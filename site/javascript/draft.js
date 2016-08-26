//TO DO//
//add the divisions of the menu: status, controls, configuration, etc

//code to undo a draft pick. should be able to click on a previous pick and reset draft to that point (undo that pick and all after it)


//add option to change position rows into bench rows to team boards instead of denying player drafting too many of a position

//somehow indicate to the user that you can rename teams by double clicking on them
    //add (i) icon to menu tools to get user instructions!!

//allow customization of draft, number of rounds, teams

//add feature for setting keepers
    //added! now just need to fix undo pick
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
/*
overall_pick
:
1
pick
:
1
player
:
"Antonio Brown"
pos
:
"WR"
round
:
1
team
:
1
*/

$(document).ready(function(){
    
   var numTeams = 12;
   var numRounds = 15;
   var num_bench_spots = numRounds - 9;
   var round = 1;
   var pick = 1;
   var dp_of_team_name_change;
   var draft_record = [];
   draft_record[12] = {'overall_pick': '12', 'player': 'Antonio Brown', 'pos': 'WR', 'round':'1', 'pick':'12' };
   draft_record[10] = {'overall_pick': '10', 'player': 'Rob Gronkowski', 'pos': 'WR', 'round':'1', 'pick':'12' };
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
    $('#draft_status').load('../DraftHelper/data.php?resource=draft_status&num_rounds='+numRounds+'&num_teams='+numTeams, function(){
        update_draft_status(round, pick);
    });
    $('#quick_draft_configuration').load('../DraftHelper/data.php?resource=quick_draft_configuration');
    $('#draft_controls').load('../DraftHelper/data.php?resource=draft_controls');
    
    
   
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
        //console.log(team_info);
        if(add_player_to_team_board(team, player_name, player_pos) == 1){
            add_player_to_draft_record(overall_pick, team, player_name, player_pos);
            restyle_player_list_row_for_drafted_player(this_obj);
            last_pick.push(overall_pick);
            go_to_first_available_pick();
            update_draft_status(round, pick);
            color_the_player_table();
            highlight_picking_teams_table();
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
    $('body').on('click', '#set_keepers', function(){
        set_keepers();
    });

    $('body').on('change', '.draft_status_select', function(){
        console.log('a draft status select box change fired, did we want it to?');
        pick = $('#draft_status_pick').val();
        round = $('#draft_status_round').val();
        overall_pick = (round -1 ) * numTeams + pick;
        update_draft_status(round, pick);
        color_the_player_table();
        highlight_picking_teams_table();
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
        
        function add_player_to_draft_record(overall_pick, team, player_name, player_pos){
            // add the draft pick to the draft_record array
            //draft_record.push({'overall_pick':overall_pick, 'round':round, 'pick':pick, 'team':team, 'player':player_name, 'pos':player_pos });
            draft_record[overall_pick] = ({'overall_pick':overall_pick, 'round':round, 'pick':pick, 'team':team, 'player':player_name, 'pos':player_pos });
            // remove the 'click_to_draft class from the player name cell so he cant be drafted again
        }
        function restyle_player_list_row_for_drafted_player(obj){
            $(obj).removeClass();
            //add the 'drafted' class to the player name cell so his name is styled with line-though
            $(obj).parent().attr('drafted', 'true');
            //figure out what team board table and cell to put the player in, and put him there.
            $(obj).parent().attr('overall_pick', overall_pick);      
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
        function update_draft_status(){
            var team_info = get_team_info(round, pick);
            $('#draft_status_round').val(round);
            $('#draft_status_pick').val(pick);
            $('#picking_team').text(team_info['team_name']);
            //console.log(team_info);
        }
        
        function color_the_player_table(){
            $('.player_row').each(function(index){
                
                if($(this).attr('drafted') != 'true'){
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
        
        function show_non_recent_drafted_players(){
            $('.player_row').css('display', 'table-row');
            position = $('#position_filter').val();
            team = $('#team_filter').val();
            filter_player_list(position, team);
        }

        function undo_last_draft_pick(){
            var last_draft_pick_overall_pick = last_pick.pop();
            console.log(last_draft_pick_overall_pick);
            var last_draft_pick = draft_record[last_draft_pick_overall_pick];
            
            //step 1 - erase player from team table
            $('.team_board td:contains("'+last_draft_pick['player']+'")').text("");
            
            //step 2 - set tr drafted attribute to false
            ($('#player_list_table tr[player_name="'+last_draft_pick['player']+'"]').attr('drafted', false));
            //step 3 - set tr overall_pick attribute to ''
            $('#player_list_table tr[player_name="'+last_draft_pick['player']+'"]').attr('overall_pick', '');
            //step 4 re-apply the .click_to_draft class to the td of the player in the player_list
            $('#player_list_table td[player_name="'+last_draft_pick['player']+'"]').attr('class', 'click_to_draft');
            //step 5 remove the draft record from the array
            draft_record.splice(last_draft_pick_overall_pick, 1);
            //step 6 move the draft position to the first empty pick
            go_to_first_available_pick();
            //step 7 update the draft status
            update_draft_status(round, pick);
            //step 8 highlight the correct team board
            highlight_picking_teams_table();
            //step 9 color the player table
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
            var url = "http://api.fantasy.nfl.com/v1/players/editordraftranks?format=json&count=50&offset=";
            $('#player_list').html('<table id="player_list_table"><tr><th>no.</th><th>Pos</th><th>Player</th><th>Team</th><th>ADP</th></tr><tbody id=player_rows_tbody>');

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
        
        function go_to_first_available_pick(){
            overall_pick = 1;
            pick = 1;
            round = 1;
            while(draft_record[overall_pick]){
                if(pick < numTeams){
                    pick += 1;
                }
                else{
                    pick = 1;
                    round += 1;
                }
            overall_pick += 1;
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
                console.log('Overall Pick:'+draft_record[i]['overall_pick']+ ' round:'+draft_record[i]['round']+' pick:'+draft_record[i]['pick']+' team:'+draft_record[i]['team']+' player:'+draft_record[i]['player']+ ' position:'+draft_record[i]['pos']);
            }
            
        }
        
        function set_keepers(){
            var keeper =  [];
            keeper.push({'overall_pick': '12', 'player': 'Antonio Brown', 'pos': 'WR', 'team': '12', 'round':'1', 'pick':'12' });
            keeper.push({'overall_pick': '10', 'player': 'Rob Gronkowski', 'pos': 'TE', 'team': '10', 'round':'1', 'pick':'10' });
            keeper.push({'overall_pick': '14', 'player': 'Odell Beckham', 'pos': 'WR', 'team': '11', 'round':'2', 'pick':'2' });
            keeper.push({'overall_pick': '22', 'player': 'A.J. Green', 'pos': 'WR', 'team': '3', 'round':'2', 'pick':'10' });
            keeper.push({'overall_pick': '27', 'player': 'Mike Evans', 'pos': 'WR', 'team': '3', 'round':'3', 'pick':'3' });
            keeper.push({'overall_pick': '31', 'player': 'DeAndre Hopkins', 'pos': 'WR', 'team': '7', 'round':'3', 'pick':'7' });
            keeper.push({'overall_pick': '37', 'player': 'Amari Cooper', 'pos': 'WR', 'team': '12', 'round':'4', 'pick':'1' });
            keeper.push({'overall_pick': '49', 'player': 'Julian Edelman', 'pos': 'WR', 'team': '1', 'round':'5', 'pick':'1' });
            keeper.push({'overall_pick': '50', 'player': 'Todd Gurley', 'pos': 'RB', 'team': '2', 'round':'5', 'pick':'2' });
            keeper.push({'overall_pick': '58', 'player': 'Jarvis Landry', 'pos': 'WR', 'team': '10', 'round':'5', 'pick':'10' });
            keeper.push({'overall_pick': '59', 'player': 'Brandon Marshall', 'pos': 'WR', 'team': '11', 'round':'5', 'pick':'11' });
            keeper.push({'overall_pick': '61', 'player': 'Tom Brady', 'pos': 'QB', 'team': '12', 'round':'6', 'pick':'1' });
            keeper.push({'overall_pick': '65', 'player': 'Allen Robinson', 'pos': 'WR', 'team': '8', 'round':'6', 'pick':'5' });
            keeper.push({'overall_pick': '80', 'player': 'Ryan Mathews', 'pos': 'RB', 'team': '8', 'round':'7', 'pick':'8' });
            keeper.push({'overall_pick': '98', 'player': 'Devonta Freeman', 'pos': 'RB', 'team': '2', 'round':'9', 'pick':'2' });
            keeper.push({'overall_pick': '114', 'player': 'Cam Newton', 'pos': 'QB', 'team': '7', 'round':'10', 'pick':'6' });
            keeper.push({'overall_pick': '123', 'player': 'Julius Thomas', 'pos': 'TE', 'team': '3', 'round':'11', 'pick':'3' });
            keeper.push({'overall_pick': '125', 'player': 'David Johnson', 'pos': 'RB', 'team': '5', 'round':'11', 'pick':'5' });
            keeper.push({'overall_pick': '130', 'player': 'DeAngelo Williams', 'pos': 'RB', 'team': '10', 'round':'11', 'pick':'10' });
            keeper.push({'overall_pick': '145', 'player': 'Tyler Lockett', 'pos': 'WR', 'team': '1', 'round':'13', 'pick':'1' });
            keeper.push({'overall_pick': '167', 'player': 'Jay Ajayi', 'pos': 'RB', 'team': '1', 'round':'15', 'pick':'1' });
            keeper.push({'overall_pick': '168', 'player': 'Doug Baldwin', 'pos': 'WR', 'team': '2', 'round':'15', 'pick':'2' });
            keeper.push({'overall_pick': '172', 'player': 'Thomas Rawls', 'pos': 'RB', 'team': '6', 'round':'15', 'pick':'6' });
            keeper.push({'overall_pick': '173', 'player': 'Kelvin Benjamin', 'pos': 'WR', 'team': '7', 'round':'15', 'pick':'7' });
            keeper.push({'overall_pick': '174', 'player': 'Blake Bortles', 'pos': 'QB', 'team': '8', 'round':'15', 'pick':'8' });
            keeper.push({'overall_pick': '179', 'player': 'Jordy Nelson', 'pos': 'WR', 'team': '11', 'round':'15', 'pick':'11' });
            
            $.each(keeper, function(){
               var _round = round = this.round;
               var _pick = this.pick;
               var player_name = this.player;
               var player_pos = this.pos;
               var _overall_pick = this.overall_pick;
               var team = this.team;
               var obj = $("td[player_name='"+player_name+"']");
               add_player_to_draft_record(_overall_pick, team, player_name, player_pos);
               //console.log(overall_pick, team, player_name, player_pos);
               add_player_to_team_board(team, player_name, player_pos);
               restyle_player_list_row_for_drafted_player(obj);
               last_pick.push(_overall_pick);
               go_to_first_available_pick();
               update_draft_status(round, pick);
               color_the_player_table();
               highlight_picking_teams_table();
            });
        }

           
}); //end document.ready


// player_name="'+value['firstName']+' '+value['lastName']+'" player_pos="'+value['position']+'" player_team="'+value['teamAbbr']+'"