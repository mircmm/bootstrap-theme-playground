
gfonts = function() {
  'use strict';

  var googleAPI = 'AIzaSyDyJtbKog963UG494tay5ydfU-AWhVbZUg';
  var googleFontsURL = 'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=' + googleAPI;

  var fontCategoryFilters = [ 'all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' ];
  var fontCategoryIndexes = [ [], [], [], [], [], [] ];
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

  var fontFamilyList = fontFamilyListInit;
  var fontFamilyDisplayedSize = 24;
  var fontFamilyListSelected = 0;
  var fontFamilyFirstDisplayed = 0;
  var fontFamilyCountDisplayed = 4;

  var fontExampleTextShort = 'abcde ABCDE 67890';
  var fontExampleTextInit = 'abcde fghij klmno pqrst uvwxyz ABCDE FGHIJ KLMNO PQRST UVWXYZ 12345 67890';
  var fontExampleText;
  var fontExampleSize = 48;


// ----- initialize -----
  _initFontsHtml();
  _initGoogleFonts();

// ----- functions -----
  function _initGoogleFonts() {
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
      _displayFontsCategory();
      _displayFontsFamily();
      _displayFontsExample();
    });
  } // _initGoogleFonts

  function _initFontsHtml() {
    // category
    var fc = $( '<div id="mm-font-category-select"> </div>' ).appendTo('#mm-content');
    for ( var i = 0; i < fontCategoryFilters.length; i++ ) {
      fc.append( $( '<span class="mm-font-category">' + fontCategoryFilters[i] + '</span>' ).data( 'inx', i ) );
    }
    fc.append( $( '<span id="mm-font-category-display"> </span>' ) );
    fc.append( $( '<p>' ) );
    // family
    var ff = $( '<div id="mm-font-family-select"> </div>' ).appendTo('#mm-content');
    ff.append( $( '<span id="mm-font-family-first-last"> </span>' ) );
    ff.append( $( '<span class="mm-font-family-goto">first</span>' ).data( 'goto', -9999 ) );
    ff.append( $( '<span class="mm-font-family-goto">prev</span>' ).data( 'goto', -1 ) );
    ff.append( $( '<span class="mm-font-family-count">&nbsp;-&nbsp;</span>' ).data( 'count', -2 ) );
    ff.append( $( '<input id="mm-font-family-count-display" size="4" disabled>' ) );
    ff.append( $( '<span class="mm-font-family-count">&nbsp;+&nbsp;</span>' ).data( 'count', +2 ) );
    ff.append( $( '<span class="mm-font-family-goto">next</span>' ).data( 'goto', +1 ) );
    ff.append( $( '<span class="mm-font-family-goto">last</span>' ).data( 'goto', +9999 ) );
    ff.append( $( '<div id="mm-font-family-list"> </div>' ) );
    ff.append( $( '<p>' ) );
    // example
    var fe = $( '<div id="mm-font-example"> </div>' ).appendTo('#mm-content');
    fe.append( $( '<span>example: </span><input id="mm-font-example-text" size="60"><br>' ) );
    fe.append( $( '<span>selected:</span>' ) );
    fe.append( $( '<span id="mm-font-family-display"> </span>' ) );
    fe.append( $( '<span> size:</span>' ) );
    fe.append( $( '<span class="mm-font-example-size">&nbsp;-&nbsp;</span>' ).data( 'size', -4 ) );
    fe.append( $( '<input id="mm-font-example-size-display" size="4" disabled>' ) );
    fe.append( $( '<span class="mm-font-example-size">&nbsp;+&nbsp;</span>' ).data( 'size', +4 ) );
    fe.append( $( '<span id="mm-font-example-update">Update</span>' ) );
    fe.append( $( '<div id="mm-font-example-display"> </div>' ) );
    $( '#mm-font-example-display' ).html( fontExampleTextInit );
    fontExampleText = $( '#mm-font-example-display' ).html();
  } // _initFontsHtml

  function _displayFontsCategory() {
    $( '#mm-font-category-display' ).text( 'selected: ' + fontCategoryFilters[fontCategorySelected] );
  } // _displayFontsCategory

  function _familyAndFallback( item ) {
    // return '"' + item.family + '", ' + item.category;
    return '"' + item.family + '"';
  }

  function _displayFontsFamily() {
    var first = fontFamilyFirstDisplayed;
    var count = fontFamilyCountDisplayed;
    $( '#mm-font-family-first-last' ).text(
      'displayed: (' + (first+1) + '-' + (first+count) + '/' + fontCategoryIndexes[fontCategorySelected].length + ')'
      );
    $( '#mm-font-family-count-display' ).val( count );
    // list families
    var element = $( '#mm-font-family-list' );
    element.empty();
    for ( var i = first, c = 0; i <= fontCategoryIndexes[fontCategorySelected].length && c < count; i++ ) {
      var inxf = fontCategoryIndexes[fontCategorySelected][i];
      var item = fontFamilyList[inxf];
      if ( item.kind ) WebFont.load({ google: { families: [item.family]} });
      var df = $( '<span class="mm-font-family">' + item.family + '</span>' ).data( 'inxf', inxf );
      element.append( df );
      df = $( '<span class="mm-font-family-example">' + fontExampleTextShort + '</span><br>' );
      element.append( df );
      df.css({ 'font-family': _familyAndFallback(item), 'font-size': fontFamilyDisplayedSize });
      c++;
    }
  } // _displayFontsFamily

  function _displayFontsExample() {
    var item = fontFamilyList[fontFamilyListSelected];
    $( '#mm-font-family-display' ).text( _familyAndFallback(item) );
    $( '#mm-font-example-text' ).val( fontExampleText );
    $( '#mm-font-example-size-display' ).val( fontExampleSize );
    $( '#mm-font-example-display' ).html( fontExampleText );
    $( '#mm-font-example-display' ).css({ 'font-size': fontExampleSize, 'font-family': _familyAndFallback(item) });
  } // _displayFontsExample

