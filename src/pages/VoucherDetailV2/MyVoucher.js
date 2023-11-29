/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {myVouchers, updateMyVoucher} from '../../actions/account.action';
import ListVoucher from './components/ListVoucher';
import EmptyVoucher from './components/EmptyVoucher';
import {uniqBy} from 'lodash';
import SearchVoucherCode from './SearchVoucherCode';
import useVouchers from '../../hooks/vouchers/useVouchers';
import {debounce} from 'lodash';
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
  const [serialCode, setSerialCode] = React.useState('');
  const voucherList = useSelector(
    state => state.accountsReducer.myVouchers?.vouchers,
  );
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [loadingRedeem, setLoadingRedeem] = React.useState(false);
  const {checkVoucher} = useVouchers();
  const renderList = ({item, index}) => (
    <ListVoucher
      isMyVoucher={true}
      vouchers={voucherList}
      item={item}
      key={index}
    />
  );
  const onRefresh = async useLoading => {
    if (useLoading) {
      setLoading(true);
    }
    await dispatch(myVouchers());
    setLoading(false);
    setLoadingRedeem(false);
  };

  const onRefreshLoading = () => {
    onRefresh(true);
  };

  const onTypeCode = text => {
    setErrorMessage(null);
    setSerialCode(text.toUpperCase());
  };

  const onRedeemVoucher = async () => {
    setLoadingRedeem(true);
    const response = await checkVoucher(serialCode);
    if (response?.serialNumber) {
      onRefreshLoading();
      setSerialCode('');
    } else {
      if (response.status) {
        dispatch(updateMyVoucher(response));
      } else {
        setErrorMessage(response.message);
      }
      setLoadingRedeem(false);
      setSerialCode('');
    }
  };

  const removeCode = () => setSerialCode('');

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useEffect(() => {
    if (voucherList && Array.isArray(voucherList)) {
      const uniq = uniqBy(voucherList, 'id');
      setUniqVoucher(uniq);
    }
  }, [JSON.stringify(voucherList)]);

  return (
    <FlatList
      contentContainerStyle={[styles.scrollContainer, styles.contentContainer]}
      style={styles.flatStyle}
      data={uniqVoucher}
      renderItem={renderList}
      onRefresh={onRefreshLoading}
      refreshing={loading}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <SearchVoucherCode
          onSearchCode={onTypeCode}
          onRedeem={onRedeemVoucher}
          loading={loadingRedeem}
          codeValue={serialCode}
          onRemoveCode={removeCode}
          isError={errorMessage}
        />
      }
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
  );
};

export default React.memo(MyVoucher);
