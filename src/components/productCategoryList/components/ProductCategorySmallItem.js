import React from 'react';
import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import appConfig from '../../../config/appConfig';

import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginTop: 8,
      width: '49%',
      elevation: 2,
      paddingHorizontal: 8,
      paddingVertical: 10,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonStandBy,
    },
    rootSelected: {
      marginTop: 8,
      width: '49%',
      elevation: 2,
      paddingHorizontal: 8,
      paddingVertical: 10,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      backgroundColor: theme.colors.buttonStandBy,
      borderColor: theme.colors.buttonActive,
    },
    textName: {
      flex: 1,
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    image: {
      marginRight: 8,
      width: 36,
      height: 36,
    },
  });
  return styles;
};

const ProductCategorySmallItem = ({category, selected, onPress}) => {
  const styles = useStyles();

  const image = category?.defaultImageURL
    ? {uri: category?.defaultImageURL}
    : appConfig.logoMerchant;

  const styleRoot =
    category?.id === selected?.id ? styles.rootSelected : styles.root;

  return (
    <TouchableOpacity style={styleRoot} onPress={onPress}>
      <Image source={image} resizeMode="contain" style={styles.image} />
      <Text numberOfLines={2} style={styles.textName}>
        {category?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default ProductCategorySmallItem;
