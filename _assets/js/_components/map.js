


///////////////////////////////////////
//      Roadtrip map
///////////////////////////////////////

if( $('#map').length ){

  var page = $('.roadtrip').attr('data-roadtrip-id');
  for( var i = 0; i < mapData.roadtrips.length; i++ ){
    if( page == mapData.roadtrips[i].id ){
      var roadtrip = mapData.roadtrips[i];
    }
  }

  var mapCenter    = roadtrip.center,
      mapZoom      = 7,
      mapFocusZoom = 12;

  function mapInit(){

    // launch map with settings
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtaXNoamdyYXkiLCJhIjoiY2pkbjBmeGN6MDd1YzMzbXI3cWdpNThjayJ9.3YE8T1H2QUyqNIkxdKWxkg';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/hamishjgray/cjkmdbmoo36rw2sp83lrzyyh2',
      logoPosition: 'bottom-right',
      center: mapCenter,
      zoom: mapZoom,
      minZoom: 3
    });

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();




    function getRoute() {

      var coordString = [];
      var total = roadtrip.features.length;
      for(var i in roadtrip.features){
        if( i == (total - 1) ){
          var coord = roadtrip.features[i].geometry.coordinates;
        }else{
          var coord = roadtrip.features[i].geometry.coordinates + ';';
        }
        coordString += coord;
      };

      var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coordString + '?geometries=geojson&access_token=' + mapboxgl.accessToken;

      $.ajax({
        method: 'GET',
        url: directionsRequest,
      }).done(function(data) {
        var route = data.routes[0].geometry;
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: route
            }
          },
          paint: {
            'line-width': 2,
            'line-color': "#666666"
          }
        });
      });
    }




    // builds map with custom functionality
    map.on('load', function(event) {


      // apply route to map
      getRoute();
      
      ///////////// adds highlights markers to the map
      map.addLayer({
        id: 'stops',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          data: roadtrip
        },
        layout: {
          "icon-image": "marker-15", // custom icon is in the mapbox style spritesheet
          "icon-size": 1,
          'icon-anchor': "bottom"
        }
      });

      // ///////////// Launches POI modal when marker is clicked
      map.on('click', 'stops', function (e) {
        var clickedStopId = e.features[0].properties.id
        console.log(clickedStopId);
        clickMarker(clickedStopId);
      });

      ///////////// center the map markers within the viewport
      var bounds = new mapboxgl.LngLatBounds();
      function getMapBounds() {
        roadtrip.features.forEach(function(feature) {
          bounds.extend(feature.geometry.coordinates);
        });
        // set different padding depending on original viewport width
        // not super precise but should catch mobile phones and reduce the padding
        var iconPadding;
        if ($(window).innerWidth() < 400) {
          iconPadding = { "padding": 40 };
        } else {
          iconPadding = { "padding": 120 };
        }
        map.fitBounds(bounds, iconPadding); // adds padding so markers aren't on edge

      }
      getMapBounds(); // resets the view when the map loads

    });





    ///////////////////////////////////////
    //      Roadtrip page navigation
    ///////////////////////////////////////

    function activateMarker(markerId){
      for (var i = 0; i < roadtrip.features.length; i++) {
        if (roadtrip.features[i].properties.id == markerId) {
          map.flyTo({
            zoom: mapFocusZoom,
            center: roadtrip.features[i].geometry.coordinates
          });
        }
      }
    }
    function clickMarker(markerId){
      for (var i = 0; i < roadtrip.features.length; i++) {
        if (roadtrip.features[i].properties.id == markerId) {
          map.flyTo({
            zoom: mapFocusZoom,
            center: roadtrip.features[i].geometry.coordinates
          });
        }
      }
      $('.roadtrip__stop.is-current').removeClass('.is-current');
      $('.roadtrip__stop').each(function(){
        if( $(this).data('stop-id') == markerId ){
          $(this).addClass('is-current');
        }
      });
    }


    function mapReset(){
      map.flyTo({
        center: mapCenter,
        zoom: mapZoom
      });
      // update content panel
      $('.roadtrip__page.is-current').removeClass('is-current');
      $('.roadtrip__page').first().addClass('is-current');
    }




    ///////////////////////////////////////
    //      Content carousel
    ///////////////////////////////////////


    // Roadtrip carousel
    var jump = $('.roadtrip__nav-jump');
    var next = $('.roadtrip__nav-next');
    var prev = $('.roadtrip__nav-prev');
    var items = $(document).find('.roadtrip__stop');
    var counter = 0;
    var amount = items.length;
    var current = items[0];

    // navigation
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
      $('.roadtrip').attr('data-current-stop', counter);
      var stopId = $('.roadtrip__stop.is-current').data('stop-id');
      if(stopId){
        activateMarker(stopId);
      }else{
        mapReset();
      }
      if(counter == 0){
        $('.site-header').removeClass('is-minimised');
      }else{
        $('.site-header').addClass('is-minimised');
      }
    }

    // skip to stop
    function jumpTo(event) {
      $('.is-current').removeClass('is-current');
      var targ = $(event.currentTarget).data('stop-link');
      var stopId = $(event.currentTarget).data('stop-id');

      counter = targ;
      current = items[counter];
      current.classList.add('is-current');
      $('.roadtrip').attr('data-current-stop', counter);
      $('.site-header').addClass('is-minimised');
      activateMarker(stopId);
    }

    // navigation events
    next.click(function(ev) { navigate(1); });
    prev.click(function(ev) { navigate(-1); });
    jump.click(function(ev) { jumpTo(event); });

    $(document).on('keyup', function(e) {
      if(e.which === 37){
        navigate(-1);
      }else if(e.which === 39) {
        navigate(1);
      }
    });
  }





  mapInit();
} // END if( $('#map').length )