import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import colorConfig from '../../config/colorConfig';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../utils/navigation.utils';

export default class CartIcon extends Component {
  constructor(props) {
    super(props);
  }

  getCountProducts = () => {
    try {
      const {dataBasket, outletID} = this.props;
      if (dataBasket != undefined) {
        // if (dataBasket.outlet.id === outletID) {
        let total = 0;
        dataBasket.details.map(item => {
          total += item.quantity;
        });
        return total;
        // }
      }
    } catch (e) {
      return null;
    }
  };

  render() {
    const {dataBasket, outletID} = this.props;
    return (
      <TouchableOpacity
        style={{
          padding: 2,
          paddingRight: 1,
          marginLeft: '5%',
          marginTop: 5,
          justifyContent: 'center',
        }}
        onPress={() =>
          navigate('basket', {
            refreshQuantityProducts: this.props.refreshQuantityProducts,
          })
        }>
        <IconAntDesign
          name="shoppingcart"
          style={{fontSize: 30, color: colorConfig.store.defaultColor}}
        />
        {/* <Icon
          size={20}
          name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
          style={{color: colorConfig.store.defaultColor}}
        /> */}
        <Text
          style={{
            paddingLeft: 5,
            color: colorConfig.store.defaultColor,
            fontSize: 10,
            fontFamily: 'Poppins-Regular',
          }}>
          Cart
        </Text>
        {dataBasket != undefined && (
          <View
            style={{
              position: 'absolute',
              right: -13,
              top: -4,
              backgroundColor: colorConfig.store.secondaryColor,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
              {this.getCountProducts()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
