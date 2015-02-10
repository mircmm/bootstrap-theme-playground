// TODO: background za size


(function($) {
  'use strict';

  $.fn.gfonts = function() {

// ----- init -----

    var googleAPI = 'AIzaSyDyJtbKog963UG494tay5ydfU-AWhVbZUg';
    var googleFontsURL = 'https://www.googleapis.com/webfonts/v1/webfonts?key='+googleAPI;
    var allFonts;
    var firstItem = 0;
    var countOfItems = 10;

    var exampleText = 'abc&#269;s&#353;z&#382; ABC&#268;S&#352;Z&#381; 1234567890';
    $( '#mm-display-example' ).html( exampleText );
    exampleText = $( '#mm-display-example' ).html();
    $( '#mm-enter-example' ).val( exampleText );

    var categoryFilters = [ 'all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' ];
    var selectedCategoryFilter = 0;
    var element = $( '#mm-choose-filter' );
    for ( var i = 0; i < categoryFilters.length; i++ ) {
      var opt = $( '<span class="mm-filter" mm-filter-index="' + i + '">' + categoryFilters[i] + '</span>' );
      element.append( opt ).append( '&nbsp;&nbsp;' );
    }
    $( '#mm-display-filter' ).text( categoryFilters[selectedCategoryFilter] );

    $.getJSON( googleFontsURL, function(result) {
      allFonts = result;
      generateSelectFont( firstItem, countOfItems  );
    });

// ----- functions -----

    function generateSelectFont( first, count ) {
      var element = $( '#mm-choose-font' );
      element.empty();
      for ( var i = first, c = 0; i <= allFonts.items.length && c < count; i++ ) {
        var item = allFonts.items[i];
        if ( selectedCategoryFilter === 0 || categoryFilters[selectedCategoryFilter] === item.category ) {
          var opt = $( '<span class="mm-family" mm-font-index="' + i + '">' + item.family + '</span> <span class="mm-example">' + exampleText + '</span><br>' );
          element.append( opt );
          c++;
        }
      }
    }


// ----- events -----

    $( '#mm-choose-filter' ).on( 'click', '.mm-filter', function(ev) {
      ev.preventDefault();
      var clicked = $(this);
      selectedCategoryFilter = parseInt( clicked.attr( 'mm-filter-index' ) );
      $( '#mm-display-filter' ).text( categoryFilters[selectedCategoryFilter] );
      firstItem = 0;
      generateSelectFont( firstItem, countOfItems  );
    });

    $( '#mm-prev-10' ).on( 'click', function(ev) {
      ev.preventDefault();
      firstItem -= 10;
      if ( firstItem < 0 ) { firstItem = 0; };
      generateSelectFont( firstItem, countOfItems  );
    });

    $( '#mm-next-10' ).on( 'click', function(ev) {
      ev.preventDefault();
      firstItem += 10; // tole ni prav, preskocit bi moral glede na selected category
      generateSelectFont( firstItem, countOfItems );
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
      familyAndFallback = ' (' + i + '/' + allFonts.items.length + ') ' + familyAndFallback;
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



