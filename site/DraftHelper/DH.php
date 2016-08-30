<?php
//require('data.php');
?>

<HTML>
<meta name="viewport" content="width=device-width, initial-scale=1">
    <TITLE>Draft Helper</TITLE>
    <HEAD>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Ubuntu"/>
        <!--<link rel="stylesheet" type="text/css" href="../css/draft_helper.css">-->
        <link rel="stylesheet" href="../lib/w3.css">
        <script src='../javascript/jquery.js'></script>
        <!--<script src='../javascript/draft.js'></script>-->
        <script src='../javascript/draft.js'></script>
    </HEAD>
    <body>
            <div id='menu' class="w3-row">
                <div class='menu_div w3-col s4 w3-dark-grey' id='draft_status'></div>
                <div class='menu_div w3-col s4 w3-dark-grey' id='draft_controls'></div>
                <div class='menu_div w3-col s4 w3-dark-grey' id='quick_draft_configuration'></div>
            </div>
            <div id="content">
                <div id='players' class='w3-col l9 m6 s4 w3-left'>
                    <div id='player_list_filter' class='w3-panel'></div>
                    <div id='player_list'></div>
                </div>
                <div id='teams_display' class='w3-rest w3-responsive'></div>
            </div>
        