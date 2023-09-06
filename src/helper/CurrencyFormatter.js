const config = require('../config/awsConfig');

const CurrencyFormatter = price => {
  const currencyCode = `${config.default.CURRENCY}`;
  const currencyLocale = `${config.default.LOCALES}`;

  if (!price || price === '-') {
    price = 0;
  }

  let priceFormatted = price.toLocaleString(currencyLocale, {
    style: 'currency',
    currency: currencyCode,
  });

  const priceFormattedSplit = priceFormatted.split(currencyCode);
  const onlyPrice = priceFormattedSplit[1];
  const result = `${currencyCode} ${onlyPrice}`;

  return result;
};

export default CurrencyFormatter;
