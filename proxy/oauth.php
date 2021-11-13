<?php
include 'constants.php';
$authorization_code = $_GET['code'];
// post request for access token
$post_url = "https://app.youneedabudget.com/oauth/token";
/*
https://app.youneedabudget.com/oauth/token?client_id=
[CLIENT_ID]&client_secret=[CLIENT_SECRET]&redirect_uri=
[REDIRECT_URI]&grant_type=authorization_code&code=[AUTHORIZATION_CODE]
*/ 
$post_fields = [
  "client_id" => CLIENT_ID,
  "client_secret" => CLIENT_SECRET,
  "redirect_uri" => BASE_URL,
  "grant_type" => "authorization_code",
  "code" => $authorization_code,
];
$ch = curl_init($post_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$token_response = curl_exec($ch);
curl_close($ch);

// turn into json 
$token_response = json_decode($token_response);
$expire_days = 30;  
$refresh_expires = time() + (60*60*24*$expire_days);
setcookie("refresh_token", $token_response->refresh_token, $refresh_expires, "/", "", true, true);
// remove refresh_token from response
unset($token_response->refresh_token);
// send back response
echo json_encode($token_response);
