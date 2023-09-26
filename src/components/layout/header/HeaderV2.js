import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Logo from '../../../assets/img/logo.png';
import BackButton from '../../../assets/svg/BackButton';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../../helper/Layout';
import {Actions} from 'react-native-router-flux';
import Theme from '../../../theme/Theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    haderContainer: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      flexDirection: 'row',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 3,
      backgroundColor: 'white',
      height: 52,
      alignItems: 'center',
    },
    backButtonContainer: {
      position: 'absolute',
      left: 0,
      padding: 16,
    },
    lofoContainer: isCenter => ({
      marginLeft: isCenter ? 0 : 'auto',
    }),
    logoStyle: {
      height: normalizeLayoutSizeHeight(56),
      width: normalizeLayoutSizeWidth(105),
    },
  });
  return {styles};
};

const HeaderV2 = ({onBackBtn, isCenterLogo}) => {
  const {styles} = useStyles();
  const onBack = () => {
    if (onBackBtn && typeof onBackBtn === 'function') {
      return onBackBtn();
    }
    Actions.pop();
  };

  return (
    <View style={styles.haderContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
        <BackButton />
      </TouchableOpacity>
      <View style={styles.lofoContainer(isCenterLogo)}>
        <Image resizeMode="contain" style={styles.logoStyle} source={Logo} />
      </View>
    </View>
  );
};

export default React.memo(HeaderV2);
