<HTML>
    <TITLE>Main Page</TITLE>
    <head>
    </head>
    <?php
    $json_data = file_get_contents('data/2015.json', 'r');
    $json_a = json_decode($json_data, true, JSON_FORCE_OBJECT);
    //var_dump($json_a);
    var_dump( $json_a['players']);
    
    
    
    ?>

        