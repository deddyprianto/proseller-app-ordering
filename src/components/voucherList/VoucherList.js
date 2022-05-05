import React from 'react';

import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {Actions} from 'react-native-router-flux';
import VoucherListItem from './components/VoucherListItem';

const styles = StyleSheet.create({
  touchableVoucher: {
    width: '100%',
    height: 'auto',
  },
});

const Redeem = () => {
  const categories = [
    {
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'martin',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'test',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
    {
      name: 'anjay',
      image:
        'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    },
  ];

  const renderRewardList = () => {
    const result = categories.map(category => {
      return (
        <TouchableOpacity
          style={styles.touchableVoucher}
          onPress={() => {
            Actions.voucherDetail();
          }}>
          <VoucherListItem voucher={category} pointToRedeem="120" />
        </TouchableOpacity>
      );
    });
    return result;
  };

  return <View>{renderRewardList()}</View>;
};

export default Redeem;
