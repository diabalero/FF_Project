<?php

class ff_queries{
    
//get the running back stats and echo them to a table
    function get_running_back_stats($week, $season){
        $mysqli = new mysqli('localhost', 'root', 'usbw', 'ff');
        $sql = "SELECT  p.name,
        MAX(IF(ps.stat_id = 14, ps.value, 0)) 'Rushing Yards',
		MAX(IF(ps.stat_id = 13, ps.value, 0)) 'Rushing Attempts',
		MAX(IF(ps.stat_id = 20, ps.value, 0)) 'Receptions',
		MAX(IF(ps.stat_id = 21, ps.value, 0)) 'Receiving Yards',
		MAX(IF(ps.stat_id = 15, ps.value, 0)) 'Rushing Touchdowns',
		MAX(IF(ps.stat_id = 22, ps.value, 0)) 'Recieving Touchdowns',
		MAX(IF(ps.stat_id = 31, ps.value, 0)) 'Fumble',		
		MAX(IF(ps.stat_id = 0, ps.value, 0)) 'fantasy points'

FROM    t_players p
JOIN	t_player_stats ps ON p.player_id = ps.player_id
WHERE	p.position = 'rb'
AND		ps.week = 1
AND		ps.season = 2015
GROUP   BY p.name";

        $rb_stats = $mysqli->query($sql);
        $stats_array = $rb_stats->fetch_all();
        var_dump($stats_array);
        //$mysqli::close();
}

}

$rb = new ff_queries();
$rb->get_running_back_stats('1', '2015');

?>