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
   //console.log(num_bench_spots);
    
   //load the list of all the players into the side bar
   //$('#player_list').load('../DraftHelper/data.php?resource=player_list');
   $('#player_list').load('../DraftHelper/data.php?resource=player_list_from_csv', function(){
       color_the_player_table();
   });
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
        //create these variables for ease of use...
        var player_name = $(this).attr('player_name');
        var player_pos = $(this).attr('player_pos');
        var this_obj = $(this); //just use this variable for styling selected player rows, dont have to use $(this) that way.
        
        // if its an odd round the team picking should coincide with the pick number 
        if(round%2!=0){
            var team_info = teams_info[pick];
        }
        //if its an even round the team picking should be inverse to the pick number
        if(round%2 == 0){
            var team_info = teams_info[(numTeams+1) - pick];
        }
        var team = team_info['draft_position'];
        
        if (player_pos == 'QB'){
            if($("#Team"+team+'_QB').text() == ''){
                $("#Team"+team+'_QB').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'TE'){
            if($("#Team"+team+'_TE').text() == ''){
                $("#Team"+team+'_TE').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'PK'){
            if($("#Team"+team+'_PK').text() == ''){
                $("#Team"+team+'_PK').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'DEF'){
            if($("#Team"+team+'_DEF').text() == ''){
                $("#Team"+team+'_DEF').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
            }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            }
        }
        if (player_pos == 'RB'){
            if($("#Team"+team+'_RB1').text() == ''){
                $("#Team"+team+'_RB1').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
                }
            else if($("#Team"+team+'_RB2').text() == ''){
                $("#Team"+team+'_RB2').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
                }
            else if($("#Team"+team+'_Flex').text() == ''){
                $("#Team"+team+'_Flex').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
                }
            else{
                    if (add_to_bench(team, player_pos, player_name) == 1){
                        draft_player(this_obj, round, pick, team, player_name, player_pos);
                        }
                    }
        }
        if (player_pos == 'WR'){
            if($("#Team"+team+'_WR1').text() == ''){
                $("#Team"+team+'_WR1').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            else if($("#Team"+team+'_WR2').text() == ''){
                $("#Team"+team+'_WR2').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            else if($("#Team"+team+'_Flex').text() == ''){
                $("#Team"+team+'_Flex').text(player_name);
                draft_player(this_obj, round, pick, team, player_name, player_pos);
                    }
            else{
                if (add_to_bench(team, player_pos, player_name) == 1){
                    draft_player(this_obj, round, pick, team, player_name, player_pos);
                        }
                    }                
            
        }
        
        //increment the pick and our round based on current pick and number of teams
        //BUG HERE! pick increments even in the case of an unsuccessful draft pick!!!            
        if(pick < numTeams){
            pick += 1;
            console.log(pick);
            }
        else{
            pick = 1;
            round += 1;
            console.log(pick);
            }
        team_info = get_team_info(round, pick);
        update_draft_status(round, pick);  
        color_the_player_table();
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

        
        function reset(){
           //use this function to reset the draft to a certain point
           /*for(var i = 0; i < draft_record.length; i++ )
                {
                    alert(draft_record[i]['pos']);
                }*/
            //
        }
        function add_to_bench(team, player_pos, player_name){
                 var i = 1;
                 console.log(num_bench_spots);
                 while(i <= num_bench_spots){
                     if($('#team'+team+'_bench_'+i+' td:nth-child(2)').text() == ''){
                            $('#team'+team+'_bench_'+i+' td:nth-child(2)').text(player_name);
                            return 1;    
                                }
                    else{
                        i++;
                            }
                    if ($('#team'+team+'_bench_'+num_bench_spots+' td:nth-child(2)').text() != ''){
                        alert('you cannot draft another '+player_pos);
                        return 0;
                            }
                        }
                    }
        function draft_player(obj, round, pick, team, player_name, player_pos){
            // add the draft pick to the draft_record array
            draft_record.push({'round':round, 'pick':pick, 'team':team, 'player':player_name, 'pos':player_pos });
            // remove the 'click_to_draft class from the player name cell so he cant be drafted again
            $(obj).removeClass();
            //add the 'drafted' class to the player name cell so his name is styled with line-though
            $(obj).parent().attr('drafted', 'true');
            //figure out what team board table and cell to put the player in, and put him there.
            $(obj).parent().attr('overall_pick', overall_pick);

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
        //function to color player rows not working yet...
        function color_the_player_table(){
            var current_pick = round + (pick/100);
            console.log(current_pick);
            $('.player_row').each(function(index){
                
                if($(this).attr('drafted') != 'true'){
                var low_pick = $(this).find('.low_pick').text();
                var high_pick = $(this).find('.high_pick').text();
                var adp = $(this).find('.adp').text();
                $(this).css('background-color','transparent');
                

                if(current_pick >= adp){
                    $(this).css('background-color','#4dffb8'); // #66ccff
                    }
                if(current_pick < adp){
                    $(this).css('background-color','#ff6666');
                    }
                if((current_pick > (adp - 0.02)) && (current_pick < (adp + 0.02))){ //no idea why this doesnt work...
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
                if(overall_pick - $(this).attr('overall_pick') > 20){
                    $(this).css('display','none');
                }
                
                });
            
                
            }           
                 
            

}); //end document.ready