import {Dimensions} from 'react-native';

export const normalizeLayoutSizeHeight = height => {
  const referenceHeight = 926;
  const currentScreenHeight = Dimensions.get('screen').height;
  const normalizedLayoutHeight =
    (currentScreenHeight / referenceHeight) * height;
  return normalizedLayoutHeight;
};

export const normalizeLayoutSizeWidth = width => {
  const referenceWidth = 428;
  const currentScreenWidth = Dimensions.get('screen').width;
  const normalizedLayoutWidth = (currentScreenWidth / referenceWidth) * width;
  return normalizedLayoutWidth;
};
