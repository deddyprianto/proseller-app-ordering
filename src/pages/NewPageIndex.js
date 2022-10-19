import React, {useEffect} from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';

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
    },
    viewNavbarContent: {
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      position: 'absolute',
      bottom: 0,
    },
    viewNavbarItem: {
      elevation: 10,
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
  const styles = useStyles();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(
    state => state.authReducer?.authData?.isLoggedIn,
  );

  const defaultOutlet = useSelector(
    state => state.storesReducer?.defaultOutlet?.defaultOutlet,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getColorSettings());
    };
    loadData();
  }, [dispatch]);

  const dataRetailScreens = {
    Home: Home,
    Inbox: Inbox,
    Scan: ScannerBarcode,
    History: History,
    Profile: Profile,
  };

  const dataFnBScreens = {
    Home: Home,
    Inbox: Inbox,
    Rewards: Rewards,
    History: History,
    Profile: Profile,
  };
  const screens = true ? dataRetailScreens : dataFnBScreens;

  const handleImage = name => {
    switch (name) {
      case 'Home':
        return appConfig.iconHome;
      case 'Inbox':
        return appConfig.iconEmail;
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

  const renderNavbarDefault = ({props, name, index}) => {
    const isActive = props?.navigation?.state?.index === index;

    const textStyle = isActive
      ? styles.textNavbarItemActive
      : styles.textNavbarItem;

    const imageStyle = isActive
      ? styles.iconNavbarItemActive
      : styles.iconNavbarItem;

    return (
      <TouchableOpacity
        style={styles.viewNavbarItem}
        activeOpacity={1}
        onPress={() => {
          props.navigation.navigate(name);
        }}>
        <Image source={handleImage(name)} style={imageStyle} />
        <Text numberOfLines={1} style={textStyle}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderNavbarScan = () => {
    return (
      <View style={styles.viewNavbarItem}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            Actions.scannerBarcode();
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
      return renderNavbarScan();
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

  if (!isLoggedIn) {
    return <OnBoarding />;
  } else if (!defaultOutlet?.id) {
    return <Store />;
  } else {
    return (
      <SafeAreaView style={styles.root}>
        <Tabs />
      </SafeAreaView>
    );
  }
};

export default NewPageIndex;
