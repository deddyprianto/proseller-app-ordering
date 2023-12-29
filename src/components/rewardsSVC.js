import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../config/colorConfig';
import Icon from 'react-native-vector-icons/EvilIcons';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import appConfig from '../config/appConfig';
import {navigate} from '../utils/navigation.utils';

class RewardsSVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
    };
  }

  format2 = item => {
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
    const {intlData} = this.props;
    const {balance} = this.props;
    return (
      <View
        style={{
          // height: this.state.screenHeight / 3 - 40,
          borderWidth: 0.4,
          borderColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 14,
          borderRadius: 5,
          width: '40%',
          marginRight: 10,
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.backgroundColor,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Store Value Card
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              navigate('summary');
            }}>
            <Text
              style={{
                marginLeft: 30,
                color: colorConfig.pageIndex.backgroundColor,
                textAlign: 'center',
                fontSize: 25,
                fontFamily: 'Poppins-Medium',
              }}>
              {this.format2(CurrencyFormatter(balance))}
            </Text>
            <Icon
              size={40}
              name={'chevron-right'}
              style={{color: 'white', marginBottom: 5}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonComplete: {
    backgroundColor: colorConfig.store.secondaryColor,
    borderRadius: 10,
    // marginHorizontal: '20%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  boxInfo: {
    // marginHorizontal: '15%',
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colorConfig.store.TransBG,
  },
  textInfo: {
    color: colorConfig.store.colorError,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

mapStateToProps = state => ({
  balance: state.SVCReducer.balance.balance,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RewardsSVC);
