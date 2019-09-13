import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

export default class StorePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{paddingBottom: 20}}>
        {/* <Text style={styles.stores}>Promotion</Text> */}
        <Image resizeMode='stretch' style={styles.imageLogo} source={appConfig.appLogo}/>
        {/* <View style={{borderBottomColor: colorConfig.store.defaultColor, borderBottomWidth:2, marginBottom:10}}/> */}
        <Swiper style={styles.swiper}
          autoplay = {true}
          autoplayTimeout = {4}
          animated = {true}
          dot={ <View style={styles.swiperDot} /> }
          activeDot={ <View style={styles.swiperActiveDot} /> }
          paginationStyle={styles.swiperPaginatiom} loop>
          <View style={styles.slide}>
            <Image resizeMode='stretch' style={styles.image} source={require('../assets/slide/slide1.jpg')} />
          </View>
          <View style={styles.slide}>
            <Image resizeMode='stretch' style={styles.image} source={require('../assets/slide/slide2.jpg')} />
          </View>
          <View style={styles.slide}>
            <Image resizeMode='stretch' style={styles.image} source={require('../assets/slide/slide3.jpg')} />
          </View>
          <View style={styles.slide}>
            <Image resizeMode='stretch' style={styles.image} source={require('../assets/slide/slide4.jpg')} />
          </View>
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stores: {
    paddingTop: 5,
    paddingBottom:10,
    color: colorConfig.store.storesTitle,
    fontSize: 16,
    fontWeight: 'bold'
  },
  imageLogo: {
    width: 40,
    height: 32,
    paddingTop: 5,
    marginBottom:5,
  },
  swiper: {
    paddingBottom: 10,
    height: (Dimensions.get('window').width/3),
  },
  swiperDot:{
    backgroundColor: 'rgba(0,0,0,.2)', 
    width: 5, 
    height: 5, 
    borderRadius: 4, 
    margin: 3
  },
  swiperActiveDot: {
    backgroundColor: colorConfig.store.defaultColor, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    margin: 3
  },
  swiperPaginatiom: {
    bottom: -23, 
    // left: null, 
    // right: 10
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width: Dimensions.get('window').width,
    flex: 1
  }, 
  titleSlide: {
    color:colorConfig.pageIndex.activeTintColor
  }
});
