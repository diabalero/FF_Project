<?php
/*
$mysqli = new mysqli('localhost', 'root', 'usbw', 'ff');

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
            
}
*/

/*
if ($_GET['resource'] == 'player_list'){
    $all_players_result_set = $mysqli->query("Select * FROM t_draft_player_list");
    while ($player_array = $all_players_result_set->fetch_array()){
        $arrays[] = $player_array;
    }
    $teams = array('PIT','NYG','NYJ','LA','ATL','MIN','ARI','HOU','DAL','CIN','NE','JAC','KC','NO','GB','BUF','TB','SD','OAK','CHI','SEA','CAR','IND','DEN','TEN','MIA','SF','WAS','BAL','PHI','DET','CLE');
    echo "hello?<div id=table_filters><select id='team_filter'>";
    foreach($teams as $key =>$team){
        echo "<option value='".$team."'>".$team."</option>";
    }
    echo "</select></div>";
    echo "<table id='player_list_table'><tr><th>Pos</th><th>Player/Team</th><th>ADP</th><th>Bye</th><th>Low</th><th>High</th></th></tr>";
    foreach($arrays as $array)
    {
        echo "<tr class='player_row' id='row_for_" . str_replace(' ', '',$array['Name']) . "'><td>" . $array['Pos'] . "</td><td class='click_to_draft' player_name = '" . $array['Name'] . "' player_pos='".$array['Pos']."'>" . $array['Name'] . " ".  $array['Team'] . "</td><td>" . $array['Overall'] . "</td><td>" . $array['Bye'] . "</td><td class='low_pick' value='" . $array['Low'] . "'>" . $array['Low'] . "</td><td class='high_pick' value='" . $array['High'] . "'>" . $array['High'] . "</td</tr>"; 
    }
    echo "</table>";
    $all_players_result_set->close();   
}
*/

