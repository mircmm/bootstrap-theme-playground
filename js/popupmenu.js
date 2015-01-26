(function($) {
  'use strict';

  $.fn.mmTest = function(options) {

    alert('mmTest');

  }; // PopupMenu

})(jQuery);



(function($) {
  'use strict';

  $.fn.PopupMenu = function(options) {

//    return this.each(function() {

      var
        title = "Bootstrap Theme Playground",
        settings,
        triggerelement = $(this), // body
        popover_container,
        elements,
        connectedinput = false,
        mm_color_light = [100, 96, 92, 88, 80, 60, 50, 32, 26, 20, 12, 0],
        // default sliders options
        cpDefault = {
          previewformat: "hsl",
          rendervalues: true,
          slidersplusminus: true,
          flat: true,
          sliders: true,
          swatches: false,
          hsvpanel: false,
          onchange: _onColorChange
        },
        // specific slider options
        cpMaxLight = $.extend( {}, cpDefault, {
          color: "hsl(180, 50%, 90%)",
          order: { hslL: 6 }
        }),
        cpHueSat   = $.extend( {}, cpDefault, {
          color: "hsl(180, 50%, 50%)",
          order: { hslH: 4, hslS: 5 }
        }),
        cpMinLight = $.extend( {}, cpDefault, {
          color: "hsl(180, 50%, 10%)",
          order: { hslL: 6 }
        }),
        lastVar;
      // end of variables

      init();

      function _initSettings() {
        if (typeof options === 'undefined') {
          options = {};
        }

        settings = $.extend({
          title: '',
          lastOption: null
        }, options);
      }; // _initSettings

      function init() {
        _initSettings();
        _showPopover();
        _bindEvents();
      } // init

      function _showPopover() {
        popover_container = $('<div id="mm-menu-main"></div>').appendTo('body');
        popover_container.html( _getControllerHtml() );
        // ----- make menu draggable inside browser window --------------------
        $( "#mm-menu-main" ).draggable({
          handle: "#mm-menu-drag",
          containment: "window"
        });
        // ----- init color sliders in colors menu ----------------------------
        $(" #mm-color-light-100" ).removeClass( "mm-preview" ).addClass( "mm-preview-bm1" ).ColorPickerSliders( cpMaxLight );
        $(" #mm-color-light-50" ).removeClass( "mm-preview" ).addClass( "mm-preview-bm2" ).ColorPickerSliders( cpHueSat );
        $(" #mm-color-light-0" ).removeClass( "mm-preview" ).addClass( "mm-preview-bm1" ).ColorPickerSliders( cpMinLight );
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
              '<ul>' +
                _getColorsTable() +
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
        var colors_html = '';
        // use array mm_color_light
        for (var c in mm_color_light) {
          colors_html +=
            '<div class="mm-preview" id="mm-color-light-' + mm_color_light[c] + '">' + mm_color_light[c] + '&#37;</div>';
        }
        return colors_html;
      } // _getColorsTable

      function _onColorChange(container, color) {
/* tukaj naredi update background barv za vse % */
        var a = container.parent();
        var b = color;
        var c = null;
      } // _onColorChange

      function _bindEvents() {
        $( ".mm-menu-top" ).on( "click", function() {
          $( ".mm-menu-top+div" ).hide();
          $( this ).next().show();
        });

        $( "#mm-menu-color-close" ).on( "click", function() {
          $( ".mm-menu-top+div" ).hide();
        });
      } // _bindEvents

//    }); // this.each

  }; // PopupMenu

})(jQuery);



// ----- main -----------------------------------------------------------------
$( document ).ready(function() {
//  alert("dela");

//  $( "body" ).mmTest();


//  $( "body" ).PopupMenu();
  $().PopupMenu();


}); // ----- end of document ready --------------------------------------------



