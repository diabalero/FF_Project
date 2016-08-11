$(document).ready(function(){
    $("header").load('menu.html');
    $('#menu').menu();

    /*Slide down the team info for individual teams on the draft helper site*/
    $('.top').on('click', function() {
	    $parent_box = $(this).closest('.box');
	    $parent_box.siblings().find('.bottom').hide();
	    $parent_box.find('.bottom').toggle();
    });
    
/*final closing bracket*/    
});