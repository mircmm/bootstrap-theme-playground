$( document ).ready(function() {
  'use strict';

  $( "#mm-menu-main" ).draggable({
    handle: "#mm-menu-drag",
    containment: "window"
  });

/*
  $( "#mm-menu-down-file" ).on("click", function( event ) {
    var presedButton = event.which;
    $( "#mm-menu-down-file .mm-long-button div" ).hide();
    presedButton.show();
  });
*/


  $( "#mm-menu-down-file" ).on("click",function( event ){
    $( "#mm-menu-file" ).toggle();
    $( "#mm-menu-color" ).hide();
    $( "#mm-menu-font" ).hide();
  });

  $( "#mm-menu-down-color" ).on("click",function(){
    $( "#mm-menu-file" ).hide();
    $( "#mm-menu-color" ).toggle();
    $( "#mm-menu-font" ).hide();
  });

  $( "#mm-menu-down-font" ).on("click",function(){
    $( "#mm-menu-file" ).hide();
    $( "#mm-menu-color" ).hide();
    $( "#mm-menu-font" ).toggle();
  });



  $("lalabody").click(function() {
    $("#mm-popupmenu").hide();
    setTimeout(function(){
      $("#mm-popupmenu").show();
    }, 2000);
  });


});




/*
 * css ko dela ?
 * cursor: wait;
 *
 */
