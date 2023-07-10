import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import Logo from '../../../assets/img/logo.png';
import BackButton from '../../../assets/svg/BackButton';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../../helper/Layout';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  haderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backButtonContainer: {
    marginRight: 'auto',
  },
  lofoContainer: {
    marginLeft: 'auto',
  },
  logoStyle: {
    height: normalizeLayoutSizeHeight(28),
    width: normalizeLayoutSizeWidth(105),
  },
});

const HeaderV2 = () => {
  const onBack = () => {
    Actions.pop();
  };

  return (
    <View style={styles.haderContainer}>
      <View style={styles.backButtonContainer}>
        <BackButton onPress={onBack} />
      </View>
      <View style={styles.lofoContainer}>
        <Image style={styles.logoStyle} source={Logo} />
      </View>
    </View>
  );
};

export default React.memo(HeaderV2);
