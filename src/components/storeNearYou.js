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
                  {/* <View>
                    <Image
                      style={styles.storesNearImage}
                      source={
                        item.image != ''
                          ? {uri: item.image}
                          : appConfig.appImageNull
                      }
                    />
                  </View> */}
                  <View style={styles.storesNearDetail}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: colorConfig.pageIndex.activeTintColor,
                        fontFamily: 'Lato-Medium',
                      }}>
                      {item.storeName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        color: colorConfig.pageIndex.grayColor,
                        fontFamily: 'Lato-Medium',
                      }}>
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
    paddingTop: 5,
    paddingBottom: 10,
    color: colorConfig.store.storesTitle,
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  storesNearItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
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
