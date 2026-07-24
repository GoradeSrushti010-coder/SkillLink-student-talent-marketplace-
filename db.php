<?php
$connection = mysqli_connect("localhost", "root", "", "skillLink");

if (!$connection) {
    die("Connection Failed!");
}

echo "Database Connected Successfully!";
?>