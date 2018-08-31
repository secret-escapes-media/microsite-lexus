// general js for the project that wouldn't be a reuseable component

$('.roadtrip__map-close').click(function(){
  $('.roadtrip__map').removeClass('roadtrip__map--mobile-active');
});

$('.roadtrip__map-open').click(function(){
  $('.roadtrip__map').addClass('roadtrip__map--mobile-active');
});
