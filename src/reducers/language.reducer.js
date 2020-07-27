import awsConfig from '../config/awsConfig';

const setLanguage = language => {
  let messages = {};
  switch (language) {
    case 'id':
      messages = Object.assign(messages, require('../service/i18n/id'));
      break;
    default:
    case 'en':
      messages = Object.assign(messages, require('../service/i18n/en'));
      break;
  }
  return messages;
};

const initialState = {
  locale: 'en',
  messages: setLanguage(awsConfig.LOCALES),
};

const intlData = (state = initialState, action) => {
  if (action === undefined) return state;
  switch (action.type) {
    case 'UPDATE_LANGUAGE':
      return {
        locale: action.language,
        messages: setLanguage(action.language),
      };
    default:
      // if (state != undefined) {
      //   console.log({state});
      // return {
      //   locale: state.locale,
      //   messages: setLanguage(state.locale),
      // };
      // } else {
      return state;
    // }
  }
};
export default intlData;
