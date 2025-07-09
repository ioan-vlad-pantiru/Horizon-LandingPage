<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// --- CORS: Allow only trusted origins ---
$allowedOrigins = [
    'http://localhost:3000',
    $_ENV['FRONTEND_URL'] ?? '',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

$email = filter_input(INPUT_GET, 'email', FILTER_SANITIZE_EMAIL);
$success = false;
$message = '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $message = 'Invalid email address.';
} else {
    try {
        // Database connection
        $dbHost = $_ENV['DB_HOST'];
        $dbName = $_ENV['DB_NAME'];
        $dbUser = $_ENV['DB_USER'];
        $dbPass = $_ENV['DB_PASS'];

        $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Find subscriber
        $stmt = $db->prepare("SELECT id, name FROM subscribers WHERE email = ? AND status != 'unsubscribed'");
        $stmt->execute([$email]);
        $subscriber = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($subscriber) {
            // Update subscriber status
            $updateStmt = $db->prepare("UPDATE subscribers SET status = 'unsubscribed', updated_at = NOW() WHERE id = ?");
            $updateStmt->execute([$subscriber['id']]);

            $success = true;
            $message = 'You have been successfully unsubscribed from our mailing list.';

            // Send confirmation
            $subject = "Unsubscription Confirmed - Horizon HUD";
            $siteUrl = $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu';
            $body = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Unsubscription Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Unsubscription Confirmed</h2>
        <p>Hello {$subscriber['name']},</p>
        <p>We're sorry to see you go. You have been successfully unsubscribed from the Horizon HUD mailing list.</p>
        <p>If you unsubscribed by mistake or change your mind in the future, you can always resubscribe on our website.</p>
        <p>Best regards,<br>The Horizon Team</p>
    </div>
</body>
</html>
HTML;

            $headers = [
                'MIME-Version: 1.0',
                'Content-Type: text/html; charset=UTF-8',
                'From: Horizon HUD <noreply@horizon-hud.eu>'
            ];

            mail($email, $subject, $body, implode("\r\n", $headers));

        } else {
            $message = 'This email is not currently subscribed to our mailing list.';
        }
    } catch (Exception $e) {
        error_log("Unsubscribe Error: " . $e->getMessage());
        $message = 'We encountered a technical issue. Please try again later or contact support.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribe - Horizon HUD</title>
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
            color: #0066cc;
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
        <h1>Unsubscribe</h1>
        <?php if (!empty($message)): ?>
            <p><?php echo $message; ?></p>
        <?php else: ?>
            <form method="post">
                <p>Please confirm that you want to unsubscribe from all Horizon HUD emails.</p>
                <input type="hidden" name="confirm" value="1">
                <input type="hidden" name="email" value="<?php echo htmlspecialchars($email); ?>">
                <button type="submit" class="btn">Confirm Unsubscribe</button>
            </form>
        <?php endif; ?>

        <a href="<?php echo $_ENV['SITE_URL'] ?? 'https://horizon-hud.eu'; ?>" class="btn" style="margin-top: 20px;">Back to Homepage</a>
    </div>
</div>
</body>
</html>