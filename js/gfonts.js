
(function($) {
  'use strict';

  $.fn.gfonts = function() {

    var googleAPI = 'AIzaSyDyJtbKog963UG494tay5ydfU-AWhVbZUg';
    var googleFontsURL = 'https://www.googleapis.com/webfonts/v1/webfonts?sort=style&key='+googleAPI;

    var fontCategoryFilters = [ 'all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' ];
    var fontCategoryIndexes = [
      [], // all
      [], // sans-serif
      [], // serif
      [], // display
      [], // handwriting
      []  // monospace
    ];
    var fontCategorySelected = 0;

    var fontFamilyListInit = [
      { kind: false, family: 'Helvetica Neue', category: 'sans-serif'},
      { kind: false, family: 'Helvetica', category: 'sans-serif'},
      { kind: false, family: 'Arial', category: 'sans-serif'},
      { kind: false, family: 'Georgia', category: 'serif'},
      { kind: false, family: 'Times New Roman', category: 'serif'},
      { kind: false, family: 'Times', category: 'serif'},
      { kind: false, family: 'Menlo', category: 'monospace'},
      { kind: false, family: 'Monaco', category: 'monospace'},
      { kind: false, family: 'Consolas', category: 'monospace'},
      { kind: false, family: 'Courier New', category: 'monospace'}
    ];
/*      { kind: false, family: '"Helvetica Neue", Helvetica, Arial', category: 'sans-serif'},
      { kind: false, family: 'Georgia, "Times New Roman", Times', category: 'serif'},
      { kind: false, family: 'Menlo, Monaco, Consolas, "Courier New"', category: 'monospace'} ]; */

    var fontFamilyList;
    var fontFamilyDisplayedSize = 24;
    var fontFamilyListSelected = 0;
    var fontFamilyFirstDisplayed = 0;
    var fontFamilyCountDisplayed = 8;

    var fontExampleTextShort = 'abcde ABCDE 67890';
    var fontExampleTextInit = 'abcde fghij klmno pqrst uvwxyz ABCDE FGHIJ KLMNO PQRST UVWXYZ 12345 67890';
    $( '#mm-font-example-display' ).html( fontExampleTextInit );
    var fontExampleText = $( '#mm-font-example-display' ).html();
    var fontExampleSize = 48;


    _fontsInit();


// ----- functions -----

    function _fontsInit() {
      $.getJSON( googleFontsURL, function(result) {
        // load fonts list from google
        fontFamilyList = [].concat( fontFamilyListInit, result.items );
        // init category indexes
        for ( var inxf = 0; inxf < fontFamilyList.length; inxf++ ) {
          fontCategoryIndexes[0].push( inxf );
          for ( var inxc = 1; inxc < fontCategoryFilters.length; inxc++ ) {
            if ( fontFamilyList[inxf].category === fontCategoryFilters[inxc] ) {
              fontCategoryIndexes[inxc].push( inxf );
            }
          }
        }
        // display category
        var element = $( '#mm-font-category-select' );
        for ( var i = 0; i < fontCategoryFilters.length; i++ ) {
          var opt = $(
            '<span class="mm-font-category" mm-font-category-index="' + i + '">' +
            fontCategoryFilters[i] + '</span>'
          );
          element.append( opt ).append( '&nbsp;&nbsp;' );
        }
        $( '#mm-font-category-display' ).text( fontCategoryFilters[fontCategorySelected] );
        // display family and example
        _displayFontsFamily();
        _displayFontsExample();
      });
    } // fontsInit


    function _familyAndFallback( item ) {
      return '"' + item.family + '", ' + item.category;
    }

    function _displayFontsFamily() {
      var first = fontFamilyFirstDisplayed;
      var count = fontFamilyCountDisplayed;
      var element;
      $( '#mm-font-family-first-last' )
        .text( '(' + first + '-' + (first+count-1) + '/' + fontCategoryIndexes[fontCategorySelected].length + ')' );
      $( '#mm-font-family-count' ).val( count );
      // list families
      element = $( '#mm-font-family-select' );
      element.empty();
      for ( var i = first, c = 0; i <= fontCategoryIndexes[fontCategorySelected].length && c < count; i++ ) {
        var inxf = fontCategoryIndexes[fontCategorySelected][i];
        var item = fontFamilyList[inxf];
        if ( item.kind ) WebFont.load({ google: { families: [item.family]} });
        var df = $( '<span class="mm-font-family" mm-font-family-index="' + inxf + '">' + item.family + '</span>' );
        element.append( df );
        df = $( '<span class="mm-font-family-example">&nbsp;&nbsp;' + fontExampleTextShort + '</span><br>' );
        element.append( df );
        df.css({ 'font-family': _familyAndFallback(item), 'font-size': fontFamilyDisplayedSize });
        c++;
      }
    } // _displayFontsFamily

    function _displayFontsExample() {
      var item = fontFamilyList[fontFamilyListSelected];
      $( '#mm-font-family-display' ).text( ' (' + fontFamilyListSelected + '/' + fontFamilyList.length + ') ' + _familyAndFallback(item) );
      $( '#mm-font-example-text' ).val( fontExampleText );
      $( '#mm-font-example-size' ).val( fontExampleSize );
      $( '#mm-font-example-display' ).html( fontExampleText );
      $( '#mm-font-example-display' ).css({ 'font-size': fontExampleSize, 'font-family': _familyAndFallback(item) });
    }

    function _updateFontsCategory( index ) {
      fontCategorySelected = index;
      $( '#mm-font-category-display' ).text( fontCategoryFilters[fontCategorySelected] );
      _displayFontsFamily();
    } // _updateFontsCategory

    function _updateFontsFamilyFirst( first ) {
      fontFamilyFirstDisplayed += first;
      if ( fontFamilyFirstDisplayed < 0 ) {
        fontFamilyFirstDisplayed = 0;
      }
      if ( fontFamilyFirstDisplayed > fontCategoryIndexes[fontCategorySelected].length - fontFamilyCountDisplayed ) {
        fontFamilyFirstDisplayed = fontCategoryIndexes[fontCategorySelected].length - fontFamilyCountDisplayed + 1;
      }
      _displayFontsFamily();
    } // _updateFontsFamilyFirst

    function _updateFontsFamilyCount ( count ) {
      fontFamilyCountDisplayed += count;
      if ( fontFamilyCountDisplayed < 4 ) { fontFamilyCountDisplayed = 4; }
      if ( fontFamilyCountDisplayed > 40 ) { fontFamilyCountDisplayed = 40; }
      _displayFontsFamily();
    } // _updateFontsFamilyCount

    function _updateFontsFamily( index ) {
      fontFamilyListSelected = index;
      _displayFontsExample();
    } // _updateFontsFamily

    function _updateFontsExample( text, size ) {
      fontExampleText = text;
      fontExampleSize = size;
      if ( fontExampleSize < 8 ) { fontExampleSize = 8; }
      if ( fontExampleSize > 80 ) { fontExampleSize = 80; }
      _displayFontsExample();
    } // _updateFontsExample



// ----- events -----

    // select category
    $( '#mm-font-category-select' ).on( 'click', '.mm-font-category', function(ev) {
      ev.preventDefault();
      fontFamilyListSelected = 0;
      fontFamilyFirstDisplayed = 0;
      _updateFontsCategory( parseInt( $(this).attr( 'mm-font-category-index' ) ) );
    });

    $( '#mm-font-family-count-minus' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsFamilyCount ( -2 );
    });

    $( '#mm-font-family-count-plus' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsFamilyCount ( +2 );
    });

    // prev/next families
    $( '#mm-font-family-prev' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsFamilyFirst ( -fontFamilyCountDisplayed );
    });

    $( '#mm-font-family-next' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsFamilyFirst ( +fontFamilyCountDisplayed );
    });

    // select family
    $( '#mm-font-family-select' ).on( 'click', '.mm-font-family', function(ev) {
      ev.preventDefault();
      _updateFontsFamily( parseInt( $(this).attr( 'mm-font-family-index' ) ) );
    });

    // example
    $( '#mm-font-example-update' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsExample( $('#mm-font-example-text').val(), fontExampleSize );
    });

    $( '#mm-font-example-size-minus' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsExample( fontExampleText, fontExampleSize - 4 );
    });

    $( '#mm-font-example-size-plus' ).on( 'click', function(ev) {
      ev.preventDefault();
      _updateFontsExample( fontExampleText, fontExampleSize + 4 );
    });

  }; // gfonts

})(jQuery);


// ----- main -----------------------------------------------------------------
$( document ).ready(function() {

  $().gfonts();

}); // ----- end of document ready --------------------------------------------



