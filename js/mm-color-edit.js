function mmColorEdit( ev ) {

  alert( ev );
  var konec = null;
}

$( document ).ready( function() {

  $( '#id-button' ).on( 'click', function(ev) {
    event.preventDefault();
    mmColorEdit( ev );
  })

  var konec = null;
});

// var $jQueryObject = $($.parseHTML(myString));
