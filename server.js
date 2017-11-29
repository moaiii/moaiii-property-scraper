// funcitonal modules
const http = require('http');
const fs = require('fs');
const _flatten = require('lodash.flatten');
const _zip = require('lodash.zip');
const argv = require('yargs').argv

// component modules
const analytics = require('./calculateData');
let fpa = require('./scrape/futurepropertyauctions');
let gmap = require('./map/googleMap');


// create server
const server = http.createServer((req, res) => {
  
  req.url === '/'
    ? fs.readFile('./pages/index.html', (err, html) => {
        if(err) throw err;
    
        res.writeHead(200, {'content-type': 'text/html'})
        res.write(html);
        res.end();
      })
      : res.write('Error loading index page!');
});
  
server.on('error', e => {
  console.log('Error on server', e);
});
  
server.on('connect', (req, cltSocket, head) => {
  console.log('Scraper Connected!');
  
  // scrape FUTURE PROPERTY AUCTIONS website
  fpa
    .getTabUrls(argv.location)
    .then(tabUrls => {

      let tabTargets = argv.page === 'all'
        ? tabUrls
        : tabUrls[parseInt(argv.page) - 1];
      
      console.log(tabTargets);
      
        fpa
        .getDetailUrls(tabTargets)
        .then(detailUrls => {

          fpa
            .getPropertyInfo(_flatten(detailUrls))
            .then(propertyDetailsArray => { // Array<Object>

              let gmapPromises = [];

              propertyDetailsArray.map(property => {
                gmapPromises.push(gmap
                  .geocodeAddress(property.postcode));
              });

              Promise
                .all(gmapPromises)
                .then(results => {

                  results.map((coord, index) => {
                    propertyDetailsArray[index].coord = {
                      lat: coord.lat,
                      lng: coord.lng,
                    };
                    
                    // console.log(analytics.calculateData(propertyDetailsArray[index]));
                  });

                  let html = gmap
                    .writeHtml(propertyDetailsArray, argv.location)
                    .then(html => {
                      console.log("done");
                    });
                })
                .catch(e => {
                  console.log("Error getting geolocations", e);
                  reject(e);
                })
              
            });
        });
    });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');

  const options = {
    port: 3000,
    hostname: '127.0.0.1',
    method: 'connect'
  };

  const req_scrape = http.request(options);
  req_scrape.end();
});