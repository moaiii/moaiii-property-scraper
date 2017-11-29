let axios = require('axios');

const base_url = 'http://www.futurepropertyauctions.co.uk' ;
const path_url = '/catalogue_';
const ext = '.asp';

const getRoot = (location) => {
  return new Promise((resolve, reject) => {

    let full_url =  base_url + path_url + location + ext;

    axios
      .get(full_url.toLowerCase())
      .then(html => {
        // setTimeout(() => {
          // console.time('Requesting Root page +1000ms');
          resolve(html);
        // }, 1000);

      })
      .catch(e => {
      console.log('Error getting data for the root page');
        reject(e);
      });
  });
};

const getPage = (url) => {
  return new Promise((resolve, reject) => {
    // console.log(`${base_url}${url}`);
    axios
      .get(`${base_url}${url}`)
      .then(html => {
        // setTimeout(() => {
          // console.time(`Requesting ${url} +1000ms`);
          resolve(html);
        // }, 1000);

      })
      .catch(e => {
        console.log('Error getting data for the properties detail page');
        reject(e);
      });
  });
};

module.exports = {
  getRoot,
  getPage
};