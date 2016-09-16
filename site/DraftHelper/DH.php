<?php
//require('data.php');
?>

<HTML>
<meta name="viewport" content="width=device-width, initial-scale=1">
    <TITLE>Draft Helper</TITLE>
    <HEAD>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Ubuntu"/>
        <link rel="stylesheet" href="../lib/w3.css">
        <link rel="stylesheet" type="text/css" href="draft_helper.css">
        <script src='../javascript/jquery.js'></script>
        <!--<script src='../javascript/draft.js'></script>-->
        <script src='draft.js'></script>
    </HEAD>
    <body>
            <div id='menu' class="w3-row">
                <div class='menu_div w3-light-grey' id='draft_status'></div>
                <div class='menu_div w3-light-grey' id='draft_controls'></div>
                <div class='menu_div w3-light-grey' id='quick_draft_configuration'></div>
            </div>
            <div id="content">
                <div id='players' class='w3-quarter'>
                    <div id='player_list_filter' class='w3-panel'></div>
                    <div id='player_list' class='w3-card-4'></div>
                </div>
                <div id='teams_display' class='w3-half w3-responsive'></div>
                <div id='draft_record' class='w3-quarter w3-responsive'></div>
            </div>
        