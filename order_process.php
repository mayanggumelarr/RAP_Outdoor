<?php
file_put_contents("log.txt", "Order_process dipanggil pada " . date('Y-m-d H:i:s') . "\n", FILE_APPEND);
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
require('koneksi.php');

header('Content-Type: application/json');

$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);
file_put_contents("log.txt", "Raw JSON Input: " . $inputJSON . "\n", FILE_APPEND);
file_put_contents("log.txt", "Decoded Input: " . print_r($input, true) . "\n", FILE_APPEND);

// Ambil user_id
$user_id = null;
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    file_put_contents("log.txt", "User ID from session: " . $user_id . "\n", FILE_APPEND);
} else if (isset($input['user_id'])) {
    $user_id = $input['user_id'];
    file_put_contents("log.txt", "User ID from input: " . $user_id . "\n", FILE_APPEND);
} else {
    echo json_encode(['success' => false, 'message' => 'Anda harus login atau user_id tidak tersedia.']);
    exit;
}

// Validasi input
if (
    !isset($input['items']) ||
    !isset($input['durasi']) ||
    !isset($input['catatan']) ||
    !isset($input['total_harga']) ||
    !is_array($input['items']) ||
    count($input['items']) === 0
) {
    echo json_encode(['success' => false, 'message' => 'Data pesanan tidak lengkap atau salah format.']);
    exit;
}

// Ambil data utama
$durasi = (int)$input['durasi'];
$catatan = mysqli_real_escape_string($conn, $input['catatan']);
$total_harga_raw = $input['total_harga'];
$total_harga = (int)preg_replace('/[^0-9]/', '', $total_harga_raw);

// Simpan ke tabel `sewa`
$stmt = $conn->prepare("INSERT INTO sewa (user_id, durasi, catatan, total_harga) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sisi", $user_id, $durasi, $catatan, $total_harga);

if (!$stmt->execute()) {
    file_put_contents("log.txt", "Gagal insert ke sewa: " . $stmt->error . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan ke database.']);
    exit;
}

$sewa_id = $stmt->insert_id;
$stmt->close();
file_put_contents("log.txt", "Berhasil insert ke sewa, sewa_id: " . $sewa_id . "\n", FILE_APPEND);

// Simpan masing-masing item ke `sewa_items`
$insert_item_stmt = $conn->prepare("INSERT INTO sewa_items (sewa_id, nama_barang, harga, quantity, subtotal) VALUES (?, ?, ?, ?, ?)");

foreach ($input['items'] as $item) {
    $nama_barang = mysqli_real_escape_string($conn, $item['nama_barang']);
    $harga = (int)preg_replace('/[^0-9]/', '', $item['harga']);
    $quantity = (int)$item['quantity'];
    $subtotal = $harga * $quantity;

    $insert_item_stmt->bind_param("isiii", $sewa_id, $nama_barang, $harga, $quantity, $subtotal);

    if (!$insert_item_stmt->execute()) {
        file_put_contents("log.txt", "Gagal insert item: " . $insert_item_stmt->error . "\n", FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan item sewa.']);
        exit;
    }
}

$insert_item_stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'message' => 'Pesanan berhasil disimpan. Silahkan konfirmassikan ke kami melalui WhatsApp',
    'sewa_id' => $sewa_id
]);
