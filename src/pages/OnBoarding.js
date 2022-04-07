import React, {useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';

const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrap: {
    width: 400,
  },
  viewImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: 360, height: 400, marginHorizontal: 20},
  WrapDot: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  activeDot: {
    fontSize: 16,
    margin: 3,
    marginHorizontal: 10,
    color: '#BB1515',
  },
  inactiveDot: {
    fontSize: 16,
    margin: 3,
    marginHorizontal: 10,
    color: 'grey',
  },
  marginTop20: {marginTop: 20},
  colorWhite: {color: 'white'},
  touchableLogin: {
    height: 40,
    width: 150,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableRegister: {
    height: 40,
    width: 150,
    backgroundColor: 'grey',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  viewRegisterAndLogin: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
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
  const [selectedImage, setSelectedImage] = useState(0);

  const handleOnScroll = nativeEvent => {
    const image = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );

    if (image !== selectedImage) {
      setSelectedImage(image);
    }
  };

  const images = [
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/08/18/16/38/paper-2655579_1280.jpg',
  ];

  const renderImages = () => {
    const result = images.map((image, index) => {
      return (
        <View style={styles.viewImage}>
          <Image
            key={index}
            style={styles.image}
            resizeMode="stretch"
            source={{uri: image}}
          />
          <Text style={styles.textTitle}>Skip the Queue</Text>
          <Text style={styles.textDescription}>
            Place an order through the Fun Toast app and skip the queue.
            Available for dine-in or takeaway.
          </Text>
        </View>
      );
    });
    return result;
  };

  const renderDot = () => {
    const dots = images.map((image, index) => {
      return (
        <View style={styles.marginTop20}>
          <Text
            key={index}
            style={
              selectedImage === index ? styles.activeDot : styles.inactiveDot
            }>
            {'\u2B24'}
          </Text>
        </View>
      );
    });

    const result = <View style={styles.WrapDot}>{dots}</View>;

    return result;
  };

  const renderRegisterAndLoginButton = () => {
    return (
      <View style={styles.viewRegisterAndLogin}>
        <TouchableOpacity
          style={styles.touchableRegister}
          onPress={() => {
            Actions.register();
          }}>
          <Text>Create New Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableLogin}
          onPress={() => {
            Actions.login();
          }}>
          <Text style={styles.colorWhite}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.wrap}
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
