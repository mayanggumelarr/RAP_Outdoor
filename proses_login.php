<?php
// Pastikan tidak ada spasi, baris baru, atau karakter lain sebelum tag pembuka <?php
session_start();
require 'koneksi.php'; // Pastikan koneksi.php tidak memiliki output apapun

// Set header Content-Type agar browser tahu bahwa respons ini adalah JSON
header('Content-Type: application/json');

// Inisialisasi array respons
$response = ['success' => false, 'message' => 'Terjadi kesalahan tidak diketahui.'];

// Pastikan request method adalah POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $response['message'] = 'Username dan password harus diisi.';
    } else {
        $sql = "SELECT id, username, password FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            // Penting: Anda menggunakan password_verify(), jadi pastikan password di database sudah di-hash!
            // Jika password di database masih plain text, ganti password_verify($password, $user['password'])
            // dengan $password === $user['password'] untuk tujuan testing, TAPI SANGAT TIDAK AMAN UNTUK PRODUKSI.
            // Asumsi: password di DB sudah ter-hash dengan password_hash().
            if (password_verify($password, $user['password'])) {
                // Login berhasil
                $_SESSION['isLoggedIn'] = true;
                $_SESSION['username'] = $username;
                $_SESSION['user_id'] = $user['id']; // Simpan user_id ke session PHP

                $response['success'] = true;
                $response['message'] = 'Login berhasil!';
                $response['user_id'] = $user['id']; // <-- KIRIM USER ID KE JAVASCRIPT DI SINI
            } else {
                // Password salah
                $response['message'] = 'Password salah.';
            }
        } else {
            // Username tidak ditemukan
            $response['message'] = 'Username tidak ditemukan.';
        }
        $stmt->close();
    }
} else {
    // Jika bukan POST request
    $response['message'] = 'Metode request tidak diizinkan.';
}

// Output respons dalam format JSON
echo json_encode($response);
exit(); // Penting untuk menghentikan eksekusi script setelah mengirim JSON
?>