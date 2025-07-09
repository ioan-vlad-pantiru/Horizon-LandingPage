<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// --- CORS: Allow only trusted origins ---
$allowedOrigins = [
    'http://localhost:3000',
    $_ENV['FRONTEND_URL'] ?? '', // e.g., https://yourdomain.com
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data from the request
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['intention'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

// Validate LinkedIn URL for investors
if ($data['intention'] === 'investor' && (empty($data['linkedin']) || !filter_var($data['linkedin'], FILTER_VALIDATE_URL))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid LinkedIn profile URL']);
    exit;
}

try {
    // Database connection
    $dbHost = $_ENV['DB_HOST'];
    $dbName = $_ENV['DB_NAME'];
    $dbUser = $_ENV['DB_USER'];
    $dbPass = $_ENV['DB_PASS'];

    $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if email already exists
    $checkStmt = $db->prepare("SELECT id, status FROM subscribers WHERE email = ?");
    $checkStmt->execute([$data['email']]);
    $existingUser = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
        if ($existingUser['status'] === 'unsubscribed') {
            // Re-activate unsubscribed user
            $updateStmt = $db->prepare("
                UPDATE subscribers 
                SET status = 'pending', updated_at = NOW(), 
                    name = ?, phone = ?, intention = ?, linkedin = ?
                WHERE id = ?
            ");
            $updateStmt->execute([
                $data['name'],
                $data['phone'],
                $data['intention'],
                isset($data['linkedin']) ? $data['linkedin'] : null,
                $existingUser['id']
            ]);
            $subscriberId = $existingUser['id'];

            // Delete old tokens
            $db->prepare("DELETE FROM subscriber_tokens WHERE subscriber_id = ?")->execute([$subscriberId]);
        } else {
            // Already subscribed
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'This email is already subscribed. Please check your inbox for previous communications.'
            ]);
            exit;
        }
    } else {
        // Insert new subscriber
        $insertStmt = $db->prepare("
            INSERT INTO subscribers (name, email, phone, intention, linkedin, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        $insertStmt->execute([
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['intention'],
            isset($data['linkedin']) ? $data['linkedin'] : null
        ]);
        $subscriberId = $db->lastInsertId();
    }

    // Generate confirmation token (expires in 7 days)
    $token = bin2hex(random_bytes(32));
    $tokenStmt = $db->prepare("
        INSERT INTO subscriber_tokens (subscriber_id, token, token_type, created_at, expires_at)
        VALUES (?, ?, 'confirm', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    ");
    $tokenStmt->execute([$subscriberId, $token]);

    // Map intention for better readability in emails
    $intentionMap = [
        'investor' => 'Potential Investor',
        'rider' => 'Rider',
        'customer' => 'Customer',
        'curious' => 'Just Curious'
    ];
    $displayIntention = isset($intentionMap[$data['intention']]) ? $intentionMap[$data['intention']] : $data['intention'];

    // Prepare confirmation email
    $siteUrl = $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu';
    $confirmUrl = "$siteUrl/confirm.php?token=$token";

    $emailSubject = "Confirm Your Subscription to Horizon HUD Updates";
    $emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Horizon HUD Subscription</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { max-width: 200px; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 6px; }
        .button { display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; 
                 text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
        ul { padding-left: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="$siteUrl/horizon-logo.png" alt="Horizon Logo" class="logo">
        </div>
        
        <div class="content">
            <h2 style="color: #0066cc;">Welcome, {$data['name']}!</h2>
            
            <p>Thank you for subscribing to Horizon HUD updates. We're excited to have you join us as a <strong>$displayIntention</strong>.</p>
            
            <p>To complete your subscription and start receiving our updates, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="$confirmUrl" class="button">Confirm My Subscription</a>
            </div>
            
            <p>By confirming, you'll receive:</p>
            <ul>
                <li>Exclusive product updates and announcements</li>
                <li>Early access opportunities</li>
                <li>Community events and discussions</li>
            </ul>
            
            <p>If you didn't subscribe to Horizon HUD updates, you can safely ignore this email.</p>
        </div>
        
        <div class="footer">
            &copy; 2025 Horizon Technologies. All rights reserved.<br>
            <a href="$siteUrl/privacy" style="color: #0066cc;">Privacy Policy</a> | 
            <a href="$siteUrl/terms" style="color: #0066cc;">Terms of Service</a>
        </div>
    </div>
</body>
</html>
HTML;

    // Send confirmation email
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: Horizon HUD <noreply@horizon-hud.eu>',
        'Reply-To: contact@horizon-hud.eu'
    ];

    $emailSent = mail($data['email'], $emailSubject, $emailBody, implode("\r\n", $headers));

    if (!$emailSent) {
        // Log email sending failure but don't fail the request
        error_log("Failed to send confirmation email to {$data['email']}");
    }

    // Send admin notification
    $adminEmail = $_ENV['ADMIN_EMAIL'] ?? "admin@horizon-hud.eu";
    $adminSubject = "New Subscriber: $displayIntention";
    $adminMessage = "
        New subscription details:
        
        Name: {$data['name']}
        Email: {$data['email']}
        Phone: {$data['phone']}
        Interest: $displayIntention
        " . ($data['intention'] === 'investor' ? "LinkedIn: {$data['linkedin']}" : "") . "
        
        Time: " . date('Y-m-d H:i:s') . "
    ";

    mail($adminEmail, $adminSubject, $adminMessage, "From: noreply@horizon-hud.eu");

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for subscribing! Please check your email to confirm your subscription.'
    ]);

} catch (PDOException $e) {
    // Log database error
    error_log("Database Error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We encountered a technical issue. Please try again later.'
    ]);
} catch (Exception $e) {
    // Log general error
    error_log("General Error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred. Please try again later.'
    ]);
}
?>