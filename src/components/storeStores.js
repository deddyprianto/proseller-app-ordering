import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colorConfig from '../config/colorConfig';

class StoreStores extends Component {
  constructor(props) {
    super(props);
  }

  showAlertBasketNotEmpty = async item => {
    const {dataBasket} = this.props;
    Alert.alert(
      'Change outlet ?',
      `You will delete your cart in outlet ${dataBasket.outlet.name}`,
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: () => {
            this.removeCart();
            this.storeDetailStores(item);
          },
        },
      ],
      {cancelable: false},
    );
  };

  removeCart = async () => {
    await this.props.dispatch(removeBasket());
    await this.props.dispatch(getBasket());
  };

  storeDetailStores = async item => {
    try {
      await this.props.dispatch(getOutletById(item.storeId));
    } catch (e) {}
    try {
      this.props.refreshProducts();
    } catch (e) {}
    Actions.pop();
  };

  processChangeOutlet = item => {
    try {
      const {dataBasket} = this.props;
      if (dataBasket === undefined || dataBasket === null) {
        this.storeDetailStores(item);
        return;
      }
      if (dataBasket && dataBasket.outlet.id === item.storeId) {
        this.storeDetailStores(item);
        return;
      }
      if (dataBasket && dataBasket.outlet.id !== item.storeId) {
        this.showAlertBasketNotEmpty(item);
        return;
      }
    } catch (e) {
      this.storeDetailStores(item);
    }
  };

  render() {
    const {intlData, dataAllStore, dataStoreRegion} = this.props;
    return (
      <View>
        {dataStoreRegion.map((region, index) => (
          <View style={styles.stores} key={index}>
            <Text style={styles.stores}>
              {intlData.messages.outlets}{' '}
              {region != undefined ? ` - ${region}` : null}
            </Text>
            {dataAllStore[dataStoreRegion[index]].map((item, keys) => (
              <View key={keys}>
                {
                  <TouchableOpacity
                    style={styles.storesItem}
                    onPress={() => this.processChangeOutlet(item)}>
                    <View style={styles.storesDetail}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colorConfig.store.secondaryColor,
                          fontFamily: 'Poppins-Medium',
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
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {intlData.messages.open}
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
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {intlData.messages.closed}
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
                          {isNaN(item.storeJarak.toFixed(1))
                            ? '0 KM'
                            : item.storeJarak.toFixed(1) + ' KM'}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                }
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }
}
import {Actions} from 'react-native-router-flux';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getOutletById} from '../actions/stores.action';
import {getBasket, removeBasket} from '../actions/order.action';

const styles = StyleSheet.create({
  stores: {
    paddingTop: 5,
    paddingBottom: 10,
    color: colorConfig.store.title,
    fontSize: 19,
    fontFamily: 'Poppins-Medium',
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
  },
});

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(StoreStores);
