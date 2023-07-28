import React from 'react';
import {FlatList, ScrollView, StyleSheet} from 'react-native';
import GlobalText from '../../components/globalText';
import {useDispatch, useSelector} from 'react-redux';
import {myVouchers} from '../../actions/account.action';
import ListVoucher from './components/ListVoucher';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
});

const MyVoucher = () => {
  const dispatch = useDispatch();
  const voucherLust = useSelector(
    state => state.accountsReducer.myVouchers?.vouchers,
  );

  const renderList = ({item, index}) => <ListVoucher item={item} key={index} />;

  React.useEffect(() => {
    dispatch(myVouchers());
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.scrollContainer}
      data={voucherLust}
      renderItem={renderList}
    />
  );
};

export default MyVoucher;
