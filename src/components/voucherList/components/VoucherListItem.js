import React from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';

import colorConfig from '../../../config/colorConfig';
import appConfig from '../../../config/appConfig';
import {normalizeLayoutSizeHeight} from '../../../helper/Layout';
import Theme from '../../../theme/Theme';

const useStyles = () => {
  const {fontFamily} = Theme();
  const styles = StyleSheet.create({
    viewVoucher: {
      flex: 1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewVoucherQty: {
      top: 0,
      left: 0,
      position: 'absolute',
      backgroundColor: colorConfig.primaryColor,
      borderBottomRightRadius: 8,
      borderTopLeftRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 8.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewVoucherPointToRedeem: {
      top: 0,
      right: 0,
      position: 'absolute',
      backgroundColor: colorConfig.primaryColor,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageBackground: {
      height: normalizeLayoutSizeHeight(154),
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 16,
    },
    image: {
      borderRadius: 8,
    },
    textWhite: {fontSize: 12, fontFamily: fontFamily.poppinsBold},
    textTitle: {
      fontSize: 18,
      marginBottom: 16,
      fontFamily: fontFamily.poppinsBold,
    },
  });

  return {styles};
};

const VoucherListItem = ({voucher, qty, pointToRedeem}) => {
  const {styles} = useStyles();
  const renderVoucherPointToRedeem = () => {
    if (pointToRedeem) {
      return (
        <View style={styles.viewVoucherPointToRedeem}>
          <Text style={styles.textWhite}>{pointToRedeem} Points</Text>
        </View>
      );
    }
  };

  const renderVoucherQty = () => {
    if (qty) {
      return (
        <View style={styles.viewVoucherQty}>
          <Text style={styles.textWhite}>{qty} x</Text>
        </View>
      );
    }
  };

  const renderVoucherTitle = () => {
    return <Text style={styles.textTitle}>{voucher?.name}</Text>;
  };

  const handleImage = () => {
    if (!voucher.image) {
      return appConfig.appImageNull;
    }
    return {uri: voucher.image};
  };

  return (
    <>
      <Image
        style={styles.imageBackground}
        imageStyle={styles.image}
        resizeMode="contain"
        source={handleImage()}
      />
      {renderVoucherTitle()}
      {renderVoucherPointToRedeem()}
      {renderVoucherQty()}
    </>
  );
};

export default VoucherListItem;
