import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Swiper from 'react-native-swiper';
import Theme from '../../theme';

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {dataPromotion} from '../../actions/promotion.action';
import {Actions} from 'react-native-router-flux';
import {isEmptyArray} from '../../helper/CheckEmpty';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const styles = StyleSheet.create({
    wrap: {
      height: WIDTH / 3,
    },

    wrapImage: {
      width: WIDTH,
    },
    image: {
      height: undefined,
      width: WIDTH,
      maxWidth: WIDTH,
      aspectRatio: 3 / 1,
    },
    activeDot: {
      opacity: 1,
      margin: 3,
      backgroundColor: Theme().colors.primary,
      width: 30,
      height: 10,
      borderRadius: 50,
    },
    inactiveDot: {
      opacity: 0.5,
      margin: 3,
      backgroundColor: Theme().colors.inactiveDot,
      width: 10,
      height: 10,
      borderRadius: 50,
    },
  });
  return styles;
};

const Banner = ({bottom = 0}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const banners = useSelector(
    state => state.promotionReducer.dataPromotion.promotion,
  );

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataPromotion());
    };
    loadData();
  }, [dispatch]);

  const handleBannerClick = item => {
    return Actions.storeDetailPromotion({
      dataPromotion: item,
      item: defaultOutlet,
    });
  };

  const renderImages = () => {
    const result = banners?.map((banner, index) => {
      return (
        <TouchableOpacity
          style={styles.wrapImage}
          onPress={() => {
            handleBannerClick(banner);
          }}>
          <Image
            key={index}
            style={styles.image}
            resizeMode="stretch"
            source={{uri: banner?.defaultImageURL}}
          />
        </TouchableOpacity>
      );
    });
    return result;
  };

  if (!isEmptyArray(banners)) {
    return (
      <Swiper
        style={styles.wrap}
        autoplay={true}
        autoplayTimeout={6}
        animated={true}
        paginationStyle={{bottom}}
        dot={<View style={styles.inactiveDot} />}
        activeDot={<View style={styles.activeDot} />}
        loop>
        {renderImages()}
      </Swiper>
    );
  } else {
    return null;
  }
};

export default Banner;
