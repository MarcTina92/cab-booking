// (function ($, Drupal) {

  
//   Drupal.behaviors.google_place_autocomplete = {
//     attach: function (context, settings) {
//       if (!settings.google_place_autocomplete) {
//         return;
//       }
//       /**
//        * Initialize Autocomplete fields.
//        */
//       function initializeAutocomplete() {

//         // Loop over autocomplete fields
//         $(once('google_place_autocomplete', 'input[data-google-places-autocomplete]', context)).each(function () {
//           let input = $(this);
//           input.addClass('processed-autocomplete');
//           // Setup options
//           let options = {
//             Fields: ['address_component', 'formatted_address'],
//           };
//           if (settings.google_place_autocomplete.elements[input.attr('id')]) {
//             if (settings.google_place_autocomplete.elements[input.attr('id')].options.types) {
//               options['types'] = [settings.google_place_autocomplete.elements[input.attr('id')].options.types];
//             }
//             if (settings.google_place_autocomplete.elements[input.attr('id')].options.country) {
//               options['componentRestrictions'] = {country: settings.google_place_autocomplete.elements[input.attr('id')].options.country};
//             }
//           }
//           let autocomplete = new google.maps.places.Autocomplete(this, options);
//           autocomplete.addListener('place_changed', function () {
//             let place = autocomplete.getPlace();
//             if (place) {
//               $.each(place.address_components, function (index, value) {
//                 let addressType = value.types[0];
//                 if (addressType === 'postal_code' || addressType === "postal_code_prefix") {
//                   if (value.short_name) {
//                     let current_address = input.val();
//                     if (!current_address.includes(value.short_name)) {
//                       input.val(current_address + ' ' + value.short_name);
//                     }
//                   }
//                 }
//               });
//             }
//           });
//         });
//       }
//       window.addEventListener('load', initializeAutocomplete);
//       $(document).ajaxStop(initializeAutocomplete);
//     }
//   };

    

// })(jQuery, Drupal);
