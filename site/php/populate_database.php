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

function insert_t_stats_from_nfl_api($mysqli){
    $cxContext = set_proxy();
    $url = 'http://api.fantasy.nfl.com/v1/game/stats?format=json';
    $content = file_get_contents($url, False, $cxContext);
    $json = json_decode($content, true); 
    if($mysqli){
        foreach ($json["stats"] as $stat){
            $stat_id = mysqli_real_escape_string($mysqli,$stat['id']);
            $stat_abbr = mysqli_real_escape_string($mysqli,$stat['abbr']);
            $stat_name = mysqli_real_escape_string($mysqli,$stat['name']);
            $stat_short_name = mysqli_real_escape_string($stat['shortName']);
            echo "I would insert: stat_id: $stat_id, stat_abbr: $stat_abbr, stat_name: $stat_name, stat_short_name: $stat_short_name <br>";
            $insert = "INSERT INTO t_stats(stat_id, abbr, name, shortname) 
                VALUES('" . $stat_id . "', '" . $stat_abbr . "', '" . $stat_name . "', '" . $stat_short_name . "')";
            if($mysqli->query($insert) === TRUE){
                echo "inserted stat_id: $stat_id, stat_abbr: $stat_abbr, stat_name: $stat_name, stat_short_name: $stat_short_name <br>";
            }
            else{
                printf("Error: %s\n", $mysqli->error);
            }
                }        
            }
    }


// after creating the database, populate it with this script

//this function adds the stats definition to the database, stat_id, stat name etc, no actual player stats 
insert_t_stats_from_nfl_api($mysqli);

//this function adds the players to the database, player_id, name, position, team, and some other id that might be used for a feed or something
for($i = 0; $i < 1000; $i+=100){
    add_players_to_database($i, $mysqli);
}

//this function adds the players statistics to the database, weeks 1 thru 17, no playoff stats, though we could add those by changing the week for-loop.
<<<<<<< HEAD
for ($season = 2015; $season < 2016; $season++){
=======
for ($season = 2010; $season < 2016; $season++){
>>>>>>> 4473054a3aeed85219f56e125e12d3b13c09ae82
    for($week = 1; $week < 18; $week++){
        insert_t_players_stats_from_nfl_api($week,$season,$mysqli);
    }
}






?>
    
