import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {Actions} from 'react-native-router-flux';
import VoucherListItem from './components/VoucherListItem';
import {myVouchers} from '../../actions/account.action';

const styles = StyleSheet.create({
  touchableVoucher: {
    width: '100%',
    height: 'auto',
  },
});

const VoucherList = () => {
  const dispatch = useDispatch();
  const vouchers = useSelector(
    state => state.accountsReducer?.myVouchers?.vouchers,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(myVouchers());
    };
    loadData();
  }, [dispatch]);

  const renderRewardList = () => {
    const result = vouchers?.map(voucher => {
      return (
        <TouchableOpacity
          style={styles.touchableVoucher}
          onPress={() => {
            Actions.voucherDetail({voucher});
          }}>
          <VoucherListItem
            voucher={voucher}
            pointToRedeem={voucher?.redeemValue}
          />
        </TouchableOpacity>
      );
    });
    return result;
  };

  return <View>{renderRewardList()}</View>;
};

export default VoucherList;
