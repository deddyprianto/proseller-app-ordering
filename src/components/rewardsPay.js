import React, { Component } from 'react';
import { 
  View, 
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Picker
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from "../config/colorConfig";

export default class RewardsPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payment: '',
      storeName: 'Suntec',
      paymentType: '',
      isFocused: false
    };
  }

  goBack(){
    Actions.pop()
  }

  handleFocus = (event) => {
    this.setState({ isFocused: true})
    if(this.props.onFocus){
      this.props.onFocus(event);
    }
  }

  handleBlur(){
    this.setState({ isFocused: false})
    if(this.props.onBlur){
      this.props.onBlur(event);
    }
  }

  sendPay = () => {
    console.log('press btn pay')
    var data = {
      'payment': this.state.payment,
      'storeName': this.state.storeName,
      'paymentType': this.state.paymentType
    }
    console.log(data)
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack}
          onPress={this.goBack}>
            <Icon size={28} name={ Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back' } style={styles.btnBackIcon} />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line}/>
        </View>
        <View style={{margin:10}}>
          <View style={{flexDirection:'row', justifyContent :'space-between'}}>
            <View style={{flexDirection:'row', alignItems: 'center'}}>
            <Icon size={30} name={ Platform.OS === 'ios' ? 'ios-cash' : 'md-cash' } style={{color: colorConfig.pageIndex.inactiveTintColor}} />
              <TextInput
                placeholder='Payment'
                selectionColor={colorConfig.pageIndex.activeTintColor}
                underlineColorAndroid={
                  this.state.isFocused ? colorConfig.pageIndex.activeTintColor: colorConfig.pageIndex.inactiveTintColor
                }
                style={styles.inputPayment}
                onChangeText={(payment) => this.setState({payment})}
                value={this.state.payment}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                keyboardType = 'numeric'
              />
            </View>
            <View style={{flexDirection:'row', alignItems: 'center'}}>
              <Icon size={25} name={ Platform.OS === 'ios' ? 'ios-card' : 'md-card' } style={{color: colorConfig.pageIndex.inactiveTintColor}} />
              <Picker
                selectedValue={this.state.paymentType}
                style={styles.inputPaymentType}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({paymentType: itemValue})
                }>
                <Picker.Item label='-- Choose --' value=""  />
                <Picker.Item label='Cash' value="cash"  />
                <Picker.Item label="Debit" value="debit" />
                <Picker.Item label="Credit" value="credit" />
              </Picker>
            </View>
          </View>
          <TouchableOpacity
          style={styles.btnPay}
          onPress={this.sendPay}>
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
    backgroundColor: colorConfig.pageIndex.backgroundColor
  },
  inputPayment: {
    height: 50, 
    paddingLeft: 6,
    marginBottom: 10,
    width: (Dimensions.get('window').width/2)-40,
  },
  inputPaymentType: {
    height: 50, 
    width: (Dimensions.get('window').width/2)-40,
  },
  btnPay: {
    width: '100%',
    height: 40,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
  },
  btnIcon: {
    color: colorConfig.pageIndex.backgroundColor, 
    margin:10 
  },
  btnText: {
    color: colorConfig.pageIndex.backgroundColor, 
    fontWeight: 'bold'
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor, 
    margin:10
  },
  btnBack: {
    flexDirection:'row', 
    alignItems:'center'
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor, 
    fontWeight: 'bold'
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor, 
    borderBottomWidth:2
  }
});
