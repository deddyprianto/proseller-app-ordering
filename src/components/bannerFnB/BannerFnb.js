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
  const theme = Theme();
  const styles = StyleSheet.create({
    wrap: {
      height: (WIDTH - 32) / 2,
    },
    wrapContainer: {
      margin: 16,
    },
    wrapImage: {
      width: WIDTH - 32,
    },
    image: {
      // height: (WIDTH - 32) / 2,
      // width: WIDTH - 32,
      // maxWidth: WIDTH - 32,
      // borderRadius: 8,
      aspectRatio: 3 / 4,
    },
    activeDot: {
      opacity: 1,
      margin: 3,
      backgroundColor: theme.colors.buttonActive,
      width: 36,
      height: 8,
      borderRadius: 50,
    },
    inactiveDot: {
      opacity: 0.5,
      margin: 3,
      backgroundColor: theme.colors.accent,
      width: 8,
      height: 8,
      borderRadius: 50,
    },
  });
  return styles;
};

const BannerFnB = ({bottom = 0}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const banners = useSelector(
    state => state.promotionReducer.dataPromotion.promotion,
  );
  const bannerSize = useSelector(
    state => state.settingReducer.bannerSizeSettings.bannerSize,
  );

  console.log('MARTIN', bannerSize);

  const findBanner = (banner = []) => {
    const findSelectedOutlet = banner?.selectedOutlets.find(
      banner => banner.text === defaultOutlet.name,
    );
    return findSelectedOutlet ? true : false;
  };

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
      // const showBanner = findBanner(banner);
      // if (showBanner) {
      console.log('TEST', banner);
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
      // }
      // return null;
    });
    return result;
  };

  if (!isEmptyArray(banners)) {
    return (
      <Swiper
        style={styles.wrap}
        autoplay={true}
        containerStyle={styles.wrapContainer}
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

export default BannerFnB;
