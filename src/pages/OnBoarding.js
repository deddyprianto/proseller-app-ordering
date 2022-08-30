import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';

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

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {useDispatch} from 'react-redux';
import {getLoginSettings} from '../actions/setting.action';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  root: {
    flex: 1,
  },
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    marginHorizontal: 20,
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
  colorWhite: {
    color: 'white',
  },
  colorPrimary: {
    color: colorConfig.primaryColor,
  },
  touchableLogin: {
    height: 34,
    width: '47%',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableRegister: {
    height: 34,
    width: '47%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
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
    backgroundColor: 'white',
  },
  textTitle: {
    fontSize: 20,
    color: colorConfig.primaryColor,
    fontWeight: 'bold',
    marginTop: 10,
  },
  textDescription: {
    fontSize: 16,
    color: colorConfig.primaryColor,
    textAlign: 'center',
    width: 250,
    marginTop: 10,
  },
});

const OnBoarding = () => {
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getLoginSettings());
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

  const images = [
    appConfig.imageOnBoarding1,
    appConfig.imageOnBoarding2,
    appConfig.imageOnBoarding3,
    appConfig.imageOnBoarding4,
  ];

  const renderImages = () => {
    const result = images.map((image, index) => {
      return (
        <Image
          key={index}
          style={{
            height: HEIGHT,
            width: WIDTH,
          }}
          resizeMode="stretch"
          source={image}
        />
      );
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
          Actions.register();
        }}>
        <Text style={styles.colorPrimary}>Create New Account</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonLogin = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.touchableLogin}
        onPress={() => {
          Actions.login();
        }}>
        <Text style={styles.colorWhite}>Login</Text>
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
