import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Picker,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {notifikasi} from '../actions/auth.actions';
import {sendPayment, campaign, dataPoint} from '../actions/rewards.action';

import colorConfig from '../config/colorConfig';

class RewardsPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payment: '',
      storeName: 'Suntec',
      paymentType: '',
      isFocused: false,
    };
  }

  goBack() {
    Actions.pop();
  }

  handleFocus = event => {
    this.setState({isFocused: true});
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({isFocused: false});
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  sendPay = async () => {
    try {
      var data = {
        payment: this.state.payment,
        storeName: this.state.storeName,
        paymentType: this.state.paymentType,
      };
      // value={JSON.stringify({
      //   'payment': 20,
      //   'storeName': 'Qiji Test',
      //   // 'paymentType': 'Cash'
      //   'dataPay' : [
      //     {'itemName': 'nasi', 'qty': 1, 'price': 10},
      //     {'itemName': 'buah', 'qty': 1, 'price': 10}
      //   ]
      // })}
      const response = await this.props.dispatch(sendPayment(data));
      if (response.statusCode != 400) {
        await this.props.dispatch(campaign());
        await this.props.dispatch(dataPoint());
        await this.props.dispatch(
          notifikasi(
            'Pay success!',
            response.message + ' point',
            Actions.pop(),
          ),
        );
      } else {
        await this.props.dispatch(
          notifikasi(
            'Pay error!',
            response.message,
            console.log('Cancel Pressed'),
          ),
        );
      }
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          'Pay Error!',
          error.responseBody.message,
          console.log('Cancel Pressed'),
        ),
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View style={{margin: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                size={30}
                name={Platform.OS === 'ios' ? 'ios-cash' : 'md-cash'}
                style={{color: colorConfig.pageIndex.inactiveTintColor}}
              />
              <TextInput
                placeholder="Payment"
                selectionColor={colorConfig.pageIndex.activeTintColor}
                underlineColorAndroid={
                  this.state.isFocused
                    ? colorConfig.pageIndex.activeTintColor
                    : colorConfig.pageIndex.inactiveTintColor
                }
                style={styles.inputPayment}
                onChangeText={payment => this.setState({payment})}
                value={this.state.payment}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                keyboardType="numeric"
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                size={25}
                name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                style={{color: colorConfig.pageIndex.inactiveTintColor}}
              />
              <Picker
                selectedValue={this.state.paymentType}
                style={styles.inputPaymentType}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({paymentType: itemValue})
                }>
                <Picker.Item label="-- Choose --" value="" />
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Debit" value="Debit" />
                <Picker.Item label="Credit" value="Credit" />
              </Picker>
            </View>
          </View>
          <TouchableOpacity style={styles.btnPay} onPress={this.sendPay}>
            {/* <Icon size={25} name={ Platform.OS === 'ios' ? 'ios-cash' : 'md-cash' } style={styles.btnIcon} /> */}
            <Text style={styles.btnText}> Pay </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  inputPayment: {
    height: 50,
    paddingLeft: 6,
    marginBottom: 10,
    width: Dimensions.get('window').width / 2 - 40,
  },
  inputPaymentType: {
    height: 50,
    width: Dimensions.get('window').width / 2 - 40,
  },
  btnPay: {
    width: '100%',
    height: 40,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnIcon: {
    color: colorConfig.pageIndex.backgroundColor,
    margin: 10,
  },
  btnText: {
    color: colorConfig.pageIndex.backgroundColor,
    fontWeight: 'bold',
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(connect(null, mapDispatchToProps))(RewardsPay);
