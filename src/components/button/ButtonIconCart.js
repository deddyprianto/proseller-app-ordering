import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const ButtonCartIcon = ({...props}) => {
  const getCountProducts = () => {
    try {
      const {dataBasket, outletID} = props;
      if (dataBasket !== undefined) {
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

  return (
    <TouchableOpacity
      style={{
        padding: 2,
        paddingRight: 1,
        marginLeft: '5%',
        marginTop: 5,
        justifyContent: 'center',
      }}
      onPress={() => Actions.cart()}>
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
      {props.dataBasket !== undefined && (
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
            {getCountProducts()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ButtonCartIcon;
