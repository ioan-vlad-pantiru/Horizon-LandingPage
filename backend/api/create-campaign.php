<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

session_start();

// Secure admin credentials from .env
$validUsername = $_ENV['ADMIN_USERNAME'];
$validPasswordHash = $_ENV['ADMIN_PASSWORD_HASH'];

// Database connection parameters from .env
$dbHost = $_ENV['DB_HOST'];
$dbName = $_ENV['DB_NAME'];
$dbUser = $_ENV['DB_USER'];
$dbPass = $_ENV['DB_PASS'];

$loggedIn = false;
$message = '';
$db = null;

// Handle login
if (isset($_POST['username']) && isset($_POST['password'])) {
    if (
        $_POST['username'] === $validUsername &&
        password_verify($_POST['password'], $validPasswordHash)
    ) {
        $_SESSION['admin_logged_in'] = true;
        $loggedIn = true;
    } else {
        $message = "Invalid credentials";
    }
} elseif (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    $loggedIn = true;
}

// Create campaign
if ($loggedIn && isset($_POST['campaign_submit'])) {
    try {
        $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $db->prepare("
            INSERT INTO email_campaigns (name, subject, content, created_at, status, scheduled_for)
            VALUES (?, ?, ?, NOW(), ?, ?)
        ");

        $scheduledDate = null;
        if (!empty($_POST['scheduled_date']) && !empty($_POST['scheduled_time'])) {
            $scheduledDate = $_POST['scheduled_date'] . ' ' . $_POST['scheduled_time'] . ':00';
        }

        $status = empty($scheduledDate) ? 'draft' : 'scheduled';

        $stmt->execute([
            $_POST['campaign_name'],
            $_POST['campaign_subject'],
            $_POST['campaign_content'],
            $status,
            $scheduledDate
        ]);

        $message = "Campaign created successfully!";
    } catch (Exception $e) {
        $message = "Error: " . $e->getMessage();
    }
}

// Get existing campaigns if logged in
$campaigns = [];
if ($loggedIn) {
    try {
        if (!$db) {
            $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }

        $stmt = $db->query("
            SELECT id, name, subject, status, created_at, scheduled_for, sent_date 
            FROM email_campaigns 
            ORDER BY created_at DESC
        ");

        $campaigns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $message = "Error fetching campaigns: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campaign Management - Horizon HUD</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0066cc;
            margin-top: 0;
        }
        .message {
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
            background-color: #d4edda;
            color: #155724;
        }
        .message.error {
            background-color: #f8d7da;
            color: #721c24;
        }
        form {
            margin-bottom: 30px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"],
        input[type="password"],
        input[type="date"],
        input[type="time"],
        textarea,
        select {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            min-height: 300px;
            font-family: Arial, sans-serif;
        }
        button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0055aa;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        .help-text {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Horizon HUD Campaign Management</h1>

    <?php if ($message): ?>
        <div class="message <?php echo strpos($message, 'Error') !== false ? 'error' : ''; ?>">
            <?php echo htmlspecialchars($message); ?>
        </div>
    <?php endif; ?>

    <?php if (!$loggedIn): ?>
        <form method="post">
            <h2>Admin Login</h2>
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    <?php else: ?>
        <form method="post">
            <h2>Create New Campaign</h2>

            <div>
                <label for="campaign_name">Campaign Name:</label>
                <input type="text" id="campaign_name" name="campaign_name" required>
                <div class="help-text">Internal name for this campaign (not shown to subscribers)</div>
            </div>

            <div>
                <label for="campaign_subject">Email Subject:</label>
                <input type="text" id="campaign_subject" name="campaign_subject" required>
                <div class="help-text">This will appear as the subject line of the email</div>
            </div>

            <div>
                <label for="campaign_content">Email Content (HTML):</label>
                <div class="help-text">
                    Available variables:<br>
                    {{name}} - Subscriber's name<br>
                    {{unsubscribe_url}} - URL to unsubscribe
                </div>
                <textarea id="campaign_content" name="campaign_content" required></textarea>
            </div>

            <div>
                <label for="scheduled_date">Schedule Date (optional):</label>
                <input type="date" id="scheduled_date" name="scheduled_date">
            </div>

            <div>
                <label for="scheduled_time">Schedule Time (optional):</label>
                <input type="time" id="scheduled_time" name="scheduled_time">
                <div class="help-text">If no date/time is specified, campaign will be saved as draft</div>
            </div>

            <button type="submit" name="campaign_submit">Create Campaign</button>
        </form>

        <h2>Existing Campaigns</h2>
        <?php if (empty($campaigns)): ?>
            <p>No campaigns found.</p>
        <?php else: ?>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Scheduled For</th>
                    <th>Sent Date</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($campaigns as $campaign): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($campaign['name']); ?></td>
                        <td><?php echo htmlspecialchars($campaign['subject']); ?></td>
                        <td><?php echo htmlspecialchars($campaign['status']); ?></td>
                        <td><?php echo htmlspecialchars($campaign['created_at']); ?></td>
                        <td><?php echo $campaign['scheduled_for'] ? htmlspecialchars($campaign['scheduled_for']) : '-'; ?></td>
                        <td><?php echo $campaign['sent_date'] ? htmlspecialchars($campaign['sent_date']) : '-'; ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>

        <p><a href="?logout=1">Logout</a></p>
    <?php endif; ?>
</div>
</body>
</html>