<?php
require('../php/mysql.php');
 
function player_list_table($mysqli){
    $sql = "SELECT player_id, name, position, teamAbbr, rank, adp 
            FROM t_players 
            WHERE position IN ('DEF' )
            OR (position IN ('QB', 'RB', 'WR', 'TE', 'K') AND  rank < 300)
            ORDER BY rank";
    $result = $mysqli->query($sql);
    echo "<table id='player_list_table'><tr><th>Player</th><th>Pos</th><th>Team</th><th>ADP</th><th>Rank</th></tr><tbody id='overflow_protected'>";
    while($player = $result->fetch_array(MYSQLI_ASSOC)){
        echo "<tr>
                <td>".$player['name']."</td>
                <td>".$player['position']."</td>
                <td>".$player['teamAbbr']."</td>
                <td>".$player['adp']."</td>
                <td>".$player['rank']."</td>
            </tr>";   
    }
    echo "</tbody></table>";
}

player_list_table($mysqli);

