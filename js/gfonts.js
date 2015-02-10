// TODO: background za size


(function($) {
  'use strict';

  $.fn.gfonts = function() {

    var googleAPI = 'AIzaSyDyJtbKog963UG494tay5ydfU-AWhVbZUg';
    var googleFontsURL = 'https://www.googleapis.com/webfonts/v1/webfonts?key='+googleAPI;
    // https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDyJtbKog963UG494tay5ydfU-AWhVbZUg
    // var allFonts = $.get( googleFontsURL ).responseJSON.items;

    var allFonts;

    var exampleText = 'abc&#269;s&#353;z&#382; ABC&#268;S&#352;Z&#381; 1234567890';
    $( '#mm-display-example' ).html( exampleText );
    exampleText = $( '#mm-display-example' ).html();
    $( '#mm-enter-example' ).val( exampleText );
    

    function generateSelectFont( first, count, filter ) {
      // valid filters: 'sans-serif', 'serif', 'display', 'handwriting', 'monospace'

      var element = $( '#mm-choose-font' );
      for ( var i = first, c = 0; i <= allFonts.items.length && c < count; i++ ) {
        var item = allFonts.items[i];
        if ( filter && item.category === filter ) { // popravi na filter
          var opt = $( '<span class="mm-family" mm-font-index="' + i + '">' + item.family + '</span> <span class="mm-example">' + exampleText + '</span><br>' );
          element.append( opt );
          c++;
        }
      }
    }
    
    $( '#mm-load-json' ).on( 'click', function(ev) {
      ev.preventDefault();
//      $.getJSON( '/all-google-fonts.js', function(result) {
      $.getJSON( googleFontsURL, function(result) {
        allFonts = result;
        generateSelectFont( 0, 5, 'sans-serif' );
      });
    });
    
    $( '#mm-choose-font' ).on( 'click', '.mm-family', function(ev) {
      ev.preventDefault();
      var clicked = $(this);
      var i = parseInt( clicked.attr( 'mm-font-index' ) );
      var item = allFonts.items[i];
      WebFont.load({
        google: { families: [item.family]}
      });
      var familyAndFallback = '"' + item.family + '",' + item.category;
      $( '#mm-display-example' ).css( 'font-family', familyAndFallback );
      $( '#mm-display-font' ).text( familyAndFallback );
    });
    
    $( '#mm-update-example' ).on( 'click', function(ev) {
      ev.preventDefault();
      var txt = $( '#mm-enter-example' ).val();
      $( '#mm-display-example' ).text( txt );
    });
  
  }; // gfonts

})(jQuery);



// ----- main -----------------------------------------------------------------
$( document ).ready(function() {

  $().gfonts();

}); // ----- end of document ready --------------------------------------------