if($_GET['resource'] == 'draft_record'){
    $num_teams = $_GET['numTeams'];
    $num_rounds = $_GET['numRounds'];
    $overall_pick = 1;
    for($round=1; $round <= $num_rounds; $round++){
        echo "<div style='background-color:#E37222;' class='w3-panel w3-text-white w3-round hide_round' round_to_hide=' ".$round."'>Round".$round."</div>";
        echo "<div round='".$round."'>";
        for($pick=1;$pick<=$num_teams;$pick++){
            echo "<div class='w3-panel w3-blue w3-round-large w3-margin-bottom' overall_pick='".$overall_pick."' round='".$round."' pick='".$pick."'>
                <span class='w3-badge'>".$overall_pick."</span>
                <span overall_pick='".$overall_pick."'></span>
                </div>";
            $overall_pick++;
        }
        echo "</div>";
    }
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

/*Start of Quick Draft Configuration code*/
if($_GET['resource'] == 'quick_draft_configuration'){
    echo "<div class='w3-dropdown-hover'><span class='menu_div_title'>Start New Draft (Quick Config)</span><hr>";
    echo "<div class='w3-dropdown-content w3-card-4' style='width:250px'><div class='w3-container'><form id='draft_configuration_form' method='post'>";
    echo "<div class='w3-small'> Teams: <select id='draft_configuration_select_teams'>";
    for($i=1;$i<21;$i++){
        if($i == '12'){
            echo "<option value='$i' selected>$i</option>";    
        }
        else{
            echo "<option value='$i'>$i</option>";    }    
        }
    echo "</select>&nbsp &nbsp &nbsp &nbsp";
    echo "Rounds: <select id='draft_configuration_select_rounds'>";
    for($i=1;$i<21;$i++){
        if($i == '15'){
            echo "<option value='$i' selected>$i</option>";
        }
        else{
            echo "<option value='$i'>$i</option>";
            }
    }
    echo "</select><br>";
    echo "Flex: <select id='draft_configuration_select_flex'><option value='std'>WR, RB</option><option value='te'>WR, RB, TE</option></select>";
    
    echo "<br><button class='w3-btn w3-small w3-round w3-teal w3-margin-top' id='launch_new_draft'>Launch New Draft</button>";
    echo "</form></div></div></div></div>";
}
/*End of Quick Draft Configuration code*/

/*Start of Draft Controls code*/
if($_GET['resource']=='draft_controls'){
    echo "<div class='w3-dropdown-hover'><span class='menu_div_title'>Draft Controls</span><hr>";
    echo "<div class='w3-dropdown-content w3-card-4' style='width:300px;height:100px'><div class='w3-container w3-small'><span id='export_span'><button class='w3-btn w3-small w3-round w3-teal' alt='Export Draft' id='export_draft'>Export Draft</button> </span><br>";
    echo "<input class='w3-btn w3-small w3-round w3-margin-top w3-teal' type='file' id='import_file'><br></div></div></div>";
}
/*End of Draft Controls code*/

/*Start of Draft Status code*/
if($_GET['resource'] == 'draft_status'){
    $num_teams = $_GET['num_teams'];
    $num_rounds = $_GET['num_rounds'];
    echo "<span class='menu_div_title'>Draft Status</span><hr>";
    echo 'Round: <select class="draft_status_select w3-small" id="draft_status_round">';
    for($i=1; $i<=$num_rounds; $i++){
        echo '<option value='."$i".'>'.$i.'</option>';
    }
    echo '</select>&nbsp &nbsp &nbsp &nbsp Pick: <select class="draft_status_select w3-small" id="draft_status_pick">';
    for($i=1; $i<=$num_teams; $i++){
        echo '<option value='."$i".'>'.$i.'</option>';
    }
    echo '</select><div class="w3-margin-top">Picking Team: <span id="picking_team"></span></div>';
    echo "<button class='w3-btn w3-tiny w3-round w3-red w3-margin-top' alt='undo' id='undo_button'>Undo Last Pick</button>";
}
/*End of Draft Status code*/

if($_GET['resource'] == 'teams_display'){
    $num_rounds = $_GET['numRounds'];
    $num_teams = $_GET['numTeams'];
    $num_bench_spots = $num_rounds - 9;
    
    for($team = 1; $team <= $num_teams; $team++){
        echo "<table class='team_board w3-table-all w3-card-4 w3-tiny w3-margin-left w3-margin-right w3-margin-top w3-col m3' id='team_".$team."_board' draft_position='".$team."' team_name='Team ".$team."'>";
        echo "<tr class='w3-blue'><th colspan=2><div purpose='team_name' draft_position='".$team."' class='team_name'>Team".$team. "</div></td> Pick".$team."</th></tr>";
        echo "<tr><td >QB</td><td class='Team_".$team."_QB_cell' id='Team_".$team."_QB'></td></tr>";
        echo "<tr><td>RB1</td><td  class='Team_".$team."_RB_cell' id='Team_".$team."_RB1'></td></tr>";
        echo "<tr><td>RB2</td><td class='Team_".$team."_RB_cell' id='Team_".$team."_RB2'></td></tr>";
        echo "<tr><td>WR1</td><td class='Team_".$team."_WR_cell' id='Team_".$team."_WR1'></td></tr>";
        echo "<tr><td>WR2</td><td class='Team_".$team."_WR_cell' id='Team_".$team."_WR2'></td></tr>";
        echo "<tr><td>Flex</td><td class='Team_".$team."_Flex_cell' id='_Team".$team."_Flex'></td></tr>";
        echo "<tr><td>TE</td><td class='Team_".$team."_TE_cell' id='Team_".$team."_TE'></td></tr>";
        echo "<tr><td>K</td><td class='Team_".$team."_K_cell' id='Team_".$team."_K'></td></tr>";
        echo "<tr><td>DEF</td><td class='Team_".$team."_DEF_cell' id='Team_".$team."_DEF_cell'></td></tr>";
    for($i = 1; $i<= $num_bench_spots; $i++){
        echo "<tr id='team".$team."_bench_".$i."'><td>BN</td><td class='Team_".$team."_BN_cell'></td></tr>";
    }
        
        echo "</table>";
    }
}

if($_GET['resource'] == 'player_list_from_csv'){

    $teams = array('PIT','NYG','NYJ','LA','ATL','MIN','ARI','HOU','DAL','CIN','NE','JAC','KC','NO','GB','BUF','TB','SD','OAK','CHI','SEA','CAR','IND','DEN','TEN','MIA','SF','WAS','BAL','PHI','DET','CLE');
    asort($teams);
    echo "<div id=table_filters>Team: <select id='team_filter'><option value='All'>All</option>";
    foreach($teams as $team){
        echo "<option value='".$team."'>".$team."</option>";
    }
    echo "</select> ";
    $positions = array('QB','RB','WR','TE','DEF','K');
    echo "Position: <select id='position_filter'><option value='All'>All</option>";
    foreach($positions as $position){
        echo "<option value='$position'>$position</option>";
    }
    echo "</select></div>";
    echo "<table id='player_list_table' class='w3-table-all w3-tiny w3-margin-top w3-hoverable'>
    <tr id='player_list_header_row' class='w3-blue'><th>Pos</th><th>Player/Team</th><th>ADP</th><th>Low</th><th>High</th><th>Bye</th></tr>";
    //$data_as_string = file_get_contents('../resources/adp.csv');

    $lines = file('../resources/adp.csv');

    foreach($lines as $key => $line){
        if($key === 0){continue;}
        
        $line = explode(',', $line);
        echo "<tr class='player_row' id='row_for_" . str_replace(' ', '',$line[2]) . "' player_team = '".$line[4]."' player_name = '" . $line[2] . "' player_pos='".$line[3]."'>
            <td>" . $line[3] . "</td>
            <td class='click_to_draft' player_team = '".$line[4]."' player_name = '" . $line[2] . "' player_pos='".$line[3]."'>" . $line[2] . " ".  $line[4] . "</td>
            <td class='adp' value='" . $line[1] . "'>" . $line[1] . "</td>
            <td class='low_pick' value='" . $line[9] . "'>" . $line[9] . "</td>
            <td class='high_pick' value='" . $line[8] . "'>" . $line[8] . "</td>
            <td>" . $line[5] . "</td>
            </tr>";
        }
    }




if($_GET['resource'] == 'player_list_filter'){
    $teams = array('PIT','NYG','NYJ','LA','ATL','MIN','ARI','HOU','DAL','CIN','NE','JAC','KC','NO','GB','BUF','TB','SD','OAK','CHI','SEA','CAR','IND','DEN','TEN','MIA','SF','WAS','BAL','PHI','DET','CLE');
    asort($teams);
    echo "<div id=table_filters>Team: <select id='team_filter'><option value='All'>All</option>";
    foreach($teams as $team){
        echo "<option value='".$team."'>".$team."</option>";
    }
    echo "</select> ";
    $positions = array('QB','RB','WR','TE','DEF','K');
    echo "Position: <select id='position_filter'><option value='All'>All</option>";
    foreach($positions as $position){
        echo "<option value='$position'>$position</option>";
    }
    echo "</select></div>";
}

/*if($_GET['resource'] == 'player_list_from_nfl'){
    for($i=1;$i<301$i+=100){
        $100_players = json_decode(file_get_contents());
    }
}*/


?>