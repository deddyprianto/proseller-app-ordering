export const emailValidation = email => {
  const regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;
  return regex.test(email);
};

export const fieldValidation = (requiredField = [], dataObject = {}) => {
  let emptyValue = [];
  for (let i = 0; i < requiredField.length; i++) {
    if (!dataObject[requiredField[i]] || dataObject[requiredField[i]] === '') {
      emptyValue.push(requiredField[i]);
    }
  }
  return emptyValue;
};
