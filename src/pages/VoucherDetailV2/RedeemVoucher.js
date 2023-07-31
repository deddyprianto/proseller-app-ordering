/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {vouchers} from '../../actions/rewards.action';
import ListVoucher from './components/ListVoucher';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
});

const ReedemVoucher = () => {
  const dispatch = useDispatch();
  const vouchersList = useSelector(
    state => state.rewardsReducer.vouchers?.dataVoucher,
  );
  const redeemVoucherList = () => {
    dispatch(vouchers());
  };

  const renderItem = ({item}) => <ListVoucher item={item} />;

  React.useEffect(() => {
    redeemVoucherList();
  }, []);
  console.log(vouchersList, 'hebat');
  return (
    <FlatList
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
      data={vouchersList || []}
      contentContainerStyle={styles.scrollContainer}
    />
  );
};

export default ReedemVoucher;
