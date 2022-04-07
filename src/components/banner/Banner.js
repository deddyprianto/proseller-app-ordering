import React, {useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {TouchableOpacityComponent} from 'react-native';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';

import colorConfig from '../../config/colorConfig';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.01,
  },
  wrap: {
    width: WIDTH,
  },
  wrapImage: {
    height: HEIGHT * 0.25,
    width: WIDTH * 0.95,
    marginLeft: WIDTH * 0.025,
    marginRight: WIDTH * 0.025,
    borderRadius: 10,
  },
  WrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  activeDot: {
    margin: 3,
    color: colorConfig.primaryColor,
  },
  inactiveDot: {
    margin: 3,
    color: 'white',
  },
});

const Banner = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const onChange = nativeEvent => {
    const image = Math.ceil(nativeEvent.contentOffset.x / 420);

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
        <Image
          key={index}
          style={styles.wrapImage}
          resizeMode="stretch"
          source={{uri: image}}
        />
      );
    });
    return result;
  };

  const renderDot = () => {
    const dots = images.map((image, index) => {
      return (
        <Text
          key={index}
          style={
            selectedImage === index ? styles.activeDot : styles.inactiveDot
          }>
          {'\u2B24'}
        </Text>
      );
    });

    const result = <View style={styles.WrapDot}>{dots}</View>;

    return result;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrap}>
        <ScrollView
          style={styles.wrap}
          onScroll={({nativeEvent}) => {
            onChange(nativeEvent);
          }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal>
          {renderImages()}
        </ScrollView>
        {renderDot()}
      </View>
    </SafeAreaView>
  );
};

export default Banner;
