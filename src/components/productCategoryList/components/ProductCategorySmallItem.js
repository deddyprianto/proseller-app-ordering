import React from 'react';
import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      marginTop: 8,
      width: '49%',
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
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      marginTop: 8,
      width: '49%',
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
  const imageSettings = useSelector(
    state => state.settingReducer.imageSettings,
  );

  const image = category?.defaultImageURL
    ? category?.defaultImageURL
    : imageSettings?.productPlaceholderImage;

  const styleRoot =
    category?.id === selected?.id ? styles.rootSelected : styles.root;

  return (
    <TouchableOpacity style={styleRoot} onPress={onPress}>
      <Image source={{uri: image}} resizeMode="contain" style={styles.image} />
      <Text numberOfLines={2} style={styles.textName}>
        {category?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default ProductCategorySmallItem;
