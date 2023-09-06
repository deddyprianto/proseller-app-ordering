/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Dimensions, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {myVouchers} from '../../actions/account.action';
import ListVoucher from './components/ListVoucher';
import EmptyVoucher from './components/EmptyVoucher';
import {uniqBy} from 'lodash';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    minHeight: Dimensions.get('window').height / 5,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  flatStyle: {
    flex: 1,
  },
});

const MyVoucher = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [uniqVoucher, setUniqVoucher] = React.useState([]);
  const voucherList = useSelector(
    state => state.accountsReducer.myVouchers?.vouchers,
  );

  const renderList = ({item, index}) => (
    <ListVoucher vouchers={voucherList} item={item} key={index} />
  );

  const onRefresh = async useLoading => {
    if (useLoading) {
      setLoading(true);
    }
    await dispatch(myVouchers());
    setLoading(false);
  };

  const onRefreshLoading = () => {
    onRefresh(true);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useEffect(() => {
    if (voucherList && Array.isArray(voucherList)) {
      const uniq = uniqBy(voucherList, 'id');
      setUniqVoucher(uniq);
    }
  }, [voucherList]);

  return (
    <>
      <FlatList
        contentContainerStyle={[
          styles.scrollContainer,
          styles.contentContainer,
        ]}
        style={styles.flatStyle}
        data={uniqVoucher}
        renderItem={renderList}
        onRefresh={onRefreshLoading}
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
