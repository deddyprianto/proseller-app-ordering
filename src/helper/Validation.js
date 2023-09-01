export const emailValidation = email => {
  const regex = /^[\w][\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
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
