import React from 'react';
import GlobalText from '../../components/globalText';
import {ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {vouchers} from '../../actions/rewards.action';

const ReedemVoucher = () => {
  const dispatch = useDispatch();
  const redeemVoucherList = React.useEffect(() => {
    dispatch(vouchers());
  }, []);

  return (
    <ScrollView>
      <GlobalText>reedem</GlobalText>
    </ScrollView>
  );
};

export default ReedemVoucher;
