import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';

export default class StorePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  seeMorePromotion = () => {
    Actions.seeMorePromotion();
  };

  storeDetailPromotion = () => {
    Actions.storeDetailPromotion();
  };

  render() {
    return (
      <View style={{paddingBottom: 20}}>
        <TouchableOpacity style={styles.seeAll} onPress={this.seeMorePromotion}>
          <Text style={styles.seeAllTitle}>See More</Text>
        </TouchableOpacity>
        <Swiper
          style={styles.swiper}
          autoplay={true}
          autoplayTimeout={4}
          animated={true}
          dot={<View style={styles.swiperDot} />}
          activeDot={<View style={styles.swiperActiveDot} />}
          paginationStyle={styles.swiperPaginatiom}
          loop>
          <TouchableOpacity
            style={styles.slide}
            onPress={this.storeDetailPromotion}>
            <Image
              resizeMode="stretch"
              style={styles.image}
              source={require('../assets/slide/slide1.jpg')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.slide}
            onPress={this.storeDetailPromotion}>
            <Image
              resizeMode="stretch"
              style={styles.image}
              source={require('../assets/slide/slide2.jpg')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.slide}
            onPress={this.storeDetailPromotion}>
            <Image
              resizeMode="stretch"
              style={styles.image}
              source={require('../assets/slide/slide3.jpg')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.slide}
            onPress={this.storeDetailPromotion}>
            <Image
              resizeMode="stretch"
              style={styles.image}
              source={require('../assets/slide/slide4.jpg')}
            />
          </TouchableOpacity>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stores: {
    paddingTop: 5,
    paddingBottom: 10,
    color: colorConfig.store.storesTitle,
    fontSize: 16,
    fontWeight: 'bold',
  },
  swiper: {
    paddingBottom: 10,
    height: Dimensions.get('window').width / 3,
  },
  swiperDot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 5,
    height: 5,
    borderRadius: 4,
    margin: 3,
  },
  swiperActiveDot: {
    backgroundColor: colorConfig.store.defaultColor,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  swiperPaginatiom: {
    bottom: -23,
    // left: null,
    // right: 10
  },
  seeAll: {
    position: 'absolute',
    top: Dimensions.get('window').width / 3 + 5,
    right: 10,
  },
  seeAllTitle: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    flex: 1,
  },
  titleSlide: {
    color: colorConfig.pageIndex.activeTintColor,
  },
});
