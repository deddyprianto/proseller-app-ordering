import React, {useEffect, useState} from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import OneSignal from 'react-native-onesignal';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import History from './history';
import Profile from './Profile';
import Store from './store';
import Home from './home';
import Inbox from './inbox';
import Rewards from './rewards';
import ScannerBarcode from './ScannerBarcode';
import OnBoarding from './OnBoarding';

import appConfig from '../config/appConfig';

import {getColorSettings} from '../actions/setting.action';

import Theme from '../theme';
import awsConfig from '../config/awsConfig';
import {dataInbox} from '../actions/inbox.action';
import MessageCounter from '../components/MessageCounter';
import additionalSetting from '../config/additionalSettings';
import {HistoryNotificationModal} from '../components/modal';
import {
  openPopupNotification,
  removeBasket,
  setNotificationData,
} from '../actions/order.action';
import {navigate} from '../utils/navigation.utils';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    iconNavbarItem: {
      width: '100%',
      maxWidth: 36,
      maxHeight: 36,
      height: undefined,
      aspectRatio: 1 / 1,
      tintColor: theme.colors.textTertiary,
    },
    iconNavbarItemActive: {
      width: '100%',
      maxWidth: 36,
      maxHeight: 36,
      height: undefined,
      aspectRatio: 1 / 1,
      tintColor: theme.colors.textQuaternary,
    },
    iconNavbarScan: {
      width: '100%',
      maxWidth: 36,
      maxHeight: 36,
      height: undefined,
      aspectRatio: 1 / 1,
      tintColor: theme.colors.textSecondary,
    },
    textNavbarScan: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNavbarItem: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNavbarItemActive: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewNavbar: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 5,
      height: 77,
      backgroundColor: 'white',
      width: '100%',
    },
    viewNavbarContent: {
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    viewNavbarItem: {
      width: (WIDTH * 20) / 100,
      height: 77,
      display: 'flex',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    viewNavbarItemScan: {
      width: (WIDTH * 20) / 100,
      height: (WIDTH * 20) / 100,
      marginBottom: 20,
      borderRadius: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backgroundColor: theme.colors.buttonActive,
    },
    viewGroupProduct: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 70,
    },
  });
  return styles;
};

const NewPageIndex = () => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [notification, setNotification] = useState({});

  const isLoggedIn = useSelector(state => state.authReducer.authData.token);
  const defaultOutlet = useSelector(
    state => state.storesReducer?.defaultOutlet?.defaultOutlet,
  );
  const basketStoreCheckout = useSelector(state => state.orderReducer?.dataBasket?.product?.isStoreCheckoutCart);

  useEffect(() => {
    const loadData = async () => {
      const isFEF = appConfig.appName === 'fareastflora';
      basketStoreCheckout && isFEF && await dispatch(removeBasket());
      await dispatch(getColorSettings());
    };
    loadData();
    dispatch(dataInbox(0, 100));
  }, [dispatch]);

  const dataRetailScreens = {
    Home: Home,
    Inbox: Inbox,
    Scan: ScannerBarcode,
    Orders: History,
    Profile: Profile,
  };

  const dataFnBScreens = {
    Home: Home,
    Inbox: Inbox,
    Rewards: Rewards,
    History: History,
    Profile: Profile,
  };

  const screens =
    awsConfig.COMPANY_TYPE === 'Retail' ? dataRetailScreens : dataFnBScreens;

  const handleImage = name => {
    switch (name) {
      case 'Home':
        return appConfig.iconHome;
      case 'Inbox':
        return appConfig.iconEmail;
      case 'Orders':
        return appConfig.iconHistory;
      case 'History':
        return appConfig.iconHistory;
      case 'Rewards':
        return appConfig.iconReward;
      case 'Profile':
        return appConfig.iconProfile;
      case 'Login':
        return appConfig.iconLogin;
      default:
        return appConfig.iconHome;
    }
  };

  React.useEffect(() => {
    handleGetNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderNavbarDefault = ({props, name, index}) => {
    const isActive = props?.navigation?.state?.index === index;

    const textStyle = isActive
      ? styles.textNavbarItemActive
      : styles.textNavbarItem;

    const imageStyle = isActive
      ? styles.iconNavbarItemActive
      : styles.iconNavbarItem;

    return (
      <>
        <TouchableOpacity
          style={styles.viewNavbarItem}
          activeOpacity={1}
          onPress={() => {
            !isLoggedIn ? navigate('login') : props.navigation.navigate(name);
          }}>
          <Image source={handleImage(name)} style={imageStyle} />
          <Text numberOfLines={1} style={textStyle}>
            {name}
          </Text>
          {name === 'Inbox' ? <MessageCounter /> : null}
        </TouchableOpacity>
      </>
    );
  };
  const handleGetNotification = () => {
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        const currentPage = Actions.currentScene;
        const getNotification = notificationReceivedEvent.getNotification();
        if (
          currentPage === 'paymentSuccess' ||
          currentPage === 'pendingOrderDetail' ||
          currentPage === 'pageIndex' ||
          currentPage === 'payment'
        ) {
          dispatch(setNotificationData(getNotification));
          dispatch(openPopupNotification(true));
        } else {
          setNotification(getNotification);
          setIsOpenNotification(true);
        }
        notificationReceivedEvent.complete(getNotification);
      },
    );
  };

  const renderHistoryNotificationModal = props => {
    return (
      <HistoryNotificationModal
        value={notification}
        open={isOpenNotification}
        handleClose={() => {
          setIsOpenNotification(false);
        }}
      />
    );
  };

  const renderNavbarScan = () => {
    return (
      <View style={styles.viewNavbarItem}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigate('scannerBarcode');
          }}
          style={styles.viewNavbarItemScan}>
          <Image source={appConfig.iconScan} style={styles.iconNavbarScan} />
          <Text style={styles.textNavbarScan}>Scan</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNavbarItem = ({props, name, index}) => {
    if (name === 'Scan') {
      if (
        additionalSetting().enableScannerButton &&
        defaultOutlet?.enableStoreCheckOut
      ) {
        return renderNavbarScan();
      }
      return null;
    } else {
      return renderNavbarDefault({props, name, index});
    }
  };

  const renderNavbar = props => {
    const result = Object.keys(screens).map((name, index) => {
      return renderNavbarItem({props, name, index});
    });

    return (
      <View style={styles.viewNavbar}>
        {renderHistoryNotificationModal()}

        <View style={styles.viewNavbarContent}>{result}</View>
      </View>
    );
  };

  const TabNavigator = createBottomTabNavigator(screens, {
    initialRouteName: 'Home',
    tabBarComponent: props => {
      return renderNavbar(props);
    },
  });

  const Tabs = createAppContainer(TabNavigator);

  if (!isLoggedIn && !additionalSetting().enableFnBBrowseMode) {
    return <OnBoarding />;
  } else if (!defaultOutlet.id && awsConfig.COMPANY_TYPE === 'Retail') {
    return <Store />;
  } else if (isLoggedIn || additionalSetting().enableScannerButton) {
    return (
      <SafeAreaView style={styles.root}>
        <Tabs />
      </SafeAreaView>
    );
  } else {
    return null;
  }
};

export default NewPageIndex;
