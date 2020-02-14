import React, {Component} from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {formatter} from '../../helper/CurrencyFormat';

export default class ButtonViewBasket extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => Actions.basket()}
        style={{
          position: 'absolute',
          zIndex: 2,
          bottom: 20,
          left: '5%',
          right: '5%',
          padding: 10,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingVertical: 15,
          borderRadius: 10,
          backgroundColor: colorConfig.store.defaultColor,
          shadowColor: '#00000021',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.7,
          shadowRadius: 7.49,
          elevation: 12,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontFamily: 'Lato-Bold',
          }}>
          View Basket {'SGD - '}{this.props.dataBasket.totalNettAmount}{' '}
        </Text>
        {/*<ActivityIndicator size={'small'} color={'white'} />*/}
      </TouchableOpacity>
    );
  }
}
