<?php

$mysqli = new mysqli('localhost', 'root', 'usbw', 'ff');

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}

$all_players_result_set = $mysqli->query("Select * FROM t_draft_player_list");
while ($player_array = $all_players_result_set->fetch_array()){
    $arrays[] = $player_array;
}
echo "<table id='player_list_table'><tr><td>Player/Team/Pos</td><td>ADP</td><td>Bye</td><td>High</td><td>Low</td></td></tr>";
foreach($arrays as $array)
{
    echo "<tr><td>" . $array['Name'] . " " . $array['Pos'] . " " . $array['Team'] . "</td><td>" . $array['Overall'] . "</td><td>" . $array['Bye'] . "</td><td>" . $array['High'] . "</td><td>" . $array['Low'] . "</td</tr>"; 
}
echo "</table>";
$all_players_result_set->close();



?>