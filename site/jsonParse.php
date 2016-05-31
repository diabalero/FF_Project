<?php
//require('mysql.php');
/*
$json = json_decode(file_get_contents('C:/Users/alexandj/WebServer/root/FF_Project/data/2015/w1.json'));
//var_dump($json);
//var_dump($json->players[0]);
//var_dump($json->players[0]->stats);
echo"<table><tr><td>ID</td><td>Name</td><td>Position</td><td>team</td></tr>";
foreach($json->players as $player){
    echo "<tr><td>$player->id</td><td>$player->name</td><td>$player->position</td><td>$player->teamAbbr</td></tr>";
}
echo "</table>";
*/
//$json = json_decode(file_get_contents('http://api.fantasy.nfl.com/v1/game/stats?format=json'), true);
$aContext = array(
    'http' => array(
        'proxy' => 'proxy.atlanta.hp.com:8088', // This needs to be the server and the port of the NTLM Authentication Proxy Server.
        'request_fulluri' => True,
        ),
    );
$cxContext = stream_context_create($aContext);

$url = 'http://api.fantasy.nfl.com/v1/game/stats?format=json';
$content = file_get_contents($url, False, $cxContext);
$json = json_decode($content, true);;
//var_dump($json);
echo "<table><tr><td>stat id</td><td>abbr</td><td>name</td><td>Short Name</td></tr>";
foreach ($json["stats"] as $stat){
    //echo "<tr><td>" . $stat['id'] . "</td><td>" . $stat['abbr'] . "</td><td>" . $stat['name'] . "</td><td>" . $stat['shortname'] . "</td></tr>";
    echo "<tr><td>" . $stat['id'] . "</td><td>" . $stat['abbr'] . "</td><td>" . $stat['name'] . "</td><td>" . $stat['shortName'] . "</td></tr>";
    //var_dump($stat);
}

// ["id"]=> int(1) ["abbr"]=> string(2) "GP" ["name"]=> string(12) "Games Played" ["shortName"]=> string(2) "GP" }
?>

