import React, {Component} from 'react';
import {Text, TouchableOpacity, Platform, View} from 'react-native';
import colorConfig from '../../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigate} from '../../utils/navigation.utils';

export default class OutletIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {dataBasket, outletID} = this.props;
    return (
      <TouchableOpacity
        style={{
          padding: 2,
          paddingRight: 1,
          // marginLeft: '4%',
          marginTop: 5,
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() =>
          navigate('stores', {refreshProducts: this.props.refreshProducts})
        }>
        <Icon
          size={20}
          name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
          style={{color: colorConfig.store.defaultColor}}
        />
        <Text
          style={{
            color: colorConfig.store.defaultColor,
            fontSize: 10,
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
          }}>
          Outlet
        </Text>
      </TouchableOpacity>
    );
  }
}
