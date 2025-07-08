<!-- <?php
include "koneksi.php";
header("Content-Type: application/json");

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Koneksi ke database gagal: " . mysqli_connect_error()]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["success" => false, "message" => "Input JSON tidak valid."]);
    exit;
}

$user_id     = mysqli_real_escape_string($conn, $input["user_id"]);
$nama_barang = mysqli_real_escape_string($conn, json_encode($input["nama_barang"]));
$durasi      = (int)$input["durasi"];
$catatan     = mysqli_real_escape_string($conn, $input["catatan"]);
$total_harga = (int)$input["total_harga"];

$query = "INSERT INTO pesanan (user_id, nama_barang, durasi, catatan, total_harga, created_at)
          VALUES ('$user_id', '$nama_barang', '$durasi', '$catatan', '$total_harga', NOW())";

$result = mysqli_query($conn, $query);

if ($result) {
    echo json_encode(["success" => true, "message" => "Pesanan berhasil disimpan."]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal menyimpan: " . mysqli_error($conn)]);
}
?>
