(function ($, Drupal) {
  Drupal.behaviors.priceCalculator = {
    attach: function (context, settings) {
      once('cab-booking-wrapper-init', '.cab-booking-wrapper', context).forEach(function (element) {
        const originAutocomplete = new google.maps.places.Autocomplete(document.getElementById("edit-field-from-0-value"));
        originAutocomplete.addListener("place_changed", () => {
          Drupal.originalPlace = originAutocomplete.getPlace();
          if (!Drupal.originalPlace.geometry) {
            alert("Please select a valid location from the dropdown.");
            return;
          }
          onChangeHandler();
          // use place.geometry.location or place.formatted_address
        });
        const destinationAutocomplete = new google.maps.places.Autocomplete(document.getElementById("edit-field-destination-0-value"));
        destinationAutocomplete.addListener("place_changed", () => {
          Drupal.destinationPlace = destinationAutocomplete.getPlace();
          if (!Drupal.destinationPlace.geometry) {
            alert("Please select a valid location from the dropdown.");
            return;
          }
          onChangeHandler();
          // use place.geometry.location or place.formatted_address
        });
        
        $('#edit-field-car-type').on('change', function() {
          onChangeHandler();
        });
        var directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#800080', // Purple
            strokeOpacity: 0.8,
            strokeWeight: 5,
          }
        });
       map = new google.maps.Map($('.route-map')[0], {
          zoom: 14,
          center: { lat: -34.397, lng: 150.644 },
          styles: [
            {
              featureType: "all",
              elementType: "all",
              stylers: [
                { saturation: -100 },
                { lightness: 50 },
                { visibility: "on" }
              ]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e3f2fd" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }]
            }
          ]
        });

        directionsRenderer.setMap(map);
        
        const onChangeHandler = function () {
          calculateAndDisplayRoute(directionsService, directionsRenderer);
        };
        function calculateAndDisplayRoute(
          directionsService,
          directionsRenderer
        ) {
          if (!$('#edit-field-from-0-value').val() || !$('#edit-field-destination-0-value').val()) {
            return;
          }
          
          directionsService
            .route({
              origin: {
                placeId: Drupal.originalPlace.place_id,
              },
              destination: {
                placeId: Drupal.destinationPlace.place_id,
              },
              travelMode: google.maps.TravelMode.DRIVING,
            })
            .then((response) => {
              directionsRenderer.setDirections(response);
               getDistanceBetweenPlaces(Drupal.originalPlace.place_id, Drupal.destinationPlace.place_id, function(result) {
                // Show in UI or calculate fare
                document.getElementById('distance').innerText = result.distance.text;
                document.getElementById('duration').innerText = result.duration.text;
                document.getElementById('price').innerText = getPrice(result.distance.value);
              });
            })
            .catch((e) => console.log("Directions request failed due to " + e));
          }
      });
    }
  }
    
  function getPrice(distance) {
    // Example pricing logic: $1 per kilometer
    // Adjust this logic based on your pricing model
    $vehicleType = $('#edit-field-car-type').val();
    var pricePerKm = 10;
    if ($vehicleType == 1) {
       pricePerKm = 10; // Luxury vehicle price per km
    }
    else if ($vehicleType == 2) {
       pricePerKm = 15; // Standard vehicle price per km
    }
    else if ($vehicleType == 3) {
       pricePerKm = 8; // Standard vehicle price per km
    }
    else if ($vehicleType == 4) {
      pricePerKm = 20; // Standard vehicle price per km
    }

    const distanceInKm = distance / 1000; // Convert meters to kilometers
    return (distanceInKm * pricePerKm).toFixed(2); // Return price rounded to 2 decimal places  
  }

  function getDistanceBetweenPlaces(sourcePlaceId, destinationPlaceId, callback) {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [{ placeId: sourcePlaceId }],
        destinations: [{ placeId: destinationPlaceId }],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status !== 'OK') {
          console.error('Error getting distance matrix:', status);
          return;
        }

        const result = response.rows[0].elements[0];

        if (result.status === 'OK') {
          const distanceText = result.distance.text; // e.g. "14.2 km"
          const durationText = result.duration.text; // e.g. "23 mins"

          console.log('Distance:', distanceText, '| Duration:', durationText);

          // Optional: return result to callback
          if (typeof callback === 'function') {
            callback({
              distance: result.distance,
              duration: result.duration,
            });
          }
        } else {
          console.warn('Distance not found:', result.status);
        }
      }
    );
  }


})(jQuery, Drupal);
