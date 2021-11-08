<?php
// Callback for Oauth
$authorization_code = $_GET['code'];
// post request for access token
// $base_url = 'http://localhost:8888/';
$base_url = 'https://damp-castle-92074.herokuapp.com/';
$client_id = 'e9ba8a5be607dd037705e53bd02932bc5821e98e5bce344b45beba4135f65d29';
$client_secret = getenv("client_secret");
var_dump($client_secret);
$redirect_uri = $base_url . 'oauth';
$post_url = "https://app.youneedabudget.com/oauth/token";
// https://app.youneedabudget.com/oauth/token?client_id=[CLIENT_ID]&client_secret=[CLIENT_SECRET]&redirect_uri=[REDIRECT_URI]&grant_type=authorization_code&code=[AUTHORIZATION_CODE]
$post_fields = [
  "client_id" => $client_id,
  "client_secret" => $client_secret,
  "redirect_uri" => $redirect_uri,
  "grant_type" => "authorization_code",
  "code" => $authorization_code,
];
$ch = curl_init($post_url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$token_response = curl_exec($ch);
curl_close($ch);

$token_response = json_decode($token_response);
var_dump($token_response);
$access_token = $token_response->access_token;
echo "Your access token is $access_token";
