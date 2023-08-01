/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {myVouchers} from '../../actions/account.action';
import ListVoucher from './components/ListVoucher';
import EmptyVoucher from './components/EmptyVoucher';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 30,
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
    <>
      <FlatList
        contentContainerStyle={[
          styles.scrollContainer,
          styles.contentContainer,
        ]}
        data={voucherLust}
        renderItem={renderList}
        onRefresh={onRefresh}
        refreshing={loading}
        ListEmptyComponent={
          !loading && (
            <EmptyVoucher
              text={
                'Your voucher collection is waiting to be filled! Begin placing orders and earning points to unlock redeemable vouchers.'
              }
            />
          )
        }
      />
    </>
  );
};

export default React.memo(MyVoucher);
