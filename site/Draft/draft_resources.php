<?php
require('../php/mysql.php');
 
function player_list_table($mysqli){
    $sql = "SELECT player_id, name, position, teamAbbr, rank, adp 
            FROM t_players 
            WHERE position IN ('DEF' )
            OR (position IN ('QB', 'RB', 'WR', 'TE', 'K') AND  rank < 300)
            ORDER BY rank";
    $result = $mysqli->query($sql);
    echo "<table id='player_list_table'><thead><tr id='player_list_th_tr'><th>Player</th><th>Pos</th><th>Team</th><th >ADP</th><th>Rank</th></tr></thead><tbody>";
    while($player = $result->fetch_array(MYSQLI_ASSOC)){
        echo "<tr>
                <td >".$player['name']."</td>
                <td >".$player['position']."</td>
                <td >".$player['teamAbbr']."</td>
                <td >".round($player['adp'], 2)."</td>
                <td >".$player['rank']."</td>
            </tr>";   
    }
    echo "</tbody></table>";
    $result->close();
}

function get_league_info($mysqli, $league_id, $request_source){
    $league = array();
    $sql = "SELECT * FROM t_league WHERE league_id = '".$league_id."'";
    $result = $mysqli->query($sql);
    while($row = $result->fetch_array(MYSQLI_ASSOC)){
        $league[] = $row
    }
    if($request_source = 'php'){
        return json_encode($league);
    }
    if($request_source = 'js'){
        echo json_encode($league);
    }
    
    
}

function get_league_teams($mysqli, $league_id, $logged_in_team_id) {
    $league = json_decode(get_league_info($mysqli, $league_id, 'php'));
    
    $sql = "SELECT * from t_teams WHERE league_id = '".$league_id."'";
    $result = $mysqli->query($sql);
    while($team = $result->fetch_array(MYSQLI_ASSOC)){
        $name = $team['name'];
        $draft_position = $team['draft_position'];
        $team_id = $team['draft_position'];
        echo "<table class='team_draft_table'>";
        
    }
}

if($_GET['resource'] == 'player_list_table'){
    player_list_table($mysqli);
}

if($_GET['resource']=='league_teams'){
    $logged_in_team_id = $_GET['team_id'];
    $league_id = $_GET['league_id'];
    
   
}

