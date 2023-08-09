const config = require('../config/awsConfig');

const CurrencyFormatter = price => {
  const currencyCode = `${config.default.CURRENCY}`;
  const currencyLocale = `${config.default.LOCALES}`;

  if (!price || price === '-') {
    price = 0;
  }

  let result = price.toLocaleString(currencyLocale, {
    style: 'currency',
    currency: currencyCode,
  });

  return result;
};

export default CurrencyFormatter;