// ----- event handlers -----
  function _updateFontsCategory() {
    fontCategorySelected = $(this).data('inx');
    fontFamilyListSelected = 0;
    fontFamilyFirstDisplayed = 0;
    _displayFontsCategory();
    _displayFontsFamily();
  } // _updateFontsCategory

  function _updateFontsFamilyGoto() {
    fontFamilyFirstDisplayed += fontFamilyCountDisplayed * $(this).data('goto');
    if ( fontFamilyFirstDisplayed < 0 ) {
      fontFamilyFirstDisplayed = 0;
    }
    var maxFirst = fontCategoryIndexes[fontCategorySelected].length - fontFamilyCountDisplayed;
    if ( fontFamilyFirstDisplayed > maxFirst ) {
      fontFamilyFirstDisplayed = maxFirst;
    }
    _displayFontsFamily();
  } // _updateFontsFamilyGoto

  function _updateFontsFamilyCount() {
    fontFamilyCountDisplayed += $(this).data('count');
    if ( fontFamilyCountDisplayed < 4 ) { fontFamilyCountDisplayed = 4; }
    if ( fontFamilyCountDisplayed > 40 ) { fontFamilyCountDisplayed = 40; }
    _displayFontsFamily();
  } // _updateFontsFamilyCount

  function _updateFontsFamily() {
    fontFamilyListSelected = $(this).data( 'inxf' );
    _displayFontsExample();
  } // _updateFontsFamily

  function _updateFontsExample() {
    fontExampleText = $('#mm-font-example-text').val();
    _displayFontsExample();
  } // _updateFontsExample

  function _updateFontsExampleSize() {
    fontExampleSize += $(this).data( 'size' );
    if ( fontExampleSize < 8 ) { fontExampleSize = 8; }
    if ( fontExampleSize > 80 ) { fontExampleSize = 80; }
    _displayFontsExample();
  } // _updateFontsExample

// ----- register events -----
  $( '#mm-font-category-select' ).on( 'click', '.mm-font-category', _updateFontsCategory );

  $( '#mm-font-family-select' ).on( 'click', '.mm-font-family-count', _updateFontsFamilyCount );

  $( '#mm-font-family-select' ).on( 'click', '.mm-font-family-goto', _updateFontsFamilyGoto );

  $( '#mm-font-family-select' ).on( 'click', '.mm-font-family', _updateFontsFamily );

  $( '#mm-font-example-update' ).on( 'click', _updateFontsExample );

  $( '#mm-font-example' ).on( 'click', '.mm-font-example-size', _updateFontsExampleSize );

}; // gfonts


// ----- main -----------------------------------------------------------------
$( document ).ready( gfonts );

