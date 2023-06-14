const formatter = value => {
  const firstLetter = value.substring(0, 1).toUpperCase();
  let result = firstLetter;

  for (var i = 1; i < value?.length; i++) {
    result = result + '*';
  }

  return result;
};

const TextBlurFormatter = text => {
  let result = '';
  const textSplitted = text.split(' ');
  textSplitted.forEach(value => {
    result = result + formatter(value) + ' ';
  });

  return result;
};

export default TextBlurFormatter;
