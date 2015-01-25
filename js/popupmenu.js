// ----- init -----------------------------------------------------------------
  var cpInit = {
    color: "hsl(180, 50%, 50%)",
    previewformat: "hsl",
    rendervalues: true,
    slidersplusminus: true,
    flat: true,
    sliders: true,
    swatches: false,
    hsvpanel: false,
    order: {
      preview: 1,
      hslL: 6
    }
  };
  var cpMaxLight = $.extend( {}, cpInit, { color: "hsl(180, 50%, 90%)" });
  var cpHueSat   = $.extend( {}, cpInit, { order: { preview: 1, hslH: 5, hslS: 6 } });
  var cpMinLight = $.extend( {}, cpInit, { color: "hsl(180, 50%, 10%)" });



// ----- main -----------------------------------------------------------------
$( document ).ready(function() {
  'use strict';
//  alert("dela");

  // ----- make my menu draggable inside browser window -----------------------
  $( "#mm-menu-main" ).draggable({
    handle: "#mm-menu-drag",
    containment: "window"
  });

  // ----- init color sliders in colors menu ----------------------------------
  $(" #cp-max-light ").ColorPickerSliders( cpMaxLight );
  $(" #cp-hue-sat ").ColorPickerSliders( cpHueSat );
  $(" #cp-min-light ").ColorPickerSliders( cpMinLight );

  // ----- event handlers -----------------------------------------------------
  $( ".mm-menu-top" ).on( "click", function() {
    $( ".mm-menu-top+div" ).hide();
    $( this ).next().show();
  });

  $( "#mm-menu-color-close" ).on( "click", function() {
    $( ".mm-menu-top+div" ).hide();
  });


}); // ----- end of document ready --------------------------------------------


