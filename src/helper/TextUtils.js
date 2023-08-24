export const setCapitalFirstLetter = text => {
  if (text && typeof text === 'string') {
    const capital = text.charAt(0).toUpperCase();
    const notCapital = text.slice(1);
    return `${capital}${notCapital}`;
  }

  return '';
};
