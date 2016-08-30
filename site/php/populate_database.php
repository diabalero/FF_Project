<?php
//configure the credentials to your database in mysql.php 
require('mysql.php');
set_time_limit(10000);
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
function add_players_to_database($mysqli){
    //set $cxContect to null if you are at home by uncommenting the second line below
    $cxContext = set_proxy();
    //$cxContext = null;
        for($offset=0;$offset<1000;$offset+=100){
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
}   
function insert_t_players_stats_from_nfl_api($week, $season, $mysqli){
    //set $cxContect to null if you are at home by uncommenting the second line below
    $cxContext = set_proxy();        
    //$cxContext = null;
    for($season = 2010; $season<2016; $season++){
        for($week=1;$week<18;$week++){
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

function insert_t_nfl_schedule($mysqli){
    
} 

function update_player_table_ranks($mysqli){
    //set $cxContect to null if you are at home by uncommenting the second line below
    $cxContext = set_proxy();
    //$cxContext = null;
    for($offset = 0;$offset<1000;$offset+=100){
        $url = 'http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=100&offset='.$offset;
        $json = json_decode(file_get_contents($url, true, $cxContext), true);
        $players = $json['players'];
        foreach($players as $player){
            $name = mysqli_real_escape_string($mysqli,$player['lastName']);
            $player_id = mysqli_real_escape_string($mysqli,$player['id']);
            $rank = mysqli_real_escape_string($mysqli,$player['rank']);
            $sql = "UPDATE t_players SET rank = '".$rank."' WHERE player_id = '".$player_id."'"; 
            
            if($mysqli->query($sql) === TRUE){
                echo 'updated '. $name . ' set rank to '.$rank.'<br>';
                }
            else{
                 printf("Error: %s\n", $mysqli->error);
                }
        }
    }    
}
function update_player_table_adps($mysqli){
    //set $cxContect to null if you are at home by uncommenting the second line below
    $cxContext = set_proxy();
    //$cxContext = null;
    for($offset = 0;$offset<1000;$offset+=100){
        $url = 'http://api.fantasy.nfl.com/v1/players/userdraftranks?format=json&count=100&offset='.$offset;
        $json = json_decode(file_get_contents($url, true, $cxContext), true);
        $players = $json['players'];
        foreach($players as $player){
            $name = mysqli_real_escape_string($mysqli,$player['lastName']);
            $player_id = mysqli_real_escape_string($mysqli,$player['gsisPlayerId']);
            $adp = mysqli_real_escape_string($mysqli,$player['rank']);
            $sql = "UPDATE t_players SET adp = '".$adp."' WHERE gsisPlayerId = '".$player_id."'"; 
            
            if($mysqli->query($sql) === TRUE){
                echo 'updated '. $name . ' set adp to '.$adp.'<br>';
                }
            else{
                 printf("Error: %s\n", $mysqli->error);
                }
        }
    }    
}

//this function adds the stats definition to the database, stat_id, stat name etc, no actual player stats 
//insert_t_stats_from_nfl_api($mysqli);

//this function adds the players to the database, player_id, name, position, team, and some other id that might be used for a feed or something
//add_players_to_database($mysqli);

//this function adds the players statistics to the database, weeks 1 thru 17, no playoff stats, though we could add those by changing the week for-loop.
//insert_t_players_stats_from_nfl_api($mysqli);
//updates the players with current ranks
//update_player_table_ranks($mysqli);
//updates the players with current adps
//update_player_table_adps($mysqli);



?>
    
