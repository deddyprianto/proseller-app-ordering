import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import Theme from '../../theme/Theme';
import {Header} from '../../components/layout';
import MyVoucher from './MyVoucher';
import RedeemVouchers from './RedeemVoucher';
import TabbarComponent from '../../components/tabbarComponent';
import GlobalText from '../../components/globalText';
import {useSelector} from 'react-redux';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';

const useStyles = () => {
  const {colors, fontFamily} = Theme();

  const styles = StyleSheet.create({
    safeAreaCOntainer: {
      flex: 1,
    },
    tabbarStyle: {
      backgroundColor: colors.primary,
      marginTop: 0,
    },
    rootStyle: {
      paddingBottom: 0,
    },
    indicatorStyle: {
      backgroundColor: 'white',
    },
    whiteBg: {
      backgroundColor: 'white',
    },
    primaryText: {
      color: colors.primary,
    },
    tpContainer: {
      width: normalizeLayoutSizeWidth(128),
    },
    tpText: {
      marginLeft: 'auto',
      fontFamily: fontFamily.poppinsMedium,
      color: 'white',
    },
  });
  return {styles};
};

const MyVoucherRoute = () => <MyVoucher />;

const RedeemRoute = () => <RedeemVouchers />;

const VoucherDetailV2 = () => {
  const {styles} = useStyles();
  const [routes] = React.useState([
    {key: 'second', title: 'Redeem Voucher', children: RedeemRoute},
    {key: 'first', title: 'My Voucher', children: MyVoucherRoute},
  ]);

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  const renderCustomRightIcon = () => (
    <View style={styles.tpContainer}>
      <GlobalText style={styles.tpText}>Your Points: {totalPoint}</GlobalText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaCOntainer}>
      <Header
        rootStyle={styles.rootStyle}
        leftTitle
        usingPrimaryColor
        title={'Vouchers'}
        customRightIcon={renderCustomRightIcon}
      />
      <TabbarComponent routes={routes} />
    </SafeAreaView>
  );
};

export default VoucherDetailV2;
