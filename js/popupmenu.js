
(function($) {
  'use strict';

  $.fn.PopupMenu = function(options) {

      var
        title = 'Bootstrap Theme Playground',
        settings,
        // can not use false or 0, because it can be a legal value
        empty = 'E',
        // default color (use whenever there is no user choosen value))
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
          { proc: 100, init: {h: empty, s: empty, l: 0.999}, used: {}, calc: {} },
          { proc:  96, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  92, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  88, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  80, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  60, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  50, init: {h: 180,   s: 0.6,   l: empty}, used: {}, calc: {} },
          { proc:  32, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  26, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  20, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:  12, init: {h: empty, s: empty, l: empty}, used: {}, calc: {} },
          { proc:   0, init: {h: empty, s: empty, l: 0.001}, used: {}, calc: {} }
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

      // working
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
      }; // _initSettings

      function _showPopover() {
        // create and display main menu
        $('<div id="mm-menu-main"></div>').appendTo('body').html( _getControllerHtml() );
        // make menu draggable inside browser window
        $( '#mm-menu-main' ).draggable({
          handle: '#mm-menu-drag',
          containment: 'window'
        });
        // init colors & sliders
        _btpUpdateUsedFromInit();
        _btpColorsCalculate();
        _updateColorsHTML();
        _updateSlidersHTML();
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

      function _updateSlidersHTML() {
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
        } // updateSlidersHTML

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

      function _updateColorsHTML() {
        for (var i = 0; i < btpColors.length; i++) {
          var color_input = $( '#mm-color-edit-' + btpColors[i].proc + ' .mm-color-view' );
          var color_hsl = tinycolor( btpColors[i].calc ).toHsl();
          var color_back = tinycolor( color_hsl ).toHslString();
          var color_txt = tinycolor.mostReadable( color_hsl, ['#000', '#fff'] ).toHslString();
          color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
        }
      } // _updateColorsHTML

      function _btpUpdateUsedFromInit() {
        for ( var i=0; i < btpColors.length; i++ ) {
          // must use Object.create to get a copy, otherwise just pointer
          btpColors[i].used = Object.create( btpColors[i].init );
        }
      } // _btpUpdateUsedFromInit

      function _updateUsedFromHTML() {
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
            var s = color.toHsl().s
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
      } // _updateUsedFromHTML

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
          btpColors[i].calc.h = (_btpColorsPoint( pts_h, btpDefaultH, btpColors[i].proc ) + 360) % 360;
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
        var r;
        if( points.length == 0 ) {
          r = default_y;
        } else if ( points.length == 1 ) {
          r = points[0].y;
        } else {
          var i = 0;
          do {
            var p0 = points[i];
            var p1 = points[i+1];
            i++;
          } while ( x < p1.x && i < points.length-1 );
          var a = (p1.y - p0.y) / (p1.x - p0.x);
          var b = p0.y - a * p0.x;
          r = a * x + b;
        }
        return r;
      } // _btpColorsPoint

      function _onColorChange(container, color) {
      } // _onColorChange

      function _bindEvents() {
        // open clicked drop down menu and close all others
        $( '.mm-menu-top' ).on( 'click', function(ev) {
          ev.preventDefault();
          $( '.mm-menu-top+div' ).hide();
          $( this ).next().show();
        });

        // reset colors and sliders to default
        $( '#mm-menu-color-defaults' ).on( 'click', function(ev) {
          ev.preventDefault();
          _btpUpdateUsedFromInit();
          _btpColorsCalculate();
          _updateColorsHTML();
          _updateSlidersHTML();
        });

        // update colors
        $( '#mm-menu-color-update' ).on( 'click', function(ev) {
          ev.preventDefault();
          _updateUsedFromHTML();
          _btpColorsCalculate();
          _updateColorsHTML();
          _updateSlidersHTML();
        });

        // close colors drop down
        $( '#mm-menu-color-close' ).on( 'click', function(ev) {
          ev.preventDefault();
          $( '.mm-menu-top+div' ).hide();
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

      // never used, but just in case I need it again it is still here
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

      // never used, but just in case I need it again it is still here
      function _mixRGB( pmix, rgb_1, proc1, rgb_2, proc2 ) {
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

  }; // PopupMenu

})(jQuery);



// ----- main -----------------------------------------------------------------
$( document ).ready(function() {

  $().PopupMenu();

}); // ----- end of document ready --------------------------------------------



