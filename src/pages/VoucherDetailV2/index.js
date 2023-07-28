import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import GlobalText from '../../components/globalText';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import Theme from '../../theme/Theme';
import {Header} from '../../components/layout';
import MyVoucher from './MyVoucher';
import RedeemVouchers from '../../components/vouchers/RedeemVouchers';

const useStyles = () => {
  const {colors} = Theme();

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
  });
  return {styles};
};

const MyVoucherRoute = () => <MyVoucher />;

const RedeemRoute = () => <RedeemVouchers />;

const renderScene = SceneMap({
  first: MyVoucherRoute,
  second: RedeemRoute,
});

const VoucherDetailV2 = () => {
  const layout = useWindowDimensions();

  const {styles} = useStyles();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'My Voucher'},
    {key: 'second', title: 'Redeem Voucher'},
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={styles.tabbarStyle}
    />
  );

  return (
    <SafeAreaView style={styles.safeAreaCOntainer}>
      <Header
        rootStyle={styles.rootStyle}
        leftTitle
        usingPrimaryColor
        title={'Vouchers'}
      />
      <ScrollView>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VoucherDetailV2;
