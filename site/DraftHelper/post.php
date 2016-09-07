<?php

if($_POST){
    $encode = json_encode($_POST);
    $file = 'keeper_exports/export';
    file_put_contents($file, $encode);
    if( !file_exists($file) ) die("File not found");
    header('Content-disposition: attachment; filename='.$file);
    readfile($file);
}

?>

200 OK
Content-Type: text/html; charset=utf-8
Content-Disposition: attachment; filename="keeper_exports/export"
Content-Length: 22