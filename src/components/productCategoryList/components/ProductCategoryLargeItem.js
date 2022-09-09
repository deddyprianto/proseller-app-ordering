import React from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';

import Theme from '../../../theme';

const WIDTH = Dimensions.get('window').width;

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
      padding: 8,
      flex: 1,
      width: ((WIDTH - 32) * 30) / 100,
      minWidth: ((WIDTH - 32) * 30) / 100,
      maxWidth: ((WIDTH - 32) * 30) / 100,
      marginHorizontal: ((WIDTH - 32) * 1.6) / 100,
      borderRadius: 8,
      marginVertical: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    rootSelected: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      padding: 8,
      flex: 1,
      width: ((WIDTH - 32) * 30) / 100,
      minWidth: ((WIDTH - 32) * 30) / 100,
      maxWidth: ((WIDTH - 32) * 30) / 100,
      marginHorizontal: ((WIDTH - 32) * 1.6) / 100,
      borderWidth: 1,
      borderRadius: 8,
      marginVertical: 8,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderColor: theme.colors.buttonActive,
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

const ProductCategoryLargeItem = ({category, selected, onPress}) => {
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

export default ProductCategoryLargeItem;
