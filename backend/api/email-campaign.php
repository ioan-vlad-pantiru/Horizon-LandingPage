<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Set to true to actually send emails, false to just test
$sendEmails = false;

// Database connection from .env
$dbHost = $_ENV['DB_HOST'];
$dbName = $_ENV['DB_NAME'];
$dbUser = $_ENV['DB_USER'];
$dbPass = $_ENV['DB_PASS'];

$siteUrl = $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu';

try {
    // Connect to database
    $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get campaign to send
    $campaignStmt = $db->prepare("
        SELECT * FROM email_campaigns 
        WHERE status = 'scheduled' AND scheduled_for <= NOW()
        ORDER BY scheduled_for ASC LIMIT 1
    ");
    $campaignStmt->execute();
    $campaign = $campaignStmt->fetch(PDO::FETCH_ASSOC);

    if (!$campaign) {
        echo "No campaigns scheduled for sending.\n";
        exit;
    }

    echo "Preparing to send campaign: {$campaign['name']}\n";

    // Update campaign status to sending
    $db->prepare("UPDATE email_campaigns SET status = 'sending', sent_date = NOW() WHERE id = ?")->execute([$campaign['id']]);

    // Get confirmed subscribers
    $subscriberStmt = $db->prepare("
        SELECT id, name, email, intention 
        FROM subscribers 
        WHERE status = 'confirmed'
    ");
    $subscriberStmt->execute();

    $totalSubscribers = 0;
    $successCount = 0;
    $failCount = 0;

    // Process each subscriber
    while ($subscriber = $subscriberStmt->fetch(PDO::FETCH_ASSOC)) {
        $totalSubscribers++;

        // Generate unsubscribe link
        $unsubscribeUrl = "$siteUrl/unsubscribe.php?email=" . urlencode($subscriber['email']);

        // Personalize email content
        $emailContent = str_replace(
            ['{{name}}', '{{unsubscribe_url}}'],
            [$subscriber['name'], $unsubscribeUrl],
            $campaign['content']
        );

        // Prepare email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: Horizon HUD <noreply@horizon-hud.eu>',
            'Reply-To: contact@horizon-hud.eu'
        ];

        // Send email
        if ($sendEmails) {
            $sent = mail($subscriber['email'], $campaign['subject'], $emailContent, implode("\r\n", $headers));
        } else {
            // Just simulate sending in test mode
            $sent = true;
            echo "Would send to: {$subscriber['email']}\n";
        }

        // Record in tracking table
        $trackingStmt = $db->prepare("
            INSERT INTO campaign_tracking (campaign_id, subscriber_id, sent_at)
            VALUES (?, ?, NOW())
        ");
        $trackingStmt->execute([$campaign['id'], $subscriber['id']]);

        // Update last_email_sent in subscribers table
        $db->prepare("UPDATE subscribers SET last_email_sent = NOW() WHERE id = ?")->execute([$subscriber['id']]);

        if ($sent) {
            $successCount++;
        } else {
            $failCount++;
            error_log("Failed to send campaign email to {$subscriber['email']}");
        }

        // Add a slight delay to prevent server overload
        if ($sendEmails) {
            usleep(500000); // 0.5 second delay between emails
        }
    }

    // Update campaign status
    $db->prepare("UPDATE email_campaigns SET status = 'completed' WHERE id = ?")->execute([$campaign['id']]);

    echo "Campaign completed.\n";
    echo "Total subscribers: $totalSubscribers\n";
    echo "Successful: $successCount\n";
    echo "Failed: $failCount\n";

} catch (Exception $e) {
    error_log("Campaign Error: " . $e->getMessage());
    echo "Error: " . $e->getMessage() . "\n";

    // If there was an error, set campaign back to scheduled
    if (isset($campaign) && isset($db)) {
        $db->prepare("UPDATE email_campaigns SET status = 'scheduled' WHERE id = ?")->execute([$campaign['id']]);
    }
}
?>