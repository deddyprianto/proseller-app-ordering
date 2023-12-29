import React, {Component} from 'react';
import {Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {compose} from 'redux';
import {connect} from 'react-redux';
import appConfig from '../../config/appConfig';
import {navigate} from '../../utils/navigation.utils';

class ButtonViewBasket extends Component {
  constructor(props) {
    super(props);
  }

  openBasket = () => {
    navigate('basket', {
      from: 'products',
      refreshQuantityProducts: this.props.refreshQuantityProducts,
      previousTableNo: this.props.previousTableNo,
    });
  };

  format = item => {
    try {
      const curr = appConfig.appMataUang;
      item = item.replace(curr, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  render() {
    // console.log(this.props.dataBasket, 'update this.props.dataBasket');
    return (
      <TouchableOpacity
        onPress={this.openBasket}
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
            fontFamily: 'Poppins-Medium',
          }}>
          View Basket - {appConfig.appMataUang}
          {this.format(
            CurrencyFormatter(this.props.dataBasket?.totalNettAmount),
          )}{' '}
        </Text>
        {/*<ActivityIndicator size={'small'} color={'white'} />*/}
      </TouchableOpacity>
    );
  }
}

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
)(ButtonViewBasket);
