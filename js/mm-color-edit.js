
$( document ).ready( function() {

  var cpDefault = {
    previewformat: 'hsl-rgb',
    previewontriggerelement: true,
    rendervalues: true,
    slidersplusminus: true,
//    size: 'lg',
    flat: true,
    sliders: true,
    swatches: false,
    hsvpanel: false,
    order: {
        hslL: 4
      }
  };

  // var bc = $( '#mm-color-edit-1 .mm-color-view' ).css('background-color');
  // $( '#mm-color-edit-1 .mm-color-view' ).ColorPickerSliders( $.extend( {color: bc}, cpDefault ) );



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

  var konec = null;
});

