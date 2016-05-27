<?php
$json = json_decode(file_get_contents('C:/Users/alexandj/WebServer/root/FF_Project/data/2015.json'));
//var_dump($json);
//var_dump($json->players[0]);
//var_dump($json->players[0]->stats);
$obj = $json->players[0]->stats;
foreach($obj as $key => $value){
    echo "$key : $value ";
}
echo "<br />";

print_r($obj);
echo "<br />";
print $obj->{'1'};
?>

