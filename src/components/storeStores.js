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
import CryptoJS from 'react-native-crypto-js';

import colorConfig from '../config/colorConfig';
import LoadingScreen from './loadingScreen';
import {navigate} from '../utils/navigation.utils';

class StoreStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
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
          onPress: async () => {
            await this.removeCart();
            await this.storeDetailStores(item);
          },
        },
      ],
      {cancelable: false},
    );
  };
  handleRemoveSelectedAddress = async () => {
    const userDecrypt = CryptoJS.AES.decrypt(
      this.props.user,
      awsConfig.PRIVATE_KEY_RSA,
    );

    const user = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    await this.props.dispatch(
      updateUser({selectedAddress: null, phoneNumber: user.phoneNumber}),
    );
  };

  removeCart = async () => {
    this.setState({isLoading: true});
    await this.handleRemoveSelectedAddress();
    await this.props.dispatch(changeOrderingMode({orderingMode: ''}));
    await this.props.dispatch(removeBasket());
    await this.props.dispatch(getBasket());
  };

  orderingModesField = [
    {
      key: 'STOREPICKUP',
      isEnabledFieldName: 'enableStorePickUp',
    },
    {
      key: 'DELIVERY',
      isEnabledFieldName: 'enableDelivery',
    },
    {
      key: 'TAKEAWAY',
      isEnabledFieldName: 'enableTakeAway',
    },
    {
      key: 'DINEIN',
      isEnabledFieldName: 'enableDineIn',
    },
    {
      key: 'STORECHECKOUT',
      isEnabledFieldName: 'enableStoreCheckOut',
    },
  ];

  handleSelectStoreFnB = async () => {
    const orderingModesFieldFiltered = this.orderingModesField.filter(mode => {
      if (
        this.props.defaultOutlet[mode.isEnabledFieldName] &&
        this.props.orderSetting?.includes(mode.key)
      ) {
        return mode;
      }
    });

    if (orderingModesFieldFiltered.length === 1) {
      await this.props.dispatch(
        changeOrderingMode({
          orderingMode: orderingModesFieldFiltered[0].key,
        }),
      );
      navigate('orderHere');
      this.setState({isLoading: false});
    } else {
      navigate('orderingMode');
      this.setState({isLoading: false});
    }
  };

  storeDetailStores = async item => {
    try {
      this.setState({isLoading: true});
      await this.props.dispatch(getOutletById(item.storeId));

      if (awsConfig.COMPANY_TYPE !== 'Retail') {
        this.handleSelectStoreFnB();
      } else if (Actions.currentScene !== 'pageIndex') {
        Actions.pop();
      }
    } catch (e) {}
    try {
      this.props.refreshProducts();
    } catch (e) {}
    // Actions.pageIndex();
  };

  processChangeOutlet = async item => {
    try {
      const {dataBasket, defaultOutlet} = this.props;
      if (defaultOutlet?.id === item?.storeId) {
        await this.storeDetailStores(item);
        return;
      }
      if (dataBasket === undefined || dataBasket === null) {
        await this.removeCart();
        await this.storeDetailStores(item);
        return;
      }
      if (dataBasket && dataBasket.outlet.id !== item.storeId) {
        this.showAlertBasketNotEmpty(item);
        return;
      }
      await this.storeDetailStores(item);
    } catch (e) {
      await this.removeCart();
      await this.storeDetailStores(item);
    }
  };

  render() {
    const {intlData, dataAllStore, dataStoreRegion} = this.props;
    return (
      <View>
        <LoadingScreen loading={this.state.isLoading} />
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
                    disabled={item.orderingStatus !== 'AVAILABLE'}
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
                      {item.storeStatus &&
                      item.orderingStatus === 'AVAILABLE' ? (
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
                          style={{color: colorConfig.primaryColor}}
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
import {
  changeOrderingMode,
  getBasket,
  removeBasket,
} from '../actions/order.action';
import {updateUser} from '../actions/user.action';
import awsConfig from '../config/awsConfig';
import appConfig from '../config/appConfig';

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
  orderingMode: state.orderReducer.dataOrderingMode.orderingMode,
  defaultOutlet: state.storesReducer.defaultOutlet.defaultOutlet,
  orderSetting: state.settingReducer?.allowedOrder?.settingValue,
  user: state.userReducer.getUser.userDetails,
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
