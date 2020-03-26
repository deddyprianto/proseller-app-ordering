import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import colorConfig from '../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {movePageIndex} from '../actions/user.action';

export default class RewardsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
    };
  }

  pagePay = () => {
    this.props.disableStatusGetData();
    var pembayaran = {
      payment: 9.01,
      storeName: 'Bugis Village',
      referenceNo: `${new Date().valueOf()}`,
      storeId: '486e2b85-6700-409d-afe4-5f1cdbacba53',
      dataPay: [
        {id: '123', itemName: 'Nasi Goreng Pedas', qty: 1, price: 10},
        {
          id: '06d65cc5-a234-43e6-b9e3-7f49a737ce0c',
          itemName: 'Coke',
          qty: 1,
          price: 5,
        },
        {id: '123', itemName: 'Nasi Lemak', qty: 1, price: 5},
      ],
    };
    // console.log(pembayaran);
    // Actions.pay()
    // Actions.scan({
    //   enableStatusGetData: this.props.enableStatusGetData,
    // });
    Actions.paymentDetail({pembayaran: pembayaran});
  };

  pageRewards = () => {
    this.props.disableStatusGetData();
    Actions.rewards({
      enableStatusGetData: this.props.enableStatusGetData,
    });
  };

  pageQRCode = () => {
    Actions.qrcode();
  };

  render() {
    const {intlData} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <TouchableOpacity onPress={this.pagePay}>
            <View style={{alignItems: 'center'}}>
              <Icon
                size={this.state.screenHeight / 5 / 2 - 10}
                name={Platform.OS === 'ios' ? 'wallet' : 'md-wallet'}
                style={{color: colorConfig.pageIndex.activeTintColor}}
              />
            </View>
            <Text style={styles.menuText}>{intlData.messages.pay}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.pageQRCode(this.props)}>
            <View style={{alignItems: 'center'}}>
              <Icon
                size={this.state.screenHeight / 5 / 2 - 10}
                name={Platform.OS === 'ios' ? 'qr-scanner' : 'md-qr-scanner'}
                style={{color: colorConfig.pageIndex.activeTintColor}}
              />
            </View>
            <Text style={styles.menuText}>{intlData.messages.myQrCode}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.pageRewards}>
            <View style={{alignItems: 'center'}}>
              <Icon
                size={this.state.screenHeight / 5 / 2 - 10}
                name={Platform.OS === 'ios' ? 'price-ribbon' : 'md-ribbon'}
                style={{color: colorConfig.pageIndex.activeTintColor}}
              />
            </View>
            <Text style={styles.menuText}>{intlData.messages.rewards}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 8 - 30,
    alignContent: 'center',
  },
  item: {
    height: Dimensions.get('window').height / 5 - 20,
    width: Dimensions.get('window').width - 40,
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -(Dimensions.get('window').height / 5) / 2,
    backgroundColor: colorConfig.store.storesItem,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  menuText: {
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 15,
    color: colorConfig.store.title,
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
  },
});
