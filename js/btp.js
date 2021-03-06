// display current hex & hsl of row background color in first 2 columns
function mmWriteColorValuesToTable(sel){
  // parameter: sel = '#id-colors .row'
  lastSel = sel.split(' ')[sel.split(' ').length-1];
  r = $(sel).first();
  while ( r.is(lastSel) ) {   // loop while r is a row
    s = tinycolor( r.css('background-color') ).toHexString();
    r.children(':first').text(s);
    s = tinycolor( r.css('background-color') ).toHslString();
    r.children(':first').next().text(s);
    r = r.next();
  }
};


// update colors for min and max lightness
function mmUpdateMinMaxColor(){
  // parameter: sel = '#id-colors .row'
  c = $(sel).first().css('background-color');
  $('#id-base-max-lum').css('background-color', c);
  $('#id-base-max-lum').val( tinycolor(c).toHexString() );
  c = $(sel).last().css('background-color');
  $('#id-base-min-lum').css('background-color', c);
  $('#id-base-min-lum').val( tinycolor(c).toHexString() );
};


// compile colors
function mmCompileColors(){
  less.modifyVars({
    '@base-max-lum':   $('#id-base-max-lum').val(),
    '@base-color':     $('#id-base-color').val(),
    '@base-min-lum':   $('#id-base-min-lum').val(),
    '@brand-primary':  $('#id-brand-color').val()
  });
};


// reset colors to default
function mmDefaultColors(){
  $('#id-base-max-lum').val( '#fff' );
  $('#id-base-color').val( '#777' );
  $('#id-base-min-lum').val( '#000');
  $('#id-brand-color').val( '#336699' );
}


// main
$(document).ready(function() {

  // set init value for left menu inputs and show them
  mmDefaultColors();
  mmCompileColors();
  mmWriteColorValuesToTable('#id-colors .row');

  // color picker pop up for base and brand
  var paramsColor = {
    placement: 'right',
    sliders: true,
    hsvpanel: false,
    swatches: false,
    size: 'lg',
    previewontriggerelement: true,
    previewformat: 'hsl',
    rendervalues: true,
    slidersplusminus: true,
    order: {
      preview: 1,
      hsl: 2,
      rgb: 3
    }
  };
  $('#id-base-color').ColorPickerSliders(paramsColor);
  $('#id-brand-color').ColorPickerSliders(paramsColor);

  // color picker pop up for min and max lum
  var paramsLightness = {
    placement: 'right',
    sliders: true,
    hsvpanel: false,
    swatches: false,
    size: 'lg',
    previewontriggerelement: true,
    previewformat: 'hsl',
    rendervalues: true,
    slidersplusminus: true,
    order: {
      preview: 1,
      lightness: 2
    }
  };
  $('#id-base-min-lum').ColorPickerSliders(paramsLightness);
  $('#id-base-max-lum').ColorPickerSliders(paramsLightness);


  // button: change theme colors by less compile
  $('#id-compile').on('click', function(){
//    $("#id-compile-wait").css("display", "block");
    $("#id-compile-wait").show(1);

//    setInterval( function() {
      mmCompileColors();
  //    mmUpdateMinMaxColor('#id-colors .row');
      mmWriteColorValuesToTable('#id-colors .row');

//      $("#id-compile-wait").css("display", "none")
      $("#id-compile-wait").hide(1000);
//    }, 10);
  });

  // button: reset colors to defaults
  $('#id-defaults').on('click', function() {
    $("#id-compile-wait").css("display", "block");

    mmDefaultColors();
    mmCompileColors();
//    mmUpdateMinMaxColor('#id-colors .row');
    mmWriteColorValuesToTable('#id-colors .row');

    $("#id-compile-wait").css("display", "none");
  });

});

