const config = require('./googlemaps.config');

const scripts = `
      <script 
        src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js">
      </script>
      <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=${config.maps_apikey}&callback=initMap">
      </script>
    </body>
  </html>
`;

const head = `
  <!DOCTYPE html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Auction Scrapper</title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
          #map {
            height: 60%;
            margin: 0 auto;
            display: block;
          }
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
    </head>
    <body>
      <h1>Auction Scrapper</h1>
      <div id="map"></div>
`;

module.exports = {
  scripts,
  head
};