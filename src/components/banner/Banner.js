import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
import {dataPromotion} from '../../actions/promotion.action';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  wrap: {
    width: WIDTH,
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.01,
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
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);

  const banners = useSelector(
    state => state.promotionReducer.dataPromotion.promotion,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataPromotion());
    };
    loadData();
  }, [dispatch]);

  const onChange = nativeEvent => {
    const image = Math.ceil(nativeEvent.contentOffset.x / 420);

    if (image !== selectedImage) {
      setSelectedImage(image);
    }
  };

  const renderImages = () => {
    const result = banners?.map((banner, index) => {
      return (
        <Image
          key={index}
          style={styles.wrapImage}
          resizeMode="stretch"
          source={{uri: banner?.defaultImageURL}}
        />
      );
    });
    return result;
  };

  const renderDot = () => {
    const dots = banners?.map((image, index) => {
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
    <View style={styles.wrap}>
      <ScrollView
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
  );
};

export default Banner;
