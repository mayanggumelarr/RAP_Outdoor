-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 07, 2025 at 10:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `belanja`
--

-- --------------------------------------------------------

--
-- Table structure for table `sewa`
--

CREATE TABLE `sewa` (
  `id` int(11) NOT NULL,
  `user_id` int(255) NOT NULL,
  `durasi` int(11) NOT NULL,
  `total_harga` int(11) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sewa`
--

INSERT INTO `sewa` (`id`, `user_id`, `durasi`, `total_harga`, `catatan`, `created_at`) VALUES
(45, 2, 1, 25000, 'j', '2025-07-07 20:30:16'),
(46, 2, 1, 25000, 'j', '2025-07-07 20:32:31'),
(47, 2, 1, 25000, 'ini test', '2025-07-07 20:35:24'),
(48, 2, 1, 25000, 'jabja', '2025-07-07 20:39:30'),
(49, 2, 1, 25000, 'hh', '2025-07-07 20:48:41');

-- --------------------------------------------------------

--
-- Table structure for table `sewa_items`
--

CREATE TABLE `sewa_items` (
  `id` int(11) NOT NULL,
  `sewa_id` int(11) DEFAULT NULL,
  `nama_barang` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `subtotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sewa_items`
--

INSERT INTO `sewa_items` (`id`, `sewa_id`, `nama_barang`, `harga`, `quantity`, `subtotal`) VALUES
(1, 45, 'Sepatu Outdoor Wanita', 25000, 0, 0),
(2, 46, 'Sepatu Outdoor Wanita', 25000, 0, 0),
(3, 47, 'Sepatu Outdoor Wanita', 25000, 0, 0),
(4, 48, 'Sepatu Outdoor Wanita', 25000, 1, 25000),
(5, 49, 'Sepatu Outdoor Pria', 25000, 1, 25000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'tegar', 'tegarwijaya', 'tegar@gmail.com', '$2y$10$9Mq3BXakKVWW53OxVQ5WN.FRTP6GNkbpO/eBtk3Tyiaz/kZ5ezO2G', '2025-07-07 15:22:19'),
(2, 'dany', 'dany', 'dany@gmail.com', '$2y$10$Cd97S2hmmoSYLEf658hyzuaU0FRAbR1pa5JjYxlBessCDJZIcEiDW', '2025-07-07 18:06:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sewa`
--
ALTER TABLE `sewa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sewa_items`
--
ALTER TABLE `sewa_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sewa_id` (`sewa_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sewa`
--
ALTER TABLE `sewa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `sewa_items`
--
ALTER TABLE `sewa_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sewa`
--
ALTER TABLE `sewa`
  ADD CONSTRAINT `sewa_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sewa_items`
--
ALTER TABLE `sewa_items`
  ADD CONSTRAINT `sewa_items_ibfk_1` FOREIGN KEY (`sewa_id`) REFERENCES `sewa` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
