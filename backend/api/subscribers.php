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
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// JWT secret (use the same as in your login.php)
$jwtSecret = $_ENV['JWT_SECRET'];

// Check Authorization header for Bearer token
$headers = getallheaders();
if (
    !isset($headers['Authorization']) ||
    !preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)
) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: No token']);
    exit();
}

$jwt = $matches[1];
try {
    $decoded = JWT::decode($jwt, new Key($jwtSecret, 'HS256'));
    // Optionally, check claims (e.g., $decoded->admin === true)
    if (empty($decoded->admin)) {
        throw new Exception('Not admin');
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: Invalid token']);
    exit();
}

// Database config
$dbHost = $_ENV['DB_HOST'];
$dbName = $_ENV['DB_NAME'];
$dbUser = $_ENV['DB_USER'];
$dbPass = $_ENV['DB_PASS'];

try {
    ini_set('display_errors', 0);
    error_reporting(0);

    $db = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query('SELECT id, name, phone, intention, linkedin, status, created_at, updated_at FROM subscribers ORDER BY created_at DESC');
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
    // Optionally log $e->getMessage() to a file
}
?>