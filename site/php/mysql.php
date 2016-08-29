<?php
//echo 'test';
$mysqli = new mysqli('localhost', '[root username]', '[root password]', '[database name]');

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}

?>
