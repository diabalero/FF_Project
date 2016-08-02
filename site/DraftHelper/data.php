<?php

$mysqli = new mysqli('localhost', 'root', 'usbw', 'ff');

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}

$all_players_result_set = $mysqli->query("Select * FROM t_draft_player_list");
print_r($all_players_result_set);

?>