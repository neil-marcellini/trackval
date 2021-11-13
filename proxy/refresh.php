<?php
include 'constants.php';
$refresh_token = $_COOKIE["refresh_token"];
// if there is no refresh token return an error.
if (!isset($refresh_token)) {
  http_response_code(401);
  exit;
}

/* https://app.youneedabudget.com/oauth/token?client_id=
[CLIENT_ID]&client_secret=[CLIENT_SECRET]&grant_type=
refresh_token&refresh_token=[REFRESH_TOKEN]*/
$post_url = 'https://app.youneedabudget.com/oauth/token';
$post_fields = [
  "client_id" => CLIENT_ID,
  "client_secret" => CLIENT_SECRET,
  "grant_type" => "refresh_token",
  "refresh_token" => $refresh_token,
];

$ch = curl_init($post_url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$token_response = curl_exec($ch);
curl_close($ch);

// turn into json 
$token_response = json_decode($token_response);
// set the new refresh token as a cookie.
$expire_days = 30;
$refresh_expires = time() + 60*60*24*$expire_days;
setcookie("refresh_token", $token_response->refresh_token, $refresh_expires, "/", BASE_URL, true, true);
// remove refresh_token from response
unset($token_response->refresh_token);
// send back response
echo json_encode($token_response);

?>