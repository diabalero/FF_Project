<?php
//require mysql.php allows you to run queries using the $mysqli connection variable, example: $mysqli->query($sql);
require('mysql.php');

//function to insert stats for players/seasons/weeks. configured so that iteration through the pages is possible via a wrapper function
function insert_t_players_stats_from_nfl_api($week, $season, $requireProxy, $mysqli){ //set requireProxy to true if you are at work
    //set the proxy info if true in the function definition
    if($requireProxy == true){
    $cxContext = set_proxy();        
    }
    else {
        $cxContext = null;
    }
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
        foreach($json->games->$game_id->players->$player_id->stats->week->$season->$week as $key =>$value){
                //execute the mysqli_query statement to insert the data into the db 
                if($mysqli){
                        $insert = "INSERT INTO t_player_stats(PLAYER_ID, stat_id, season, week, value) 
                        VALUES('" .  $player_id . "', '" . $key . "', '" . $season . "', '" . $week . "', '" . $value . "')";
                    echo $insert . "<br />";
                    if($mysqli->query($insert) === TRUE){
                    echo 'success!';
                        }
                    else{
                        printf("Error: %s\n", $mysqli->error);
                    }
                        }        
                    }
    }

    }



//function to insert the stats schema into the database from the nfl api. uses set_proxy() so comment that out if you are on a network without a proxy. (MAY NEED TO EDIT THE file_get_contents call as well)
function insert_t_stats_from_nfl_api(){
    //configure the proxy using the set_proxy() function
    $cxContext = set_proxy();
    //get the json from the nfl api
    $url = 'http://api.fantasy.nfl.com/v1/game/stats?format=json';
    $content = file_get_contents($url, False, $cxContext);
    $json = json_decode($content, true);;
    //var_dump($json); //use the var dump if you want to view the json in the html page output
    //output the data to an html table (this is separate from the sql statement and may not reflect what goes into the db) 
    echo "<table><tr><td>stat id</td><td>abbr</td><td>name</td><td>Short Name</td></tr>";
    foreach ($json["stats"] as $stat){
        echo "<tr><td>" . $stat['id'] . "</td><td>" . $stat['abbr'] . "</td><td>" . $stat['name'] . "</td><td>" . $stat['shortName'] . "</td></tr>";
    }

    //execute the mysqli_query statement to insert the data into the db 
    if($mysqli){
        foreach ($json["stats"] as $stat){
            $insert = "INSERT INTO t_stats(stat_id, abbr, name, shortname) 
                VALUES('" . $stat['id'] . "', '" . $stat['abbr'] . "', '" . $stat['name'] . "', '" . $stat['shortName'] . "')";
            echo $insert . "<br />";
            /*if($mysqli->query($insert) === TRUE){
                echo 'success!';
            }
            else{
                printf("Error: %s\n", $mysqli->error);
            }*/
                }        
            }
    }

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

function add_players_to_database($offset){
    $cxContext = set_proxy();
    $url = 'http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=100&offset='.$offset;
    $json = json_decode(file_get_contents($url, true, $cxContext), true);
    $players = $json['players'];
    //echo "<table><tr><th>Player_id</th><th>Position</th><th>Name</th><th>Team</th><th>Rank</th></tr>";
    foreach($players as $player){
        echo "<tr><td>".$player['id']."</td>
                <td>".$player['position']."</td>
                <td>".$player['firstName'] ." ".$player['lastName']."</td>
                <td>".$player['teamAbbr']."</td>
                <td>".$player['rank']."</td></tr>";           
    }
}
function outer_layer(){
    echo "<table><tr><th>Player_id</th><th>Position</th><th>Name</th><th>Team</th><th>Rank</th></tr>";
    for($i=0;$i<1000;$i+=100){
    add_players_to_database($i);
    }
    echo "</table>";
}

//Execute functions here
//insert_t_stats_from_nfl_api();
if($mysqli){
    print_r($mysqli);
    outer_layer();    
}

?>

