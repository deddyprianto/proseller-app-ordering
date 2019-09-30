import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';

export default class StoreStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStoreRegion: this.props.dataStoreRegion,
      dataAllStore: this.props.dataAllStore,
    };
  }

  storeDetailStores = item => {
    Actions.storeDetailStores({item});
  };

  render() {
    return (
      <View>
        {this.state.dataStoreRegion.map((region, index) => (
          <View style={styles.stores} key={index}>
            <Text style={styles.stores}>Stores - {region}</Text>
            {this.state.dataAllStore[this.state.dataStoreRegion[index]].map(
              (item, keys) => (
                <View key={keys}>
                  {
                    <TouchableOpacity
                      style={styles.storesItem}
                      onPress={() => this.storeDetailStores(item)}>
                      <View>
                        <Image
                          style={styles.storesImage}
                          source={
                            item.image != ''
                              ? {uri: item.image}
                              : appConfig.appImageNull
                          }
                        />
                      </View>
                      <View style={styles.storesDetail}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colorConfig.pageIndex.activeTintColor,
                            fontFamily: 'Lato-Bold',
                          }}>
                          {item.storeName}
                        </Text>
                        {item.storeJarak != '-' ? (
                          <Text
                            style={{
                              fontSize: 12,
                              color: colorConfig.pageIndex.grayColor,
                              fontFamily: 'Lato-Medium',
                            }}>
                            {item.storeJarak + ' KM'}
                          </Text>
                        ) : null}
                        <Text
                          style={{
                            fontSize: 12,
                            color: colorConfig.store.defaultColor,
                            fontFamily: 'Lato-Medium',
                          }}>
                          {item.storeStatus}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              ),
            )}
          </View>
        ))}
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
  storesItem: {
    height: Dimensions.get('window').width / 4 + 2,
    flexDirection: 'row',
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  storesImage: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  storesDetail: {
    padding: 10,
    borderLeftColor: colorConfig.store.defaultColor,
    borderLeftWidth: 1,
  },
});
