<!DOCTYPE html>
<html>
<head>
    <script src='javascript/jquery.js'></script>
    <script src='javascript/js.js'></script>
    
    <Title>Fantasy Football Boost Site</Title>
    <meta charset="utf-8" />
    <link rel="stylesheet" type="text/css" href="css/Main.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"/>
</head>
<?php require('menu.html'); ?>


<form name='stats_view'>
    <select name='season'>
        <option value='2016'>2016</option>
        <option value='2015'>2015</option>
        <option value='2014'>2014</option>
        <option value='2013'>2013</option>
        <option value='2012'>2012</option>
        <option value='2011'>2011</option>
        <option value='2010'>2010</option>
    </select>
    <select name='week'>
        <?php 
        for($i = 1; $i<24; $i++){
            echo "<option value='$i'>$i</option>";
        }
        ?>
        </select>
        <button action='GET'>submit</button>
        </form>

<form name='position_view'>
    <select name='position'>
        <option value='QB'>QB</option>
        <option value='WR'>WR</option>
        <option value='RB'>RB</option>
        <option value='TE'>TE</option>
        <option value='DEF'>DEF</option>
    </select>
    
    

