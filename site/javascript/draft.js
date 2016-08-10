//to do//
//hide player rows drafted more than 10 players ago (only show last 10 players drafted, roll up the rest)
//style the drafted player rows more, faded gray, etc
    //need a class for the row, not just the td
//hidable right side bar to show pick, player and team. needs to be hidden unless clicked to show
//code to undo a draft pick. should be able to click on a previous pick and reset draft to that point (undo that pick and all after it)
//color available player rows based on how the current pick compares to thier highest and lowest pick 
//add option to add bench rows to team boards instead of denying player drafting too many of a position
//remove database element, make it rely on a csv
//add ability to change teams name display
//display teams name in header

$(document).ready(function(){
    
   var numTeams = 12;
   var numRounds = 15;
   var num_bench_spots = numRounds - 9;
   var round = 1;
   var pick = .01;
   var draft_record = [];
   console.log(num_bench_spots);
    
   //load the list of all the players into the side bar
   $('#player_list').load('../DraftHelper/data.php?resource=player_list');
   $('#teams_display').load('../DraftHelper/data.php?resource=teams_display&numTeams='+numTeams+'&numRounds='+numRounds);
   $('#draft_status').text("Round:"+round+" Pick:"+ Math.round(pick*100));
   $.get('../DraftHelper/data.php?resource=drafted_players', function(data, status){
   //console.log("Data: " + data + "\nStatus: " + status);
   
   }); //end function to get the list of drafted players and edit/update the working players list column as needed
   
   
   //function to style the low and high picks to highlight value 
   
   //function to pick a player.
        //1. add a record to the draft_record array
        //2. cross off the name in the player list
        //3. add player to the correct cell of the correct team board
        //4. increment the pick and round status
        $('body').on('click', '.click_to_draft', function () {
            //create these variables for ease of use...
            var player_name = $(this).attr('player_name');
            var player_pos = $(this).attr('player_pos');
            var this_obj = $(this);
            
            // if its an odd round the team picking should coincide with the pick number 
            if(round%2!=0){
                var team = Math.round(pick * 100);
            }
            //if its an even round the team picking should be inverse to the pick number
            if(round%2 == 0){
                var team = ((numTeams + 1) - Math.round(pick * 100));
            }

                //!!! still need to add code to add bench spots when starters spots are filled !!!!//
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
            
            //if the pick is less than the number of teams
            if(pick < (numTeams/100)){
                pick = (((pick * 100) + 1) /100);
                console.log('The current pick is '+ pick);
                $('#draft_status').text("Round:"+round+" Pick:"+ Math.round(pick*100));
                return;
            }
            if(pick == (numTeams/100)){
                pick = .01;
                round += 1;
                console.log('The current pick is '+ pick);
                $('#draft_status').text("Round:"+round+" Pick:"+ Math.round(pick*100));
                return;
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
            // logging to console what team just picked 
            console.log('Team ' + team + ' just picked');
            // remove the nth child CSS that alternates the color of rows in the player list
            $('#player_list_table tr:nth-child(even)').removeAttr("background-color");
            // remove the 'click_to_draft class from the player name cell so he cant be drafted again
            $(obj).removeClass();
            //add the 'drafted' class to the player name cell so his name is styled with line-though
            $(obj).parent().addClass('drafted');
            //figure out what team board table and cell to put the player in, and put him there.
        }
                     
                 
            

}); //end document.ready