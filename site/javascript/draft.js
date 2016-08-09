//to do//
//change code from adding bench spots to having fixed bench spots, will have to add logic to remove rows if a player avoids a certain position the whole draft, or deny the team from drafting that player..
    //almost done - still need to fix player list functionality if a team cannot draft a player 
//hidable right side bar to show pick, player and team. needs to be hidden unless clicked to show
//code to undo a draft pick. should be able to click on a previous pick and reset draft to that point (undo that pick and all after it)
//color available player rows based on how the current pick compares to thier highest and lowest pick  

$(document).ready(function(){
    
   var numTeams = 1;
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
            
            // if its an odd round the team picking should coincide with the pick number 
            if(round%2!=0){
                var team = Math.round(pick * 100);
            }
            //if its an even round the team picking should be inverse to the pick number
            if(round%2 == 0){
                var team = ((numTeams + 1) - Math.round(pick * 100));
            }
            // add the draft pick to the draft_record array
            draft_record.push({'pick':pick, 'team':team, 'player':player_name, 'pos': player_pos });
            // logging to console what team just picked 
            console.log('Team ' + team + ' just picked');
            // remove the 'click_to_draft class from the player name cell so he cant be drafted again
            $(this).removeClass();
            //add the 'drafted' class to the player name cell so his name is styled with line-though
            $(this).addClass('drafted');
            //figure out what team board table and cell to put the player in, and put him there.
                //!!! still need to add code to add bench spots when starters spots are filled !!!!//
            if (player_pos == 'QB'){
                if($("#Team"+team+'_QB').text() == ''){
                    $("#Team"+team+'_QB').text(player_name);
                }
                else{
                    add_to_bench(team, player_pos, player_name);
                }
            }
            if (player_pos == 'TE'){
                if($("#Team"+team+'_TE').text() == ''){
                    $("#Team"+team+'_TE').text(player_name);
                }
                else{
                    add_to_bench(team, player_pos, player_name);
                }
            }
            if (player_pos == 'PK'){
                if($("#Team"+team+'_PK').text() == ''){
                    $("#Team"+team+'_PK').text(player_name);
                }
                else{
                    add_to_bench(team, player_pos, player_name);
                }
            }
            if (player_pos == 'DEF'){
                if($("#Team"+team+'_DEF').text() == ''){
                    $("#Team"+team+'_DEF').text(player_name);
                }
                else{
                    add_to_bench(team, player_pos, player_name);
                }
            }
            if (player_pos == 'RB'){
                if($("#Team"+team+'_RB1').text() == ''){
                    $("#Team"+team+'_RB1').text(player_name);
                    }
                else if($("#Team"+team+'_RB2').text() == ''){
                    $("#Team"+team+'_RB2').text(player_name);
                    }
                else if($("#Team"+team+'_Flex').text() == ''){
                    $("#Team"+team+'_Flex').text(player_name);
                    }
                else{
                    add_to_bench(team, player_pos, player_name);
                }
            }
            if (player_pos == 'WR'){
                if($("#Team"+team+'_WR1').text() == ''){
                    $("#Team"+team+'_WR1').text(player_name);
                        }
                else if($("#Team"+team+'_WR2').text() == ''){
                    $("#Team"+team+'_WR2').text(player_name);
                        }
                else if($("#Team"+team+'_Flex').text() == ''){
                    $("#Team"+team+'_Flex').text(player_name);
                        }
                else{
                    add_to_bench(team, player_pos, player_name);
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
                            return;    
                        }
                    else{
                        i++;
                    }     
                    console.log('you cannot draft another '+player_pos);
                    }
        function draft_player(pick, team, player_name, player_pos){

        }
        }
                     
                 
            

}); //end document.ready