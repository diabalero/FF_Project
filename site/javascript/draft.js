$(document).ready(function(){
    
   var numTeams = 12;
   var numRounds = 15;
   var round = 1;
   var pick = .01;
    
   //load the list of all the players into the side bar
   $('#player_list').load('../DraftHelper/data.php?resource=player_list');
   $('#draft_grid').load('../DraftHelper/data.php?resource=draft_grid&numTeams=12&numRounds=15');
   
   //function to get the list of drafted players and edit/update the working players list column as needed
   $.get('../DraftHelper/data.php?resource=drafted_players', function(data, status){
   console.log("Data: " + data + "\nStatus: " + status);
   
   }); //end function to get the list of drafted players and edit/update the working players list column as needed
   
   
   //function to style the low and high picks to highlight value 
   
   
   
}); //end document.ready