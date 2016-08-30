<?php
//configure the credentials to your database in mysql.php 
require('mysql.php');
set_time_limit(600);
//print_r($mysqli);

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
function add_players_to_database($offset, $mysqli){
    //set $cxContect to null if you are at home by uncommenting the second line below
    $cxContext = set_proxy();
    //$cxContext = null;
    
        $url = 'http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=100&offset='.$offset;
        $json = json_decode(file_get_contents($url, true, $cxContext), true);
        $players = $json['players'];
        $insert_array = [];
        foreach($players as $player){
            $player_id = mysqli_real_escape_string($mysqli,$player['id']);
            $name = mysqli_real_escape_string($mysqli,$player['firstName'] .' '. $player['lastName']);
            $position = mysqli_real_escape_string($mysqli,$player['position']);
            $team = mysqli_real_escape_string($mysqli,$player['teamAbbr']);
            $gsid = mysqli_real_escape_string($mysqli,$player['gsisPlayerId']);
            $sql = "INSERT INTO t_players (player_id, name, position, teamAbbr, gsisPlayerId) VALUES ('$player_id', '$name', '$position', '$team', '$gsid')";
            
            if($mysqli->query($sql) === TRUE){
                echo 'added '. $name . ' to the database <br>';
                }
            else{
                 printf("Error: %s\n", $mysqli->error);
                }
        }    
}   
function insert_t_players_stats_from_nfl_api($week, $season, $mysqli){
    //set $cxContect to null if you are at home by uncommenting the second line below
    $cxContext = set_proxy();        
    //$cxContext = null;
    
    //here is the URL, I will loop through all the weeks of seasons 2010 to Present
    $url = "http://api.fantasy.nfl.com/v2/players/weekstats?week=" . $week . "&season=" . $season;
    //get the stats from the nfl api in json form
    $json = json_decode(file_get_contents($url, False, $cxContext));
    //get the game id from the json file, that will be part of the path to the stats
    $game_id = $json->systemConfig->currentGameId;
    //create an array of player id's to loop through
    $player_ids = array();
    foreach ($json->games->$game_id->players as $key => $value){
    array_push($player_ids, $key);
    }
   //here is the path through the json file for looping reference 
   //$json->games->$game_id->players->$player_id->stats->week->$season->$week
    
    foreach($player_ids as $player_id){
        foreach($json->games->$game_id->players->$player_id->stats->week->$season->$week as $stat_id =>$value){
                //execute the mysqli_query statement to insert the data into the db 
                if($mysqli){
                        $insert = "INSERT INTO t_player_stats(player_id, stat_id, season, week, value) 
                        VALUES('" .  $player_id . "', '" . $stat_id . "', '" . $season . "', '" . $week . "', '" . $value . "')";
                    echo $insert . "<br />";
                    if($mysqli->query($insert) === TRUE){
                    echo 'added playerId: '.$player_id.' stat_id: '.$stat_id.' season: '.$season.' week: '.$week.' value: '.$value;
                        }
                    else{
                        printf("Error: %s\n", $mysqli->error);
                    }
                        }        
                    }
    }

}


// after creating the database, populate it with content by commenting out and running these functions one at a time, in order

// #1) uncomment this block to add players to the players table in the database

for($i = 0; $i < 1000; $i+=100){
    add_players_to_database($i, $mysqli);
}


// #2) uncomment these blocks one at a time to add players stats to the database

for ($season = 2010; $season < 2016; $season++){
    for($week = 1; $week < 10; $week++){
        insert_t_players_stats_from_nfl_api($week,$season,$mysqli);
    }
}




?>
    
