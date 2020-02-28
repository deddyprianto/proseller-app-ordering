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
  messages: setLanguage('en'),
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
      return state;
  }
};
export default intlData;
