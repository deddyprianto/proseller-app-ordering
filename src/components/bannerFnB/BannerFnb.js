import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Swiper from 'react-native-swiper';
import Theme from '../../theme';

import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

import {dataPromotion} from '../../actions/promotion.action';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {navigate} from '../../utils/navigation.utils';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    wrapSmall: {
      height: 132,
      // height: (WIDTH - 32) / 3,
    },
    wrapLarge: {
      height: 222,
    },
    wrapContainer: {
      margin: 16,
    },
    wrapImage: {
      width: WIDTH - 32,
    },
    imageSmall: {
      borderRadius: 8,
      height: 132,
      // height: (WIDTH - 32) / 3,
      // width: WIDTH - 32,
      // maxWidth: WIDTH - 32,
    },
    imageLarge: {
      height: 222,
      borderRadius: 8,
    },
    activeDot: {
      opacity: 1,
      margin: 3,
      width: 36,
      height: 8,
      borderRadius: 50,
      backgroundColor: theme.colors.buttonActive,
    },
    inactiveDot: {
      opacity: 0.5,
      margin: 3,
      width: 8,
      height: 8,
      borderRadius: 50,
      backgroundColor: theme.colors.buttonActive,
    },
  });
  return styles;
};

const BannerFnB = ({bottom = 0, placement}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [bannerList, setBannerList] = useState([]);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const banners = useSelector(
    state => state.promotionReducer.dataPromotion.promotion,
  );
  const bannerSize = useSelector(
    state => state.settingReducer?.bannerSizeSettings?.bannerSize,
  );

  const sizes = bannerSize?.split('x') || [];
  const bannerHeight = sizes[1] || '480';

  // const findBanner = (banner = []) => {
  //   const findSelectedOutlet = banner?.selectedOutlets.find(
  //     banner => banner.text === defaultOutlet.name,
  //   );
  //   return findSelectedOutlet ? true : false;
  // };

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataPromotion());
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    let result = [];

    switch (placement) {
      case 'bottom':
        result = banners?.filter(row => row?.placement === 'BOTTOM');
        break;

      case 'top':
        result = banners?.filter(row => row?.placement === 'TOP');
        break;

      default:
        result = banners;
        break;
    }

    setBannerList(result);
  }, [placement, banners]);

  const handleBannerClick = async item => {
    const isOpenUrl = item?.linkBanner && item?.url && item?.linkType === 'URL';

    if (isOpenUrl) {
      const isHTTPS = item?.url?.search('https://') !== -1;
      const url = isHTTPS ? item?.url : `https://${item?.url}`;

      return await Linking.openURL(url);
    } else {
      navigate('storeDetailPromotion', {
        dataPromotion: item,
        item: defaultOutlet,
      });
    }
  };

  const renderImages = () => {
    const styleImage =
      bannerHeight === '720' ? styles.imageLarge : styles.imageSmall;

    const result = bannerList?.map((banner, index) => {
      return (
        <TouchableOpacity
          style={styles.wrapImage}
          onPress={() => {
            handleBannerClick(banner);
          }}>
          <Image
            key={index}
            style={styleImage}
            resizeMode="stretch"
            source={{uri: banner?.defaultImageURL}}
          />
        </TouchableOpacity>
      );
    });
    return result;
  };

  if (!isEmptyArray(bannerList)) {
    if (bannerSize) {
      const styleWrap =
        bannerHeight === '720' ? styles.wrapLarge : styles.wrapSmall;

      return (
        <Swiper
          style={styleWrap}
          autoplay={true}
          containerStyle={styles.wrapContainer}
          autoplayTimeout={6}
          animated={true}
          paginationStyle={{bottom}}
          dot={<View style={styles.inactiveDot} />}
          activeDot={<View style={styles.activeDot} />}
          loop={false}>
          {renderImages()}
        </Swiper>
      );
    }
    return null;
  } else {
    return null;
  }
};

export default BannerFnB;
