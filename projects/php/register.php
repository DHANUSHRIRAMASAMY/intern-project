<?php
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

$conn = new mysqli("localhost", "root", "dhanusibi", "intern_db");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

$name     = $_POST['name'];
$email    = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $password);

try {
    $stmt->execute();
    echo json_encode(["status" => "success"]);
} catch (mysqli_sql_exception $e) {
    echo json_encode(["status" => "error", "message" => "Email already exists"]);
}

$stmt->close();
$conn->close();
?>
