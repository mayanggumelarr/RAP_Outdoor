<?php
require('koneksi.php');
header('Content-Type: application/json');

$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);

if (!isset($input['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'user_id tidak ditemukan']);
    exit;
}

$user_id = $input['user_id'];

// Ambil data sewa berdasarkan user_id
$sql_sewa = "SELECT * FROM sewa WHERE user_id = ?";
$stmt = $conn->prepare($sql_sewa);
$stmt->bind_param("s", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $sewa_id = $row['id'];

    // Ambil items dari sewa_items
    $stmt_items = $conn->prepare("SELECT * FROM sewa_items WHERE sewa_id = ?");
    $stmt_items->bind_param("i", $sewa_id);
    $stmt_items->execute();
    $items_result = $stmt_items->get_result();

    $items = [];
    while ($item = $items_result->fetch_assoc()) {
        $items[] = $item;
    }

    $row['items'] = $items;
    $orders[] = $row;

    $stmt_items->close();
}

$stmt->close();
$conn->close();

echo json_encode(['success' => true, 'orders' => $orders]);
