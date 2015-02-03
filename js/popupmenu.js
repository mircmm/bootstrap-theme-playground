

(function($) {
  'use strict';

  $.fn.PopupMenu = function(options) {

//    return this.each(function() {

      var
        title = 'Bootstrap Theme Playground',
        settings,
        popoverContainer,
        // default color (use whenever there is no user choosen value))
//        btpDefaultHSL= { h: 180, s: 0.5, l: 0.5 },
        btpDefaultH = 180,
        btpDefaultS = 0.6,
        btpDefaultL = 0.5,
        // colors used in the table (array of objects)
        // proc: 50, // 0..100 (x axis for color mixes)
        // init: {h: false, s: false, l: false}   // startup defaults, false, if slider is hidden or hsl value if shown
        //    or {h: 120, s: 0.5, l: 0.5}
        // used: {h: false, s: false, l: false}   // same as init, updated when user clicks
        // calc: {h: 120, s: 0.5, l: 0.5}         // calculated hsl values
        btpColors = [
          { proc: 100, init: {h: false, s: false, l: 0.999}, used: {}, calc: {} },
          { proc:  96, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  92, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  88, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  80, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  60, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  50, init: {h: 180,   s: false, l: false}, used: {}, calc: {} },
          { proc:  32, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  26, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  20, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:  12, init: {h: false, s: false, l: false}, used: {}, calc: {} },
          { proc:   0, init: {h: false, s: false, l: 0.001}, used: {}, calc: {} }
        ],
        // default sliders options
        cpDefault = {
          previewformat: 'hsl-rgb',
          previewontriggerelement: true,
          rendervalues: true,
          slidersplusminus: true,
          flat: true,
          sliders: true,
          swatches: false,
          hsvpanel: false,
          onchange: _onColorChange
        },
        lastVar;
      // end of variables

      // init
      _initSettings();
      _showPopover();
      _bindEvents();


      function _initSettings() {
        // init options
        if (typeof options === 'undefined') {
          options = {};
        }
        settings = $.extend({
          title: '',
          lastOption: null
        }, options);
        // init btpColors used from init
        for ( var i=0; i < btpColors.length; i++ ) {
          // must use Object.create to get a copy, otherwise just pointer
          btpColors[i].used = Object.create( btpColors[i].init );
        }
        // this is temporary, must be replaced with calculate from used
        for ( var i=0; i < btpColors.length; i++ ) {
          btpColors[i].calc = { btpDefaultH, btpDefaultS, btpDefaultL };
        }
      }; // _initSettings

      function _showPopover() {
        // create and display main menu
        popoverContainer = $('<div id="mm-menu-main"></div>').appendTo('body').html( _getControllerHtml() );
        // init color sliders in colors menu
        _updateColorsTable ();
        // show default sliders
        _initShowSliderButtons();
        $( '.mm-color-line' ).each( function() {
          _showLineSliders( $(this) );
        });
        // make menu draggable inside browser window
        $( '#mm-menu-main' ).draggable({
          handle: '#mm-menu-drag',
          containment: 'window'
        });
      } // showPopover

      function _getControllerHtml() {
        var popup_menu_html = '';
        // dragable top
        popup_menu_html += '<ul>' ;
        popup_menu_html +=
          '<li><span class="mm-menu-title mm-menu-top" id="mm-menu-drag">' + title + '</span></li>';
        popup_menu_html += '</ul>' ;
        // menus
        popup_menu_html += '<ul>' ;
        // file menu
        popup_menu_html +=
          '<li>' +
            '<span class="mm-long-button mm-menu-top" id="mm-menu-file">File</span>' +
            '<div id="mm-menu-file-down">' +
              '<ul>' +
                '<li><span class="mm-long-button" id="mm-menu-file-1">file1</span></li>' +
                '<li><span class="mm-long-button" id="mm-menu-file-2">file2</span></li>' +
              '</ul>' +
            '</div>' +
          '</li>';
        // color menu
        popup_menu_html +=
          '<li>' +
            '<span class="mm-long-button mm-menu-top" id="mm-menu-color">Color</span>' +
            '<div id="mm-menu-color-down">' +
              _getColorsTable() +
              '<ul>' +
                '<li><span class="mm-long-button" id="mm-menu-color-defaults">Defaults</span></li>' +
                '<li><span class="mm-long-button" id="mm-menu-color-update">Colors</span></li>' +
                '<li><span class="mm-long-button" id="mm-menu-color-close">Close</span></li>' +
              '</ul>' +
            '</div>' +
          '</li>';
        // font menu
        popup_menu_html +=
          '<li>' +
            '<span class="mm-long-button mm-menu-top" id="mm-menu-font">Font</span>' +
            '<div id="mm-menu-font-down">' +
              '<ul>' +
                '<li><span class="mm-long-button" id="mm-menu-font-1">font1</span></li>' +
                '<li><span class="mm-long-button" id="mm-menu-font-2">font2</span></li>' +
              '</ul>' +
            '</div>' +
          '</li>';
        // end of menus
        popup_menu_html += '</ul>' ;
        return popup_menu_html;
      } // _getControllerHtml

      function _getColorsTable () {
        var colors_html = '<div id="mm-color-menu-container">';
        // create color edit line for each lightness
        for (var i = 0; i < btpColors.length; i++) {
          colors_html +=
            '<div id="mm-color-edit-' + btpColors[i].proc + '" class="mm-color-line">' +
              '<div class="mm-color-H">H</div>' +
              '<div class="mm-color-S">S</div>' +
              '<div class="mm-color-L">L</div>' +
              '<input type="text" class="mm-color-view" readonly data-color-format="hsl">' +
            '</div>';
        }
        colors_html += '</div>';
        return colors_html;
      } // _getColorsTable

      function _initShowSliderButtons () {
        for (var i = 0; i < btpColors.length; i++) {
          var btpline = btpColors[i];
          var line = $( '#mm-color-edit-' + btpline.proc );
          if ( btpline.used.h ) {
            line.find( '.mm-color-H' ).attr( 'show-slider', true );
          } else {
            line.find( '.mm-color-H' ).removeAttr( 'show-slider' );
          };
          if ( btpline.used.s ) {
            line.find( '.mm-color-S' ).attr( 'show-slider', true );
          } else {
            line.find( '.mm-color-S' ).removeAttr( 'show-slider' );
          };
          if ( btpline.used.l ) {
            line.find( '.mm-color-L' ).attr( 'show-slider', true );
          } else {
            line.find( '.mm-color-L' ).removeAttr( 'show-slider' );
          };
        }
      } // _initShowSliderButtons

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
        if ( new_order !== {}) {
          var color_view = line.find( '.mm-color-view' );
          var bc = color_view.css( 'background-color' );
          var params = $.extend( {color: bc, order: new_order }, cpDefault );
          color_view.ColorPickerSliders( params );
        }
      } // _showLineSliders

      function _updateColorsTable() {
        for (var i = 0; i < btpColors.length; i++) {
          var color_input = $( '#mm-color-edit-' + btpColors[i].proc + ' .mm-color-view' );

          var color_hsl = tinycolor({ h: btpDefaultH, s: btpDefaultS, l: btpDefaultL }).toHsl();
          color_hsl.l = btpColors[i].proc / 100;

          var color_back = tinycolor( color_hsl ).toHslString();
          var color_txt = tinycolor.mostReadable( color_hsl, ['#000', '#fff'] ).toHslString();
          color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
        }
      } // _updateColorsTable

      function _new_updateColorsTable() {
        // find shown sliders and save index and color
        var usedSliders = [];
        for (var i = 0; i < btpColors.length; i++) {
          var line = $( '#mm-color-edit-' + btpColors[i].proc );
          var proc_h = line.find( '.mm-color-H' ).attr( 'show-slider' );
          var proc_s = line.find( '.mm-color-S' ).attr( 'show-slider' );
          var proc_l = line.find( '.mm-color-L' ).attr( 'show-slider' );
          if ( proc_h || proc_s || proc_l ) {
            var bc = line.find( '.mm-color-view' ).css( 'background-color' );
            var hsl = tinycolor( bc ).toHsl();
            usedSliders.push( { i: i, h: hsl.h, s: hsl.s, l: hsl.l } );
          }
        }
        // calculate other colors
        var firstSlider, lastSlider, i, c1, c2, mix;
        firstSlider = usedSliders.shift();
        while ( lastSlider = usedSliders.shift() ) {
          for ( i = firstSlider.i+1; i < lastSlider.i; i++ ) {
            mix = tinycolor (
              _mixHSL ( btpColors[i].proc,
              firstSlider, btpColors[firstSlider.i].proc,
              lastSlider, btpColors[lastSlider.i].proc )
            );
            var color_input = $( '#mm-color-edit-' + btpColors[i].proc + ' .mm-color-view' );
            var color_back = tinycolor( mix ).toHslString();
            var color_txt = tinycolor.mostReadable( mix, ['#000', '#fff'] ).toHslString();
            color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
          }
          firstSlider = lastSlider;
        }
        var konec = 0;
      } // _new_updateColorsTable

      function _slidersToCalc() {
      // scan displayed sliders and save to btpColors[i].used
      // potem popravi update colors table
      } _slidersToCalc

      function _btpColorsCalculate() {
        // sliders (shown by user) === points
        // find and save points to calculate curves
        var pts_h = [], pts_s = [], pts_l = [];
        for ( var i=0; i < btpColors.length; i++ ) {
          if ( btpColors[i].used.h ) {
            pts_h.push( { x: btpColors[i].proc, y: btpColors[i].used.h} );
          };
          if ( btpColors[i].used.s ) {
            pts_s.push( { x: btpColors[i].proc, y: btpColors[i].used.s} );
          };
          if ( btpColors[i].used.l ) {
            pts_l.push( { x: btpColors[i].proc, y: btpColors[i].used.l} );
          };
        } // for
        // now calculate colors using found points
        for ( var i=0; i < btpColors.length; i++ ) {
          btpColors[i].calc.h = _btpColorsPoint( pts_h, btpDefaultH, btpColors[i].proc );
          btpColors[i].calc.s = _btpColorsPoint( pts_s, btpDefaultS, btpColors[i].proc );
          btpColors[i].calc.l = _btpColorsPoint( pts_l, btpDefaultL, btpColors[i].proc );
        }
        var konec = 0;
      } // _btpColorsCalculate

      // help function for _btpColorsCalculate
      // points: array of x, y pairs
      // default_y: y used if array is empty
      // x: calculate y = f(x)
      function _btpColorsPoint(points, default_y, x) {
        // functions to calculate middle values
        // for 2 points, y = a*x + b
        function f2() {
          var x0 = points[0].x;
          var y0 = points[0].y;
          var x1 = points[1].x;
          var y1 = points[1].y;
          var a = (y1 - y0) / (x1 - x0);
          var b = y0 - a * x0;
          var r = a * x + b;
          return r;
        }
        // for 3 points, y = a*x*x + b*x + c
        function f3() {
          return null;
        }
        //
        var r;
        switch( points.length ) {
          case 0:
            r = default_y;
            break;
          case 1:
            r = points[0].y;
            break;
          case 2:
            r = f2();
            break;
          default:
            r = null;
        }
        return r;
      } // _btpColorsPoint

      function _mixHSL( pmix, hsl_1, proc_1, hsl_2, proc_2 ) {
        var w1, w2;
        if ( proc_1 === proc_2 ) {
          w2 = 0.5;
        } else {
          w2 = (pmix - proc_1) / (proc_2 - proc_1);
        }
        w1 = 1 - w2;
        var mix = {
          h: (hsl_1.h * w1 + hsl_2.h * w2),
          s: (hsl_1.s * w1 + hsl_2.s * w2),
          l: (hsl_1.l * w1 + hsl_2.l * w2)
        };
        return mix;
      } // _mixHSL

      function _mixRGB( pmix, rgb_1, proc1, rgb_2, proc2 ) {
      // preveri ce dela
        var w1, w2;
        if ( proc1 === proc2 ) {
          w2 = 0.5;
        } else {
          w2 = (pmix - proc1) / (proc2 - proc1);
        }
        w1 = 1 - w2;
        return {
          r: rgb_1.r * w1 + rgb_2.r * w2,
          g: rgb_1.g * w1 + rgb_2.g * w2,
          b: rgb_1.b * w1 + rgb_2.b * w2
        };
      } // _mixRGB

      function _onColorChange(container, color) {
      } // _onColorChange

      function _bindEvents() {
        // open clicked drop down menu and close all others
        $( '.mm-menu-top' ).on( 'click', function(ev) {
          ev.preventDefault();
          $( '.mm-menu-top+div' ).hide();
          $( this ).next().show();
        });

        // update colors
        $( '#mm-menu-color-update' ).on( 'click', function(ev) {
          ev.preventDefault();
          // _new_updateColorsTable();
          _btpColorsCalculate();
        });

        // close colors drop down
        $( '#mm-menu-color-close' ).on( 'click', function(ev) {
          ev.preventDefault();
          $( '.mm-menu-top+div' ).hide();
        });

        // reset colors and sliders to default
        $( '#mm-menu-color-defaults' ).on( 'click', function(ev) {
          ev.preventDefault();
          _updateColorsTable();
          _initShowSliderButtons();
          $( '.mm-color-line' ).each( function() {
            _showLineSliders( $(this) );
          });
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

      } // _bindEvents

//    }); // this.each

  }; // PopupMenu

})(jQuery);



// ----- main -----------------------------------------------------------------
$( document ).ready(function() {

  $().PopupMenu();

}); // ----- end of document ready --------------------------------------------



