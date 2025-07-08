<?php
require 'koneksi.php'; // file koneksi ke DB

$name = $_POST['name'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirm = $_POST['confirm_password'];

if ($password !== $confirm) {
    die("Password dan konfirmasi tidak cocok.");
}

// hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Cek apakah username/email sudah digunakan
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $username, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    die("Username atau email sudah digunakan.");
}

// Simpan ke database
$stmt = $conn->prepare("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $username, $email, $hashedPassword);
$stmt->execute();

echo "Pendaftaran berhasil! Silakan <a href='login.html'>login di sini</a>.";
?>
