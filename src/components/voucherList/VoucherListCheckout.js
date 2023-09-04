import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import VoucherCard from '../../assets/img/Selected-voucher.png';
import GlobalText from '../globalText';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';

const styles = StyleSheet.create({
  imageContainer: {
    width: normalizeLayoutSizeWidth(396),
    height: normalizeLayoutSizeWidth(92),
    justifyContent: 'center',
    paddingHorizontal: 22,
    marginTop: 16,
  },
  voucherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const VoucherListCheckout = ({onPress, item, type}) => {
  const handleImage = () => {};

  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground style={styles.imageContainer} source={VoucherCard}>
        <View style={styles.voucherContainer}>
          <View>
            <GlobalText>{item?.name} </GlobalText>
          </View>
          <View>
            <TouchableOpacity onPress={onPress}>
              <GlobalText>Use Now</GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default React.memo(VoucherListCheckout);
