-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Jul 2025 pada 16.42
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rap_store`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Mayang Gumelar', 'mayunggumeraru', 'mayanggumelar02@gmail.com', '$2y$10$q91ZLYvIAscX.GdTQm/LIeS4ZruDMTfnaHRougxcidLc1Yz2sShsS', '2025-06-17 03:16:02'),
(2, 'Hana Fithri', 'xyzhaaan', 'zee.el203@gmail.com', '$2y$10$17fWEERknkfuoMDhKXcI0uNxYcXAlmMnA52jWnbCzH.H6neEAQRPO', '2025-06-18 01:35:38'),
(3, 'Adinda Putri', 'adindin', 'adindaputri@gmail.com', '$2y$10$tipYrshiMVE79yNRq50nk.xGy80yJcLkxPGpl.9fSzoD9h9VjGIji', '2025-07-07 12:29:45'),
(4, 'Indra Permana', 'permanaIndra', 'indrapermana@gmail.com', '$2y$10$UGspVTly23/Zm8LZy3Mha.ED7kxqdHmN0LIWoeyUW9jyGoyWf/Bni', '2025-07-07 12:32:09');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
