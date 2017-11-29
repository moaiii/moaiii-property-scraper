const config = require('./googlemaps.config');
const axios = require('axios');
const fs = require('fs');


/**
 * Turns address into longitude and latitude data 
 * for use with the google maps browser api
 * @param {string} postcode 
 */
const geocodeAddress = (postcode) => {
  return new Promise((resolve, reject) => {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?"
      + "address=" 
      + postcode.replace(/\s/g, '+').trim()
      + "&key=" 
      + config.geocoding_apiKey

    console.log("Geocoding: ", url);

    axios
      .get(url)
      .then(json => {
        resolve({
          lat: json.data.results[0].geometry.location.lat,
          lng: json.data.results[0].geometry.location.lng
        })

      })
      .catch(e => {
        console.log("~! Error geocoding address", e);
        reject(e);
      })
  });
};


const writeHtml = (properties, location) => {
  return new Promise((resolve, reject) => {
    geocodeAddress(location)
      .then(center => {
        
        let mapCentre = {
          lat: center.lat,
          lng: center.lng
        };

        let locations = properties.map(property => {
          return JSON.stringify(property.coord);
        });

        // console.log(locations);

        // let info = "<div><h1>" + data[i].postcode + "</h1>

        let gmapHtml = `
          <script>
            function initMap() {
          
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: ${JSON.stringify(mapCentre)}
              });

              var infowindow = new google.maps.InfoWindow();
          
              var locations = [${locations}];

              var data = ${JSON.stringify(properties)};
          
              var marker, i;
              
                for (i = 0; i < locations.length; i++) {  
                  marker = new google.maps.Marker({
                    position: locations[i],
                    map: map
                  });
      
                  google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                    return function() {
                      infowindow.setContent(JSON.stringify({
                        price: JSON.stringify(data[i].price),
                        fees: JSON.stringify(data[i].fees.total),
                        investment: JSON.stringify(data[i].investment),
                        roi: JSON.stringify(Math.round(data[i].roi) + "%"),
                      }));
                      infowindow.open(map, marker);
                    }
                  })(marker, i));
                }
            }
          </script>
        `;

        // write to the index.html file
        let htmlSections = require('./html-sections');

        let html = htmlSections.head + gmapHtml + htmlSections.scripts;

        // console.log(html);
          
        fs.writeFile('../pages/index.html', html, (err) => {
          if(err) throw err;

          resolve();
        });
      
      })
      .catch(e => {
        console.log("~! Error getting map center", e);
      });
  });
  
};


module.exports = {
  geocodeAddress,
  writeHtml
};