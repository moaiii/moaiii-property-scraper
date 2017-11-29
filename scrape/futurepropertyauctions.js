const axios = require('axios');
const cheerio = require('cheerio');
const getPage = require('./getPages');


/**
 * @return {array.<Object>} tabUrls
 * @description Will return a list of urls, within 
 * each of these html docs will have a list of property articles
 */
const getTabUrls = (location) => { 
  return new Promise((resolve, reject) => {
    getPage
      .getRoot(location)
      .then(html => {
        let $ = cheerio.load(html.data);
        
        let tabUrls = [];
        
        $('nav.pagination li > a')
          .each(function(i, elm) {
            tabUrls.push($(this).attr('href'));
          });
  
        resolve(tabUrls);
      });
  });
};


/**
 * @param {Array.<String>} list
 * @description Takes a list of URLS and needs to extract 
 * the list of 10 property detail uls
 */
const getDetailUrls = (list) => {
  return new Promise((resolve, reject) => {

    let pagePromises = [];
  
    // scraping multiple pages 
    if(list.constructor === Array) {
      for(let url of list) {
        pagePromises.push(getPage.getPage(url));
      };
    
    // scrape a single page
    } else {
      pagePromises.push(getPage.getPage(list));
    }
  
    Promise
      .all(pagePromises)
      .then(results => {

        let detailUrls = results
          .map(html => {
            let $ = cheerio.load(html.data);

            let urlList = [];
            
            $('.medium-content a')
              .each(function(i, elm) {
                
                let link = $(this).attr('href');

                // avoid duplicates because hrefs are all over page
                !urlList.includes(link)
                  ? urlList.push('/' + link)
                  : null;
              });

              return urlList;
          });

        resolve(detailUrls);
      })
    
  });
};

/**
 * @param {Array.<String>} urlList
 * @description Gets the html of the property detail pages 
 * and returns the info object
 */
const getPropertyInfo = (urlList) => {
  return new Promise((resolve, reject) => {
    let infoPromises = [];
    
      for(let url of urlList) {
        infoPromises.push(getPage.getPage(url));
      };
    
      Promise
        .all(infoPromises)
        .then(results => {
  
          let infoArray = results
            .map(html => {
              let $ = cheerio.load(html.data);

              // format the address for google api
              let addressRaw = $('h3.title').first().text();
              
              let addressParts = addressRaw.split(',');
              
              let postcode = addressParts[addressParts.length - 1]
                .replace(/ /g,'')
                .replace('\n', '')
                .trim();
              
              let address = addressParts[0];

              // format the the price for Math calcs
              let priceRaw = $('.medium-content2 a').first().text();
              
              let price = parseInt(priceRaw
                .replace('£', '').replace(',','').trim());

              // search the description for the pcm value
              let descArray = [];

              let descRaw = $('ul.check-list li')
                .each(function(i, el) {
                  descArray.push($(this).text());
                });

              let desc = descArray.join(" ");

              let pcm = getPCM(desc);
              console.log("PCM", pcm);
  
              let property = {
                price,
                address,
                postcode
              };
              
              return property;
            });
  
          resolve(infoArray);
        })
  });
};

const getPCM = (descriptionRaw) => {

  let descriptionClean = descriptionRaw.toLowerCase();

  let lookupPhrases = [" per capita month", " pcm", " cpm", "per capita month", "pcm", "cpm"];

  for(let i = 0; i < lookupPhrases.length; i++) {
    let index = descriptionClean.indexOf(lookupPhrases[i]);
    
    if(index >= 0) {
      console.log("found @ ", index);
      return descriptionClean.substring(index - 3, index);
      break;
    }
  }
};


module.exports = {
  getTabUrls,
  getDetailUrls,
  getPropertyInfo
};