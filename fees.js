// based from https://www.moneyadviceservice.org.uk/en/articles/estimate-your-overall-buying-and-moving-costs

const calculateFees = (price) => {

  let fees = {};

  fees.bookingFee = 250;
  fees.arrangementFee = 2000;
  fees.mortgageValuation = 150;
  fees.stampDuty = _stampDutyRate_buyToLet(price) * price;
  // fees.deposit = 0.2 * price;
  fees.valuation = 1500;
  fees.surveyor = 600;
  fees.legal = 1500;
  fees.localPlans = 300;
  fees.electronicTransfer = 50;
  fees.estateAgent = (0.05 * price) + (0.05 * price * 1.2);
  fees.leasehold = 100;
  fees.repair = 5700;
  fees.total = 0;

  // sum all fees 
  for(let fee in fees) {
    fees.total += fees[fee];
  };

  return fees;
};

const _stampDutyRate_buyToLet = (price) => {
  return price <= 125000
    ? 0.03
    : price > 125000 && price <= 25000
      ? 0.05
      : price > 250000 && price <= 925000
        ? 0.08
        : price > 925000 && price <= 1500000
          ? 0.13
          : 0.15;
};

module.exports = {
  calculateFees
};