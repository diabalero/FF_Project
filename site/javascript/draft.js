//TO DO//
//add button to show hidden drafted players (currently players drafted more than 20 picks ago)
//code to undo a draft pick. should be able to click on a previous pick and reset draft to that point (undo that pick and all after it)
//MAYBE color undrafted player rows individual cells to take advantage of lowest and highest pick data 
//add option to add bench rows to team boards instead of denying player drafting too many of a position
    //bug here currently! if the tool denys a pick because there are no more bench spots, it still progresses the pick counter
//somehow indicate to the user that you can rename teams by double clicking on them
//allow customization of draft, number of rounds, teams
//add feature for setting keepers
//highlight table of currently picking team

//STYLING TASK SUGGESTIONS FOR DEREK (just ideas)
//make the pick number smaller in the team boards
//style the team tables such that they dont look like generic html tables
    //rounded corners?
    //background colors
    //no borders?
    //border only on outside edges and between team name and picks?
//change the font used on the page, probably need sans serif
//color the background of the page, such that the tables stand out
//highlight table of picking team


$(document).ready(function(){
    
   var numTeams = 12;
   var numRounds = 15;
   var num_bench_spots = numRounds - 9;
   var round = 1;
   var pick = 1;
   var dp_of_team_name_change;
   var draft_record = [];
   var overall_pick = 1;
   var allowed_flex_positions = ['RB', 'WR'];
   //console.log(num_bench_spots);
    
   //load the list of all the players into the side bar
   //$('#player_list').load('../DraftHelper/data.php?resource=player_list');
   /*$('#player_list').load('../DraftHelper/data.php?resource=player_list_from_csv', function(){
       color_the_player_table();
       filter_player_list('All', 'All');
   }); */
   $('#player_list_filter').load('../DraftHelper/data.php?resource=player_list_filter');
   get_players();
   filter_player_list('All', 'All');
   //console.log(players_array[0]);
   $('#teams_display').load('../DraftHelper/data.php?resource=teams_display&numTeams='+numTeams+'&numRounds='+numRounds, function(){
    current_team_id = 1;
    current_team_name = $('#team_'+current_team_id+'_board').find('.team_name').text();
    $('#draft_status').text("Round:"+round+" Pick:"+ pick +" Picking: "+current_team_name);
       });
   
   //create an array of team information
   var teams_info = [];
   for(i = 1; i <= numTeams; i++){
       teams_info[i] = {'draft_position': i, 'team_name':'Team'+i, 'odd_round_pick':i,'even_round_pick':(numTeams+1)-i};
       //console.log(team_info[i]);
   }
   var draft_record = [];
   
   //function to style the low and high picks to highlight value 
   
   //function to draft a player
    $('body').on('click', '.click_to_draft', function () {
        //Step 1. create variables from theplayers td properties
        //Step 2. create a team_info array, based on what round and pick it is (determine whose pick it is and keep that teams info)
        //step 3a. put the chosen player on the correct spot on the teams board. 
        //step 3b. If the team does not have an appropriate spot, reject the pick
        //step 4. Draft the player
        //create these variables for ease of use...
        var player_name = $(this).attr('player_name');
        var player_pos = $(this).attr('player_pos');
        var this_obj = $(this); //just use this variable for styling selected player rows, dont have to use $(this) that way.
        var team_info = get_team_info(round, pick);
        var team = team_info['draft_position'];
        console.log(team_info);
        add_player_to_team_board(team, player_name, player_pos);
        /*var team = team_info['draft_position'];
        
        if (player_pos == 'QB'){
            if($("#Team"+team+'_QB').text() == ''){
                $("#Team"+team+'_QB').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'TE'){
            if($("#Team"+team+'_TE').text() == ''){
                $("#Team"+team+'_TE').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'K'){
            if($("#Team"+team+'_K').text() == ''){
                $("#Team"+team+'_K').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'DEF'){
            if($("#Team"+team+'_DEF').text() == ''){
                $("#Team"+team+'_DEF').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'RB'){
            if($("#Team"+team+'_RB1').text() == ''){
                $("#Team"+team+'_RB1').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                }
            else if($("#Team"+team+'_RB2').text() == ''){
                $("#Team"+team+'_RB2').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                }
            else if($("#Team"+team+'_Flex').text() == ''){
                $("#Team"+team+'_Flex').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                }
            else{
                    if (add_to_bench(team, player_pos, player_name) == 1){
                        draft_player(this_obj, team, player_name, player_pos);
                        }
                    }
        }
        if (player_pos == 'WR'){
            if($("#Team"+team+'_WR1').text() == ''){
                $("#Team"+team+'_WR1').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                    }
            else if($("#Team"+team+'_WR2').text() == ''){
                $("#Team"+team+'_WR2').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                    }
            else if($("#Team"+team+'_Flex').text() == ''){
                $("#Team"+team+'_Flex').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                    }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, team, player_name, player_pos);
                        }
                    }                
            
        }     

        team_info = get_team_info(round, pick);
        update_draft_status(round, pick);  
        color_the_player_table();
        highlight_picking_teams_table();*/
    });
    //function to change the name of a team
    $('body').on('dblclick', '.team_name', function() {
        
        $('.team_board').find('div[purpose="team_name"]').removeClass(); //this disables the user from changing 2 team names simultaneously
        $(this).html('<input type="text" id="new_team_name"></input><button id="change">change</button>');
        $('#new_team_name').focus();
        dp_of_team_name_change = $(this).attr('draft_position');
            });
    $('body').on('click', '#change', function(){
        if ($('#new_team_name').val() != ''){
        new_team_name = $('#new_team_name').val()
        $('div[draft_position='+dp_of_team_name_change+']').text(new_team_name);
        teams_info[dp_of_team_name_change]['team_name'] = new_team_name;
        update_draft_status(round, pick);
        $('.team_board').find('div[purpose="team_name"]').addClass('team_name');
        }

        });
    $('body').on('keyup', '#new_team_name', function(e){
        if(e.keyCode == 13){
            if ($('#new_team_name').val() != ''){
            new_team_name = $('#new_team_name').val();
            $('div[draft_position='+dp_of_team_name_change+']').text(new_team_name);
            teams_info[dp_of_team_name_change]['team_name'] = new_team_name;
            update_draft_status(round, pick);
            $('.team_board').find('div[purpose="team_name"]').addClass('team_name');
            }
        }
        
    });
    //implement function to filter the player list when the select boxes change
    $('body').on('change', '#team_filter', function(){
        position = $('#position_filter').val();
        team = $('#team_filter').val();
        filter_player_list(position, team);
    });
    $('body').on('change', '#position_filter', function(){
        position = $('#position_filter').val();
        team = $('#team_filter').val();
        filter_player_list(position, team);
    });
    $('body').on('click', '#print_draft_results', function(){
        print_draft_results();
    });
    $('body').on('click', '#menu', function(){
        undo_last_draft_pick();
    });    
    

        function add_player_to_team_board(team, player_name, player_pos){
            //step1. put the position into a variable
            //step2. look for the first empty cell in that teams board with the class matching the position
            //step3. if the position cells are filled, look for the first empty bench class cell
            //step4. check to see if the player was added to a cell
            //step5. return true if a player was added, return false if no applicable spots are available
            if($('.Team_'+team+'_'+player_pos+'_cell:empty').first().text(player_name).length === 1)
                {
                    return 1;
                }
            else
                {
                    if(allowed_flex_positions.includes(player_pos)) //<---watch out for this, it might not work...
                        {
                        if($('.Team_'+team+'_Flex_cell:empty').first().text(player_name).length === 1)
                            {
                                return 1;
                            }
                        else
                            {
                                if($('.Team_'+team+'_BN_cell:empty').first().text(player_name).length === 1)
                                    {
                                        return 1;
                                    }
                                else
                                    {
                                        alert('You cannot draft any more '+player_pos+"'s");
                                        return 0;
                                    }
                            }
                }
                else
                    {
                        if($('.Team_'+team+'_BN_cell:empty').first().text(player_name).length === 1)
                            {
                                return 1;
                            }
                        else
                            {
                                return 0;
                            }
                    }
            }
            //console.log('.Team_'+team+'_'+player_pos+'_cell:contains("")');
            //console.log(player_pos);
        }
        
        function draft_player(obj, team, player_name, player_pos){
            // add the draft pick to the draft_record array
            draft_record.push({'round':round, 'pick':pick, 'team':team, 'player':player_name, 'pos':player_pos });
            // remove the 'click_to_draft class from the player name cell so he cant be drafted again
            $(obj).removeClass();
            //add the 'drafted' class to the player name cell so his name is styled with line-though
            $(obj).parent().attr('drafted', 'true');
            //figure out what team board table and cell to put the player in, and put him there.
            $(obj).parent().attr('overall_pick', overall_pick);
            if(pick < numTeams){
                pick += 1;
                }
            else{
                pick = 1;
                round += 1;
                }
            overall_pick += 1;
        }
        
        function get_team_info(round, pick){
            if (round % 2 != 0){ //applies to odd rounds
                local_team_info = teams_info[pick];
            }
            else{ //applies to even rounds
                local_team_info = teams_info[(numTeams+1) - pick];
            }
            return local_team_info;
        }
        function update_draft_status(round, pick){
            var team_info = get_team_info(round, pick);
            $('#draft_status').text("Round:"+round+" Pick:"+ pick+" Picking: "+team_info['team_name']);
        }
        
        function color_the_player_table(){
            //var current_pick = round + (pick/100);
                //console.log(overall_pick);
            $('.player_row').each(function(index){
                
                if($(this).attr('drafted') != 'true'){
                //var low_pick = $(this).find('.low_pick').text();
                //var high_pick = $(this).find('.high_pick').text();
                var adp = Math.round($(this).find('.adp').text());
                
                $(this).css('background-color','transparent');
                

                if(overall_pick > adp){
                    $(this).css('background-color','#4dffb8'); // #66ccff
                    }
                if(overall_pick <= adp){
                    $(this).css('background-color','#ff6666');
                    }
                if((overall_pick > (adp - 0.02)) && (overall_pick < (adp + 0.02))){
                    $(this).css('background-color','yellow');
                    }
                
                /*else{
                    if(overall_pick - ($this).attr('overall_pick').val() > 9){
                        console.log('we know it runs...');
                        $(this).css('display', 'none');
                */    
                }
                    
                else{
                    $(this).css('background-color', '#808080');
                    $(this).css('color', '#404040');
                    }
                hide_non_recent_drafted_players();
            });
        }
        function filter_player_list(position, team){
            //var visible_tr_display = $('#player_list_header_row').css('display');
            //console.log(visible_tr_display);
            if(team == 'All' && position == 'All'){
                $('tr[class="player_row"]:hidden').css('display','table-row');
            }
            if(position == 'All' && team != 'All'){
                $('tr[class="player_row"]').css('display','none');
                $('tr[player_team="'+team+'"]').css('display','table-row');
            }
            if(team == 'All' && position != 'All'){
                $('tr[class="player_row"]').css('display','none');
                 $('tr[player_pos="'+position+'"]').css('display','table-row');
            }
            if(team != 'All' && position != 'All'){
                $('tr[class="player_row"]').each(function(){
                    if($(this).attr('player_pos') == position && $(this).attr('player_team') == team){
                        $(this).css('display', 'table-row');
                    }
                    else($(this).css('display','none'));
                });
                
            }
        }
        
        function hide_non_recent_drafted_players(){
            $('.player_row').each(function(){
                if(overall_pick - $(this).attr('overall_pick') > 20){
                    $(this).css('display','none');
                }    
            });
        }
        
        function show_non_recent_drafted_players(){
            $('.player_row').css('display', 'table-row');
            position = $('#position_filter').val();
            team = $('#team_filter').val();
            filter_player_list(position, team);
        }

        function undo_last_draft_pick(){
            //0. if the overall_pick is 1, return.
            //1. erase player from team table
            //2. set tr drafted attribute to false
            //3. set tr overall_pick attribute to ''
            //4. re-apply the .click_to_draft class to the td of the player in the player_list
            //5. remove the draft record from the array
            //6. move the pick back, move the round back if neccessary, subract one from overall pick
            //7. update the draft status
            //8. highlight the correct team board
            //9. color the player table
            //step 0
            if(overall_pick == 1){return;}
            var last_draft_pick = draft_record[draft_record.length - 1];
            //step 1 - done
            $('.team_board td:contains("'+last_draft_pick['player']+'")').text("");
            //step 2 - done
            console.log($('#player_list_table tr[player_name="'+last_draft_pick['player']+'"]').attr('drafted', false));
            //step 3 - done
            $('#player_list_table tr[player_name="'+last_draft_pick['player']+'"]').attr('overall_pick', '');
            //step 4
            $('#player_list_table td[player_name="'+last_draft_pick['player']+'"]').attr('class', 'click_to_draft');
            //step 5
            draft_record.pop();
            //step 6
            if(pick == 1){
                pick = numTeams;
                round = round - 1
            }
            else{
                pick = pick - 1;
            }
            overall_pick--;
            //step 7
            update_draft_status(round, pick);
            //step 8
            highlight_picking_teams_table();
            //step 9
            color_the_player_table(); 
            


        }
        
        //this doesnt work, but if I figure out how the functions that do work, work, maybe I can fix this...
        /*function player_list_from_nfl_com(){
            var url = "http://api.fantasy.nfl.com/v1/players/userdraftranks?format=json&count=100&offset=";
            $('#player_list').html('<table id="player_list_table"><tr><th>Pos</th><th>Player</th><th>Team</th><th>ADP</th></tr>');
                for(i=0;i<501;i+=100){
                //console.log(url+i);
                
                $.getJSON(url+i, function(data){
                    $.each(data['players'], function(key, value){
                    $('#player_list_table tr:last').after('<tr player_name="'+value['firstName']+' '+value['lastName']+'" player_pos="'+value['position']+'" player_team="'+value['teamAbbr']+'"><td>'+value['position']+'</td><td>'+value['firstName']+ ' '+value['lastName']+'</td><td>'+value['teamAbbr']+'</td><td>'+value['rank']+'</td></tr>');
                    });
                    
                });
                }
        }*/

  
        function populate_player_list_via_json_queries(callback){
            var players_array = [];        
            var url = "http://api.fantasy.nfl.com/v1/players/userdraftranks?format=json&count=50&offset=";
            $('#player_list').html('<table id="player_list_table"><tr><th>no.</th><th>Pos</th><th>Player</th><th>Team</th><th>ADP</th></tr>');

            var players_needed = 300;
            var players_retrieved = 0;
            var players_per_request = 50;
            while (players_needed > players_retrieved)
            {
                //console.log(url+players_retrieved);

                $.getJSON(url+players_retrieved, function(data)
                {
                    $.each(data['players'], function(key, value)
                    {
                        players_array.push(this);
                    });
                
                    //console.log(players_array[i]);
                    //console.log("Inside JSON: " + players_array.length);
                    
                    if (players_array.length >= players_needed)
                    {
                        callback(players_array);
                    }
                });
                
                players_retrieved += players_per_request;
            }
          }
                


            //when you call populate_player_list_via_json_queries, it get's back the result:
        function get_players(){

            //get our JSON
            populate_player_list_via_json_queries(function(player_array)
            {
                //when we get our data, evaluate
                player_array.sort(function(a, b)
                {
                    return( parseFloat(a.rank) - parseFloat(b.rank)); 
                })
                //console.log(player_array);
                for(i=0;i<player_array.length;i++)
                {        
                $('#player_list_table tr:last').after('<tr class="player_row" drafted="false" player_name="'+player_array[i]['firstName']+ ' '+player_array[i]['lastName']+'" player_team="'+player_array[i]['teamAbbr']+'" player_pos="'+player_array[i]['position']+'"><td>'+(i+1)+'</td><td>'+player_array[i].position+'</td><td class="click_to_draft" player_name="'+player_array[i]['firstName']+ ' '+player_array[i]['lastName']+'" player_team="'+player_array[i]['teamAbbr']+'" player_pos="'+player_array[i]['position']+'">'+player_array[i].firstName+ ' ' + player_array[i].lastName+'</td><td>'+player_array[i].teamAbbr+'</td><td class="adp">'+player_array[i].rank+'</td></tr>');
                }
                color_the_player_table();
                highlight_picking_teams_table();    
            });
        }

        //this is unused right now, but I want to separate it out into its own function eventually, so I will leave this here    
        function add_player_to_board(team, player_name, player_pos, pick){
            if (player_pos == 'QB')
            {
                if($("#Team"+team+'_QB').text() == ''){
                    $("#Team"+team+'_QB').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, team, player_name, player_pos);
                    }
                }
            }
            if (player_pos == 'TE')
            {
                if($("#Team"+team+'_TE').text() == '')
                {
                $("#Team"+team+'_TE').text(player_name);
                draft_player(this_obj, team, player_name, player_pos);
                }
                else
                {
                    if (add_to_bench(team, player_pos, player_name) == 1)
                    {
                        draft_player(this_obj, team, player_name, player_pos);
                    }
                }
            }
            if (player_pos == 'K')
            {
                if($("#Team"+team+'_K').text() == '')
                {
                    $("#Team"+team+'_K').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else
                {
                    if (add_to_bench(team, player_pos, player_name) == 1)
                    {
                        draft_player(this_obj, team, player_name, player_pos);
                    }
                }
            }
            if (player_pos == 'DEF')
            {
                if($("#Team"+team+'_DEF').text() == '')
                {
                    $("#Team"+team+'_DEF').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else
                {
                    if (add_to_bench(team, player_pos, player_name) == 1)
                    {
                        draft_player(this_obj, team, player_name, player_pos);
                    }
                }
            }
            if (player_pos == 'RB')
            {
                if($("#Team"+team+'_RB1').text() == '')
                {
                    $("#Team"+team+'_RB1').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else if($("#Team"+team+'_RB2').text() == '')
                {
                    $("#Team"+team+'_RB2').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else if($("#Team"+team+'_Flex').text() == '')
                {
                    $("#Team"+team+'_Flex').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else
                {
                        if (add_to_bench(team, player_pos, player_name) == 1)
                        {
                            draft_player(this_obj, team, player_name, player_pos);
                        }
                }
            }
            if (player_pos == 'WR')
            {
                if($("#Team"+team+'_WR1').text() == '')
                {
                    $("#Team"+team+'_WR1').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else if($("#Team"+team+'_WR2').text() == '')
                {
                    $("#Team"+team+'_WR2').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else if($("#Team"+team+'_Flex').text() == '')
                {
                    $("#Team"+team+'_Flex').text(player_name);
                    draft_player(this_obj, team, player_name, player_pos);
                }
                else
                {
                    if (add_to_bench(team, player_pos, player_name) == 1)
                    {
                        draft_player(this_obj, team, player_name, player_pos);
                    }
                }                
            } 
        }
        
        function highlight_picking_teams_table(){
            if(round%2!=0){ team = pick;}
            if(round%2==0) {team = (numTeams+1)-pick;}
            $('.team_board th').css('background-color', 'transparent');
            $('#team_'+team+'_board th').css('background-color', 'yellow');
        }
        function print_draft_results(){
            for(i=0;i<draft_record.length;i++){
                console.log('round:'+draft_record[i]['round']+' pick:'+draft_record[i]['pick']+' team:'+draft_record[i]['team']+' player:'+draft_record[i]['player']+ ' position:'+draft_record[i]['pos']);
            }
            
        }
           
}); //end document.ready


// player_name="'+value['firstName']+' '+value['lastName']+'" player_pos="'+value['position']+'" player_team="'+value['teamAbbr']+'"