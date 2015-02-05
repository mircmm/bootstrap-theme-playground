
(function($) {
  'use strict';

  $.fn.PopupMenu = function(options) {

      var
        title = 'Bootstrap Theme Playground',
        settings,
        // default color (use whenever there is no user choosen value))
        btpDefaultH = 180,
        btpDefaultS = 0.6,
        btpDefaultL = 0.5,
        // constant for not used (can not use false or 0, because it can be a legal value)
        empty = 'E',
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
        // bootstrap color descriptions for _colorViewPopup
        btpDescription = {
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
            '0': 'default lightness 0% default color #000 <br> bootstrap: tooltip and modal bg'
        },
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

      // ----- initialize, show menus and wait for user actions ---------------
      _initSettings();
      _showPopover();
      _bindEvents();
      // ----------------------------------------------------------------------

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
          '<li><span class="mm-menu-title mm-menu-top" id="mm-menu-drag">' + title + '</span></li>' +
          '<li><span class="mm-menu-help">' + '?' + '</span></li>';
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

      function _colorViewPopup( element, event ) {
        var val = element.val();
        var col = element.css('color');
        var bck = element.css('background-color');
        var rgb = tinycolor(bck).toRgbString();
        var id = element.parent().attr('id');
        var i = id.slice( id.lastIndexOf('-')+1 );
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
      } // _colorViewPopup

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

      function _btpUpdateUsedFromHTML() {
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
      } // _btpUpdateUsedFromHTML

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


      function _onColorChange(container, color) {
      } // _onColorChange

      function _bindEvents() {

        // show help
        $( '.mm-menu-help' ).on( 'click', function(ev) {
          ev.preventDefault();
          _helpPopup( ev );
        });

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
          _btpUpdateUsedFromHTML();
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

        // show info about color (popup)
        $( '.mm-color-view' ).on( 'click', function(ev) {
          ev.preventDefault();
          _colorViewPopup( $(this), ev );
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



