/* eslint-disable react-hooks/exhaustive-deps */
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
  const [loading, setLoading] = React.useState(false);
  const voucherLust = useSelector(
    state => state.accountsReducer.myVouchers?.vouchers,
  );

  const renderList = ({item, index}) => <ListVoucher item={item} key={index} />;

  const onRefresh = async () => {
    setLoading(true);
    await dispatch(myVouchers());
    setLoading(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.scrollContainer}
      data={voucherLust}
      renderItem={renderList}
      onRefresh={onRefresh}
      refreshing={loading}
    />
  );
};

export default MyVoucher;
