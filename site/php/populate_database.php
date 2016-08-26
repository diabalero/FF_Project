<?php

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

function add_players_to_database(){
    $cxContext = set_proxy();

        $data = json_decode(file_get_contents('http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=100&offset=0'), true, $cxContext);
        foreach($data as $key=>$value){
            echo $key . " " . $value;
        
        }
}

add_players_to_database();
    
