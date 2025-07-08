<?php
session_start();
header('Content-Type: application/json');

$response = [
  'loggedIn' => isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true
];

echo json_encode($response);
