//TO DO//
//Features: 
    //export and import keeper list
//style:
    //If you start a draft with few teams, the teams div shrinks too much, 
    //center the team tables in thier container, right now they lean to the left
    //force page to be 100% wide (why is it stopping short on wide monitors?)
//improvements:
    //need a better query or algorythm for showing draftable players. Top x # of ranked players isnt good enough. (dont want players from 10 years ago, but need all the TEs and DEFs to show)
    //load the player list, rankings, etc.


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
   var last_pick = []; //I will just set last_pick to overall_pick after a selection, 
   //then the undo function will just erase that from the draft record, and restyle what needs it
   
   
    
   //load the list of all the players into the side bar from the database
   //$('#player_list').load('../DraftHelper/data.php?resource=player_list');
   
   //load the list of all the players from a CSV (ffcalculator is the source)
   /*$('#player_list').load('../DraftHelper/data.php?resource=player_list_from_csv', function(){
       color_the_player_table();
       filter_player_list('All', 'All');
   }); */
   
   function load_the_page(){
   //load the list of players from nfl.com's api
   $('#player_list_filter').load('../DraftHelper/data.php?resource=player_list_filter');
   get_players();
   filter_player_list('All', 'All');
   
   //load the team tables based on number of teams and rounds (# of rounds effects bench spots)
   //I need to add configuration for how many of each position and what can be in a flex spot using the allowed flex positions array
   $('#teams_display').load('../DraftHelper/data.php?resource=teams_display&numTeams='+numTeams+'&numRounds='+numRounds, function(){
    current_team_id = 1;
    current_team_name = $('#team_'+current_team_id+'_board').find('.team_name').text();
       });
    $('#draft_record').load('../DraftHelper/data.php?resource=draft_record&numTeams='+numTeams+'&numRounds='+numRounds);
    $('#draft_status').load('../DraftHelper/data.php?resource=draft_status&num_rounds='+numRounds+'&num_teams='+numTeams, function(){
        
        update_draft_status(round, pick);
    });
    $('#quick_draft_configuration').load('../DraftHelper/data.php?resource=quick_draft_configuration');
    $('#draft_controls').load('../DraftHelper/data.php?resource=draft_controls');
   }
