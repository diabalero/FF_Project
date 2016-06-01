<?php
//require mysql.php allows you to run queries using the $mysqli connection variable, example: $mysqli->query($sql);
require('mysql.php');

//function to insert stats for players/seasons/weeks. configured so that iteration through the pages is possible via a wrapper function
function insert_t_players_stats_from_nfl_api($week, $season){
    $cxContext = set_proxy();
    $url = "http://api.fantasy.nfl.com/v2/players/weekstats?week=" . $week . "&season=" . $season;
    //echo $url;
    $json = json_decode(file_get_contents($url, False, $cxContext));
    var_dump($json);
    foreach($json->systemConfig as $sc){
        
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
            //echo $insert . "<br />";
            if($mysqli->query($insert) === TRUE){
                echo 'success!';
            }
            else{
                printf("Error: %s\n", $mysqli->error);
            }
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

//Execute functions here
insert_t_players_stats_from_nfl_api("1", "2015");    
    
?>

