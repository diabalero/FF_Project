<?php
//configure the credentials to your database in mysql.php, the 
require('../php/mysql.php');
//function to configure the proxy at HP
function set_proxy(){
    $aContext = array(
    'http' => array(
        'proxy' => 'proxy.atlanta.hp.com:8088', // This needs to be the server and the port of the Proxy Server.
        'request_fulluri' => True,
        ),
    );
    $cxContext = stream_context_create($aContext);
    return $cxContext;
    }
    
//function to add players to the database

function add_players_to_database($offset){
    //set cxContext to null if you are not at work...
    $cxContext = set_proxy();
        $url = 'http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=100&offset='.$offset;
        $json = json_decode(file_get_contents($url, true, $cxContext), true);
        $players = $json['players'];
        
        foreach($players as $player){
            $player_id = $player['id'];
            $name = $player['firstName'] . $player['lastName'];
            $position = $player['position'];
            $team = $player['teamAbbr'];
            $gsid = $player['gsisPlayerId'];
            $sql = "INSERT INTO t_players (player_id, name, position, teamAbbr, gsisPlayerId) VALUES ('$player_id', '$name', '$position', '$team', '$gsid')";
            
        
        }
}

add_players_to_database(100);
    
