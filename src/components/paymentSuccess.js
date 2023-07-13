/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import LottieView from 'lottie-react-native';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {clearAccount, clearAddress} from '../actions/payment.actions';
// import OneSignal from 'react-native-onesignal';
import {getPendingCart, removeTimeslot} from '../actions/order.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import {updateUser} from '../actions/user.action';

import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';

class PaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: this.props.dataRespons.message,
      titleAlert: `${this.props.intlData.messages.thankYou} !`,
      showDetail: false,
    };

    // OneSignal.inFocusDisplaying(2);
  }

  componentDidMount = async () => {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
    try {
      this.props.dispatch(clearAccount());
      this.props.dispatch(getPendingCart());
      this.props.dispatch(removeTimeslot());
    } catch (e) {}
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleRemoveReducer = async () => {
    const userDecrypt = CryptoJS.AES.decrypt(
      this.props.user,
      awsConfig.PRIVATE_KEY_RSA,
    );

    const user = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    await this.props.dispatch(
      updateUser({selectedAddress: null, phoneNumber: user.phoneNumber}),
    );
    await this.props.dispatch({
      type: 'DATA_ORDERING_MODE',
      orderingMode: null,
    });
  };

  handleBackPress = async () => {
    this.handleRemoveReducer();
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    const {url, outlet, paidMembership, paySVC, payVoucher} = this.props;
    if (paidMembership === true) {
      Actions.popTo('pageIndex');
    } else if (paySVC === true) {
      Actions.popTo('summary');
    } else if (payVoucher === true) {
      Actions.popTo(this.props.fromPage);
    } else {
      Actions.reset('app', {fromPayment: true});
    }
    // Order Notifications
    try {
      if (paidMembership !== true) {
        setTimeout(async () => {
          if (
            outlet !== undefined &&
            !isEmptyArray(outlet.waitingTimeMessages) &&
            url !== undefined
          ) {
            let needle = this.props.dataRespons.totalNettAmount;
            let closest = await outlet.waitingTimeMessages.find(
              item => needle >= item.minAmount && needle <= item.maxAmount,
            );

            if (closest != undefined) {
              if (
                closest.message !== undefined &&
                closest.message !== null &&
                closest.message !== ''
              ) {
                Alert.alert('Ordering', closest.message);
              }
            }
          }
        }, 1000);
      }
    } catch (e) {}
  };

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear() +
      ' • ' +
      tanggal.getHours() +
      ':' +
      tanggal.getMinutes()
    );
  }

  getMonth(value) {
    var mount = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return mount[value];
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  formatCurrency = value => {
    try {
      return CurrencyFormatter(value).match(/[a-z]+|[^a-z]+/gi)[1];
    } catch (e) {
      return value;
    }
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

  getPaymentType = item => {
    try {
      if (!isEmptyObject(item.details)) {
        return item.details.cardIssuer.toUpperCase() + ' ' + item.paymentName;
      } else {
        return item.paymentName;
      }
    } catch (e) {
      return '-';
    }
  };

  getGrandTotal = () => {
    const {dataRespons} = this.props;
    try {
      if (!isEmptyArray(dataRespons.payments)) {
        const find = dataRespons.payments.find(
          item => item.isAppPayment === true || item.isSVC === true,
        );
        if (find !== undefined) {
          let grandTotal = 0;
          for (let i = 0; i < dataRespons.payments.length; i++) {
            if (
              dataRespons.payments[i].isAppPayment ||
              dataRespons.payments[i].isSVC
            ) {
              grandTotal += Number(dataRespons.payments[i].paymentAmount);
            }
          }
          return this.format(CurrencyFormatter(grandTotal));
        } else if (find === undefined && dataRespons.payAtPOS !== true) {
          const findAmount = dataRespons.payments.find(
            item => item.paymentID === 'MANUAL_TRANSFER',
          );
          if (findAmount) {
            return this.format(CurrencyFormatter(findAmount.paymentAmount));
          }
          return this.format(CurrencyFormatter(0));
        } else {
          return this.format(CurrencyFormatter(dataRespons.totalNettAmount));
        }
      } else {
        if (dataRespons.totalNettAmount) {
          return this.format(CurrencyFormatter(dataRespons.totalNettAmount));
        } else {
          return this.format(CurrencyFormatter(dataRespons.price));
        }
      }
    } catch (e) {
      return dataRespons.totalNettAmount;
    }
  };

  renderPaymentDetails = () => {
    const {intlData} = this.props;
    const {paidMembership, paySVC} = this.props;
    return (
      <View style={styles.card}>
        <View
          style={{
            position: 'absolute',
            height: 70,
            width: 70,
            borderColor: 'white',
            borderWidth: 5,
            borderRadius: 60,
            top: -30,
            left: this.state.screenWidth / 2 - 60,
            backgroundColor: colorConfig.store.colorSuccess,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            size={40}
            name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
            style={{
              color: colorConfig.pageIndex.backgroundColor,
            }}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: colorConfig.pageIndex.activeTintColor,
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            {this.props.dataRespons.payAtPOS === true
              ? 'Amount to Pay'
              : intlData.messages.youPaid}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              left: -10,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 10,
                marginRight: 5,
              }}>
              {appConfig.appMataUang}
            </Text>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
                fontSize: 35,
                fontWeight: 'bold',
              }}>
              {/*{this.format(*/}
              {/*  CurrencyFormatter(this.props.dataRespons.totalNettAmount),*/}
              {/*)}*/}
              {this.getGrandTotal()}
            </Text>
          </View>
          {/*{this.props.dataRespons.earnedPoint > 0 ? (*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      color: colorConfig.pageIndex.activeTintColor,*/}
          {/*      fontSize: 12,*/}
          {/*    }}>*/}
          {/*    {'+' +*/}
          {/*      this.props.dataRespons.earnedPoint +*/}
          {/*      ` ${intlData.messages.point}`}*/}
          {/*  </Text>*/}
          {/*) : null}*/}
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              textAlign: 'center',
              marginVertical: 10,
              color: colorConfig.pageIndex.activeTintColor,
            }}>
            {this.props.dataRespons.message}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colorConfig.pageIndex.grayColor,
            height: 1,
          }}
        />
        <View
          style={{
            margin: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 40,
              borderColor: colorConfig.pageIndex.activeTintColor,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
              paddingTop: 3,
            }}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
              style={{color: colorConfig.pageIndex.activeTintColor}}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: colorConfig.pageIndex.activeTintColor,
              }}>
              {this.props.companyInfo.companyName}
            </Text>
            {paidMembership || paySVC ? null : (
              <Text
                style={{
                  fontSize: 14,
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {this.props.outlet.name}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            backgroundColor: colorConfig.pageIndex.activeTintColor,
            height: 1,
          }}
        />
        <View
          style={{
            padding: 10,
            backgroundColor: '#F0F0F0',
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
              }}>
              {intlData.messages.dateAndTime}
            </Text>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
              }}>
              {this.getDate(this.props.dataRespons.createdAt)}
            </Text>
          </View>
          {/*<View*/}
          {/*  style={{*/}
          {/*    flexDirection: 'column',*/}
          {/*    // justifyContent: 'space-between',*/}
          {/*  }}>*/}
          {/*  /!*<Text*!/*/}
          {/*  /!*  style={{*!/*/}
          {/*  /!*    color: colorConfig.pageIndex.grayColor,*!/*/}
          {/*  /!*  }}>*!/*/}
          {/*  /!*  {intlData.messages.paymentType}*!/*/}
          {/*  /!*</Text>*!/*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      marginTop: 10,*/}
          {/*      textAlign: 'right',*/}
          {/*      color: colorConfig.pageIndex.grayColor,*/}
          {/*    }}>*/}
          {/*    {this.getPaymentType(this.props.dataRespons.paymentCard)}*/}
          {/*  </Text>*/}
          {/*</View>*/}
          <View
            style={{
              backgroundColor: colorConfig.pageIndex.grayColor,
              height: 1,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                height: 45,
                width: 150,
                borderColor: colorConfig.pageIndex.activeTintColor,
                borderWidth: 1,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colorConfig.pageIndex.activeTintColor,
                borderRadius: 10,
              }}
              onPress={this.handleBackPress}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {intlData.messages.ok}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderAnimateSuccess = () => {
    try {
      return (
        <LottieView
          speed={0.8}
          source={require('../assets/animate/1708-success')}
          autoPlay
          loop={false}
        />
      );
    } catch (e) {
      return null;
    }
  };

  render() {
    const {showDetail} = this.state;
    setTimeout(() => {
      this.setState({showDetail: true});
    }, 2500);
    return (
      <View style={styles.container}>
        {showDetail ? this.renderPaymentDetails() : this.renderAnimateSuccess()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colorConfig.store.darkColor,
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
  card: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
});

mapStateToProps = state => ({
  intlData: state.intlData,
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  user: state.userReducer.getUser.userDetails,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentSuccess);
