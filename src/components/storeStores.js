import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
    // Actions.storeDetailStores({item});
    Actions.order({item});
  };

  render() {
    return (
      <View>
        {this.state.dataStoreRegion.map((region, index) => (
          <View style={styles.stores} key={index}>
            <Text style={styles.stores}>
              Stores - {region != undefined ? ` ${region}` : null}
            </Text>
            {this.state.dataAllStore[this.state.dataStoreRegion[index]].map(
              (item, keys) => (
                <View key={keys}>
                  {
                    <TouchableOpacity
                      style={styles.storesItem}
                      onPress={() => this.storeDetailStores(item)}>
                      <View style={styles.storesDetail}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colorConfig.pageIndex.activeTintColor,
                            fontFamily: 'Lato-Bold',
                          }}>
                          {item.storeName}
                        </Text>
                        {item.storeStatus ? (
                          <Text
                            style={{
                              fontSize: 12,
                              marginTop: 10,
                              width: 70,
                              padding: 5,
                              textAlign: 'center',
                              fontWeight: 'bold',
                              backgroundColor: colorConfig.store.colorSuccess,
                              borderRadius: 30,
                              color: colorConfig.store.textWhite,
                              fontFamily: 'Lato-Medium',
                            }}>
                            Open
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 12,
                              marginTop: 5,
                              width: 60,
                              padding: 5,
                              textAlign: 'center',
                              fontWeight: 'bold',
                              backgroundColor: colorConfig.store.colorError,
                              borderRadius: 30,
                              color: colorConfig.store.textWhite,
                              fontFamily: 'Lato-Medium',
                            }}>
                            Closed
                          </Text>
                        )}
                      </View>
                      {item.storeJarak != '-' ? (
                        <View style={{margin: 10, alignItems: 'center'}}>
                          <Icon
                            size={18}
                            name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                            style={{color: 'red'}}
                          />
                          <Text
                            style={{
                              color: colorConfig.pageIndex.grayColor,
                              fontSize: 11,
                            }}>
                            {item.storeJarak.toFixed(1) + ' KM'}
                          </Text>
                        </View>
                      ) : null}
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
    color: colorConfig.store.title,
    fontSize: 19,
    fontFamily: 'Lato-Bold',
  },
  storesItem: {
    height: Dimensions.get('window').width / 4 - 10,
    flexDirection: 'row',
    borderColor: colorConfig.pageIndex.inactiveTintColor,
    borderWidth: 1,
    marginBottom: 9,
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
  },
  storesImage: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  storesDetail: {
    padding: 10,
    // borderLeftColor: colorConfig.store.defaultColor,
    // borderLeftWidth: 1,
  },
});
