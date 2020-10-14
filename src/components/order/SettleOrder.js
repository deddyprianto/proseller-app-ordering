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
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  BackHandler,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as _ from 'lodash';
// import SwipeButton from 'rn-swipe-button';
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import {
  getBasket,
  getCart,
  getDeliveryProvider,
  getPendingCart,
  getPendingCartSingle,
  settleOrder,
} from '../../actions/order.action';
// import Loader from './../loader';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {
  clearAccount,
  clearAddress,
  getAccountPayment,
  registerCard,
  selectedAccount,
} from '../../actions/payment.actions';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import UUIDGenerator from 'react-native-uuid-generator';
import {defaultPaymentAccount} from '../../actions/user.action';
import LoaderDarker from '../LoaderDarker';
import {dataStores, getOutletById} from '../../actions/stores.action';
import {refreshToken} from '../../actions/auth.actions';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {afterPayment, myVoucers} from '../../actions/account.action';
import {Dialog} from 'react-native-paper';

class SettleOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      totalBayar: this.props.pembayaran.payment,
      cancelVoucher: false,
      cancelPoint: false,
      loading: false,
      failedPay: false,
      dataVoucer: undefined,
      moneyPoint: undefined,
      addPoint: undefined,
      cvv: '',
      selectedItem: {},
      refreshing: false,
      outlet: this.props.outlet,
      paymentFailed: false,
      prompPayAtPOS: false,
      pendingCart: {},
    };

    // check if users payment methods is empty
    const {myCardAccount} = this.props;
    // if (isEmptyArray(myCardAccount)) {
    //   this.askUserToAddAccount();
    // }

    // check if default accout has been set, then add selected account
    if (!isEmptyObject(this.props.defaultAccount)) {
      this.checkDefaultPaymentAccount();
    }
  }

  askUserToAddAccount = async () => {
    Alert.alert(
      'Credit Card Not Registered',
      'You have not registered an account for payment, please register now.',
      [{text: 'OK', onPress: () => this.registerCard()}],
      {cancelable: false},
    );
  };

  registerCard = async () => {
    await this.setState({loading: true});
    try {
      const payload = {
        referenceNo: 'xxx-xxx-xx',
        paymentID: 'DBS_Wirecard',
      };

      const response = await this.props.dispatch(registerCard(payload));

      if (response.success == true) {
        Actions.hostedPayment({
          url: response.response.data.url,
          page: 'settleOrder',
        });
      } else {
        Alert.alert('Sorry', 'Cant add credit card, please try again');
      }

      await this.setState({loading: false});
    } catch (e) {
      await this.setState({loading: false});
      Alert.alert('Oppss..', 'Something went wrong, please try again.');
    }
  };

  checkCVV = card => {
    if (this.isCVVPassed(card)) {
      this.createPayment();
    } else {
      this.RBSheet.open();
    }
  };

  componentDidMount = async () => {
    const {defaultAccount, pembayaran} = this.props;
    await this.setState({loading: true});
    await this.props.dispatch(refreshToken());
    await this.setDataPayment(false);

    // get outlet details
    try {
      const outletID = pembayaran.storeId;
      const response = await this.props.dispatch(getOutletById(outletID));
      if (response != false) {
        await this.setState({outlet: response});
      }
    } catch (e) {}

    await this.setState({loading: false});

    try {
      this.props.dispatch(myVoucers());
      await this.props.dispatch(getAccountPayment());
      // await this.setState({loading: false});
    } catch (e) {
      // await this.setState({loading: false});
    }

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  checkDefaultPaymentAccount = async () => {
    try {
      const {defaultAccount, myCardAccount, companyInfo} = this.props;
      if (defaultAccount.isAccountRequired != false) {
        if (!isEmptyArray(myCardAccount)) {
          const data = await myCardAccount.find(
            item => item.id == defaultAccount.id,
          );
          if (data == undefined) {
            await this.props.dispatch(defaultPaymentAccount(undefined));
            return;
          } else {
            this.props.dispatch(selectedAccount(this.props.defaultAccount));
            return;
          }
        } else {
          await this.props.dispatch(defaultPaymentAccount(undefined));
          return;
        }
      } else {
        // check if payment provider was deleted
        try {
          if (isEmptyArray(companyInfo.paymentTypes)) {
            await this.props.dispatch(defaultPaymentAccount(undefined));
            return;
          }
        } catch (e) {}

        try {
          if (!isEmptyArray(companyInfo.paymentTypes)) {
            if (!isEmptyObject(defaultAccount)) {
              const findPaymentProvider = companyInfo.paymentTypes.find(
                item => item.paymentID == defaultAccount.paymentID,
              );
              if (findPaymentProvider == undefined) {
                await this.props.dispatch(defaultPaymentAccount(undefined));
                return;
              }
            }
          }
        } catch (e) {}

        if (!isEmptyObject(defaultAccount)) {
          this.props.dispatch(selectedAccount(this.props.defaultAccount));
          return;
        }
      }
    } catch (e) {}
  };

  setDataVoucher = async dataVoucer => {
    await this.setDataPayment(true);
    await this.setState({
      dataVoucer,
      addPoint: undefined,
      moneyPoint: undefined,
      cancelVoucher: false,
    });
    await this.setDataPayment(false);
  };

  setDataPoint = async (addPoint, moneyPoint) => {
    await this.setDataPayment(true);
    await this.setState({
      addPoint,
      moneyPoint,
      dataVoucer: undefined,
      cancelPoint: false,
    });
    await this.setDataPayment(false);
  };

  setDataPayment = async cancel => {
    var totalBayar = 0;
    if (!cancel) {
      var redeemVoucer = 0;

      try {
        if (this.state.dataVoucer != undefined) {
          if (this.state.dataVoucer.applyToSpecificProduct == true) {
            //  search specific product
            let result = this.props.pembayaran.dataPay.find(
              item => item.barcode == this.state.dataVoucer.product.barcode,
            );
            // check if apply to specific product is found
            if (result == undefined) {
              this.cencelVoucher();
              Alert.alert(
                'Sorry',
                `This voucher is only available on specific product`,
              );
            } else {
              redeemVoucer =
                (result.price * this.state.dataVoucer.voucherValue) / 100;
            }
          } else {
            if (this.state.dataVoucer.voucherType == 'discPercentage') {
              redeemVoucer =
                (this.props.pembayaran.payment *
                  this.state.dataVoucer.voucherValue) /
                100;
            } else if (this.state.dataVoucer.voucherType == 'discAmount') {
              redeemVoucer = this.state.dataVoucer.voucherValue;
            }
          }

          //  check cap Amount
          if (this.state.dataVoucer.capAmount != undefined) {
            let capAmount = parseFloat(this.state.dataVoucer.capAmount);
            if (redeemVoucer > capAmount && capAmount > 0) {
              redeemVoucer = capAmount;
            }
          }
        }
      } catch (e) {}

      var redeemPoint =
        this.state.addPoint == undefined ? 0 : this.state.moneyPoint;
      totalBayar = this.state.totalBayar - (redeemVoucer + redeemPoint);
    } else {
      totalBayar = this.props.pembayaran.payment;
    }
    // check whether the total pay <0 after deducting the discount vouchers and points
    if (totalBayar < 0) {
      totalBayar = 0;
    }
    // console.log('total bayar ', totalBayar);
    this.setState({totalBayar});
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}

    try {
      clearInterval(this.loopCart);
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    await this.props.dispatch(clearAccount());

    try {
      this.props.dispatch(afterPayment(false));
    } catch (e) {}

    Actions.pop();
  };

  btnPayment = () => {
    Actions.paymentSuccess();
  };

  myVouchers = () => {
    const {intlData} = this.props;
    var myVoucers = [];
    try {
      if (this.props.myVoucers != undefined) {
        _.forEach(
          _.groupBy(
            this.props.myVoucers.filter(voucher => voucher.deleted == false),
            'id',
          ),
          function(value, key) {
            value[0].totalRedeem = value.length;
            myVoucers.push(value[0]);
          },
        );
      }

      if (
        this.state.cancelVoucher == false &&
        this.state.dataVoucer != undefined
      ) {
        var jumlah = _.find(myVoucers, {id: this.state.dataVoucer.id})
          .totalRedeem;

        var index = _.findIndex(myVoucers, {
          id: this.state.dataVoucer.id,
        });

        _.updateWith(
          myVoucers,
          '[' + index + "]['totalRedeem']",
          _.constant(jumlah - 1),
          Object,
        );
      }

      Actions.paymentAddVoucers({
        intlData,
        data: myVoucers,
        totalPrice: this.state.totalBayar,
        pembayaran: this.props.pembayaran,
        setDataVoucher: this.setDataVoucher,
      });
    } catch (e) {
      this.setState({
        showAlert: true,
        pesanAlert: 'Something went wrong, please try again.',
        titleAlert: 'Oopss!',
      });
    }
  };

  myPoint = () => {
    const {intlData} = this.props;
    Actions.paymentAddPoint({
      intlData,
      data: this.props.totalPoint,
      pembayaran: this.props.pembayaran,
      valueSet: this.state.addPoint == undefined ? 0 : this.state.addPoint,
      setDataPoint: this.setDataPoint,
    });
  };

  saveCVV = async () => {
    try {
      let card = JSON.stringify(this.props.selectedAccount);
      card = JSON.parse(card);
      card.details.CVV = this.state.cvv;

      await this.props.dispatch(selectedAccount(card));
      await this.createPayment();
      this.RBSheet.close();
    } catch (e) {
      this.RBSheet.close();
      Alert.alert('Sorry', 'Can`t set CVV, please try again');
      console.log(e);
    }
  };

  askUserToEnterCVV = () => {
    const {intlData} = this.props;
    const {loading} = this.state;

    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'slide'}
        height={210}
        duration={10}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          container: {
            backgroundColor: colorConfig.store.textWhite,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        <Text
          style={{
            color: colorConfig.pageIndex.inactiveTintColor,
            fontSize: 20,
            paddingBottom: 5,
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
          }}>
          Please Enter Your Card CVV
        </Text>

        <TextInput
          onChangeText={value => {
            this.setState({cvv: value});
          }}
          keyboardType={'numeric'}
          secureTextEntry={true}
          maxLength={3}
          style={{
            padding: 10,
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
            color: colorConfig.pageIndex.grayColor,
            borderColor: colorConfig.pageIndex.grayColor,
            borderRadius: 10,
            borderWidth: 1.5,
            letterSpacing: 20,
            width: '35%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        {loading ? (
          <ActivityIndicator
            style={{padding: 10}}
            size={'large'}
            color={colorConfig.store.colorSuccess}
          />
        ) : (
          <TouchableOpacity
            disabled={this.state.cvv.length != 3 ? true : false}
            onPress={this.saveCVV}
            style={{
              marginTop: 20,
              padding: 12,
              backgroundColor:
                this.state.cvv.length != 3
                  ? colorConfig.store.disableButton
                  : colorConfig.store.defaultColor,
              borderRadius: 15,
              width: '35%',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Lato-Bold',
                fontSize: 15,
                textAlign: 'center',
              }}>
              SAVE
            </Text>
          </TouchableOpacity>
        )}
      </RBSheet>
    );
  };

  isCVVPassed = item => {
    try {
      let requiredCVV = item.details.userInput.find(
        data => data.name == 'cardCVV',
      );

      if (requiredCVV == undefined) return true;

      if (requiredCVV.required == true && item.details.CVV != undefined) {
        return true;
      } else if (requiredCVV.required == false) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return true;
    }
  };

  onSlideRight = async () => {
    const {selectedAccount} = this.props;
    const {totalBayar} = this.state;

    // double check selectedAccount
    if (selectedAccount == undefined && totalBayar != 0) {
      Alert.alert('Oppss', 'Please select payment method');
      return;
    }

    // check if total is 0, then dont add creditcard
    // if (totalBayar != 0) {
    //   // check if CVV is required and has been filled
    //   this.checkCVV(selectedAccount);
    // } else {
    //   this.createPayment();
    // }
    this.createPayment();
  };

  createPayment = async () => {
    const {intlData, selectedAccount, companyInfo} = this.props;
    const {totalBayar} = this.state;

    var pembayaran = {};
    try {
      await this.setState({loading: true});
      const UUID = await UUIDGenerator.getRandomUUID();
      this.setState({loading: true});
      pembayaran.price = Number(this.props.pembayaran.payment.toFixed(3));
      pembayaran.cartID = this.props.pembayaran.cartID;

      // if price is 0, then dont add credit card
      if (totalBayar != 0) {
        // Payment Type Detail
        let paymentPayload = {};

        if (!isEmptyArray(companyInfo.paymentTypes)) {
          const find = companyInfo.paymentTypes.find(
            item => item.paymentID == selectedAccount.paymentID,
          );
          if (find != undefined) {
            paymentPayload.paymentID = selectedAccount.paymentID;
            paymentPayload.paymentName = selectedAccount.paymentName;

            if (find.isAccountRequired != false) {
              paymentPayload.accountId = selectedAccount.accountID;
            }

            if (find.minimumPayment != undefined) {
              if (totalBayar < find.minimumPayment) {
                this.setState({loading: false});
                Alert.alert(
                  'Sorry',
                  `Minimum transaction amount is ${appConfig.appMataUang}` +
                    this.formatCurrency(find.minimumPayment),
                );
                return;
              }
            }
          }
        }

        pembayaran.paymentPayload = paymentPayload;
      }

      if (
        this.state.dataVoucer == undefined &&
        this.state.addPoint == undefined
      ) {
        pembayaran.statusAdd = null;
        pembayaran.redeemValue = 0;
      } else {
        if (this.state.dataVoucer != undefined) {
          pembayaran.voucherId = this.state.dataVoucer.id;
          pembayaran.price = Number(this.state.totalBayar.toFixed(3));
          pembayaran.voucherSerialNumber = this.state.dataVoucer.serialNumber;
          pembayaran.statusAdd = 'addVoucher';
        }
        if (this.state.addPoint != undefined) {
          // pembayaran.price = Number(
          //   this.props.pembayaran.totalGrossAmount.toFixed(3),
          // );
          pembayaran.redeemValue = this.state.addPoint;
          pembayaran.statusAdd = 'addPoint';
        }
      }

      // if ordering mode is exist
      if (this.props.pembayaran.orderingMode != undefined) {
        pembayaran.orderingMode = this.props.pembayaran.orderingMode;
        pembayaran.tableNo = this.props.pembayaran.tableNo;
      }

      // check if delivery address is exist
      if (this.props.pembayaran.deliveryAddress != undefined) {
        pembayaran.deliveryAddress = this.props.pembayaran.deliveryAddress;
      }

      // check if delivery fee is exist
      if (this.props.pembayaran.deliveryFee != undefined) {
        pembayaran.deliveryFee = this.props.pembayaran.deliveryFee;
        // add delivery fee to total
        pembayaran.price = Number(
          pembayaran.price + this.props.pembayaran.deliveryFee,
        );
      }

      // check if delivery provider is exist
      if (this.props.pembayaran.deliveryProvider != undefined) {
        pembayaran.deliveryProviderId = this.props.pembayaran.deliveryProvider.id;
        pembayaran.deliveryProvider = this.props.pembayaran.deliveryProvider.name;
        pembayaran.deliveryProviderName = this.props.pembayaran.deliveryProvider.name;
        pembayaran.deliveryService = '-';
      }

      try {
        pembayaran.cartDetails = {
          partitionKey: this.props.pembayaran.cartDetails.partitionKey,
          sortKey: this.props.pembayaran.cartDetails.sortKey,
        };
      } catch (e) {}

      // get url
      let {url} = this.props;

      try {
        if (
          this.props.pembayaran.orderActionDate != undefined &&
          this.props.pembayaran.orderActionTime != undefined
        ) {
          pembayaran.orderActionDate = this.props.pembayaran.orderActionDate;
          pembayaran.orderActionTime = this.props.pembayaran.orderActionTime;
        }
      } catch (e) {}

      console.log('Payload settle order ', pembayaran);
      console.log('URL settle order ', url);

      const response = await this.props.dispatch(settleOrder(pembayaran, url));
      console.log('reponse pembayaran settle order ', response);
      if (response.success) {
        try {
          this.props.dispatch(afterPayment(true));
        } catch (e) {}

        if (response.responseBody.data.action != undefined) {
          if (response.responseBody.data.action.type === 'url') {
            Actions.hostedTrx({
              outlet: this.state.outlet,
              url: response.responseBody.data.action.url,
              urlSettle: url,
              referenceNo: response.responseBody.data.referenceNo,
              cartID: this.props.pembayaran.cartID,
              page: 'settleOrder',
            });
            this.setState({loading: false});
          }
        } else {
          //  remove selected account
          this.props.dispatch(clearAccount());
          this.props.dispatch(clearAddress());

          // get pending order
          this.props.dispatch(getPendingCart());

          // go to payment success
          const {url} = this.props;
          Actions.paymentSuccess({
            intlData,
            outlet: this.state.outlet,
            url,
            dataRespons: response.responseBody.data,
          });
        }
      } else {
        //  cancel voucher and pont selected
        this.props.dispatch(getBasket());
        this.setState({loading: false, failedPay: true});
        this.cencelPoint();
        this.cencelVoucher();
        if (
          response.responseBody.data != undefined &&
          response.responseBody.data.message != undefined
        ) {
          Alert.alert('Sorry', response.responseBody.data.message);
        } else {
          Alert.alert(
            'Sorry',
            'Something went wrong with server, please try again',
          );
        }
      }
    } catch (e) {
      //  cancel voucher and pont selected
      this.cencelPoint();
      this.cencelVoucher();
      console.log(e);
      Alert.alert('Oppss', 'Something went wrong, please try again');
      this.setState({loading: false, failedPay: true});
    }
  };

  detailPayment = pembayaran => {
    const {intlData} = this.props;
    Actions.paymentDetailItem({
      intlData,
      point: this.state.addPoint,
      voucher: this.state.dataVoucer,
      totalBayar: this.state.totalBayar,
      pembayaran: pembayaran,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  cencelVoucher = async () => {
    // await delete this.state.dataVoucer;
    await this.setState({dataVoucer: undefined});
    await this.setDataPayment(true);
    this.setState({cancelVoucher: true});
  };

  cencelPoint = async () => {
    await delete this.state.addPoint;
    await this.setDataPayment(true);
    this.setState({cancelPoint: true});
  };

  formatCurrency = value => {
    try {
      return this.format(CurrencyFormatter(value).match(/[a-z]+|[^a-z]+/gi)[1]);
    } catch (e) {
      return value;
    }
  };

  renderUsePoint = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'Lato-Bold',
            color: colorConfig.pageIndex.grayColor,
          }}>
          Point
        </Text>
        {this.state.cancelPoint == false && this.state.addPoint != undefined ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.btnMethodCencel}
              onPress={() => this.cencelPoint()}>
              <Icon
                size={18}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-close-circle-outline'
                    : 'md-close-circle-outline'
                }
                style={{color: colorConfig.store.colorError}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnMethodSelected}
              onPress={this.myPoint}>
              {/*<Image*/}
              {/*  style={{height: 18, width: 23, marginRight: 5}}*/}
              {/*  source={require('../assets/img/ticket.png')}*/}
              {/*/>*/}
              <Icon
                size={20}
                name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
                style={{
                  color: colorConfig.store.textWhite,
                  marginRight: 8,
                }}
              />
              <Text style={styles.descMethodSelected}>
                {'- ' + this.state.addPoint + ' Point'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.btnMethodUnselected}
            onPress={this.myPoint}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
              style={{
                color: colorConfig.store.defaultColor,
                marginRight: 8,
              }}
            />
            <Text style={styles.descMethodUnselected}>Pick Points</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  selectedPaymentMethod = selectedAccount => {
    try {
      if (selectedAccount.isAccountRequired != false) {
        if (!isEmptyObject(selectedAccount)) {
          let number = selectedAccount.details.maskedAccountNumber;
          number = number.substr(number.length - 4, 4);
          return `${selectedAccount.details.cardIssuer.toUpperCase()} ${number}`;
        } else {
          return null;
        }
      } else {
        return selectedAccount.paymentName;
      }
    } catch (e) {
      return null;
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

  _onRefresh = async () => {
    try {
      await this.setState({refreshing: true});
      // fetch details outlet
      const outletID = this.props.outlet.id;
      const response = await this.props.dispatch(getOutletById(outletID));
      if (response != false) {
        await this.setState({outlet: response});
      }
      await this.setState({refreshing: false});
    } catch (e) {}
  };

  getOutletName = item => {
    try {
      if (item != undefined) {
        return item.substr(0, 20);
      } else {
        return item;
      }
    } catch (e) {
      return item;
    }
  };

  payAtPOS = async () => {
    const {intlData, selectedAccount, companyInfo} = this.props;
    const {totalBayar, outlet} = this.state;

    var pembayaran = {};
    try {
      await this.setState({loading: true});
      const UUID = await UUIDGenerator.getRandomUUID();
      this.setState({loading: true});
      pembayaran.price = Number(this.props.pembayaran.payment.toFixed(3));
      pembayaran.cartID = this.props.pembayaran.cartID;

      if (
        this.state.dataVoucer != undefined ||
        this.state.addPoint != undefined
      ) {
        Alert.alert(
          'Sorry',
          'Can not use voucher or point if you make payment at the store.',
        );
        this.setState({loading: false});
        this.cencelPoint();
        this.cencelVoucher();
        return;
      }

      // if ordering mode is exist
      if (this.props.pembayaran.orderingMode != undefined) {
        pembayaran.orderingMode = this.props.pembayaran.orderingMode;
        pembayaran.tableNo = this.props.pembayaran.tableNo;
      }

      // check if delivery address is exist
      if (this.props.pembayaran.deliveryAddress != undefined) {
        pembayaran.deliveryAddress = this.props.pembayaran.deliveryAddress;
      }

      // check if delivery fee is exist
      if (this.props.pembayaran.deliveryFee != undefined) {
        pembayaran.deliveryFee = this.props.pembayaran.deliveryFee;
        // add delivery fee to total
        pembayaran.price = Number(
          pembayaran.price + this.props.pembayaran.deliveryFee,
        );
      }

      // check if delivery provider is exist
      if (this.props.pembayaran.deliveryProvider != undefined) {
        pembayaran.deliveryProviderId = this.props.pembayaran.deliveryProvider.id;
        pembayaran.deliveryProvider = this.props.pembayaran.deliveryProvider.name;
        pembayaran.deliveryProviderName = this.props.pembayaran.deliveryProvider.name;
        pembayaran.deliveryService = '-';
      }

      try {
        pembayaran.cartDetails = {
          partitionKey: this.props.pembayaran.cartDetails.partitionKey,
          sortKey: this.props.pembayaran.cartDetails.sortKey,
        };
      } catch (e) {}

      // get url
      let {url} = this.props;

      pembayaran.payAtPOS = true;

      try {
        if (
          this.props.pembayaran.orderActionDate != undefined &&
          this.props.pembayaran.orderActionTime != undefined
        ) {
          pembayaran.orderActionDate = this.props.pembayaran.orderActionDate;
          pembayaran.orderActionTime = this.props.pembayaran.orderActionTime;
        }
      } catch (e) {}

      console.log('Payload settle order ', pembayaran);
      console.log('URL settle order ', url);

      const response = await this.props.dispatch(settleOrder(pembayaran, url));
      console.log('reponse pembayaran settle order ', response);
      if (response.success) {
        try {
          this.props.dispatch(afterPayment(true));
        } catch (e) {}

        this.props.dispatch(clearAccount());
        this.props.dispatch(clearAddress());

        // get pending order
        this.props.dispatch(getPendingCart());

        // go to payment success
        const {url} = this.props;

        const dataResponse = {
          message: 'Please proceed payment at the store',
          createdAt: new Date(),
          outletName: outlet.name,
          price: totalBayar,
          payAtPOS: true,
        };

        Actions.paymentSuccess({
          intlData,
          outlet: this.state.outlet,
          url,
          dataRespons: dataResponse,
        });
      } else {
        //  cancel voucher and pont selected
        this.props.dispatch(getBasket());
        this.setState({loading: false, failedPay: true});
        this.cencelPoint();
        this.cencelVoucher();
        if (
          response.responseBody.data != undefined &&
          response.responseBody.data.message != undefined
        ) {
          Alert.alert('Sorry', response.responseBody.data.message);
        } else {
          Alert.alert(
            'Sorry',
            'Something went wrong with server, please try again',
          );
        }
      }
    } catch (e) {
      //  cancel voucher and pont selected
      this.cencelPoint();
      this.cencelVoucher();
      console.log(e);
      Alert.alert('Oppss', 'Something went wrong, please try again');
      this.setState({loading: false, failedPay: true});
    }
  };

  getPendingOrder = async cart => {
    try {
      clearInterval(this.loopCart);
    } catch (e) {}

    this.loopCart = setInterval(async () => {
      await this.loopPendingCart(cart);
    }, 1500);
  };

  loopPendingCart = async cart => {
    try {
      const response = await this.props.dispatch(getPendingCartSingle(cart.id));

      if (response.isPaymentComplete == true) {
        const {url, intlData} = this.props;
        try {
          clearInterval(this.loopCart);
        } catch (e) {}
        Actions.paymentSuccess({
          intlData,
          outlet: this.state.outlet,
          url,
          dataRespons: response.confirmationInfo,
        });
      }
    } catch (e) {}
  };

  renderPrompPayAtPOS = () => {
    const {pendingCart} = this.state;
    return (
      <Dialog
        dismissable={false}
        visible={this.state.prompPayAtPOS}
        onDismiss={() => {
          this.setState({prompPayAtPOS: false});
        }}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              fontSize: 17,
              color: colorConfig.store.defaultColor,
            }}>
            Processing your payment
          </Text>
          <View style={{marginTop: 10}}>
            <ActivityIndicator
              color={colorConfig.store.secondaryColor}
              size={50}
            />
          </View>
          {pendingCart.tableNo != undefined && pendingCart.tableNo != '-' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colorConfig.store.secondaryColor,
                borderRadius: 7,
                padding: 10,
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: colorConfig.store.titleSelected,
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                  fontSize: 18,
                }}>
                Table No : {pendingCart.tableNo}
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colorConfig.store.secondaryColor,
                borderRadius: 7,
                padding: 10,
                marginTop: 30,
              }}>
              <Text
                style={{
                  color: colorConfig.store.titleSelected,
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                  fontSize: 18,
                }}>
                Queue No : {pendingCart.queueNo}
              </Text>
            </View>
          )}
        </Dialog.Content>
      </Dialog>
    );
  };

  render() {
    const {intlData, selectedAccount, detailPoint, campign} = this.props;
    const {outlet} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <LoaderDarker />}
        {this.askUserToEnterCVV()}
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              alignItems: 'center',
              paddingVertical: 4,
              shadowColor: '#00000021',
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.37,
              shadowRadius: 7.49,
              elevation: 12,
            }}>
            <TouchableOpacity onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  margin: 10,
                  marginLeft: 20,
                  paddingRight: 50,
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10,
                left: -50,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Confirm Payment
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              left: -10,
              marginTop: 30,
              marginBottom: 50,
            }}>
            <Text
              style={{
                color: colorConfig.store.title,
                fontSize: 16,
                marginRight: 5,
              }}>
              {appConfig.appMataUang}
            </Text>
            <Text
              style={{
                color: colorConfig.store.title,
                fontSize: 60,
                top: 13,
              }}>
              {this.formatCurrency(this.state.totalBayar)}
            </Text>
            {/* value discount */}
            {this.state.totalBayar != this.props.pembayaran.payment ? (
              <View style={{marginBottom: 30}}>
                <Text
                  style={{
                    color: colorConfig.pageIndex.grayColor,
                    fontSize: 20,
                    textDecorationLine: 'line-through',
                    position: 'absolute',
                    right: -15,
                    top: 75,
                  }}>
                  {this.formatCurrency(this.props.pembayaran.payment)}
                </Text>
              </View>
            ) : null}
            {/* value discount */}
          </View>
          <View
            onPress={() => this.detailPayment(this.props.pembayaran)}
            style={{
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20,
              marginTop: 15,
              height: this.state.screenHeight - 250,
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: -30,
                  height: 60,
                  width: this.state.screenWidth - 40,
                  backgroundColor: colorConfig.pageIndex.backgroundColor,
                  borderColor: colorConfig.pageIndex.activeTintColor,
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
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
                        {appConfig.appName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colorConfig.pageIndex.grayColor,
                        }}>
                        {this.getOutletName(this.props.pembayaran.storeName)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.detailPayment(this.props.pembayaran)}
                    style={{
                      flexDirection: 'row',
                      marginRight: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginRight: 5,
                        fontWeight: 'bold',
                        fontSize: 17,
                        color: colorConfig.pageIndex.activeTintColor,
                      }}>
                      Detail
                    </Text>
                    <Icon
                      size={18}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-arrow-dropright-circle'
                          : 'md-arrow-dropright-circle'
                      }
                      style={{
                        color: colorConfig.pageIndex.activeTintColor,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 50,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Lato-Bold',
                  color: colorConfig.pageIndex.grayColor,
                }}>
                Vouchers
              </Text>
              {this.state.cancelVoucher == false &&
              this.state.dataVoucer != undefined ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.btnMethodCencel}
                    onPress={() => this.cencelVoucher()}>
                    <Icon
                      size={18}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-close-circle-outline'
                          : 'md-close-circle-outline'
                      }
                      style={{color: colorConfig.store.colorError}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnMethodSelected}
                    onPress={this.myVouchers}>
                    <Icon
                      size={20}
                      name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                      style={{
                        color: colorConfig.store.textWhite,
                        marginRight: 8,
                      }}
                    />
                    <Text style={styles.descMethodSelected}>
                      {this.state.dataVoucer.name.substr(0, 13)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.btnMethodUnselected}
                  onPress={this.myVouchers}>
                  {/*<Image*/}
                  {/*  style={{height: 18, width: 23, marginRight: 5}}*/}
                  {/*  source={require('../assets/img/voucher.png')}*/}
                  {/*/>*/}
                  <Icon
                    size={20}
                    name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                    style={{
                      color: colorConfig.store.defaultColor,
                      marginRight: 8,
                    }}
                  />
                  <Text style={styles.descMethodUnselected}>
                    Select Vouchers
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {this.props.campaignActive &&
            campign != undefined &&
            campign.points &&
            campign.points.pointsToRebateRatio1 != 0 &&
            detailPoint != undefined &&
            !isEmptyObject(detailPoint.trigger) &&
            (detailPoint.trigger.status === true ||
              detailPoint.trigger.campaignTrigger === 'USER_SIGNUP')
              ? this.renderUsePoint()
              : null}

            <View
              style={{
                marginTop: 12,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Lato-Bold',
                  color:
                    selectedAccount == undefined
                      ? colorConfig.store.colorError
                      : colorConfig.pageIndex.grayColor,
                }}>
                Payment Method <Text style={{lineHeight: 30}}>*</Text>
              </Text>
              <TouchableOpacity
                style={
                  selectedAccount != undefined
                    ? styles.btnMethodSelected
                    : [
                        styles.btnMethodUnselected,
                        selectedAccount == undefined
                          ? {
                              borderColor: colorConfig.store.colorError,
                              borderWidth: 1.5,
                            }
                          : null,
                      ]
                }
                onPress={() => Actions.paymentMethods({page: 'settleOrder'})}>
                <Icon
                  size={20}
                  name={Platform.OS === 'ios' ? 'ios-cash' : 'md-cash'}
                  style={{
                    color:
                      selectedAccount != undefined
                        ? colorConfig.store.textWhite
                        : colorConfig.store.defaultColor,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={
                    selectedAccount != undefined
                      ? styles.descMethodSelected
                      : styles.descMethodUnselected
                  }>
                  {selectedAccount != undefined
                    ? this.selectedPaymentMethod(selectedAccount)
                    : 'Select Methods'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 50}} />
            <TouchableOpacity
              onPress={this.onSlideRight}
              disabled={
                selectedAccount != undefined || this.state.totalBayar == 0
                  ? false
                  : true
              }
              style={{
                backgroundColor:
                  selectedAccount != undefined || this.state.totalBayar == 0
                    ? colorConfig.store.defaultColor
                    : colorConfig.store.disableButton,
                padding: 15,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 19,
                  color: 'white',
                  fontFamily: 'Lato-Medium',
                }}>
                {'Pay' + this.format(CurrencyFormatter(this.state.totalBayar))}
              </Text>
            </TouchableOpacity>

            {outlet.enablePayAtPOS == true ? (
              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    color: colorConfig.store.titleSelected,
                    fontSize: 18,
                    textAlign: 'center',
                    marginBottom: 20,
                  }}>
                  OR
                </Text>
                <TouchableOpacity
                  onPress={this.payAtPOS}
                  style={styles.payAtPOS}>
                  <Text
                    style={{
                      fontSize: 19,
                      color: colorConfig.store.defaultColor,
                      fontFamily: 'Lato-Bold',
                    }}>
                    Pay at Store
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {/*<SwipeButton*/}
            {/*  disabled={*/}
            {/*    selectedAccount != undefined || this.state.totalBayar == 0*/}
            {/*      ? false*/}
            {/*      : true*/}
            {/*  }*/}
            {/*  disabledThumbIconBackgroundColor="#FFFFFF"*/}
            {/*  disabledThumbIconBorderColor={*/}
            {/*    colorConfig.pageIndex.activeTintColor*/}
            {/*  }*/}
            {/*  thumbIconImageSource={appConfig.arrowRight}*/}
            {/*  height={60}*/}
            {/*  thumbIconBackgroundColor="#FFFFFF"*/}
            {/*  railBorderColor="#FFFFFF"*/}
            {/*  railFillBackgroundColor={colorConfig.pageIndex.grayColor}*/}
            {/*  thumbIconBorderColor={colorConfig.pageIndex.activeTintColor}*/}
            {/*  titleColor="#FFFFFF"*/}
            {/*  titleFontSize={20}*/}
            {/*  shouldResetAfterSuccess={this.state.failedPay}*/}
            {/*  railBackgroundColor={colorConfig.pageIndex.activeTintColor}*/}
            {/*  title={*/}
            {/*    'Pay ' + CurrencyFormatter(this.state.totalBayar)*/}
            {/*    // Number(this.state.totalBayar.toFixed(3))*/}
            {/*  }*/}
            {/*  onSwipeSuccess={this.onSlideRight}*/}
            {/*/>*/}
          </View>
        </ScrollView>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.pesanAlert}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={'Close'}
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.setState({failedPay: true});
            this.hideAlert();
          }}
        />
        {/*{this.renderPrompPayAtPOS()}*/}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    // backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    fontWeight: 'bold',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
  descItem: {
    color: colorConfig.pageIndex.grayColor,
  },
  itemDetail: {
    marginLeft: 10,
  },
  itemDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineSubtotal: {
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 2,
    top: -2,
  },
  btnMethodUnselected: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnMethodSelected: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    backgroundColor: colorConfig.store.defaultColor,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnMethodCencel: {
    borderRadius: 30,
    justifyContent: 'center',
    padding: 3,
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  descMethodUnselected: {
    color: colorConfig.store.defaultColor,
    fontSize: 13,
  },
  descMethodSelected: {
    color: colorConfig.store.textWhite,
    fontSize: 13,
  },
  payAtPOS: {
    borderWidth: 0.7,
    borderColor: colorConfig.store.defaultColor,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

mapStateToProps = state => ({
  campign: state.rewardsReducer.campaign.campaign,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  campaignActive: state.rewardsReducer.dataPoint.campaignActive,
  detailPoint: state.rewardsReducer.dataPoint.detailPoint,
  selectedAccount: state.cardReducer.selectedAccount.selectedAccount,
  myCardAccount: state.cardReducer.myCardAccount.card,
  defaultAccount: state.userReducer.defaultPaymentAccount.defaultAccount,
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  dataStamps: state.rewardsReducer.getStamps,
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
)(SettleOrder);
