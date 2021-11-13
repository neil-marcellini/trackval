<?php
/* Get all transactions */
include '../constants.php';
// make the request
$transactions_url = API_BASE_URL . '/budgets/default/transactions';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $transactions_url);
$headers = getallheaders();
$curl_headers = ["Authorization: " . $headers["Authorization"]];
curl_setopt($ch, CURLOPT_HTTPHEADER, $curl_headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$transactions_response = curl_exec($ch);
curl_close($ch);
echo $transactions_response;
?>