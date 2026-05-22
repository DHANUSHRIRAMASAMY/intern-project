<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "dhanusibi", "intern_db");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

$email    = $_POST['email'];
$password = $_POST['password'];

// Check user in MySQL
$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $hashed_password);
$stmt->fetch();

if ($stmt->num_rows === 0 || !password_verify($password, $hashed_password)) {
    echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
    exit;
}

$stmt->close();
$conn->close();

// Create session token
$token = bin2hex(random_bytes(32));

// Store token in Redis with 1 hour expiry
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
$redis->setex($token, 3600, $email);

echo json_encode(["status" => "success", "token" => $token]);
?>
