// general js for the project that wouldn't be a reuseable component



if( $('body').hasClass('layout--roadtrip') ){

  // Hide banner, show roadtrip
  $('.js-roadtrip-start').click(function(){
    $('.roadtrip-banner').removeClass('is-active');
    $('.site-header').addClass('is-minimised');
  });

  // Roadtrip carousel
  var box = document.querySelector('.roadtrip-route');
  var next = box.querySelector('.roadtrip-route__next');
  var prev = box.querySelector('.roadtrip-route__prev');
  var items = box.querySelectorAll('.roadtrip-page');
  var counter = 0;
  var amount = items.length;
  var current = items[0];
  function navigate(direction) {
    current.classList.remove('is-current');
    counter = counter + direction;
    if (direction === -1 &&
        counter < 0) {
      counter = amount - 1;
    }
    if (direction === 1 &&
        !items[counter]) {
      counter = 0;
    }
    current = items[counter];
    current.classList.add('is-current');
  }

  next.addEventListener('click', function(ev) {
    navigate(1);
  });
  prev.addEventListener('click', function(ev) {
    navigate(-1);
  });

  $(document).on('keyup', function(e) {
    if(e.which === 37){
      navigate(-1);
    }else if(e.which === 39) {
      navigate(1);
    }
  });

  navigate(0);

}