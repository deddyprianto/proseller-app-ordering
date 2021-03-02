import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';

import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import {getOutletById} from '../actions/stores.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getBasket, removeBasket} from '../actions/order.action';

class StoreNearYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
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
    const {intlData} = this.props;
    try {
      await this.props.dispatch(getOutletById(item.storeId));
      this.props.refreshProducts();
      Actions.pop();
    } catch (e) {}
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
    const {intlData, dataStoresNear} = this.props;
    return (
      <View style={styles.stores}>
        <Text style={styles.stores}>{intlData.messages.outletsNearYou}</Text>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          {dataStoresNear.slice(0, 3).map((item, key) => (
            <View key={key}>
              {
                <TouchableOpacity
                  style={styles.storesNearItem}
                  onPress={() => this.processChangeOutlet(item)}>
                  <View style={styles.storesNearDetail}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colorConfig.store.secondaryColor,
                        fontFamily: 'Poppins-Regular',
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
                        fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Medium',
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
    height: Dimensions.get('window').width / 3 - 55,
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
)(StoreNearYou);
