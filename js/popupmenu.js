$( document ).ready(function() {
  'use strict';

//  alert("dela");

  $( "#mm-menu-main" ).draggable({
    handle: "#mm-menu-drag",
    containment: "window"
  });

  $( ".mm-menu-top" ).on( "click", function() {
    $( ".mm-menu-top+div" ).hide();
    $( this ).next().show();
  });

  $( "#mm-menu-color-close" ).on( "click", function() {
    $( ".mm-menu-top+div" ).hide();
  });



  $("#cp-max-light").ColorPickerSliders({
    color: "hsl(180, 50%, 100%)",
    previewformat: 'hsl-rgb',
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
  });


  $("#cp-min-light").ColorPickerSliders({
    color: "hsl(180, 50%, 0%)",
    previewformat: 'hsl-rgb',
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
  });

  $("#cp-hue-sat").ColorPickerSliders({
    color: "hsl(180, 50%, 50%)",
    previewformat: 'hsl-rgb',
    rendervalues: true,
    slidersplusminus: true,
    flat: true,
    sliders: true,
    swatches: false,
    hsvpanel: false,
    order: {
      preview: 1,
      hslH: 4,
      hslS: 5
    }
  });


}); // ----- end of document ready -----



