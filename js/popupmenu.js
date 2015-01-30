

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
        // color_menu
        cm_default_base = tinycolor("hsl(180, 50%, 50%)"),
        cm_default_max = 100, 
        cm_default_min = 0, 
        cm_default_proc = [ 100, 96, 92, 88, 80, 60, 50, 32, 26, 20, 12, 0 ],
        cm_show_L = [ 100, 0 ],
        cm_show_HS = [ 50 ],
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
          order: {
              hslL: 4
            },
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
        // make menu draggable inside browser window
        $( "#mm-menu-main" ).draggable({
          handle: "#mm-menu-drag",
          containment: "window"
        });
        // init color sliders in colors menu
        _updateColorsTable ();
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
        var colors_html = '<div id="mm-color-menu-container">';
        // create color edit line for each lightness
        for (var proc in cm_default_proc) {
          colors_html +=
            '<div id="mm-color-edit-' + cm_default_proc[proc] + '" class="mm-color-line">' +
              '<input type="text" class="mm-color-view" data-color-format="hex">' +
              '<div class="mm-pointer">&#x25B6;</div>' +
            '</div>'
        }
        colors_html += '</div>';
        return colors_html;
      } // _getColorsTable

      function _updateColorsTable () {
        var proc;
        for (proc in cm_default_proc) {
          var line_id = '#mm-color-edit-' + cm_default_proc[proc];
          var color_input = $( line_id + ' .mm-color-view' );
          var color_hsl = cm_default_base.toHsl();
          color_hsl.l = cm_default_proc[proc] / 100;
          var color_new = tinycolor( color_hsl );
          
          var konec = 0;
        }
      }
      
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
        
        $( '.mm-pointer' ).on( 'click', function(ev) {
          ev.preventDefault();
          var ptr = $(this);
          if ( ptr.prev().hasClass('mm-color-view') ) {
            var bc = ptr.prev().css('background-color');
            ptr.prev().ColorPickerSliders( $.extend( {color: bc}, cpDefault ) );
            ptr.attr('slider', true);
          } else {
            ptr.prev().remove();
            ptr.removeAttr('slider');
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



