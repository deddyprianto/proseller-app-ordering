import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import appConfig from '../config/appConfig';
import {useDispatch} from 'react-redux';
import {getDialCodes, getLoginSettings} from '../actions/setting.action';
import Theme from '../theme';
import {navigate} from '../utils/navigation.utils';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    image: {
      height: '100%',
      width: WIDTH,
    },
    WrapDot: {
      elevation: 2,
      flexDirection: 'row',
      alignSelf: 'center',
      position: 'absolute',
      bottom: (HEIGHT * 15) / 100,
    },
    activeDot: {
      height: 10,
      width: 10,
      borderRadius: 10,
      color: 'transparent',
      borderWidth: 1,
      borderColor: 'white',
      margin: 5,
    },
    inactiveDot: {
      height: 10,
      width: 10,
      borderRadius: 10,
      backgroundColor: 'white',
      margin: 5,
    },
    marginTop20: {
      marginTop: 20,
    },
    textLogin: {
      color: theme.colors.textSecondary,
    },
    textRegister: {
      color: theme.colors.textQuaternary,
    },
    touchableLogin: {
      height: 34,
      width: '47%',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    touchableRegister: {
      height: 34,
      width: '47%',
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    viewRegisterAndLogin: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      width: '100%',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      marginTop: -10,
      backgroundColor: theme.colors.brandSecondary,
    },
  });
  return styles;
};

const OnBoarding = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getLoginSettings());
      await dispatch(getDialCodes());
    };
    return loadData();
  }, [dispatch]);

  const handleOnScroll = nativeEvent => {
    const image = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );

    if (image !== selectedImage) {
      setSelectedImage(image);
    }
  };

  let images = [
    appConfig.imageOnBoarding1,
    appConfig.imageOnBoarding2,
    appConfig.imageOnBoarding3,
  ];

  const renderImages = () => {
    if (appConfig.appName === 'fareastflora') {
      images.push(appConfig.imageOnBoarding4);
    }
    const result = images.map((image, index) => {
      return <Image key={index} style={styles.image} source={image} />;
    });

    return result;
  };

  const renderDot = () => {
    const dots = images.map((_, index) => {
      const styleDot =
        selectedImage === index ? styles.activeDot : styles.inactiveDot;

      return (
        <View style={styles.marginTop20}>
          <View key={index} style={styleDot} />
        </View>
      );
    });

    const result = <View style={styles.WrapDot}>{dots}</View>;

    return result;
  };

  const renderButtonRegister = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchableRegister}
        onPress={() => {
          navigate('register');
        }}>
        <Text style={styles.textRegister}>Create New Account</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonLogin = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchableLogin}
        onPress={() => {
          navigate('login');
        }}>
        <Text style={styles.textLogin}>Login</Text>
      </TouchableOpacity>
    );
  };
  const renderRegisterAndLoginButton = () => {
    return (
      <View style={styles.viewRegisterAndLogin}>
        {renderButtonRegister()}
        {renderButtonLogin()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.root}
        onScroll={({nativeEvent}) => {
          handleOnScroll(nativeEvent);
        }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal>
        {renderImages()}
      </ScrollView>
      {renderDot()}
      {renderRegisterAndLoginButton()}
    </SafeAreaView>
  );
};

export default OnBoarding;
