import React from 'react';

import {StyleSheet, View, Text, ImageBackground} from 'react-native';

import colorConfig from '../../../config/colorConfig';

const styles = StyleSheet.create({
  viewVoucher: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    height: 90,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    borderRadius: 8,
  },
  textWhite: {fontSize: 12, color: 'white'},
  textTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
});

const VoucherListItem = ({voucher, qty, pointToRedeem}) => {
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

  return (
    <ImageBackground
      style={styles.imageBackground}
      imageStyle={styles.image}
      source={{uri: voucher?.image}}>
      <View style={styles.viewVoucher}>
        {renderVoucherTitle()}
        {renderVoucherPointToRedeem()}
        {renderVoucherQty()}
      </View>
    </ImageBackground>
  );
};

export default VoucherListItem;
