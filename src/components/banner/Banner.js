import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, ScrollView, View, Image, Dimensions} from 'react-native';

import {dataPromotion} from '../../actions/promotion.action';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const styles = StyleSheet.create({
    wrap: {
      width: WIDTH,
    },
    wrapImage: {
      width: WIDTH,
    },
    image: {
      height: undefined,
      width: WIDTH,
      maxWidth: WIDTH,
      aspectRatio: 16 / 8,
    },
    WrapDot: {
      position: 'absolute',
      bottom: 32,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    activeDot: {
      margin: 3,
      backgroundColor: 'white',
      width: 30,
      height: 10,
      borderRadius: 50,
    },
    inactiveDot: {
      margin: 3,
      backgroundColor: 'white',
      width: 10,
      height: 10,
      borderRadius: 50,
    },
  });
  return styles;
};

const Banner = () => {
  const styles = useStyles();
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
        <View style={styles.wrapImage}>
          <Image
            key={index}
            style={styles.image}
            resizeMode="stretch"
            source={{uri: banner?.defaultImageURL}}
          />
        </View>
      );
    });
    return result;
  };

  const renderDot = () => {
    const dots = banners?.map((image, index) => {
      const styleDot =
        selectedImage === index ? styles.activeDot : styles.inactiveDot;

      return <View key={index} style={styleDot} />;
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
