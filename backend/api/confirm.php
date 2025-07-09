<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$token = filter_input(INPUT_GET, 'token', FILTER_SANITIZE_STRING);
$success = false;
$message = '';

if (empty($token)) {
    $message = 'Invalid confirmation link. Please try subscribing again.';
} else {
    try {
        // Database connection
        $dbHost = $_ENV['DB_HOST'];
        $dbName = $_ENV['DB_NAME'];
        $dbUser = $_ENV['DB_USER'];
        $dbPass = $_ENV['DB_PASS'];

        $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Find token and get subscriber info
        $tokenStmt = $db->prepare("
            SELECT t.*, s.email, s.name 
            FROM subscriber_tokens t
            JOIN subscribers s ON t.subscriber_id = s.id
            WHERE t.token = ? AND t.token_type = 'confirm' 
              AND t.used = 0 AND t.expires_at > NOW()
        ");
        $tokenStmt->execute([$token]);
        $tokenData = $tokenStmt->fetch(PDO::FETCH_ASSOC);

        if ($tokenData) {
            // Mark token as used
            $updateTokenStmt = $db->prepare("UPDATE subscriber_tokens SET used = 1 WHERE id = ?");
            $updateTokenStmt->execute([$tokenData['id']]);

            // Update subscriber status
            $updateSubStmt = $db->prepare("UPDATE subscribers SET status = 'confirmed', updated_at = NOW() WHERE id = ?");
            $updateSubStmt->execute([$tokenData['subscriber_id']]);

            $success = true;
            $message = 'Thank you! Your subscription has been confirmed.';

            // Send welcome email
            $welcomeSubject = "Welcome to the Horizon HUD Community!";
            $siteUrl = $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu';
            $welcomeBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Horizon HUD</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { max-width: 200px; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 6px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="$siteUrl/horizon-logo.png" alt="Horizon Logo" class="logo">
        </div>
        
        <div class="content">
            <h2 style="color: #0066cc;">Welcome to the Horizon Community, {$tokenData['name']}!</h2>
            
            <p>Your subscription has been confirmed. You're now officially part of our journey to revolutionize motorcycle riding.</p>
            
            <p>Here's what you can expect from us:</p>
            <ul>
                <li>Regular updates on product development</li>
                <li>Exclusive offers before they're announced publicly</li>
                <li>Invitations to virtual and in-person events</li>
                <li>Opportunities to provide feedback that shapes our product</li>
            </ul>
            
            <p>Stay tuned for our first update coming soon!</p>
            
            <p>The Horizon Team</p>
        </div>
        
        <div class="footer">
            &copy; 2025 Horizon Technologies. All rights reserved.<br>
            <a href="$siteUrl/privacy" style="color: #0066cc;">Privacy Policy</a> | 
            <a href="$siteUrl/terms" style="color: #0066cc;">Terms of Service</a> |
            <a href="$siteUrl/unsubscribe?email={$tokenData['email']}" style="color: #0066cc;">Unsubscribe</a>
        </div>
    </div>
</body>
</html>
HTML;

            $headers = [
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8',
                'From: Horizon HUD <noreply@horizon-hud.eu>',
                'Reply-To: contact@horizon-hud.eu'
            ];

            mail($tokenData['email'], $welcomeSubject, $welcomeBody, implode("\r\n", $headers));

        } else {
            $message = 'This confirmation link has expired or already been used.';
        }
    } catch (Exception $e) {
        error_log("Confirmation Error: " . $e->getMessage());
        $message = 'We encountered a technical issue. Please try again later or contact support.';
    }
}
?>
    <!DOCTYPE html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $success ? 'Subscription Confirmed' : 'Confirmation Failed'; ?> - Horizon HUD</title>
    <link rel="stylesheet" href="<?php echo $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu'; ?>/css/styles.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #f0f0f0;
            background: linear-gradient(to bottom, #000, #1a1a1a);
            min-height: 100vh;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 600px;
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            max-width: 200px;
            margin-bottom: 30px;
        }
        .message-box {
            background-color: rgba(30, 30, 30, 0.8);
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: <?php echo $success ? '#0066cc' : '#cc3300'; ?>;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #0066cc;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #0055aa;
        }
    </style>
</head>
<body>
<div class="container">
    <img src="<?php echo $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu'; ?>/horizon-logo.png" alt="Horizon Logo" class="logo">

    <div class="message-box">
        <h1><?php echo $success ? 'Subscription Confirmed!' : 'Confirmation Failed'; ?></h1>
        <p><?php echo $message; ?></p>

        <a href="<?php echo $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu'; ?>" class="btn">Back to Homepage</a>
    </div>
</div>
</body>
    </html><?php
