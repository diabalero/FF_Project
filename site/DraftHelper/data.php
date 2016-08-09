<?php

$mysqli = new mysqli('localhost', 'root', 'usbw', 'ff');

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
}


if ($_GET['resource'] == 'player_list'){
    $all_players_result_set = $mysqli->query("Select * FROM t_draft_player_list");
    while ($player_array = $all_players_result_set->fetch_array()){
        $arrays[] = $player_array;
    }
    echo "<table id='player_list_table'><tr><th>Pos</th><th>Player/Team</th><th>ADP</th><th>Bye</th><th>Low</th><th>High</th></th></tr>";
    foreach($arrays as $array)
    {
        echo "<tr class='player_row' id='row_for_" . str_replace(' ', '',$array['Name']) . "'><td>" . $array['Pos'] . "</td><td class='click_to_draft' player_name = '" . $array['Name'] . "' player_pos='".$array['Pos']."'>" . $array['Name'] . " ".  $array['Team'] . "</td><td>" . $array['Overall'] . "</td><td>" . $array['Bye'] . "</td><td class='low_pick' value='" . $array['Low'] . "'>" . $array['Low'] . "</td><td class='high_pick' value='" . $array['High'] . "'>" . $array['High'] . "</td</tr>"; 
    }
    echo "</table>";
    $all_players_result_set->close();   
}

if ($_GET['resource'] == 'drafted_players'){
    $drafted_players_result_set = $mysqli->query("SELECT * FROM t_draft_record");
    $drafted_players_json = json_encode($drafted_players_result_set->fetch_array());
    echo $drafted_players_json;
}

//i dont know if Ill use a db to track the draft in this tool, it might just all be cached
/*if($_POST['resource'] == 'draft_player'){
    $owner = $_POST['owner'];
    $player_name = $_POST['player_name'];
    $pick = $_POST['pick'];
    $sql = "INSERT INTO 't_draft_record' ('owner', 'player_name', 'pick') VALUES '$owner', '$player_name', '$pick'";
    echo $sql;
} */

//draft grid was a bad idea, probly has to go =(
if($_GET['resource'] == 'draft_grid'){
    $num_rounds = $_GET['numRounds'];
    $num_teams = $_GET['numTeams'];
    echo "<table id='draft_grid'>";
    
    for($round = 1; $round <=$num_rounds; $round++){
        //odd numbered rounds
        if($round % 2 != 0){
            $pick = .01;
            echo "<tr round='" . $round . "' >";
            for($i=1; $i<=$num_teams; $i++){
                echo "<td pick='" . ($round + $pick) . "'></td>";
                $pick = ($pick + 0.01);
                }
                
            }
            echo "</tr>";
            //even numbered rounds
            if($round % 2 == 0){
            $pick = ($num_teams/100);
            echo "<tr>";
            for($i=$num_teams; $i>=1; $i--){
                echo "<td pick='" . ($round + $pick) . "'></td>";
                $pick = ($pick - 0.01);
                }
            echo "</tr>";
            }
        }
    echo "</table>";
}

if($_GET['resource'] == 'menu'){
    echo "<div id='draft_status'></div>";
    echo "<span id='round'></span><span id='pick'>";
    echo "Create New Draft";
    echo "Number of Teams: <select>";
    for($i=1; $i<=16; $i++){
        echo "<option value=$i>$i</option>";
    }
    echo "</select>";
}

if($_GET['resource'] == 'teams_display'){
    $num_rounds = $_GET['numRounds'];
    $num_teams = $_GET['numTeams'];
    $num_bench_spots = $num_rounds - 9;
    
    for($team = 1; $team <= $num_teams; $team++){
        echo "<table class='team_board' id='team_".$team."_board'>";
        echo "<tr><th colspan=2>Team".$team. " Pick".$team."</th></tr>";
        echo "<tr><td>QB</td><td id='Team".$team."_QB'></td></tr>";
        echo "<tr><td>RB1</td><td id='Team".$team."_RB1'></td></tr>";
        echo "<tr><td>RB2</td><td id='Team".$team."_RB2'></td></tr>";
        echo "<tr><td>WR1</td><td id='Team".$team."_WR1'></td></tr>";
        echo "<tr><td>WR2</td><td id='Team".$team."_WR2'></td></tr>";
        echo "<tr><td>Flex</td><td id='Team".$team."_Flex'></td></tr>";
        echo "<tr><td>TE</td><td id='Team".$team."_TE'></td></tr>";
        echo "<tr><td>PK</td><td id='Team".$team."_PK'></td></tr>";
        echo "<tr><td>DEF</td><td id='Team".$team."_DEF'></td></tr>";
    for($i = 1; $i<= $num_bench_spots; $i++){
        echo "<tr id='team".$team."_bench_".$i."'><td>BN</td><td></td></tr>";
    }
        
        echo "</table>";
    }
}


?>