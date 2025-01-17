import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import colorConfig from '../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import appConfig from '../config/appConfig';
import MyECardModal from './modal/MyECardModal';
import {navigate} from '../utils/navigation.utils';
// import {movePageIndex} from '../actions/user.action';

export default class RewardsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
      isOpenMyECardModal: false,
    };
  }

  pagePay = () => {
    // var pembayaran = {
    //   payment: 9.01,
    //   storeName: 'Bugis Village',
    //   referenceNo: `${new Date().valueOf()}`,
    //   storeId: '486e2b85-6700-409d-afe4-5f1cdbacba53',
    //   dataPay: [
    //     {id: '123', itemName: 'Nasi Goreng Pedas', qty: 1, price: 10},
    //     {
    //       id: '06d65cc5-a234-43e6-b9e3-7f49a737ce0c',
    //       itemName: 'Coke',
    //       qty: 1,
    //       price: 5,
    //     },
    //     {id: '123', itemName: 'Nasi Lemak', qty: 1, price: 5},
    //   ],
    // };
    // console.log(pembayaran);
    // Actions.pay()
    navigate('scan');
    // Actions.paymentDetail({pembayaran: pembayaran});
  };

  pageRewards = () => {
    navigate('rewards');
  };

  pageQRCode = () => {
    navigate('qrcode');
  };

  renderMyECardModal = () => {
    if (this.state.isOpenMyECardModal) {
      return (
        <MyECardModal
          open={this.state.isOpenMyECardModal}
          handleClose={() => {
            this.setState({isOpenMyECardModal: false});
          }}
        />
      );
    }
  };

  render() {
    const {intlData} = this.props;
    return (
      <View style={styles.container}>
        {this.renderMyECardModal()}
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() => {
              navigate('referral');
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={appConfig.iconReferral}
                style={{
                  tintColor: colorConfig.store.secondaryColor,
                  width: 70,
                  height: 70,
                }}
              />
            </View>
            <Text style={styles.menuText}>Referral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({isOpenMyECardModal: true})}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={appConfig.iconQRCode}
                style={{
                  tintColor: colorConfig.store.secondaryColor,
                  width: 70,
                  height: 70,
                }}
              />
            </View>
            <Text style={styles.menuText}>My E-Card</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.pageRewards}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={appConfig.iconMyVoucher}
                style={{
                  tintColor: colorConfig.store.secondaryColor,
                  width: 70,
                  height: 70,
                }}
              />
            </View>
            <Text style={styles.menuText}>Voucher</Text>
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
    fontFamily: 'Poppins-Regular',
  },
});
