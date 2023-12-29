import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, View, TouchableOpacity} from 'react-native';

import VoucherListItem from './components/VoucherListItem';
import {vouchers} from '../../actions/rewards.action';
import {navigate} from '../../utils/navigation.utils';

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  touchableVoucher: {
    width: '100%',
    height: 'auto',
  },
});

const VoucherList = () => {
  const dispatch = useDispatch();
  const voucherList = useSelector(
    state => state.rewardsReducer?.vouchers?.dataVoucher,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(vouchers());
    };
    loadData();
  }, [dispatch]);

  const renderRewardList = () => {
    const result = voucherList?.map(voucher => {
      return (
        <TouchableOpacity
          style={styles.touchableVoucher}
          onPress={() => {
            navigate('voucherDetail', {dataVoucher: voucher});
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

  return <View style={styles.root}>{renderRewardList()}</View>;
};

export default VoucherList;
