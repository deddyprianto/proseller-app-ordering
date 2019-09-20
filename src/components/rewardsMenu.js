import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import colorConfig from "../config/colorConfig";
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

export default class RewardsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
    };
  }

  pagePay() {
    // Actions.pay()
    Actions.scan()
  }

  pageRewards() {
		Actions.rewards()
  }

  pageQRCode() {
    Actions.qrcode()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <TouchableOpacity
          onPress={this.pagePay}>
            <View style={{alignItems: 'center'}}>
              <Icon size={(this.state.screenHeight/5)/2-10} name={ Platform.OS === 'ios' ? 'wallet' : 'md-wallet' } style={{ color:  colorConfig.pageIndex.activeTintColor }} />
            </View>
            <Text style={{textAlign:'center'}}>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={this.pageQRCode}>
            <View style={{alignItems: 'center'}}>
              <Icon size={(this.state.screenHeight/5)/2-10} name={ Platform.OS === 'ios' ? 'barcode' : 'md-barcode' } style={{ color:  colorConfig.pageIndex.activeTintColor }} />
            </View>
            <Text style={{textAlign:'center'}}>My QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={this.pageRewards}>
            <View style={{alignItems: 'center'}}>
              <Icon size={(this.state.screenHeight/5)/2-10} name={ Platform.OS === 'ios' ? 'price-ribbon' : 'md-ribbon' } style={{ color:  colorConfig.pageIndex.activeTintColor }} />
            </View>
            <Text style={{textAlign:'center'}}>Rewards</Text>
          </TouchableOpacity>
        </View>
      </View>  
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: (Dimensions.get('window').height/8)-30, 
    alignContent: 'center'
  },
  item: {
    height: Dimensions.get('window').height/5-20, 
    width: Dimensions.get('window').width-80,
    borderColor: colorConfig.pageIndex.activeTintColor, 
    borderWidth:1, 
    marginLeft: 40, 
    marginRight: 40,
    borderRadius: 10,
    position: 'absolute', 
    top: -(Dimensions.get('window').height/5)/2,
    backgroundColor: colorConfig.store.storesItem,
    justifyContent :'space-between', 
    flexDirection:'row',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
  }
});
