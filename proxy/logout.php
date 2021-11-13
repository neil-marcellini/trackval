<?php
// Set the refresh token cookie to expire.
setcookie("refresh_token", '', time() - 3600, "/", "", true, true);
?>