<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Secure Config ---
$ADMIN_USERNAME = $_ENV['ADMIN_USERNAME'];
$ADMIN_PASSWORD_HASH = $_ENV['ADMIN_PASSWORD_HASH'];
$JWT_SECRET = $_ENV['JWT_SECRET'];
$RATE_LIMIT_FILE = sys_get_temp_dir() . '/horizon_login_rate_limit.json';
$RATE_LIMIT_MAX_ATTEMPTS = 5;
$RATE_LIMIT_WINDOW = 10; // 5 minutes

// --- Rate Limiting (per IP, file-based, for demo only) ---
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateData = [];
if (file_exists($RATE_LIMIT_FILE)) {
    $rateData = json_decode(file_get_contents($RATE_LIMIT_FILE), true) ?: [];
}
$now = time();
if (!isset($rateData[$ip])) {
    $rateData[$ip] = [];
}
// Remove old attempts
$rateData[$ip] = array_filter($rateData[$ip], function($ts) use ($now, $RATE_LIMIT_WINDOW) {
    return $ts > $now - $RATE_LIMIT_WINDOW;
});
if (count($rateData[$ip]) >= $RATE_LIMIT_MAX_ATTEMPTS) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many login attempts. Please try again later.']);
    exit;
}

// --- Parse Input ---
$data = json_decode(file_get_contents('php://input'), true);
$username = isset($data['username']) ? $data['username'] : '';
$password = isset($data['password']) ? $data['password'] : '';
error_log("username: " . $username);
error_log("password: " . $password);
error_log("ADMIN_USERNAME: " . $ADMIN_USERNAME);
error_log("ADMIN_PASSWORD_HASH: " . $ADMIN_PASSWORD_HASH);

// --- Authentication ---
if ($username === $ADMIN_USERNAME && password_verify($password, $ADMIN_PASSWORD_HASH)) {
    $payload = [
        'admin' => true,
        'exp' => time() + 3600 // 1 hour expiry
    ];
    $jwt = JWT::encode($payload, $JWT_SECRET, 'HS256');
    echo json_encode(['success' => true, 'token' => $jwt]);
} else {
    // Log failed attempt
    $rateData[$ip][] = $now;
    file_put_contents($RATE_LIMIT_FILE, json_encode($rateData));
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
}

// --- Notes for Production ---
// - Store secrets in real environment variables, not code.
// - Use a database for users, not hardcoded credentials.
// - Use a persistent store for rate limiting (e.g., Redis).
// - Use HTTPS for all requests.
// - Consider logging and alerting for repeated failed attempts.