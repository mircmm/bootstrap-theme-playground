
(function($) {
  'use strict';

  $.fn.gfonts = function() {

    var googleAPI = 'AIzaSyDyJtbKog963UG494tay5ydfU-AWhVbZUg';
    var googleFontsURL = 'https://www.googleapis.com/webfonts/v1/webfonts?sort=style&key='+googleAPI;

    var fontCategoryFilters = [ 'all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' ];
    var fontCategorySelected = 0;

    var fontFamilyListInit = [
      { kind: false, family: '"Helvetica Neue", Helvetica, Arial', category: 'sans-serif'},
      { kind: false, family: 'Georgia, "Times New Roman", Times', category: 'serif'},
      { kind: false, family: 'Menlo, Monaco, Consolas, "Courier New"', category: 'monospace'} ];
    var fontFamilyList;
    var fontFamilyListSelected = 0;
    var fontFamilyFirstDisplayed = 0;
    var fontFamilyCountDisplayed = 10;
    var fontFamilyDisplayedSize = 24;

    var fontExampleTextInit = 'abc&#269;s&#353;z&#382; ABC&#268;S&#352;Z&#381; 1234567890';
    $( '#mm-font-example-display' ).html( fontExampleTextInit );
    var fontExampleText = $( '#mm-font-example-display' ).html();
    var fontExampleSize = 48;


    _fontsInit();


// ----- functions -----

    function _fontsInit() {
      $.getJSON( googleFontsURL, function(result) {
        // load fonts list from google
        fontFamilyList = [].concat( fontFamilyListInit, result.items );
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
        _updateFontsCategory( fontCategorySelected );
        _updateFontsFamily( fontFamilyListSelected );
        _updateFontsExample( fontExampleText, fontExampleSize );
      });
    } // fontsInit


    function _familyAndFallback( item ) {
      var res;
      if ( item.kind ) {
        res =  '"' + item.family + '", ' + item.category;
      } else {
        res =  item.family + ', ' + item.category;
      }
      return res;
    }

    function _displayFontsFamilySelect( first, count ) {
      var element = $( '#mm-font-family-select' );
      element.empty();
      for ( var i = first, c = 0; i <= fontFamilyList.length && c < count; i++ ) {
        var item = fontFamilyList[i];
        if ( item.kind ) WebFont.load({ google: { families: [item.family]} });
        var df = $( '<span class="mm-font-family" mm-font-family-index="' + i + '">' + item.family + '</span>' );
        element.append( df );
        df = $( '<span class="mm-font-family-example">&nbsp;&nbsp;' + fontExampleText + '</span><br>' );
        element.append( df );
        df.css({ 'font-family': _familyAndFallback(item), 'font-size': fontFamilyDisplayedSize });
        c++;
      }
    } // _displayFontsFamilySelect

    // TODO: ko izberes kategory, mora pokazat in izbirat samo iz te kategorije
    function _updateFontsCategory( index ) {
      fontCategorySelected = index;
      $( '#mm-font-category-display' ).text( fontCategoryFilters[fontCategorySelected] );
      _displayFontsFamilySelect( fontFamilyFirstDisplayed, fontFamilyCountDisplayed );
    } // _updateFontsCategory

    function _updateFontsFamily( index ) {
      fontFamilyListSelected = index;
      var item = fontFamilyList[index];
      $( '#mm-font-example-display' ).css( 'font-family', _familyAndFallback(item) );
      $( '#mm-font-family-display' ).text( ' (' + index + '/' + fontFamilyList.length + ') ' + _familyAndFallback(item) );
    } // _updateFontsFamily

    function _updateFontsExample( text, size ) {
      fontExampleText = text;
      fontExampleSize = size;
      if ( fontExampleSize < 8 ) { fontExampleSize = 8; }
      if ( fontExampleSize > 80 ) { fontExampleSize = 80; }
      $( '#mm-font-example-text' ).val( fontExampleText );
      $( '#mm-font-example-size' ).val( fontExampleSize );
      $( '#mm-font-example-display' ).html( fontExampleText ).css( 'font-size', fontExampleSize );
    } // _updateFontsExample



// ----- events -----

    // category
    $( '#mm-font-category-select' ).on( 'click', '.mm-font-category', function(ev) {
      ev.preventDefault();
      fontFamilyListSelected = 0;
      fontFamilyFirstDisplayed = 0;
      _updateFontsCategory( parseInt( $(this).attr( 'mm-font-category-index' ) ) );
    });

    // family
    $( '#mm-font-family-prev' ).on( 'click', function(ev) {
      ev.preventDefault();
      fontFamilyFirstDisplayed -= fontFamilyCountDisplayed;
      if ( fontFamilyFirstDisplayed < 0 ) { fontFamilyFirstDisplayed = 0; };
      _updateFontsCategory( fontCategorySelected );
    });

    $( '#mm-font-family-next' ).on( 'click', function(ev) {
      ev.preventDefault();
      fontFamilyFirstDisplayed += fontFamilyCountDisplayed;
      _updateFontsCategory( fontCategorySelected );
    });

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



