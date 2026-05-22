<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../vendor/autoload.php';

$token = $_REQUEST['token'] ?? '';

if (!$token) {
    echo json_encode(["status" => "error", "message" => "No token"]);
    exit;
}

// Validate session via Redis
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);
$email = $redis->get($token);

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Invalid or expired session"]);
    exit;
}

// Connect to MongoDB
$mongo      = new MongoDB\Client("mongodb://localhost:27017");
$collection = $mongo->intern_db->profiles;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profile = $collection->findOne(['email' => $email]);
    echo json_encode([
        "status" => "success",
        "data" => [
            "name"    => $profile['name']    ?? '',
            "email"   => $email,
            "contact" => $profile['contact'] ?? '',
            "dob"     => $profile['dob']     ?? '',
            "age"     => $profile['age']     ?? '',
            "address" => $profile['address'] ?? '',
            "bio"     => $profile['bio']     ?? ''
        ]
    ]);

} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $collection->updateOne(
        ['email' => $email],
        ['$set' => [
            'name'    => $_POST['name'],
            'contact' => $_POST['contact'],
            'dob'     => $_POST['dob'],
            'age'     => $_POST['age'],
            'address' => $_POST['address'],
            'bio'     => $_POST['bio']
        ]],
        ['upsert' => true]
    );
    echo json_encode(["status" => "success"]);
}
?>
