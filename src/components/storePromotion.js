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
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import {dataPromotion} from '../actions/promotion.action';
import {navigate} from '../utils/navigation.utils';

class StorePromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    await this.props.dispatch(dataPromotion());
  };
  seeMorePromotion = () => {
    navigate('seeMorePromotion');
  };

  storeDetailPromotion = item => {
    navigate('storeDetailPromotion', {
      dataPromotion: item,
      item: this.props.outlet,
    });
  };

  render() {
    let dataPromotion = this.props.dataPromotion;
    // let dataPromotion = [];
    return (
      <View style={{paddingBottom: 10}}>
        {/*<TouchableOpacity style={styles.seeAll} onPress={this.seeMorePromotion}>*/}
        {/*  <Text style={styles.seeAllTitle}>See More</Text>*/}
        {/*</TouchableOpacity>*/}
        {this.props.dataPromotion == undefined ? null : this.props.dataPromotion
            .length === 0 ? null : (
          <Swiper
            style={styles.swiper}
            autoplay={true}
            autoplayTimeout={4}
            animated={true}
            dot={<View style={styles.swiperDot} />}
            activeDot={<View style={styles.swiperActiveDot} />}
            paginationStyle={styles.swiperPaginatiom}
            loop>
            {dataPromotion.map((item, key) => (
              <TouchableOpacity
                key={key}
                style={styles.slide}
                onPress={() => this.storeDetailPromotion(item)}>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.defaultImageURL,
                  }}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stores: {
    paddingTop: 5,
    paddingBottom: 5,
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
    left: 10,
    right: null,
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
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  titleSlide: {
    color: colorConfig.pageIndex.activeTintColor,
  },
});

mapStateToProps = state => ({
  dataPromotion: state.promotionReducer.dataPromotion.promotion,
  outlet: state.storesReducer.defaultOutlet.defaultOutlet,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(StorePromotion);
