<?php

$player_ranks = json_decode(file_get_contents("http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json"), true);

print_r($player_ranks['players'][0]);
//echo "hello";