<?php
header('Content-Type: text/plain; charset=utf-8');

if(isset($_FILES['userfile'])){
    echo 'file isset';
}