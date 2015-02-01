

(function($) {
  'use strict';

  $.fn.PopupMenu = function(options) {

//    return this.each(function() {

      var
        title = 'Bootstrap Theme Playground',
        settings,
        triggerelement = $(this), // body
        popover_container,
        elements,
        connectedinput = false,
        // defaults for color menu
        cm_default_base = tinycolor('hsl(180, 50%, 50%)'),
        // percents and default hsl buttons
        cm_proc_array = [
          {p: 99, h: false, s: false, l: true},
          {p: 96, h: false, s: false, l: false},
          {p: 92, h: false, s: false, l: false},
          {p: 88, h: false, s: false, l: false},
          {p: 80, h: false, s: false, l: false},
          {p: 60, h: false, s: false, l: false},
          {p: 50, h: true, s: false, l: false},
          {p: 32, h: false, s: false, l: false},
          {p: 26, h: false, s: false, l: false},
          {p: 20, h: false, s: false, l: false},
          {p: 12, h: false, s: false, l: false},
          {p: 1, h: false, s: false, l: true}
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
        popover_container = $('<div id="mm-menu-main"></div>').appendTo('body').html( _getControllerHtml() );
        // init color sliders in colors menu
        _updateColorsTable ();
        // show default sliders
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
                '<li><span class="mm-long-button" id="mm-menu-color-compile">Compile</span></li>' +
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
          var proc = cm_proc_array[i];
          var show_slider_h = proc.h ? ' show-slider=true' : '';
          var show_slider_s = proc.s ? ' show-slider=true' : '';
          var show_slider_l = proc.l ? ' show-slider=true' : '';
//          var show_pointer = (proc.h || proc.s || proc.l) ? '<div class="mm-pointer">&#x25B6;</div>' : '';
          colors_html +=
            '<div id="mm-color-edit-' + proc.p + '" class="mm-color-line">' +
              '<div class="mm-color-H"' + show_slider_h + '>H</div>' +
              '<div class="mm-color-S"' + show_slider_s + '>S</div>' +
              '<div class="mm-color-L"' + show_slider_l + '>L</div>' +
              '<input type="text" class="mm-color-view" readonly data-color-format="hsl">' +
//              show_pointer +
            '</div>';
        }
        colors_html += '</div>';
        return colors_html;
      } // _getColorsTable

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
      }

      function _updateColorsTable () {
        for (var i = 0; i < cm_proc_array.length; i++) {
          var color_input = $( '#mm-color-edit-' + cm_proc_array[i].p + ' .mm-color-view' );

          var color_hsl = cm_default_base.toHsl();
          color_hsl.l = cm_proc_array[i].p / 100;

          var color_back = tinycolor( color_hsl ).toHslString();
          var color_txt = tinycolor.mostReadable( color_hsl, ['#000', '#fff'] ).toHslString();
          color_input.css( {'background-color': color_back, 'color': color_txt} ).val( color_back );
        }
      }

      function _mixRGB ( rgb_1, rgb_2, proc2 ) {
        var w2 = proc2 / 100.0;
        var w1 = 1 - w2;
        return {
          r: rgb_1.r * w1 + rgb_2.r * w2,
          g: rgb_1.g * w1 + rgb_2.g * w2,
          b: rgb_1.b * w1 + rgb_2.b * w2
        };
      }

      function _mixHSL ( hsl_1, hsl_2, proc2 ) {
        var w2 = proc2 / 100.0;
        var w1 = 1 - w2;
        return {
          h: hsl_1.h * w1 + hsl_2.h * w2,
          s: hsl_1.s * w1 + hsl_2.s * w2,
          l: hsl_1.l * w1 + hsl_2.l * w2
        };
      }

      function _onColorChange(container, color) {
      } // _onColorChange

      function _bindEvents() {
        // open clicked drop down menu and close all others
        $( '.mm-menu-top' ).on( 'click', function() {
          $( '.mm-menu-top+div' ).hide();
          $( this ).next().show();
        });

        // recalc colors - to se ni to
        $( '#mm-menu-color-compile' ).on( 'click', function() {
          // test of mix functions
          var c1 = tinycolor("hsl(180, 10%, 90%)");
          var c2 = tinycolor("hsl(120, 90%, 10%)");

          var rgb000 = tinycolor( _mixRGB( c1.toRgb(), c2.toRgb(), 0 ) ).toHslString();
          var rgb025 = tinycolor( _mixRGB( c1.toRgb(), c2.toRgb(), 25 ) ).toHslString();
          var rgb100 = tinycolor( _mixRGB( c1.toRgb(), c2.toRgb(), 100 ) ).toHslString();

          var hsl000 = tinycolor( _mixHSL( c1.toHsl(), c2.toHsl(), 0 ) ).toHslString();
          var hsl025 = tinycolor( _mixHSL( c1.toHsl(), c2.toHsl(), 25 ) ).toHslString();
          var hsl100 = tinycolor( _mixHSL( c1.toHsl(), c2.toHsl(), 100 ) ).toHslString();

          var konec = 0;
        });

        // close colors drop down
        $( '#mm-menu-color-close' ).on( 'click', function() {
          $( '.mm-menu-top+div' ).hide();
        });

        // reset all colors to default
        $( '#mm-menu-color-defaults' ).on( 'click', function() {
          _updateColorsTable();
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

        // to bo za zbrisat, pointerje sem ukinil
        // show or hide sliders for clicked line
        $( '.mm-pointer' ).on( 'click', function(ev) {
          ev.preventDefault();
          var ptr = $(this);
          var line = ptr.parent();
          var show_slider_h = line.find( '.mm-color-H' ).attr( 'show-slider' );
          var show_slider_s = line.find( '.mm-color-S' ).attr( 'show-slider' );
          var show_slider_l = line.find( '.mm-color-L' ).attr( 'show-slider' );

          if ( ptr.prev().hasClass( 'mm-color-view' ) ) {
            var bc = ptr.prev().css( 'background-color' );
            ptr.prev().ColorPickerSliders( $.extend( {color: bc}, cpDefault ) );
            ptr.attr( 'slider', true );
          } else {
            ptr.prev().remove();
            ptr.removeAttr( 'slider' );
          };
        });
      } // _bindEvents

//    }); // this.each

  }; // PopupMenu

})(jQuery);



// ----- main -----------------------------------------------------------------
$( document ).ready(function() {

  $().PopupMenu();

}); // ----- end of document ready --------------------------------------------



