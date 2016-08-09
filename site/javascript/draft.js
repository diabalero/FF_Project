$(document).ready(function(){
    
   var numTeams = 13;
   var numRounds = 15;
   var round = 1;
   var pick = .01;
   var draft_record = [];
    
   //load the list of all the players into the side bar
   $('#player_list').load('../DraftHelper/data.php?resource=player_list');
   $('#teams_display').load('../DraftHelper/data.php?resource=teams_display&numTeams='+numTeams+'&numRounds='+numRounds);
   $('#draft_status').text("Round:"+round+" Pick:"+ Math.round(pick*100));
   $.get('../DraftHelper/data.php?resource=drafted_players', function(data, status){
   console.log("Data: " + data + "\nStatus: " + status);
   
   }); //end function to get the list of drafted players and edit/update the working players list column as needed
   
   
   //function to style the low and high picks to highlight value 
   
   //function to pick a player.
        //1. add a record to the draft_record array
        //2. cross off the name in the player list
        //3. add player to the correct cell of the correct team board
        //4. increment the pick and round status
        $('body').on('click', '.click_to_draft', function () {
            var player_name = $(this).attr('player_name');
            var player_pos = $(this).attr('player_pos');
            if(round%2!=0){//if an odd round
                var team = pick * 100;
            }
            if(round%2 == 0){ //if an even round
                var team = ((numteams + 1) - (pick * 100));
            }
            draft_record.push({'pick':pick, 'team':team, 'player':player_name, 'pos': player_pos });

            $(this).removeClass();
            $(this).addClass('drafted');
            //figure out what table and cell to put the player in, and put him there.
            if (player_pos == 'QB'){
                if($("#Team"+team+'_QB').text() == ''){
                    $("#Team"+team+'_QB').text(player_name);
                }
                else{
                    //add a bench row to the table and put the player there.
                }
            }
            if (player_pos == 'TE'){
                if($("#Team"+team+'_TE').text() == ''){
                    $("#Team"+team+'_TE').text(player_name);
                }
                else{
                    //add a bench row to the table and put the player there.
                }
            }
            if (player_pos == 'PK'){
                if($("#Team"+team+'_PK').text() == ''){
                    $("#Team"+team+'_PK').text(player_name);
                }
                else{
                    //add a bench row to the table and put the player there.
                }
            }
            if (player_pos == 'DEF'){
                if($("#Team"+team+'_DEF').text() == ''){
                    $("#Team"+team+'_DEF').text(player_name);
                }
                else{
                    //add a bench row to the table and put the player there.
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
                    //add a bench row to the table and put the player there.
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
                    //add a bench row to the table and put the player there.
                        }                
                
            }
            
                

          
            
                
            
            
            if(pick != 0.12){
                pick = (pick * 100 + .01 * 100)/100;
                console.log(pick);
                $('#draft_status').text("Round:"+round+" Pick:"+ Math.round(pick*100));
                return;
            }
            if(pick == 0.12){
                pick = .01;
                round += 1;
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

}); //end document.ready