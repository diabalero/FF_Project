$(document).ready(function(){
    
   var numTeams = 13;
   var numRounds = 15;
   var round = 1;
   var pick = .01;
    
   //load the list of all the players into the side bar
   $('#player_list').load('../DraftHelper/data.php?resource=player_list');
   $('#teams_display').load('../DraftHelper/data.php?resource=teams_display&numTeams='+numTeams+'&numRounds='+numRounds);
   //$('#menu').load('../DraftHelper/data.php?resource=menu');
   $('#draft_status').text("Round:"+round+" Pick:"+ Math.round(pick*100));
   //function to get the list of drafted players and edit/update the working players list column as needed
   $.get('../DraftHelper/data.php?resource=drafted_players', function(data, status){
   console.log("Data: " + data + "\nStatus: " + status);
   
   }); //end function to get the list of drafted players and edit/update the working players list column as needed
   
   
   //function to style the low and high picks to highlight value 
   
   //function to pick a player.
        //1. put the players name in the right cell of the right table
        //2. cross off the name in the player list
        //3. increment the pick and round status
        $('body').on('click', '.click_to_draft', function () {
            //console.log($(this).attr('player_pos'));
            if(round%2!=0){//if an odd round
                team = pick * 100;
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
   
   
   
}); //end document.ready