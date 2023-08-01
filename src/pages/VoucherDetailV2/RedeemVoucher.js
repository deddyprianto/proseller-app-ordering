/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {vouchers} from '../../actions/rewards.action';
import ListVoucher from './components/ListVoucher';
import EmptyVoucher from './components/EmptyVoucher';

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  flatStyle: {
    flex: 1,
  },
});

const ReedemVoucher = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  const vouchersList = useSelector(
    state => state.rewardsReducer.vouchers?.dataVoucher,
  );
  const redeemVoucherList = async useLoading => {
    if (useLoading) {
      setLoading(true);
    }
    await dispatch(vouchers());
    setLoading(false);
  };

  const renderItem = ({item}) => <ListVoucher item={item} />;

  const onRefresh = () => {
    redeemVoucherList(true);
  };

  React.useEffect(() => {
    redeemVoucherList(false);
  }, []);
  return (
    <FlatList
      keyExtractor={(item, index) => item.id}
      renderItem={renderItem}
      style={styles.flatStyle}
      onRefresh={onRefresh}
      refreshing={loading}
      data={vouchersList || []}
      contentContainerStyle={[styles.scrollContainer, styles.contentContainer]}
      ListEmptyComponent={
        !loading && (
          <EmptyVoucher
            text={
              'There are no available vouchers for redemption. Stay tuned for exciting offers!'
            }
          />
        )
      }
    />
  );
};

export default React.memo(ReedemVoucher);
