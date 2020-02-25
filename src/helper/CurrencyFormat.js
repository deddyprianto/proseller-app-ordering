const Intl = require('react-native-intl');
const config = require('../config/awsConfig');

module.exports = {
  formatter: async value => {
    try {
      return new Intl.NumberFormat(config.default.LOCALES, {
        style: 'currency',
        currency: config.default.CURRENCY,
        minimumFractionDigits: 2,
      })
        .format(value)
        .then(str => {
          return str.match(/[a-z]+|[^a-z]+/gi).join(' ');
        });
    } catch (e) {
      return value;
    }
  },
};
