import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import appConfig from '../../../config/appConfig';

import Theme from '../../../theme';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      elevation: 2,
      padding: 8,
      flex: 1,
      width: (WIDTH * 29) / 100,
      minWidth: (WIDTH * 29) / 100,
      maxWidth: (WIDTH * 29) / 100,
      marginHorizontal: (WIDTH * 0.8) / 100,
      borderRadius: 8,
      marginVertical: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    textName: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    image: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
    },
  });
  return styles;
};

const MoreCategoryItem = ({category, onPress}) => {
  const styles = useStyles();

  const image = category?.defaultImageURL
    ? {uri: category?.defaultImageURL}
    : appConfig.logoMerchant;

  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <Image source={image} resizeMode="contain" style={styles.image} />
      <Text numberOfLines={2} style={styles.textName}>
        {category?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default MoreCategoryItem;
