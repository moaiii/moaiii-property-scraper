const fees = require('./fees');


const calculateData = (property) => {
  // attach fees to property object
  property.fees = fees.calculateFees(property.price);
  // calc total price
  property.totalCost = (property.price + property.fees.total).toPrecision(1);

  property.mortgaged =( 0.7 * property.price).toPrecision(1);
  property.investment = ((0.3 * property.price) + property.fees.total).toPrecision(1);

  // TODO: I need to scrape this still
  property.monthlyRent = 600;
  property.yearlyRent = property.monthlyRent * 12;

  property.roi = (property.yearlyRent / property.investment).toPrecision(2) * 100;

  return property;
};

module.exports = {
  calculateData
};