<?php

if($_POST){
    //code to delete the contents of the folder first might be cool.
    $encode = json_encode($_POST);
    $rand = rand(0, 10);
    $file = 'datas/'.$rand.'.json';
    file_put_contents($file, $encode);
    echo $file;
}

?>