<?php
require_once __DIR__ . '/../vendor/autoload.php';
// Load .env variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');
// --- CORS: Allow only trusted origins ---
$allowedOrigins = [
    'http://localhost:3000',
    $_ENV['FRONTEND_URL'] ?? '', // e.g., https://yourdomain.com
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

$JWT_SECRET = $_ENV['JWT_SECRET'];

$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $jwt = $matches[1];
    try {
        $decoded = JWT::decode($jwt, new Key($JWT_SECRET, 'HS256'));
        if (!empty($decoded->admin)) {
            echo json_encode(['success' => true]);
            exit;
        }
    } catch (Exception $e) {
        // Invalid token
    }
}
http_response_code(401);
echo json_encode(['success' => false, 'message' => 'Unauthorized']);