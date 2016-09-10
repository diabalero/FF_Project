<?php
//header('Content-Type: text/plain; charset=utf-8');

if(isset($_FILES['userfile'])){
    if(move_uploaded_file($_FILES['userfile']['tmp_name'], "datas/" . $_FILES['userfile']['name'])){
        //echo $_FILES['userfile']['name']. " OK";
    } else {
        //echo $_FILES['userfile']['name']. " KO";
    }
    $file = "datas/" . $_FILES['userfile']['name'];
    $file_contents = file_get_contents($file);
    echo $file_contents;
    exit;
} 
else {
    echo "No files uploaded ...";
}

    
