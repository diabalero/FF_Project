<?php
//echo 'test';
$mysqli = new mysqli('localhost', 'root', 'usbw', 'ff');

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}


/*$dir = new DirectoryIterator(dirname('C:\Users\alexandj\WebServer\root\FF_Project\data\2015\w1.json'));
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot()) {
        var_dump($fileinfo->getFilename());
    }
}*/