load_the_page();
   
   //create an array of team information
   var teams_info = [];
   for(i = 1; i <= numTeams; i++){
       teams_info[i] = {'draft_position': i, 'team_name':'Team'+i};
       //console.log(teams_info[i]);
   }
   
   //launch new draft
   $('body').on('click', '#launch_new_draft', function(e){
       e.preventDefault();
       //alert('default was prevented');
       numTeams = parseInt($('#draft_configuration_select_teams').val());
       numRounds = parseInt($('#draft_configuration_select_rounds').val());
       var flex = $('#draft_configuration_select_flex').val();
       draft_record = [];
       round = 1;
       pick = 1;
       overall_pick = 1;
       if(flex == 'std'){
           allowed_flex_positions = ['RB', 'WR'];
       }
       if(flex == 'te'){
           allowed_flex_positions = ['RB','WR','TE'];
       }
       
       load_the_page();
       
   });
   
   //function to draft a player
    $('body').on('click', 'tr[drafted=false]', function () {
        var player_name = $(this).attr('player_name');
        var player_pos = $(this).attr('player_pos');
        var player_team = $(this).attr('player_team');
        var this_obj = $(this); //just use this variable for styling selected player rows, dont have to use $(this) that way.
        var team_info = get_team_info(round, pick);
        var team = team_info['draft_position'];
        //console.log(team_info);
        if(add_player_to_team_board(team, player_name, player_pos) == 1){ //this if statement shoudl be replaced with functionality that allows you to draft whoever you want, not limited by position
            draft_record.push({'overall_pick':overall_pick, 'round':round, 'pick':pick, 'team':team, 'player_name':player_name, 'player_position':player_pos, 'player_team':player_team });
            add_player_to_draft_record(team, player_name, player_pos);
            restyle_player_list_row_for_drafted_player(this_obj);
            go_to_first_available_pick(1,1);
            
            //console.log('on tr:player_row click: round: '+round+ ' pick:'+pick+ ' overall_pick: '+overall_pick);
            update_draft_status(round, pick);
            color_the_player_table();
            highlight_picking_teams_table();
           //console.log('pick: '+pick, ' round: '+round+ ' numTeams: '+numTeams+' numRounds: '+numRounds+ ' team_info: '+team_info[1]);
        }
        
    });
    //function to change the name of a team
    $('body').on('dblclick', '.team_name', function() {
        $('.team_board').find('div[purpose="team_name"]').removeClass(); //this disables the user from changing 2 team names simultaneously
        $(this).html('<input type="text" id="new_team_name"></input><button id="team_name_change">change</button>');
        $('#new_team_name').focus();
        dp_of_team_name_change = $(this).attr('draft_position');
            });
    $('body').on('click', '#team_name_change', function(){
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
    $('body').on('click', '#undo_button', function(){
        undo_last_draft_pick();
    });
    $('body').on('click', '#export_draft', function(){
        export_draft();
    });

    $('body').on('click', '#download_export_draft', function(){
    enable_export_draft();
    this.remove();
    }); 

    $('body').on('change', '.draft_status_select', function(){
        //console.log('a draft status select box change fired, did we want it to?');
        pick = $('#draft_status_pick').val();
        round = $('#draft_status_round').val();
        go_to_first_available_pick(pick, round);
        update_draft_status(round, pick);
        color_the_player_table();
        highlight_picking_teams_table();
        //console.log('on draft status change:'+ overall_pick + ' ' + round + ' ' + pick);
    });
    
    $('body').on('click', '.hide_round', function(){
       round_to_hide = $(this).attr('round_to_hide');
       $('div[round='+round_to_hide+']').slideToggle(150);
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
        }
        
        function add_player_to_draft_record(team, player_name, player_pos){
            $('span[overall_pick='+overall_pick+']').text(player_name+' '+player_pos);
        }
        
        function restyle_player_list_row_for_drafted_player(obj){
            $(obj).attr('drafted', 'true');
        }
        
        function get_team_info(round, pick){
            //console.log('get team info numTeams: '+ numTeams);
            if (round % 2 != 0){ //applies to odd rounds
                local_team_info = teams_info[pick];
            }
            else{ //applies to even rounds
                local_team_info = teams_info[(numTeams+1) - pick];
                console.log((numTeams+1) - pick);
            }
            //console.log('get_team_info: '+round+ ' ' +pick+ ' '+local_team_info['team_name']);
            return local_team_info;
        }
        function update_draft_status(){
           //console.log('update draft status: '+ round+' '+pick);
            team_info = get_team_info(round, pick);
            $('#draft_status_round').val(round);
            $('#draft_status_pick').val(pick);
            $('#picking_team').text(team_info['team_name']);
            //console.log('update_draft_status: '+ team_info['team_name']);
        }
        
        function color_the_player_table(){
            $('.player_row').each(function(index){
                
                if($(this).attr('drafted') != 'true'){
                var adp = Math.round($(this).find('.adp').text());
                
                $(this).css('background-color','transparent');
                

                if(overall_pick > adp){
                    $(this).css('background-color','#90EE90'); // #66ccff
                    }
                if(overall_pick <= adp){
                    $(this).css('background-color','#F08080');
                    }
                if((overall_pick > (adp - 0.02)) && (overall_pick < (adp + 0.02))){
                    $(this).css('background-color','#FAFAD2');
                    }
                }
                    
                else{
                    $(this).css('background-color', '#808080');
                    $(this).css('color', '#404040');
                    }
                //hide_non_recent_drafted_players();
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
        
        function hide_draft_record(){
            
        }
        
        function show_non_recent_drafted_players(){
            $('.player_row').css('display', 'table-row');
            position = $('#position_filter').val();
            team = $('#team_filter').val();
            filter_player_list(position, team);
        }

        function undo_last_draft_pick(){
            last_draft_pick = draft_record.pop();
            //step 1 - erase player from team table, and draft record display
            $('.team_board td:contains("'+last_draft_pick['player_name']+'")').text("");
            //$('span[overall_pick='+overall_pick+']').text(player_name+' '+player_pos);
            $('span[overall_pick='+last_draft_pick['overall_pick']+']').text("");
            console.log();
            //step 2 - set tr drafted attribute to false
            ($('#player_list_table tr[player_name="'+last_draft_pick['player_name']+'"]').attr('drafted', false));
            //step 3 - set tr overall_pick attribute to ''
            $('#player_list_table tr[player_name="'+last_draft_pick['player']+'"]').attr('overall_pick', '');            
            //step 6 move the draft position to the first empty pick
            go_to_first_available_pick(1,1);
            //step 7 update the draft status
            update_draft_status(round, pick);
            //step 8 highlight the correct team board
            highlight_picking_teams_table();
            //step 9 color the player table
            color_the_player_table();
            
        }

        function populate_player_list_via_json_queries(callback){
            var players_array = [];        
            var url = "http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=50&offset=";
            $('#player_list').html('<table id="player_list_table"><thead class="w3-light-blue"><tr><th>no.</th><th>Pos</th><th>Player</th><th>Team</th><th>ADP</th></thead></tr><tbody id=player_rows_tbody>');

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
                $('#player_list_table tr:last').after('<tr class="player_row" drafted="false" player_name="'+player_array[i]['firstName']+ ' '+player_array[i]['lastName']+'" player_team="'+player_array[i]['teamAbbr']+'" player_pos="'+player_array[i]['position']+'"><td>'+(i+1)+'</td><td>'+player_array[i].position+'</td><td player_name="'+player_array[i]['firstName']+ ' '+player_array[i]['lastName']+'" player_team="'+player_array[i]['teamAbbr']+'" player_pos="'+player_array[i]['position']+'">'+player_array[i].firstName+ ' ' + player_array[i].lastName+'</td><td>'+player_array[i].teamAbbr+'</td><td class="adp">'+player_array[i].rank+'</td></tr>');
                }
                
                color_the_player_table();
                highlight_picking_teams_table();    
            });
        }
        
        function go_to_first_available_pick(starting_round, starting_pick){
            var temp_array = [];
            $.each(draft_record, function(){
                temp_array.push(this.overall_pick);
            });
            pick = starting_round;
            round = starting_pick;
            overall_pick = ((starting_round - 1) * numTeams) + pick;
            while($.inArray(overall_pick, temp_array)> -1){
                if(pick < numTeams){
                    pick++;
                    overall_pick++;
                }
                else{
                    pick = 1;
                    round++;
                    overall_pick++;
                }
            }
        }            
               
        function highlight_picking_teams_table(){
            if(round%2!=0){ team = pick;}
            if(round%2==0) {team = (numTeams+1)-pick;}
            $('.team_board th').css('background-color', 'transparent');
            $('#team_'+team+'_board th').css('background-color', '#E37222');
            $('#team_'+team+'_board th').css('border-radius', '.5em');
            //Trying to get the header of team on the clock to flash
            for(i=5; i >= 1; i--){
                $('#team_'+team+'_board th').fadeOut(500).fadeIn(500);
            } 
            //$('#team_'+team+'_board th').fadeToggle("slow", "linear");
        }
        function print_draft_results(){
            for(i=0;i<draft_record.length;i++){
                //console.log('Overall Pick:'+draft_record[i]['overall_pick']+ ' round:'+draft_record[i]['round']+' pick:'+draft_record[i]['pick']+' team:'+draft_record[i]['team']+' player:'+draft_record[i]['player']+ ' position:'+draft_record[i]['pos']);
            }
            
        }
        
        function enable_export_draft(){
            $('#export_draft').prop('disabled', false);
        }
        function disable_export_draft(){
            $('#export_draft').prop('disabled', true);
        }
        function export_draft(){
            var json = {};
            for(i=1;i<=draft_record.length;i++){
                json['pick_'+i] = draft_record[i];
            }
            for(i=1;i<=teams_info;i++){
                json['team_'+i] = teams_info[i];
            }
            var response = $.post('post.php', json, function(){
                $('#export_span').append('<a id="download_export_draft" href="'+response.responseText+'" download>Click here to download</a>');    
                });
            disable_export_draft();
        }
        
        $('body').on('change', '#import_file', function(){
            var file = this.files[0];
            import_draft(this.files[0]);
        });
        
        function import_draft(file){
            var url = 'import.php';
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            xhr.open("POST", "import.php", true);
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4 && xhr.status == 200){
                    console.log(xhr.response);
                }
            };
            fd.append("userfile", file);
            xhr.send(fd);           
        }
        
        function transferComplete(evt){
            console.log('transfer completed ' + evt.statusText);
        }
           
}); //end document.ready


//onClick=this.style.display="none"