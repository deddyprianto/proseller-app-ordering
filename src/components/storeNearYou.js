import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

export default class StoreNearYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStoresNear: this.props.dataStoresNear,
      screenWidth: Dimensions.get('window').width,
    };
  }

  storeDetailStores = item => {
    Actions.storeDetailStores({item});
  };

  render() {
    return (
      <View style={styles.stores}>
        <Text style={styles.stores}>Stores Near You</Text>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          {this.props.dataStoresNear.slice(0, 3).map((item, key) => (
            <View key={key}>
              {
                <TouchableOpacity
                  style={styles.storesNearItem}
                  onPress={() => this.storeDetailStores(item)}>
                  <View style={styles.storesNearDetail}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colorConfig.pageIndex.activeTintColor,
                        fontFamily: 'Lato-Medium',
                      }}>
                      {item.storeName}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        fontSize: 10,
                        bottom: 0,
                        padding: 7,
                        color: colorConfig.pageIndex.grayColor,
                        fontFamily: 'Lato-Medium',
                      }}>
                      <Icon
                        size={10}
                        name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                        style={{color: 'red', marginRight: 3}}
                      />{' '}
                      {item.storeJarak.toFixed(1) + ' KM'}
                    </Text>
                  </View>
                </TouchableOpacity>
              }
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stores: {
    paddingTop: 10,
    paddingBottom: 10,
    color: colorConfig.store.title,
    fontSize: 19,
    fontFamily: 'Lato-Bold',
  },
  storesNearItem: {
    borderColor: colorConfig.pageIndex.inactiveTintColor,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    justifyContent: 'space-between',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
    width: Dimensions.get('window').width / 3 - 15,
  },
  storesNearImage: {
    height: Dimensions.get('window').width / 3 - 19,
    width: Dimensions.get('window').width / 3 - 17,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  storesNearDetail: {
    padding: 10,
    // borderTopColor: colorConfig.store.defaultColor,
    // borderTopWidth: 1,
    height: Dimensions.get('window').width / 3 - 55,
  },
});
