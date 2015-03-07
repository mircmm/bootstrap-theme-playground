
var PopupMenu = function(options) {
'use strict';

  var
    title = 'Bootstrap Theme Playground',
    version = '0.1.03.07',
    // default color (use whenever there is no user choosen value))
    btpDefaultH = 180,
    btpDefaultS = 0.6,
    btpDefaultL = 0.5,
    // constant for not used (can not use false or 0, because it can be a legal value)
    empty = 'E',
    // ----- base colors -----
    // @gray-base:              #000;
    // @gray-darker:            lighten(@gray-base, 13.5%); // #222 --> L: 12
    // @gray-dark:              lighten(@gray-base, 20%);   // #333 --> L: 20
    // @gray:                   lighten(@gray-base, 33.5%); // #555 --> L: 32
    // @gray-light:             lighten(@gray-base, 46.7%); // #777 --> L: 50
    // @gray-lighter:           lighten(@gray-base, 93.5%); // #eee --> L: 92
    // colors used in the table (array of objects)
    // proc: 50, // 0..100 (x axis for color mixes)
    // init: {h: empty, s: empty, l: empty}   // startup defaults, false, if slider is hidden or hsl value if shown
    //    or {h: 120, s: 0.5, l: 0.5}
    // used: same as init, updated when user clicks
    // calc: calculated hsl values
    btpColors = [
      { proc: 100, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  96, init: {h: empty, s: empty, l: 0.96 }, used: {}, calc: {} },
      { proc:  92, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  88, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  80, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  60, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  50, init: {h: 180,   s: 0.6,   l: empty}, used: {}, calc: {} },
      { proc:  32, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  26, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  20, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
      { proc:  12, init: {h: empty, s: empty, l: 0.12 }, used: {}, calc: {} },
      { proc:   0, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} }
    ],
    // ----- brand colors -----
    // @brand-primary:         #337ab7;
    // @brand-success:         #5cb85c;
    // @brand-info:            #5bc0de;
    // @brand-warning:         #f0ad4e;
    // @brand-danger:          #d9534f;
    btpBrand = [
      { proc: 'general', rgb: '#337ab7', init: {h: empty, s: true, l: true }, used: {}, calc: {} },
      { proc: 'primary', rgb: '#337ab7', init: {h: true, s: empty, l: empty}, used: {}, calc: {} },
      { proc: 'success', rgb: '#5cb85c', init: {h: true, s: empty, l: empty}, used: {}, calc: {} },
      { proc: 'info',    rgb: '#5bc0de', init: {h: true, s: empty, l: empty}, used: {}, calc: {} },
      { proc: 'warning', rgb: '#f0ad4e', init: {h: true, s: empty, l: empty}, used: {}, calc: {} },
      { proc: 'danger',  rgb: '#d9534f', init: {h: true, s: empty, l: empty}, used: {}, calc: {} }
    ],
    // typography
    btpTypography = [
      { id: '#mm-typo-font-base',
        init: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        used: '',
        append: '',
      },
      { id: '#mm-typo-font-code',
        init: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        used: '',
        append: '',
      },
      { id: '#mm-typo-font-size',
        init: 14,
        used: 0,
        append: 'px',
      },
      { id: '#mm-typo-padding',
        init: 6,
        used: 0,
        append: 'px',
      },
      { id: '#mm-typo-border-radius',
        init: 4,
        used: 0,
        append: 'px',
      },
      { id: '#mm-typo-example',
        init: 'this is sample text; abcd ABCD 1480 #$%&/()[]{}@',
        used: '',
        append: ''
      },
    ],
    // mark which font to change ('#mm-typo-font-code' or '#mm-typo-font-size')
    btpFontToChange = '',
    // chose font
    googleFontsURL = 'all-google-fonts.json',
    // category
    fontCategoryFilters = [ 'all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' ],
    fontCategorySelected = 0,
    // subset
    fontSubsetFilters = [ 'all' ],
    fontSubsetSelected = 0,
    // filtered indexes to fontFamilyList
    fontFamilyListFiltered = [],
    // family
    fontFamilyListInit = [
      { kind: false, family: 'Helvetica Neue',  category: 'sans-serif', subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Helvetica',       category: 'sans-serif', subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Arial',           category: 'sans-serif', subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Georgia',         category: 'serif',      subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Times New Roman', category: 'serif',      subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Times',           category: 'serif',      subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Menlo',           category: 'monospace',  subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Monaco',          category: 'monospace',  subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Consolas',        category: 'monospace',  subsets: [ 'latin', 'latin-ext'] },
      { kind: false, family: 'Courier New',     category: 'monospace',  subsets: [ 'latin', 'latin-ext'] }
    ],
    fontFamilyList = fontFamilyListInit,
    //
    fontFamilyDisplayedSize = 24,
    fontFamilyListSelected = 0,
    fontFamilyFirstDisplayed = 0,
    fontFamilyCountDisplayed = 4,
    // example
    fontExampleTextShort = 'abcde ABCDE 67890',
    fontExampleTextInit = 'abcde fghij klmno pqrst uvwxyz ABCDE FGHIJ KLMNO PQRST UVWXYZ 12345 67890',
    fontExampleText,
    fontExampleSize = 36,

    // bootstrap color descriptions for _descriptionPopup
    btpDescription = {
      // colors
      '100': 'default lightness: 100%, color #fff <br> bootstrap: most backgrounds and active components',
       '96': 'default lightness 96%, color #f5f5f5 <br> bootstrap: hoover on elements, other backgrounds',
       '92': 'default lightness 96%, color #eee, @gray-lighter <br> bootstrap: nav and pagination hoover, jumbotron bg',
       '88': 'default lightness 88%, color #ddd <br> bootstrap: most borders ',
       '80': 'default lightness 80% default color #ccc <br> bootstrap: button and input borders',
       '60': 'default lightness 60% default color #999 <br> bootstrap: input placeholder text',
       '50': 'default lightness 50% default color #777, @gray-light <br> bootstrap: default navbar, disabled button, dropdown and pagination',
       '32': 'default lightness 32% default color #555, @gray <br> bootstrap: input text, navbar active and hoover',
       '26': 'default lightness 26% default color #444 <br> bootstrap: inverse navbar link disabled',
       '20': 'default lightness 20% default color #333, @gray-dark <br> bootstrap: text',
       '12': 'default lightness 12% default color #222, @gray-darker <br> bootstrap: inverse navbar bg',
        '0': 'default lightness 0% default color #000 <br> bootstrap: tooltip and modal bg',
       // brand
      'general': 'not used in bootstrap <br> adjust S and L for all 5 brand colors',
      'primary': 'default: #337ab7 <br> bootstrap: brand primary color',
      'success': 'default: #5cb85c <br> bootstrap: brand success color',
         'info': 'default: #5bc0de <br> bootstrap: brand info color',
      'warning': 'default: #f0ad4e <br> bootstrap: brand warning color',
       'danger': 'default: #d9534f <br> bootstrap: brand danger color',
      // end
      'n': 'n'
    },
    // default sliders options
    cpDefault = {
      previewontriggerelement: true,
      rendervalues: true,
      slidersplusminus: true,
      flat: true,
      sliders: true,
      swatches: false,
      hsvpanel: false
    },
    lastVar;
  // end of variables


  function _showPopover() {
    // create and display main menu
    $('<div id="mm-menu-main"></div>').appendTo('body').html( _createMainHTML() );
    // make menu draggable inside browser window
    $( '#mm-menu-main' ).draggable({
      handle: '#mm-menu-drag',
      containment: 'window'
    });
    // init colors, sliders & typography
    _btpColorsUsedInit();
    _btpColorsCalculate();
    _updateColorsHTML();
    _updateColorSlidersHTML();
    _btpBrandUsedInit();
    _btpBrandCalculate();
    _updateBrandHTML();
    _updateBrandSlidersHTML();
    _btpFontsUsedInit();
    _updateFontsHTML();
    _btpChooseFontInit();
    _loadGoogleFonts();
  } // showPopover

  function _createMainHTML() {
    var result =
      // dragable top
      '<ul>' +
        '<li><span class="mm-menu-title" id="mm-menu-drag">' + title +
          '<span style="font-size:80%">&nbsp;&nbsp;&nbsp;(ver. ' + version + ')</span></span></li>' +
        '<li><span class="mm-menu-help">' + '?' + '</span></li>' +
      '</ul>' +
      // menus
      '<ul>' +
        // file menu
        '<li>' +
          '<span class="mm-menu-top" id="mm-menu-file">File</span>' +
          '<div class="mm-menu-down" id="mm-menu-file-down">' + _createFileHTML() + '</div>' +
        '</li>' +
        // base colors menu
        '<li>' +
          '<span class="mm-menu-top" id="mm-menu-color">Base Colors</span>' +
          '<div class="mm-menu-down" id="mm-menu-color-down">' + _createColorsHTML() + '</div>' +
        '</li>' +
        // brand colors menu
        '<li>' +
          '<span class="mm-menu-top" id="mm-menu-brand">Brand Colors</span>' +
          '<div class="mm-menu-down" id="mm-menu-brand-down">' + _createBrandHTML() + '</div>' +
        '</li>' +
        // fonts menu
        '<li>' +
          '<span class="mm-menu-top" id="mm-menu-fonts">Typography</span>' +
          '<div class="mm-menu-down" id="mm-menu-fonts-down">' + _createFontsHTML() + '</div>' +
        '</li>' +
        // choose font menu
        '<li>' +
          '<div class="mm-menu-down" id="mm-menu-choose-font-down">' + _createChooseFontHTML() + '</div>' +
        '</li>' +
      // end of menus
      '</ul>';
    return result;
  } // _createMainHTML

/* ----------------------------------------------------------------------------
 * file menu
 * ---------------------------------------------------------------------------- */
  function _createFileHTML() {
    var result =
      '<div class="mm-down-title">File</div>' +
      // title
      '<div id="mm-file-menu-container">' +
      // content
      '</div>' +
      // menu buttons
      '<ul>' +
        '<li><span class="mm-long-button mm-menu-close">Close</span></li>' +
      '</ul>';
    return result;
  } // _createFileHTML

/* ----------------------------------------------------------------------------
 * colors menu
 * ---------------------------------------------------------------------------- */
  function _createColorsHTML () {
    var result =
      '<div class="mm-down-title">Base Colors</div>' +
      // title
      '<div id="mm-color-menu-container">';
      // content
    for (var i = 0; i < btpColors.length; i++) {
      result +=
        '<div id="mm-color-edit-' + btpColors[i].proc + '" class="mm-color-line">' +
          '<div class="mm-color-H">H</div>' +
          '<div class="mm-color-S">S</div>' +
          '<div class="mm-color-L">L</div>' +
          '<input type="text" class="mm-color-view" readonly data-color-format="hsl">' +
        '</div>';
    }
    result +=
      '</div>' +
      // menu buttons
      '<ul>' +
        '<li><span class="mm-long-button" id="mm-menu-color-defaults">Defaults</span></li>' +
        '<li><span class="mm-long-button" id="mm-menu-color-update">Update</span></li>' +
        '<li><span class="mm-long-button mm-menu-close">Close</span></li>' +
      '</ul>';
    return result;
  } // _createColorsHTML

  function _btpColorsUsedInit() {
    for ( var i=0; i < btpColors.length; i++ ) {
      // must use Object.create to get a copy, otherwise just pointer
      btpColors[i].used = Object.create( btpColors[i].init );
    }
  } // _btpColorsUsedInit

  function _updateColorsHTML() {
    for (var i = 0; i < btpColors.length; i++) {
      var color_input = $( '#mm-color-edit-' + btpColors[i].proc + ' .mm-color-view' );
      var color_hsl = tinycolor( btpColors[i].calc ).toHsl();
      var color_back = tinycolor( color_hsl ).toHslString();
      var color_txt = tinycolor.mostReadable( color_hsl, ['#000', '#fff'] ).toHslString();
      color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
    }
  } // _updateColorsHTML

  function _btpColorsUsedFromHTML() {
    for (var i = 0; i < btpColors.length; i++) {
      var line = $( '#mm-color-edit-' + btpColors[i].proc );
      var color = tinycolor( line.find( '.mm-color-view' ).val() );
      //
      if ( line.find( '.mm-color-H' ).attr( 'show-slider') ) {
        var h = color.toHsl().h;
        btpColors[i].used.h = h;
      } else {
        btpColors[i].used.h = empty;
      };
      if ( line.find( '.mm-color-S' ).attr( 'show-slider') ) {
        var s = color.toHsl().s;
        btpColors[i].used.s = s;
      } else {
        btpColors[i].used.s = empty;
      };
      if ( line.find( '.mm-color-L' ).attr( 'show-slider') ) {
        var l = color.toHsl().l;
        btpColors[i].used.l = l;
      } else {
        btpColors[i].used.l = empty;
      };
    }
  } // _btpColorsUsedFromHTML

  function _btpColorsCalculate() {
    // sliders (shown by user) === points
    // find and save points to calculate curves
    var pts_h = [], pts_s = [], pts_l = [];
    for ( var i=0; i < btpColors.length; i++ ) {
      if ( btpColors[i].used.h !== empty ) {
        pts_h.push( { x: btpColors[i].proc, y: btpColors[i].used.h} );
      };
      if ( btpColors[i].used.s !== empty ) {
        pts_s.push( { x: btpColors[i].proc, y: btpColors[i].used.s} );
      };
      if ( btpColors[i].used.l !== empty ) {
        pts_l.push( { x: btpColors[i].proc, y: btpColors[i].used.l} );
      };
    } // for
    // now calculate colors using found points
    for ( var i=0; i < btpColors.length; i++ ) {
      btpColors[i].calc.h = ( _btpColorsPoint( pts_h, btpDefaultH, btpColors[i].proc ) + 360 ) % 360;
      btpColors[i].calc.s = _btpColorsPoint( pts_s, btpDefaultS, btpColors[i].proc );
      btpColors[i].calc.l = _btpColorsPoint( pts_l, btpDefaultL, btpColors[i].proc );
    }
  } // _btpColorsCalculate

  // help function for _btpColorsCalculate
  // points: array of x, y pairs
  // default_y: y used if array is empty
  // x: input parameter for y = f(x)
  function _btpColorsPoint(points, default_y, x) {
    var y;
    if( points.length == 0 ) {
      // no user choice, use default
      y = default_y;
    } else if ( points.length == 1 ) {
      // single user choice, use it everywhere
      y = points[0].y;
    } else {
      // multiple user choices
      // first find the 2 points around x
      var i = 0;
      do {
        var p0 = points[i];
        var p1 = points[i+1];
        i++;
      } while ( x < p1.x && i < points.length-1 );
      // y = linear aproximation
      var a = (p1.y - p0.y) / (p1.x - p0.x);
      var b = p0.y - a * p0.x;
      y = a * x + b;
    }
    return y;
  } // _btpColorsPoint

  function _showLineSliders( line ) {
    // line is jquery object
    // remove sliders if exists
    var sliders = line.find( '.cp-container' );
    if ( sliders.length ) {
      sliders.remove();
    }
    // add sliders
    var new_order = {};
    if( line.find( '.mm-color-H' ).attr( 'show-slider' ) ) {
      $.extend( new_order, { hslH: 1 } );
    }
    if( line.find( '.mm-color-S' ).attr( 'show-slider' ) ) {
      $.extend( new_order, { hslS: 2 } );
    }
    if( line.find( '.mm-color-L' ).attr( 'show-slider' ) ) {
      $.extend( new_order, { hslL: 3 } );
    }
    if ( new_order !== {} ) {
      var color_view = line.find( '.mm-color-view' );
      var bc = color_view.css( 'background-color' );
      var params = $.extend( {color: bc, order: new_order }, cpDefault );
      color_view.ColorPickerSliders( params );
    }
  } // _showLineSliders

  function _updateColorSlidersHTML() {
    // select/unselect HSL buttons
    for (var i = 0; i < btpColors.length; i++) {
      var btpline = btpColors[i];
      var line = $( '#mm-color-edit-' + btpline.proc );
      if ( btpline.used.h === empty ) {
        line.find( '.mm-color-H' ).removeAttr( 'show-slider' );
      } else {
        line.find( '.mm-color-H' ).attr( 'show-slider', true );
      };
      if ( btpline.used.s === empty ) {
        line.find( '.mm-color-S' ).removeAttr( 'show-slider' );
      } else {
        line.find( '.mm-color-S' ).attr( 'show-slider', true );
      };
      if ( btpline.used.l === empty ) {
        line.find( '.mm-color-L' ).removeAttr( 'show-slider' );
      } else {
        line.find( '.mm-color-L' ).attr( 'show-slider', true );
      };
    }
    // show/hide color sliders
    $( '.mm-color-line' ).each( function() {
      _showLineSliders( $(this) );
    });
  } // _updateColorSlidersHTML

/* ----------------------------------------------------------------------------
 * brand menu
 * ---------------------------------------------------------------------------- */
  function _createBrandHTML () {
    var result =
      // title
      '<div class="mm-down-title">Brand Colors</div>' +
      // content
      '<div id="mm-brand-menu-container">';
    for (var i = 0; i < btpBrand.length; i++) {
      result +=
        '<div id="mm-color-edit-' + btpBrand[i].proc + '" class="mm-color-line">' +
          '<div class="mm-color-H">H</div>' +
          '<div class="mm-color-S">S</div>' +
          '<div class="mm-color-L">L</div>' +
          '<input type="text" class="mm-color-view" readonly data-color-format="hsl">' +
        '</div>';
    }
    result +=
      '</div>' +
      // menu buttons
      '<ul>' +
        '<li><span class="mm-long-button" id="mm-menu-brand-defaults">Defaults</span></li>' +
        '<li><span class="mm-long-button" id="mm-menu-brand-update">Update</span></li>' +
        '<li><span class="mm-long-button mm-menu-close">Close</span></li>' +
      '</ul>';
    return result;
  } // _createBrandHTML

  function _btpBrandUsedInit() {
    for ( var i=0; i < btpBrand.length; i++ ) {
      btpBrand[i].used = Object.create( btpBrand[i].init );
      var color = tinycolor( btpBrand[i].rgb ).toHsl();
      btpBrand[i].calc.h = color.h;
      btpBrand[i].calc.s = color.s;
      btpBrand[i].calc.l = color.l;
    }
  } // _btpBrandUsedInit

  function _btpBrandUsedFromHTML() {
    for (var i = 0; i < btpBrand.length; i++) {
      var line = $( '#mm-color-edit-' + btpBrand[i].proc );
      var color = tinycolor( line.find( '.mm-color-view' ).val() );
      // set calc to current color
      btpBrand[i].calc = color.toHsl();
      // set used to shown sliders
      if ( line.find( '.mm-color-H' ).attr( 'show-slider') ) {
        btpBrand[i].used.h = true;
      } else {
        btpBrand[i].used.h = empty;
      };
      if ( line.find( '.mm-color-S' ).attr( 'show-slider') ) {
        btpBrand[i].used.s = true;
      } else {
        btpBrand[i].used.s = empty;
      };
      if ( line.find( '.mm-color-L' ).attr( 'show-slider') ) {
        btpBrand[i].used.l = true;
      } else {
        btpBrand[i].used.l = empty;
      };
    }
  } // _btpBrandUsedFromHTML

  function _btpBrandCalculate() {
    // get change of S and L from first
    var deltaInit =  tinycolor( btpBrand[0].rgb ).toHsl();
    var deltaS = btpBrand[0].calc.s - deltaInit.s;
    var deltaL = btpBrand[0].calc.l - deltaInit.l;
    // apply the same S and L change for others, if not explicitely set
    for ( var i=1; i < btpBrand.length; i++ ) {
      if ( btpBrand[i].used.s === empty ) {
        btpBrand[i].calc.s += deltaS;
      };
      if ( btpBrand[i].used.l === empty ) {
        btpBrand[i].calc.l += deltaL;
      };
    }
  } // _btpBrandCalculate

  function _updateBrandHTML() {
    for (var i = 0; i < btpBrand.length; i++) {
      var color_input = $( '#mm-color-edit-' + btpBrand[i].proc + ' .mm-color-view' );
      var color_hsl = tinycolor( btpBrand[i].calc ).toHsl();
      var color_back = tinycolor( color_hsl ).toHslString();
      var color_txt = tinycolor.mostReadable( color_hsl, ['#000', '#fff'] ).toHslString();
      color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
    }
  } // _updateBrandHTML

  function _updateBrandSlidersHTML() {
    // select/unselect HSL buttons
    for (var i = 0; i < btpBrand.length; i++) {
      var btpline = btpBrand[i];
      var line = $( '#mm-color-edit-' + btpline.proc );
      if ( btpline.used.h === empty ) {
        line.find( '.mm-color-H' ).removeAttr( 'show-slider' );
      } else {
        line.find( '.mm-color-H' ).attr( 'show-slider', true );
      };
      if ( btpline.used.s === empty ) {
        line.find( '.mm-color-S' ).removeAttr( 'show-slider' );
      } else {
        line.find( '.mm-color-S' ).attr( 'show-slider', true );
      };
      if ( btpline.used.l === empty ) {
        line.find( '.mm-color-L' ).removeAttr( 'show-slider' );
      } else {
        line.find( '.mm-color-L' ).attr( 'show-slider', true );
      };
    }
    // show/hide color sliders
    $( '.mm-color-line' ).each( function() {
      _showLineSliders( $(this) );
    });
  } // updateSlidersHTML

  // use same function as for colors
  // function _showLineSliders( line )

/* ----------------------------------------------------------------------------
 * fonts menu
 * ---------------------------------------------------------------------------- */
  function _createFontsHTML() {
    var result =
        // title
        '<div class="mm-down-title">Tipography</div>' +
        // container
        '<div id="mm-typography-menu-container">' +
          // controls
          '<div class="mm-typo-line" id="mm-typo-font-base">' +
            '<span>Base Font:</span>' +
            '<input type="text" readonly>' +
          '</div>' +
          '<div class="mm-typo-line" id="mm-typo-font-code">' +
            '<span>Code Font:</span>' +
            '<input type="text" readonly>' +
          '</div>' +
          '<div class="mm-typo-line" id="mm-typo-three">' +
            '<div class="mm-typo-line" id="mm-typo-font-size">' +
              '<span>Font Size:</span>' +
              '<div class="mm-button-minus">-</div>' +
              '<input type="text" readonly>' +
              '<div class="mm-button-plus">+</div>' +
            '</div>' +
            '<div class="mm-typo-line" id="mm-typo-padding">' +
              '<span>Padding:</span>' +
              '<div class="mm-button-minus">-</div>' +
              '<input type="text" readonly>' +
              '<div class="mm-button-plus">+</div>' +
            '</div>' +
            '<div class="mm-typo-line" id="mm-typo-border-radius">' +
              '<span>Border Radius:</span>' +
              '<div class="mm-button-minus">-</div>' +
              '<input type="text" readonly>' +
              '<div class="mm-button-plus">+</div>' +
            '</div>' +
          '</div>' +
          '<div class="mm-typo-line" id="mm-typo-example">' +
            '<span>Example:</span>' +
            '<input type="text">' +
          '</div>' +
          // examples
          '<div class="mm-small"> <span> </span> </div>' +
          '<div class="mm-base"> <span> </span> </div>' +
          '<div class="mm-large"> <span> </span> </div>' +
          '<div class="mm-code"> <span> </span> </div>' +
        '</div>' + // container
      // menu buttons
      '<ul>' +
        '<li><span class="mm-long-button" id="mm-menu-fonts-defaults">Defaults</span></li>' +
        '<li><span class="mm-long-button mm-menu-close">Close</span></li>' +
      '</ul>';
    return result;
  } // _createFontsHTML

  function _btpFontsUsedInit() {
    for ( var i = 0; i < btpTypography.length; i++ ) {
      btpTypography[i].used = btpTypography[i].init;
    }
  } // _btpFontsUsedInit

  function _btpFontsUsedFromHTML() {
    for (var i = 0; i < btpTypography.length; i++) {
      var value = $( btpTypography[i].id ).find( 'input' ).val();
      if ( btpTypography[i].append === 'px' ) {
        value = parseInt( value );
      }
      btpTypography[i].used = value;
    }
  } // _btpFontsUsedFromHTML

  function _updateFontsHTML() {
    var base = $( '#mm-typography-menu-container .mm-base' );
    var small = $( '#mm-typography-menu-container .mm-small' );
    var large = $( '#mm-typography-menu-container .mm-large' );
    var code = $( '#mm-typography-menu-container .mm-code' );

    for ( var i = 0; i < btpTypography.length; i++ ) {
      var value = btpTypography[i].used;
      $( btpTypography[i].id ).find( 'input' ).val( value + btpTypography[i].append );
      // update examples
      switch( btpTypography[i].id ) {
        case '#mm-typo-font-base':
          base.css( 'font-family', value );
          small.css( 'font-family', value );
          large.css( 'font-family', value );
          break;
        case '#mm-typo-font-code':
          code.css( 'font-family', value );
          break;
        case '#mm-typo-font-size':
          base.css( 'font-size', value + btpTypography[i].append );
          code.css( 'font-size', value + btpTypography[i].append );
          small.css( 'font-size', Math.floor(value*0.85) + btpTypography[i].append );
          large.css( 'font-size', Math.ceil(value*1.25) + btpTypography[i].append );
          break;
        case '#mm-typo-padding':
          base.css( 'padding-top', value + btpTypography[i].append )
              .css( 'padding-bottom', value + btpTypography[i].append )
              .css( 'padding-left', 2*value + btpTypography[i].append )
              .css( 'padding-right', 2*value + btpTypography[i].append );
          code.css( 'padding-top', value + btpTypography[i].append )
              .css( 'padding-bottom', value + btpTypography[i].append )
              .css( 'padding-left', 2*value + btpTypography[i].append )
              .css( 'padding-right', 2*value + btpTypography[i].append );
          small.css( 'padding-top', Math.floor(value*0.8) + btpTypography[i].append )
              .css( 'padding-bottom', Math.floor(value*0.8) + btpTypography[i].append )
              .css( 'padding-left', 2*Math.floor(value*0.8) + btpTypography[i].append )
              .css( 'padding-right', 2*Math.floor(value*0.8) + btpTypography[i].append );
          large.css( 'padding-top', Math.ceil(value*1.3333) + btpTypography[i].append )
              .css( 'padding-bottom', Math.ceil(value*1.3333) + btpTypography[i].append )
              .css( 'padding-left', 2*Math.ceil(value*1.3333) + btpTypography[i].append )
              .css( 'padding-right', 2*Math.ceil(value*1.3333) + btpTypography[i].append );
          break;
        case '#mm-typo-border-radius':
          base.css( 'border-radius', value + btpTypography[i].append );
          code.css( 'border-radius', value + btpTypography[i].append );
          small.css( 'border-radius', Math.floor(value*0.75) + btpTypography[i].append );
          large.css( 'border-radius', Math.ceil(value*1.5) + btpTypography[i].append );
          break;
        case '#mm-typo-example':
          base.find( 'span' ).text( 'Base: ' + value );
          code.find( 'span' ).text( 'Code: ' + value );
          small.find( 'span' ).text( 'Small: ' + value );
          large.find( 'span' ).text( 'Large: ' + value );
          break;
      } // switch
    }
  } // _updateFontsHTML

/* ----------------------------------------------------------------------------
 * choose font
 * ---------------------------------------------------------------------------- */
  function _loadGoogleFonts() {
    $.getJSON( googleFontsURL, function(result) {
      // load fonts list from google
      fontFamilyList = [].concat( fontFamilyListInit, result.items );
      // init subsets
      for ( var inxf = 0; inxf < fontFamilyList.length; inxf++ ) {
        var itemSubsets = fontFamilyList[inxf].subsets;
        for ( var s = 0; s < itemSubsets.length; s++ ) {
          if ( fontSubsetFilters.indexOf( itemSubsets[s] ) === -1 ) {
            fontSubsetFilters.push( itemSubsets[s] );
          }
        }
      }
      // create subset select
      $('<span>Subset:</span>').appendTo('#mm-font-subset-select');
      var el = $('<select name="font-subset"></select>').appendTo('#mm-font-subset-select');
      for ( var s = 0; s < fontSubsetFilters.length; s++ ) {
        el.append( '<option value="' + s + '">' + fontSubsetFilters[s] + '</option>' );
      }
      // display it
      _calcFontFilter();
      _displayFontsCategory();
      _displayFontsFamily();
      _displayFontsExample();
    });
  } // _loadGoogleFonts

  function _calcFontFilter() {
    // calc font filter indexes
    fontFamilyListFiltered = [];
    for ( var inxf = 0; inxf < fontFamilyList.length; inxf++ ) {
      if ( fontCategorySelected === 0 || fontFamilyList[inxf].category === fontCategoryFilters[fontCategorySelected] ) {
        if ( fontSubsetSelected === 0 || fontFamilyList[inxf].subsets.indexOf( fontSubsetFilters[fontSubsetSelected] ) !== -1 ) {
          fontFamilyListFiltered.push( inxf );
        }
      }
    }
  } // _calcFontFilter


  function _createChooseFontHTML() {
    var result =
      // title
      '<div class="mm-down-title">Choose Font</div>' +
      // container
      '<div id="mm-choose-font-menu-container">' +
      // _btpChooseFontInit will create this content
      '</div>' +
      // menu buttons
      '<ul>' +
        '<li><span class="mm-long-button" id="mm-choose-font-menu-use">Use</span></li>' +
        '<li><span class="mm-long-button" id="mm-choose-font-menu-cancel">Cancel</span></li>' +
      '</ul>';
    return result;
  }

  function _btpChooseFontInit() {
    var el;
    // subsets
    el = $( '<div id="mm-font-subset-select" class="mm-font-line"> </div>' ).appendTo('#mm-choose-font-menu-container');
    // category
    el = $( '<div id="mm-font-category-select" class="mm-font-line"> </div>' ).appendTo('#mm-choose-font-menu-container');
    for ( var i = 0; i < fontCategoryFilters.length; i++ ) {
      el.append( $( '<div class="mm-font-category">' + fontCategoryFilters[i] + '</div>' ).data( 'inx', i ) );
    }
    // family
    el = $( '<div id="mm-font-family-select" class="mm-font-line"> </div>' ).appendTo('#mm-choose-font-menu-container');
    el.append( $( '<span id="mm-font-family-first-last"> </span>' ) );
    el.append( $( '<div class="mm-font-family-goto">first</div>' ).data( 'goto', -9999 ) );
    el.append( $( '<div class="mm-font-family-goto">prev</div>' ).data( 'goto', -1 ) );
    el.append( $( '<div class="mm-font-family-count">&nbsp;-&nbsp;</div>' ).data( 'count', -2 ) );
    el.append( $( '<input id="mm-font-family-count-display" size="4" disabled>' ) );
    el.append( $( '<div class="mm-font-family-count">&nbsp;+&nbsp;</div>' ).data( 'count', +2 ) );
    el.append( $( '<div class="mm-font-family-goto">next</div>' ).data( 'goto', +1 ) );
    el.append( $( '<div class="mm-font-family-goto">last</div>' ).data( 'goto', +9999 ) );
    // family list
    el = $( '<div id="mm-font-family-list"> </div>' ).appendTo('#mm-choose-font-menu-container');
    // example input
    el = $( '<div id="mm-font-example" class="mm-font-line"> </div>' ).appendTo('#mm-choose-font-menu-container');
    el.append( $( '<span>Example: </span>' ) );
    el.append( $( '<input id="mm-font-example-text" size="60">' ) );
    // example info and size
    el = $( '<div id="mm-font-info-size" class="mm-font-line"> </div>' ).appendTo('#mm-choose-font-menu-container');
    el.append( $( '<span>Selected: </span>' ) );
    el.append( $( '<span id="mm-font-family-display"> </span>' ) );
    el.append( $( '<span>Size: </span>' ) );
    el.append( $( '<div class="mm-font-example-size">&nbsp;-&nbsp;</div>' ).data( 'size', -4 ) );
    el.append( $( '<input id="mm-font-example-size-display" size="4" disabled>' ) );
    el.append( $( '<div class="mm-font-example-size">&nbsp;+&nbsp;</div>' ).data( 'size', +4 ) );
    //el.append( $( '<div id="mm-font-example-update">Update</div>' ) );
    // example display
    el = ( $( '<div id="mm-font-example-display"> </div>' ) ).appendTo('#mm-choose-font-menu-container');
    $( '#mm-font-example-display' ).html( fontExampleTextInit );
    fontExampleText = $( '#mm-font-example-display' ).html();
  } // _btpChooseFontInit

  function _displayFontsCategory() {
    var fca = $( '#mm-font-category-select' );
    fca.find( '.mm-font-category' ).removeAttr( 'selected-category' );
    fca.find( '.mm-font-category:eq("' + fontCategorySelected + '")' ).attr( 'selected-category', true );
    //$( '#mm-font-category-display' ).text( 'selected: ' + fontCategoryFilters[fontCategorySelected] );
  } // _displayFontsCategory

  function _familyAndFallback( item ) {
    // return '"' + item.family + '", ' + item.category;
    return '"' + item.family + '", ' + item.category;
  }

  function _displayFontsFamily() {
    var first = fontFamilyFirstDisplayed;
    var count = fontFamilyCountDisplayed;
    $( '#mm-font-family-first-last' ).text(
      'displayed: (' + (first+1) + '-' + (first+count) + '/' + fontFamilyListFiltered.length + ')'
      );
    $( '#mm-font-family-count-display' ).val( count );
    // list families
    var element = $( '#mm-font-family-list' );
    element.empty();
    for ( var i = first, c = 0; i <= fontFamilyListFiltered.length && c < count; i++ ) {
      var inxf = fontFamilyListFiltered[i];
      var item = fontFamilyList[inxf];
      if ( item.kind ) WebFont.load({ google: { families: [item.family]} });
      //
      var dl = ( $( '<div class="mm-font-line"> </div>' ) ).appendTo( element );
      $( '<span class="mm-font-family">' + item.family + '</span>' ).data( 'inxf', inxf ).appendTo( dl );
      var df = $( '<span class="mm-font-family-example">' + fontExampleTextShort + '</span>' ).appendTo( dl );
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
  function _updateFontsSubsets() {
    fontSubsetSelected = parseInt( $(this).val() );
    fontFamilyListSelected = 0;
    fontFamilyFirstDisplayed = 0;
    _calcFontFilter();
    _displayFontsCategory();
    _displayFontsFamily();
  } // _updateFontsSubsets

  function _updateFontsCategory() {
    fontCategorySelected = $(this).data('inx');
    fontFamilyListSelected = 0;
    fontFamilyFirstDisplayed = 0;
    _calcFontFilter();
    _displayFontsCategory();
    _displayFontsFamily();
  } // _updateFontsCategory

  function _updateFontsFamilyGoto() {
    fontFamilyFirstDisplayed += fontFamilyCountDisplayed * $(this).data('goto');
    if ( fontFamilyFirstDisplayed < 0 ) {
      fontFamilyFirstDisplayed = 0;
    }
    var maxFirst = fontFamilyListFiltered.length - fontFamilyCountDisplayed;
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

/* ----------------------------------------------------------------------------
 * other
 * ---------------------------------------------------------------------------- */
  function _descriptionPopup( element, event ) {
    var val = element.val();
    var col = element.css( 'color');
    var bck = element.css( 'background-color');
    var rgb = tinycolor(bck).toRgbString();
    var id = element.parent().attr('id');
    var i = id.slice( id.lastIndexOf('-') + 1 );
    var text = val + '&nbsp;&nbsp;' + rgb + '<br>' + btpDescription[i];
    var pop = $( '<div class="mm-color-view-popup">' + text + '</div>').css({
      'background-color': bck,
      'color': col,
      'border-color': col,
      'left': event.clientX-30,
      'top': event.clientY-30
      });
    element.after( pop );
    // close it on next click
    $( '.mm-color-view-popup' ).on( 'click', function(ev) {
      ev.preventDefault();
      $(this).remove();
    });
  } // _descriptionPopup

  function _helpPopup( event ) {
    var text = 'help';
    var pop = $( '<div class="mm-help-popup">' + text + '</div>').css({
      'left': event.clientX,
      'top': event.clientY
      });
    $( 'body' ).after( pop );
    $( '.mm-help-popup' ).on( 'click', function(ev) {
      ev.preventDefault();
      $(this).remove();
    });
  }


/* ----------------------------------------------------------------------------
 * events
 * ---------------------------------------------------------------------------- */
  function _bindEvents() {

    // open clicked drop down menu and close all others
    $( '.mm-menu-top' ).on( 'click', function(ev) {
      ev.preventDefault();
      $( '.mm-menu-down' ).hide();
      $(this).next().show();
    });

    // close any drop down
    $( '.mm-menu-close' ).on( 'click', function(ev) {
      ev.preventDefault();
      $( '.mm-menu-down' ).hide();
    });

    // reset colors to default
    $( '#mm-menu-color-defaults' ).on( 'click', function(ev) {
      ev.preventDefault();
      _btpColorsUsedInit();
      _btpColorsCalculate();
      _updateColorsHTML();
      _updateColorSlidersHTML();
    });

    // reset brand to default
    $( '#mm-menu-brand-defaults' ).on( 'click', function(ev) {
      ev.preventDefault();
      _btpBrandUsedInit();
      _btpBrandCalculate();
      _updateBrandHTML();
      _updateBrandSlidersHTML();
    });

    // reset fonts to default
    $( '#mm-menu-fonts-defaults' ).on( 'click', function(ev) {
      ev.preventDefault();
      _btpFontsUsedInit();
      _updateFontsHTML();
    });

    // update colors
    $( '#mm-menu-color-update' ).on( 'click', function(ev) {
      ev.preventDefault();
      _btpColorsUsedFromHTML();
      _btpColorsCalculate();
      _updateColorsHTML();
      _updateColorSlidersHTML();
    });

    // update brand
    $( '#mm-menu-brand-update' ).on( 'click', function(ev) {
      ev.preventDefault();
      _btpBrandUsedFromHTML();
      _btpBrandCalculate();
      _updateBrandHTML();
      _updateBrandSlidersHTML();
    });

    // toggle H S L buttons in color lines and show or hide sliders
    $( '.mm-color-H, .mm-color-S, .mm-color-L' ).on( 'click', function(ev) {
      ev.preventDefault();
      var button = $(this);
      var line = button.parent();
      // first toggle clicked button
      if ( button.attr( 'show-slider' ) ) {
        button.removeAttr( 'show-slider' );
      } else {
        button.attr( 'show-slider', true );
      };
      // show or hide sliders
      _showLineSliders( line );
    });

    // typography button minus
    $( '#mm-typography-menu-container .mm-button-minus' ).on( 'click', function(ev) {
      ev.preventDefault();
      var input = $(this).parent().find( 'input' );
      var value = parseInt( input.val() );
      if ( value > 0 ) {
        input.val( (value-1)+'px' );
      }
      _btpFontsUsedFromHTML();
      _updateFontsHTML();
    });

    // typography button plus
    $( '#mm-typography-menu-container .mm-button-plus' ).on( 'click', function(ev) {
      ev.preventDefault();
      var input = $(this).parent().find( 'input' );
      var value = parseInt( input.val() );
      input.val( (value+1)+'px' );
      _btpFontsUsedFromHTML();
      _updateFontsHTML();
    });

    // example text changed
    $( '#mm-typo-example input' ).on( 'keyup', function(ev) {
      ev.preventDefault();
      btpTypography[5].used = $(this).val();
      _updateFontsHTML();
    });

    // show choose font
    $( '#mm-typo-font-base, #mm-typo-font-code' ).on( 'click', 'input', function(ev) {
      ev.preventDefault();
      btpFontToChange = $(this).parent().attr('id');
      $( '.mm-menu-down' ).hide();
      $( '#mm-menu-choose-font-down' ).show();
      var t = $( '#mm-menu-choose-font-down .mm-down-title' );
      if ( btpFontToChange === 'mm-typo-font-base' ) { t.text( 'Choose Base Font' ); }
      if ( btpFontToChange === 'mm-typo-font-code' ) { t.text( 'Choose Code Font' ); }
    });

    // use choosen font
    $( '#mm-choose-font-menu-use' ).on( 'click', function(ev) {
      ev.preventDefault();
      $( '.mm-menu-down' ).hide();
      $( '#mm-menu-fonts-down' ).show();
      $( '#'+btpFontToChange + ' input' ).val( _familyAndFallback( fontFamilyList[fontFamilyListSelected] ) );
      _btpFontsUsedFromHTML();
      _updateFontsHTML();
    });

    // dont use choosen font
    $( '#mm-choose-font-menu-cancel' ).on( 'click', function(ev) {
      ev.preventDefault();
      $( '.mm-menu-down' ).hide();
      $( '#mm-menu-fonts-down' ).show();
    });

    // choose font
    $( '#mm-font-subset-select' ).on( 'change', 'select', _updateFontsSubsets );
    $( '#mm-font-category-select' ).on( 'click', '.mm-font-category', _updateFontsCategory );
    $( '#mm-font-family-select' ).on( 'click', '.mm-font-family-count', _updateFontsFamilyCount );
    $( '#mm-font-family-select' ).on( 'click', '.mm-font-family-goto', _updateFontsFamilyGoto );
    $( '#mm-font-family-list' ).on( 'click', '.mm-font-family', _updateFontsFamily );
    $( '#mm-font-example-text' ).on( 'keyup', _updateFontsExample );
    $( '#mm-font-info-size' ).on( 'click', '.mm-font-example-size', _updateFontsExampleSize );

    // show info about color (popup)
    $( '.mm-color-view' ).on( 'click', function(ev) {
      ev.preventDefault();
      _descriptionPopup( $(this), ev );
    });

    // show help
    $( '.mm-menu-help' ).on( 'click', function(ev) {
      ev.preventDefault();
      _helpPopup( ev );
    });

  } // _bindEvents


/* ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 * start of backbone refactor  TODO
 * ----------------------------------------------------------------------------
 * ----------------------------------------------------------------------------
 * ---------------------------------------------------------------------------- */


/* ----------------------------------------------------------------------------
 * global data model
 * ---------------------------------------------------------------------------- */
  var GlobalBB = Backbone.Model.extend({
    defaults: {
      // base color
      // TODO
      // brand color
      // TODO
      // typography
      baseFont: 'Helvetica, sans-serif',
      codeFont: 'Courier New, monospace',
      fontSize: 14, // px
      padding: 6, // px
      borderRadius: 4, // px
      // passing parameters from typo to font
      fontToChange: undefined,
    },

    setFont: function( font ) {
      if ( this.get('fontToChange') === 'base' ) this.set( 'baseFont', font );
      if ( this.get('fontToChange') === 'code' ) this.set( 'codeFont', font );
      this.set( 'fontToChange', undefined );
    },

    setFontSize: function( value ) {
      value += this.get('fontSize');
      if( value > 30) value = 30;
      if( value < 6) value = 6;
      this.set( 'fontSize', value );
    },

    setPadding: function( value ) {
      value += this.get( 'padding' );
      if( value > 30) value = 30;
      if( value < 2) value = 2;
      this.set( 'padding', value );
    },

    setBorderRadius: function( value ) {
      value += this.get( 'borderRadius' );
      if( value > 30) value = 30;
      if( value < 0) value = 0;
      this.set( 'borderRadius', value );
    },

    setDefaultsTypo: function() {
      this.set( 'baseFont', this.defaults.baseFont );
      this.set( 'codeFont', this.defaults.codeFont );
      this.set( 'fontSize', this.defaults.fontSize );
      this.set( 'padding', this.defaults.padding );
      this.set( 'borderRadius', this.defaults.borderRadius );
    },

  });


/* ----------------------------------------------------------------------------
 * main title
 * ---------------------------------------------------------------------------- */
  var MainTitleViewBB = Backbone.View.extend({
    id: 'main-title-container',

    // render title
    templateTitle: _.template(
      '<div class="title-line">' +
        '<span class="label" id="menu-drag"> <%= title %> </span>' +
        '<span class="version"> (ver. <%= version %> ) </span>' +
        '<span class="help"> &nbsp;?&nbsp; </span>' +
      '</div>'
    ),

    // render
    render: function() {
      this.$el.empty();
      var html = this.templateTitle({ title: title, version: version });
      this.$el.append( html );
    },
  });


/* ----------------------------------------------------------------------------
 * main menu
 * ---------------------------------------------------------------------------- */
  var MainMenuViewBB = Backbone.View.extend({
    id: 'main-menu-container',

    events: {
      'click #menu-file': 'selectFile',
      'click #menu-color': 'selectColor',
      'click #menu-brand': 'selectBrand',
      'click #menu-typo': 'selectTypo',
    },

    selectFile: function(ev){
      this.$el.hide();
      $('#file-menu-container').show();
    },

    selectColor: function(ev){
      this.$el.hide();
      $('#base-menu-container').show();
    },

    selectBrand: function(ev){
      this.$el.hide();
      $('#brand-menu-container').show();
    },

    selectTypo: function(ev){
      this.$el.hide();
      $('#typo-menu-container').show();
    },

    // menu
    templateMenu: _.template(
      '<div class="menu-line">' +
        '<span class="menu-button" id="menu-file">File</span>' +
        '<span class="menu-button" id="menu-color">Base Colors</span>' +
        '<span class="menu-button" id="menu-brand">Brand Colors</span>' +
        '<span class="menu-button" id="menu-typo">Typography</span>' +
      '</div>'
    ),

    // render
    render: function() {
      this.$el.empty();
      var html = this.templateMenu();
      this.$el.append( html );
    },
  });


/* ----------------------------------------------------------------------------
 * file menu
 * ---------------------------------------------------------------------------- */
  var FileMenuViewBB = Backbone.View.extend({
    title: 'File',
    id: 'file-menu-container',

    events: {
      'click .buttons-line .cancel': 'selectCancel',
    },

    selectCancel: function(ev){
      this.$el.hide();
      $('#main-menu-container').show();
    },

    // render title
    templateTitle: _.template(
      '<div class="title-line">' +
        '<span class="title"> <%= text %> </span>' +
      '</div>'
    ),
    renderTitle: function(){
      var html = this.templateTitle({ text: this.title });
      this.$el.append( html );
    },

    // render buttons
    templateButtons: _.template(
      '<div class="buttons-line">' +
        '<span class="button cancel">Cancel</span>' +
      '</div>'
    ),
    renderButtons: function(){
      var html = this.templateButtons();
      this.$el.append( html );
    },

    // render
    render: function() {
      this.$el.empty();
      this.renderTitle();
      this.renderButtons();
    },
  });


/* ----------------------------------------------------------------------------
 * choose one color, used for base and brand color
 * ---------------------------------------------------------------------------- */
  var ColorBB = Backbone.Model.extend({
    defaults: {
      label: 'Label',
      showH: true,
      showS: true,
      showL: true,
      tiny: tinycolor('#ccc'),
    },
  });

  var ColorViewBB = Backbone.View.extend({
    className: 'color-line',

    // ---------- event handlers ----------------------------------------------
    events: {
      'click .buttonH': 'selectButtonH',
      'click .buttonS': 'selectButtonS',
      'click .buttonL': 'selectButtonL',
    },

    // TODO: on color-view change  update model tiny

    selectButtonH: function(ev){
      this.model.set( 'showH', !this.model.get('showH') );
      this.render();
    },

    selectButtonS: function(ev){
      this.model.set( 'showS', !this.model.get('showS') );
      this.render();
    },

    selectButtonL: function(ev){
      this.model.set( 'showL', !this.model.get('showL') );
      this.render();
    },


    // ---------- render functions --------------------------------------------
    // template
    template: _.template(
      '<span class="label"> <%= label %> </span>' +
      '<span class="buttonH" clicked= <%= showH %> > H </span>' +
      '<span class="buttonS" clicked= <%= showS %> > S </span>' +
      '<span class="buttonL" clicked= <%= showL %> > L </span>' +
      '<input class="color-view" type="text" readonly data-color-format="hsl">'
    ),

    updateColor: function() {
      var input = this.$( '.color-view' );
      var hsl = this.model.get('tiny').toHsl();
      var back = tinycolor( hsl ).toHslString();
      var txt = tinycolor.mostReadable( hsl, ['#000', '#fff'] ).toHslString();
      input.css( {'background-color': back, 'color': txt} ).val( back );
    },

    showSliders: function() {
      // remove sliders if exists
      var sliders = this.$( '.cp-container' );
      if ( sliders.length ) {
        sliders.remove();
      }
      // check which of HSL is pressed
      var cporder = {};
      if (this.model.get('showH')) $.extend( cporder, {hslH: 1} );
      if (this.model.get('showS')) $.extend( cporder, {hslS: 2} );
      if (this.model.get('showL')) $.extend( cporder, {hslL: 3} );
      // show sliders
      if ( cporder !== {} ) {
        var cview = this.$( '.color-view' );
        var bc = cview.css( 'background-color' );
        var params = $.extend( {color: bc, order: cporder }, cpDefault );
        cview.ColorPickerSliders( params );
      }
    },

    // render
    render: function(){
      var html = this.template( this.model.toJSON() );
      this.$el.html( html );
      this.updateColor();
      this.showSliders();
      return this;
    },
  });


/* ----------------------------------------------------------------------------
 * choose base color
 * ---------------------------------------------------------------------------- */
  var BaseColorBB = Backbone.Collection.extend({
    // standard backbone model
    model: ColorBB,

  });

  var BaseColorViewBB = Backbone.View.extend({
    title: 'Base Colors',
    id: 'base-menu-container',

    // ---------- event handlers ----------------------------------------------
    events: {
      'click .buttons-line .close': 'selectClose',
    },

    selectClose: function(ev){
      this.$el.hide();
      $('#main-menu-container').show();
    },

    // ---------- render functions --------------------------------------------
    // render title
    templateTitle: _.template(
      '<div class="title-line">' +
        '<span class="title"> <%= text %> </span>' +
      '</div>'
    ),
    renderTitle: function(){
      var html = this.templateTitle({ text: this.title });
      this.$el.append( html );
    },

    renderCollection: function(){
      this.collection.forEach( function( color ) {
        var colorView = new ColorViewBB({ model: color });
        this.$el.append( colorView.render().el );
      }, this );
    },

    // render buttons
    templateButtons: _.template(
      '<div class="buttons-line">' +
        '<span class="button defaults">Defaults</span>' +
        '<span class="button update">Update</span>' +
        '<span class="button close">Close</span>' +
      '</div>'
    ),
    renderButtons: function(){
      var html = this.templateButtons();
      this.$el.append( html );
    },

    // render all
    render: function(){
      this.$el.empty();
      this.renderTitle();
      this.renderCollection();
      this.renderButtons();
    },
  });


/* ----------------------------------------------------------------------------
 * choose brand color
 * ---------------------------------------------------------------------------- */
  var BrandColorBB = Backbone.Collection.extend({
    // standard backbone model
    model: ColorBB,

  });

  var BrandColorViewBB = Backbone.View.extend({
    title: 'Brand Colors',
    id: 'brand-menu-container',

    // ---------- event handlers ----------------------------------------------
    events: {
      'click .buttons-line .close': 'selectClose',
    },

    selectClose: function(ev){
      this.$el.hide();
      $('#main-menu-container').show();
    },

    // ---------- render functions --------------------------------------------
    // render title
    templateTitle: _.template(
      '<div class="title-line">' +
        '<span class="title"> <%= text %> </span>' +
      '</div>'
    ),
    renderTitle: function(){
      var html = this.templateTitle({ text: this.title });
      this.$el.append( html );
    },


    // render buttons
    templateButtons: _.template(
      '<div class="buttons-line">' +
        '<span class="button defaults">Defaults</span>' +
        '<span class="button update">Update</span>' +
        '<span class="button close">Close</span>' +
      '</div>'
    ),
    renderButtons: function(){
      var html = this.templateButtons();
      this.$el.append( html );
    },

    // render all
    render: function(){
      this.$el.empty();
      this.renderTitle();

      this.renderButtons();
    },
  });


/* ----------------------------------------------------------------------------
 * choose typography
 * ---------------------------------------------------------------------------- */
  var TypographyBB = Backbone.Model.extend({
    defaults: {
      example: 'this is sample text; abcd ABCD 1480 #$%&/()[]{}@',
    },
  });

  var TypographyViewBB = Backbone.View.extend({
    title: 'Typography',
    id: 'typo-menu-container',

    // ---------- event handlers ----------------------------------------------
    events: {
      'click .choose-font-line .button-base': 'selectBase',
      'click .choose-font-line .button-code': 'selectCode',
      'click .parameters-line .button-fs': 'selectFontSize',
      'click .parameters-line .button-pd': 'selectPadding',
      'click .parameters-line .button-br': 'selectBorderRadius',
      'keyup .examples-line div span': 'selectExampleText',
      'click .buttons-line .defaults': 'selectDefaults',
      'click .buttons-line .close': 'selectClose',
    },

    selectBase: function(ev){
      this.$el.hide();
      this.globalModel.set( 'fontToChange', 'base' );
      $('#choose-font-container').show();
    },

    selectCode: function(ev){
      this.$el.hide();
      this.globalModel.set( 'fontToChange', 'code' );
      $('#choose-font-container').show();
    },

    selectFontSize: function(ev){
      this.globalModel.setFontSize( $(ev.target).data('fontsize') );
    },

    selectPadding: function(ev){
      this.globalModel.setPadding( $(ev.target).data('padding') );
    },

    selectBorderRadius: function(ev){
      this.globalModel.setBorderRadius( $(ev.target).data('bradius') );
    },

    selectExampleText: function(ev){
      var value = $(ev.target).html();
      this.example = value;
      // update other lines, current line must be excluded to preserve cursor position
      $('#typo-menu-container .examples-line div span').not(ev.target).html(value);
    },

    selectDefaults: function(ev){
      this.globalModel.setDefaultsTypo();
    },

    selectClose: function(ev){
      this.$el.hide();
      $('#main-menu-container').show();
    },

    // ---------- render functions --------------------------------------------
    // render title
    templateTitle: _.template(
      '<div class="title-line">' +
        '<span class="title"> <%= text %> </span>' +
      '</div>'
    ),
    renderTitle: function(){
      var html = this.templateTitle({ text: this.title });
      this.$el.append( html );
    },

    // render choose font
    templateChooseFont: _.template(
      '<div class="choose-font-line">' +
        '<span class="label"> Base Font: </span>' +
        '<span class="button-base"> <%= baseFont %> </span>' +
        '<span class="label"> Code Font: </span>' +
        '<span class="button-code"> <%= codeFont %> </span>' +
      '</div>'
    ),
    renderChooseFont: function(){
      var baseFont = this.globalModel.get('baseFont');
      var codeFont = this.globalModel.get('codeFont');
      var html = this.templateChooseFont({ baseFont: baseFont, codeFont: codeFont });
      this.$el.append( html );
    },

    // render parameters
    templateParameters: _.template(
      '<div class="parameters-line">' +
        '<span class="label-fs"> Font Size: </span>' +
        '<span class="info"> <%= fontSize %>px </span>' +
        '<span class="button-fs" data-fontsize="-1"> - </span>' +
        '<span class="button-fs" data-fontsize="1"> + </span>' +
        '<span class="label-pd"> Padding: </span>' +
        '<span class="info"> <%= padding %>px </span>' +
        '<span class="button-pd" data-padding="-1"> - </span>' +
        '<span class="button-pd" data-padding="1"> + </span>' +
        '<span class="label-br"> Border Radius: </span>' +
        '<span class="info"> <%= borderRadius %>px </span>' +
        '<span class="button-br" data-bradius="-1"> - </span>' +
        '<span class="button-br" data-bradius="1"> + </span>' +
      '</div>'
    ),
    renderParameters: function(){
      var fontSize = this.globalModel.get( 'fontSize' );
      var padding = this.globalModel.get( 'padding' );
      var borderRadius = this.globalModel.get( 'borderRadius' );
      var html = this.templateParameters({ fontSize: fontSize, padding: padding, borderRadius: borderRadius });
      this.$el.append( html );
    },

    // render examples
    templateExamples: _.template(
      '<div class="examples-line">' +
        '<span class="label"> <%= label %>: </span>' +
        '<div style="font-family: <%= font %>; font-size: <%= fs %>px;' +
              'padding: <%= pd %>px <%= 2*pd %>px; border-radius: <%= br %>px;" >' +
          '<span contenteditable="true"> <%= example %> </span>' +
        '</div>' +
      '</div>'
    ),
    renderExamples: function( label ){
      var parameters = { label: label, example: this.model.get('example') };
      if ( label === 'Code' ) {
        _.extend( parameters, { font: this.globalModel.get('codeFont') });
      } else {
        _.extend( parameters, { font: this.globalModel.get('baseFont') });
      }
      var fs = this.globalModel.get('fontSize');
      var pd = this.globalModel.get('padding');
      var br = this.globalModel.get('borderRadius');
      if ( label === 'Small' ) {
        fs = Math.floor( fs * 0.85 );
        pd = Math.floor( pd * 0.80 );
        br = Math.floor( br * 0.75 );
      }
      if ( label === 'Large' ) {
        fs = Math.ceil( fs * 1.25 );
        pd = Math.ceil( pd * 1.3333 );
        br = Math.ceil( br * 1.5 );
      }
      _.extend( parameters, { fs: fs, pd: pd, br: br });
      var html = this.templateExamples( parameters );
      this.$el.append( html );
    },

    // render buttons
    templateButtons: _.template(
      '<div class="buttons-line">' +
        '<span class="button defaults">Defaults</span>' +
        '<span class="button close">Close</span>' +
      '</div>'
    ),
    renderButtons: function(){
      var html = this.templateButtons();
      this.$el.append( html );
    },

    // render all
    render: function(){
      this.$el.empty();
      this.renderTitle();
      this.renderChooseFont();
      this.renderParameters();
      this.renderExamples( 'Small' );
      this.renderExamples( 'Base' );
      this.renderExamples( 'Large' );
      this.renderExamples( 'Code' );
      this.renderButtons();
    },
  });


/* ----------------------------------------------------------------------------
 * choose font
 * ---------------------------------------------------------------------------- */
  var FontFamilyBB = Backbone.Model.extend({
    defaults: {
      family: '',
      category: '',
      subsets: [],
      kind: false
    },
  }); // FontFamilyBB

  //
  var FontFamilyListBB = Backbone.Collection.extend({
    // standard backbone model
    model: FontFamilyBB,
    // for this view
    categoryFilters: [],
    categorySelected: 0,
    subsetFilters: [],
    subsetSelected: 0,
    filtered: [],

    initialize: function(){
      this.initFilters();
    },

    initFilters: function(){
      this.reset( fontFamilyList );
      this.categoryFilters = fontFamilyList.reduce(
        function(result, element){ return _.union( result, [element.category] ); }, ['all']
      );
      this.subsetFilters = fontFamilyList.reduce(
        function(result, element){ return _.union( result, element.subsets ); }, ['all']
      );
      this.filterFonts();
    },

    filterFonts: function(){
      this.filtered = [];
      this.each( function(element, index){
        if ( this.categorySelected === 0 ||
              element.attributes.category === this.categoryFilters[this.categorySelected] ) {
          if ( this.subsetSelected === 0 ||
                element.attributes.subsets.indexOf( this.subsetFilters[this.subsetSelected] ) !== -1 ) {
            this.filtered.push(index);
          }
        }
      }, this); // each function, this context
    },

    onePage: function(first, count){
      var page = new Backbone.Collection({ model: FontFamilyBB });
      page.reset();
      for ( var i = first; i < first+count; i++ ) {
        page.add( this.at( this.filtered[i] ), {silent:true} );
      }
      return page;
    },

  }); // FontFamilyListBB

  //
  var FontFamilyListViewBB = Backbone.View.extend({
    id: 'choose-font-container',
    // pagination
    first: 0,
    count: 8,
    selected: 0,
    // example
    familyLineText: 'abcde ABCDE 67890',
    exampleText: 'abc def ghi jkl mno pqr stu vw xyz ABC DEF GHI JKL MNO PQR STU VW XYZ 123 456 7890',
    exampleTextSize: 36,
    exampleBold: false,
    exampleItalic: false,
    // result
    todoFont: undefined,

    // ---------- event handlers ----------------------------------------------
    events: {
      'change .select-line .Category': 'selectCategory',
      'change .select-line .Subset': 'selectSubset',
      'click .family-line .family': 'selectFamily',
      'keyup .family-line .example': 'selectFamilyLineText',
      'click .paginator-line .button': 'selectPage',
      'click .paginator-line .button-pp': 'selectPageSize',
      'click .example-line .button-bold': 'selectFontBold',
      'click .example-line .button-italic': 'selectFontItalic',
      'click .example-line .button-fs': 'selectFontSize',
      'keyup .example-line #example-edit': 'selectExampleText',
      'click .buttons-line .use': 'selectUse',
      'click .buttons-line .cancel': 'selectCancel',
    },

    selectCategory: function(ev){
      var value = parseInt( $(ev.target).val() );
      this.collection.categorySelected = value;
      this.collection.filterFonts();
      this.first = 0;
      this.render();
    },

    selectSubset: function(ev){
      var value = parseInt( $(ev.target).val() );
      this.collection.subsetSelected = value;
      this.collection.filterFonts();
      this.first = 0;
      this.render();
    },

    selectFamily: function(ev){
      var value = $(ev.target).data('index');
      this.selected = this.first + value;
      this.render();
    },

    selectFamilyLineText: function(ev){
      var value = $(ev.target).html();
      this.familyLineText = value;
      // update other lines, current line must be excluded to preserve cursor position
      $('#choose-font-container .family-line .example').not(ev.target).html(value);
    },

    selectPage: function(ev){
      var value = $(ev.target).data('goto');
      this.first += value * this.count;
      var maxFirst = this.collection.filtered.length - this.count;
      if( this.first > maxFirst) this.first = maxFirst;
      if( this.first < 0 ) this.first = 0;
      this.render();
    },

    selectPageSize: function(ev){
      var value = $(ev.target).data('perpage');
      this.count += value;
      if( this.count > 20) this.count = 20;
      if( this.count < 4 ) this.count = 4;
      this.render();
    },

    selectFontSize: function(ev){
      var value = $(ev.target).data('fontsize');
      this.exampleTextSize += value;
      if( this.exampleTextSize > 60) this.exampleTextSize = 60;
      if( this.exampleTextSize < 6 ) this.exampleTextSize = 6;
      this.render();
    },

    selectFontBold: function(ev){
      var button = $(ev.target);
      var example = $( '#example-edit');
      this.exampleBold = !this.exampleBold;
      if ( this.exampleBold ) {
        button.attr( 'clicked', true);
        example.css( 'font-weight', 'bold' );
      } else {
        button.attr( 'clicked', false);
        example.css( 'font-weight', 'normal' );
      }
    },

    selectFontItalic: function(ev){
      var button = $(ev.target);
      var example = $( '#example-edit');
      this.exampleItalic = !this.exampleItalic;
      if ( this.exampleItalic ) {
        button.attr( 'clicked', true);
        example.css( 'font-style', 'italic' );
      } else {
        button.attr( 'clicked', false);
        example.css( 'font-style', 'normal' );
      }
    },

    selectExampleText: function(ev){
      var value = $(ev.target).html();
      this.exampleText = value;
    },

    selectUse: function(ev){
      this.$el.hide();
      var index = this.collection.filtered[ this.selected ];
      var font = this.collection.at( index ).get( 'family' );
      this.globalModel.setFont( font );
      $('#typo-menu-container').show();
    },

    selectCancel: function(ev){
      this.$el.hide();
      this.globalModel.set( 'fontToChange', undefined );
      $('#typo-menu-container').show();
    },

    // ---------- render functions --------------------------------------------
    // title
    templateTitle: _.template(
      '<div class="title-line">' +
      '<span class="title"> <%= text %> </span>' +
      '</div>'
    ),
    renderTitle: function(){
      var title = 'Choose Font';
      if ( this.globalModel.get('fontToChange') === 'base' ) title = 'Choose Base Font';
      if ( this.globalModel.get('fontToChange') === 'code' ) title = 'Choose Code Font';
      var html = this.templateTitle({ text: title });
      this.$el.append( html );
    },

    // selector
    templateSelect: _.template(
      '<div class="select-line">' +
      '<span class="label"> Category: </span>' +
      '<select class="Category" >' +
      '<% for( var i = 0; i < valCat.length; ++i ) print( "<option value=" + i + ((i==selCat)?" selected>":" >") + valCat[i]+ "</option>" ); %>' +
      '</select>' +
      '<span class="label"> Subset: </span>' +
      '<select class="Subset" >' +
      '<% for( var i = 0; i < valSub.length; ++i ) print( "<option value=" + i + ((i==selSub)?" selected>":" >") + valSub[i]+ "</option>" ); %>' +
      '</select>' +
      '</div>'
    ),
    renderSelect: function(){
//    renderSelect: function(name, values, selected){
      var valCat = this.collection.categoryFilters;
      var selCat = this.collection.categorySelected;
      var valSub = this.collection.subsetFilters;
      var selSub = this.collection.subsetSelected;
      var html = this.templateSelect({ valCat: valCat, selCat: selCat, valSub: valSub, selSub: selSub });
      this.$el.append( html );
    },

    // font family select line
    templateFamilyLine: _.template(
      '<div class="family-line">' +
      '<span class="family" data-index= <%= index %> > <%= family %> </span>' +
      '<span class="example" contenteditable="true" style="font-family: <%= family %>"> <%= text %> </span>' +
      '</div>'
    ),
    renderFamilyLine: function(element, index){
      var kind = element.get('kind');
      var family = element.get('family');
      if ( kind ) WebFont.load({ google: { families: [family] }});
      var html = this.templateFamilyLine({ family: family, index: index, text: this.familyLineText });
      this.$el.append( html );
    },

    // paginator
    templatePaginator: _.template(
      '<div class="paginator-line">' +
      '<span class="label"> <%= displayed %> </span>' +
      '<span class="button" data-goto="-9999"> First </span>' +
      '<span class="button" data-goto="-1"> Prev </span>' +
      '<span class="button" data-goto="1"> Next </span>' +
      '<span class="button" data-goto="9999"> Last </span>' +
      '<span class="label-pp"> <%= perPage %> </span>' +
      '<span class="button-pp" data-perpage="-2"> - </span>' +
      '<span class="button-pp" data-perpage="2"> + </span>' +
      '</div>'
    ),
    renderPaginator: function(){
      var length = this.collection.filtered.length;
      var displayed = 'Font: ' + (this.first+1) + ' to ' + (this.first+this.count) + ' of ' + length;
      var perPage = 'PerPage: ' + this.count;
      var html = this.templatePaginator({ displayed: displayed, perPage: perPage });
      this.$el.append( html );
    },

    // example description
    templateExample: _.template(
      '<div class="example-line">' +
        '<span class="label"> Preview Selected: </span>' +
        '<span class="label-sel"> <%= font %> </span>' +
        '<span class="button-bold" style="font-weight: bolder"> B </span>' +
        '<span class="button-italic" style="font-style: italic"> I </span>' +
        '<span class="label-fs"> Size: <%= fontSize %>px </span>' +
        '<span class="button-fs" data-fontsize="-6"> - </span>' +
        '<span class="button-fs" data-fontsize="6"> + </span>' +
      '</div>' +
      '<div class="example-line">' +
        '<span id="example-edit" contenteditable="true" style="font-size: <%= fontSize %>px; font-family: <%= font %>"> <%= text %> </span>' +
      '</div>'
    ),
    renderExample: function(){
      var index = this.collection.filtered[ this.selected ];
      var font = this.collection.at( index ).get( 'family' );
      var html = this.templateExample({ font: font, fontSize: this.exampleTextSize, text: this.exampleText });
      this.$el.append( html );
    },

    // buttons
    templateButtons: _.template(
      '<div class="buttons-line">' +
        '<span class="button use">Use</span>' +
        '<span class="button cancel">Cancel</span>' +
      '</div>'
    ),
    renderButtons: function(){
      var html = this.templateButtons();
      this.$el.append( html );
    },

    // render all
    render: function(){
      this.$el.empty();
      this.renderTitle();
      this.renderSelect();
      this.collection.onePage( this.first, this.count ).each( this.renderFamilyLine, this ); // render each with this context
      this.renderPaginator();
      this.renderExample();
      this.renderButtons();
    },
  }); // FontFamilyListViewBB


/* ----------------------------------------------------------------------------
 * main
 * ---------------------------------------------------------------------------- */
  var _main = function() {
    var btpPopupContainer = '#mm-test';

    // common model, used by all views
    var global = new GlobalBB();

    var titleView = new MainTitleViewBB();
    titleView.render();
    titleView.$el.appendTo( btpPopupContainer );

    var menuView = new MainMenuViewBB();
    menuView.render();
    menuView.$el.appendTo( btpPopupContainer );

    var fileView = new FileMenuViewBB();
    fileView.globalModel = global;
    fileView.render();
    fileView.$el.hide().appendTo( btpPopupContainer );

    var base = new BaseColorBB();
    // le za test
    var c1 = new ColorBB({ label: 'Ena', tiny: tinycolor('#36c') });
    base.add(c1);
    var c2 = new ColorBB({ label: 'Dva', tiny: tinycolor('#93c') });
    base.add(c2);
    var c3 = new ColorBB({ label: 'Tri', tiny: tinycolor('#9cf') });
    base.add(c3);
    // konec le za test
    var baseView = new BaseColorViewBB({ collection: base });
    baseView.globalModel = global;
    baseView.render();
    baseView.$el.hide().appendTo( btpPopupContainer );
    // TODO

    var brand = new BrandColorBB();
    var brandView = new BrandColorViewBB({ collection: brand });
    brandView.globalModel = global;
    brandView.render();
    brandView.$el.hide().appendTo( btpPopupContainer );
    // TODO

    var typo = new TypographyBB();
    var typoView = new TypographyViewBB({ model: typo });
    typoView.globalModel = global;
    global.on( 'change:baseFont change:codeFont change:fontSize change:padding change:borderRadius',
      typoView.render, typoView );
    typoView.render();
    typoView.$el.hide().appendTo( btpPopupContainer );

    var font = new FontFamilyListBB();
    var fontView = new FontFamilyListViewBB({ collection: font });
    fontView.globalModel = global;
    global.on( 'change:fontToChange', fontView.render, fontView );
    fontView.render();
    fontView.$el.hide().appendTo( btpPopupContainer );
    $.getJSON( googleFontsURL, function(result, status) {
      if( status === 'success' ) {
        fontFamilyList = [].concat( fontFamilyListInit, result.items );
        fontView.collection.initFilters();
        fontView.render();
      }
    });

    var konec = 0;  // potem zbrisi, to je le za debugger
  };

  $(document).ready( function() {
    _showPopover();
    _bindEvents();

    _main();
  });

}(); // PopupMenu

