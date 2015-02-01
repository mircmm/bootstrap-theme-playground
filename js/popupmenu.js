

(function($) {
  'use strict';

  $.fn.PopupMenu = function(options) {

//    return this.each(function() {

      var
        title = 'Bootstrap Theme Playground',
        settings,
        popoverContainer,
        // default color (just in case user fucked-up and we need a value)
        btpDefaultHSL= { h: 180, s: 0.5, l: 0.5 },
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
        // defaults for color menu
        cm_default_base = tinycolor('hsl(180, 50%, 50%)'),
        // percents and default hsl buttons
        cm_proc_array = [
          {p: 100, h: false, s: false, l: true},
          {p:  96, h: false, s: false, l: false},
          {p:  92, h: false, s: false, l: false},
          {p:  88, h: false, s: false, l: false},
          {p:  80, h: false, s: false, l: false},
          {p:  60, h: false, s: false, l: false},
          {p:  50, h: true,  s: false, l: false},
          {p:  32, h: false, s: false, l: false},
          {p:  26, h: false, s: false, l: false},
          {p:  20, h: false, s: false, l: false},
          {p:  12, h: false, s: false, l: false},
          {p:   0, h: false, s: false, l: true}
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
        // init btpColors table
        for ( var i=0; i < btpColors.length; i++ ) {
          btpColors[i].used = btpColors[i].init;
          btpColors[i].calc = btpDefaultHSL;
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
        for (var i = 0; i < cm_proc_array.length; i++) {
          colors_html +=
            '<div id="mm-color-edit-' + cm_proc_array[i].p + '" class="mm-color-line">' +
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
        for (var i = 0; i < cm_proc_array.length; i++) {
          var proc = cm_proc_array[i];
          var line = $( '#mm-color-edit-' + proc.p );
          if ( proc.h ) {
            line.find( '.mm-color-H' ).attr( 'show-slider', true );
          } else {
            line.find( '.mm-color-H' ).removeAttr( 'show-slider' );
          };
          if ( proc.s ) {
            line.find( '.mm-color-S' ).attr( 'show-slider', true );
          } else {
            line.find( '.mm-color-S' ).removeAttr( 'show-slider' );
          };
          if ( proc.l ) {
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
        for (var i = 0; i < cm_proc_array.length; i++) {
          var color_input = $( '#mm-color-edit-' + cm_proc_array[i].p + ' .mm-color-view' );

          var color_hsl = cm_default_base.toHsl();
          color_hsl.l = cm_proc_array[i].p / 100;

          var color_back = tinycolor( color_hsl ).toHslString();
          var color_txt = tinycolor.mostReadable( color_hsl, ['#000', '#fff'] ).toHslString();
          color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
        }
      } // _updateColorsTable

      function _new_updateColorsTable() {
        // find shown sliders and save index and color
        var usedSliders = [];
        for (var i = 0; i < cm_proc_array.length; i++) {
          var proc = cm_proc_array[i];
          var line = $( '#mm-color-edit-' + proc.p );
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
              _mixHSL ( cm_proc_array[i].p,
              firstSlider, cm_proc_array[firstSlider.i].p,
              lastSlider, cm_proc_array[lastSlider.i].p )
            );

            var color_input = $( '#mm-color-edit-' + cm_proc_array[i].p + ' .mm-color-view' );
            var color_back = tinycolor( mix ).toHslString();
            var color_txt = tinycolor.mostReadable( mix, ['#000', '#fff'] ).toHslString();
            color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );

          }
          firstSlider = lastSlider;
        }

        var konec = 0;
      } // _new_updateColorsTable

      function _btpColorsCalculate() {
        var fh = [], fs = [], fl = [];
        // search for sliders and save values
        for ( var i=0; i < btpColors.length; i++ ) {
          if ( btpColors[i].used.h ) {
            fh.push( { proc: btpColors[i].proc, h: btpColors[i].used.h} );
          };
          if ( btpColors[i].used.s ) {
            fs.push( { proc: btpColors[i].proc, s: btpColors[i].used.s} );
          };
          if ( btpColors[i].used.l ) {
            fl.push( { proc: btpColors[i].proc, l: btpColors[i].used.l} );
          };
        } // for
        // if no sliders used, use default
        if ( fh.length === 0 ) {
          fh.push( { proc: 50, h: btpDefaultHSL.h} );
        };
        if ( fh.length === 0 ) {
          fh.push( { proc: 50, s: btpDefaultHSL.s} );
        };
        if ( fh.length === 0 ) {
          fh.push( { proc: 50, l: btpDefaultHSL.l} );
        };



        for ( var i=0; i < btpColors.length; i++ ) {
          btpColors[i].calc = btpDefaultHSL;
        }
      } // _btpColorsCalculate

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
          _new_updateColorsTable();
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



