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
    indicatorStyle: {
      backgroundColor: 'white',
    },
    whiteBg: {
      backgroundColor: 'white',
    },
    primaryText: {
      color: colors.primary,
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
  const [activeTab, setActiveTab] = React.useState(null);
  const [routes] = React.useState([
    {key: 'first', title: 'My Voucher'},
    {key: 'second', title: 'Redeem Voucher'},
  ]);
  console.log(index, 'valman');

  const onTabPress = val => {
    setActiveTab(val.route.key);
  };

  const handleTabbarSTyle = activeTab => {
    console.log(index, activeTab, 'hynuman');
    if (index === activeTab) {
      return [styles.whiteBg];
    }
    return [styles.tabbarStyle];
  };

  const renderTabBar = props => {
    console.log(props, 'papina');
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabbarStyle}
        renderIndicator={null}

        // onTabPress={onTabPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaCOntainer}>
      <Header
        rootStyle={styles.rootStyle}
        leftTitle
        usingPrimaryColor
        title={'Vouchers'}
      />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </SafeAreaView>
  );
};

export default VoucherDetailV2;
