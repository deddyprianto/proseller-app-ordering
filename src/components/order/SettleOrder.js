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
import Fa from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import {
  getBasket,
  getCart,
  getPendingCart,
  getPendingCartSingle,
  settleOrder,
} from '../../actions/order.action';
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
import {getOutletById} from '../../actions/stores.action';
import {refreshToken} from '../../actions/auth.actions';
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
    // await this.setDataPayment(false);

    await this.resetAppliedVouchers();

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

  resetAppliedVouchers = async () => {
    try {
      for (let i = 0; i < this.props.pembayaran.details.length; i++) {
        this.props.pembayaran.details[i].appliedVoucher = 0;
      }
    } catch (e) {}
  };

  setDataVoucher = async item => {
    let {dataVoucer} = this.state;
    await this.setState({loading: true});
    try {
      await this.resetAppliedVouchers();
      await this.setDataPayment(true);
      if (dataVoucer == undefined) {
        dataVoucer = [];
      }
      item.isVoucher = true;
      item.clientID = new Date().valueOf();
      dataVoucer.push(item);
      await this.setState({
        dataVoucer,
        cancelVoucher: false,
      });
      await this.setDataPayment(false);
    } catch (e) {}
    await this.setState({loading: false});
  };

  setDataPoint = async (addPoint, moneyPoint) => {
    if (addPoint > 0) {
      await this.setState({loading: true});
      await this.resetAppliedVouchers();
      await this.setDataPayment(true);
      let {dataVoucer} = this.state;

      // REMOVE DATA THAT CONTAINING  POINT FIRST, SO DATA POINT IS NOT DOUBLE
      try {
        let findOldPoint = undefined;
        if (!isEmptyArray(dataVoucer)) {
          findOldPoint = dataVoucer.find(i => i.isPoint == true);
        } else {
          dataVoucer = [];
        }

        if (findOldPoint != undefined) {
          for (let x = 0; x < dataVoucer.length; x++) {
            if (dataVoucer[x].isPoint == true) {
              dataVoucer[x].redeemValue = addPoint;
              dataVoucer[x].paymentAmount = moneyPoint;
              break;
            }
          }
        } else {
          dataVoucer.push({
            paymentType: 'point',
            redeemValue: addPoint,
            paymentAmount: moneyPoint,
            isPoint: true,
          });
        }

        await this.setState({
          addPoint,
          moneyPoint,
          dataVoucer,
          cancelPoint: false,
        });
        await this.setDataPayment(false);
      } catch (e) {
        console.log(e);
      }
      await this.setState({loading: false});
    }
  };

  setDataPayment = async cancel => {
    var totalBayar = 0;
    let index = 0;
    let tmpTotal = this.props.pembayaran.payment;

    if (!cancel) {
      var redeemVoucer = 0;
      let discount = 0;
      let {dataVoucer} = this.state;
      dataVoucer = JSON.stringify(dataVoucer);
      dataVoucer = JSON.parse(dataVoucer);

      for (let i = 0; i < dataVoucer.length; i++) {
        try {
          if (dataVoucer[i] != undefined) {
            if (
              dataVoucer[i].appliedTo != undefined &&
              dataVoucer[i].appliedTo === 'PRODUCT'
            ) {
              //  search specific product
              let result = undefined;
              for (let z = 0; z < this.props.pembayaran.details.length; z++) {
                result = await dataVoucer[i].appliedItems.find(
                  item =>
                    item.value === this.props.pembayaran.details[z].product.id,
                );
                if (result != undefined) {
                  if (
                    this.props.pembayaran.details[z].appliedVoucher <
                      this.props.pembayaran.details[z].quantity ||
                    this.props.pembayaran.details[z].appliedVoucher == undefined
                  ) {
                    result = this.props.pembayaran.details[z];
                    index = z;
                    break;
                  } else {
                    result = undefined;
                  }
                }
              }
              // check if apply to specific product is found
              if (result != undefined) {
                if (
                  this.props.pembayaran.details[index].appliedVoucher ==
                  undefined
                ) {
                  this.props.pembayaran.details[index].appliedVoucher = 1;
                } else {
                  this.props.pembayaran.details[index].appliedVoucher++;
                }

                if (dataVoucer[i].voucherType == 'discPercentage') {
                  // FIND DISCOUNT
                  discount =
                    (result.unitPrice * dataVoucer[i].voucherValue) / 100;

                  //  check cap Amount
                  if (dataVoucer[i].capAmount != undefined) {
                    let capAmount = parseFloat(dataVoucer[i].capAmount);
                    if (discount > capAmount && capAmount > 0) {
                      discount = capAmount;
                    }
                  }

                  // set value payment amount for payload
                  dataVoucer[i].paymentAmount = discount;
                  tmpTotal -= discount;

                  redeemVoucer = redeemVoucer + discount;
                } else if (dataVoucer[i].voucherType == 'discAmount') {
                  // set value payment amount for payload
                  dataVoucer[i].paymentAmount = dataVoucer[i].voucherValue;
                  redeemVoucer = redeemVoucer + dataVoucer[i].voucherValue;
                  tmpTotal -= dataVoucer[i].voucherValue;
                }
              }
            } else {
              if (dataVoucer[i].voucherType == 'discPercentage') {
                // FIND DISCOUNT
                discount = (tmpTotal * dataVoucer[i].voucherValue) / 100;

                //  check cap Amount
                if (dataVoucer[i].capAmount != undefined) {
                  let capAmount = parseFloat(dataVoucer[i].capAmount);
                  if (discount > capAmount && capAmount > 0) {
                    discount = capAmount;
                  }
                }

                dataVoucer[i].paymentAmount = discount;
                // set value payment amount for payload
                console.log(dataVoucer[i].paymentAmount, 'discount');
                tmpTotal -= discount;

                redeemVoucer = redeemVoucer + discount;
              } else if (dataVoucer[i].voucherType == 'discAmount') {
                // set value payment amount for payload
                dataVoucer[i].paymentAmount = dataVoucer[i].voucherValue;
                redeemVoucer = redeemVoucer + dataVoucer[i].voucherValue;
                tmpTotal -= dataVoucer[i].voucherValue;
              }
            }

            if (dataVoucer[i].isPoint == true) {
              tmpTotal -= dataVoucer[i].paymentAmount;
            }
            if (tmpTotal < 0) tmpTotal = 0;
          }
        } catch (e) {}
      }
      this.setState({dataVoucer});
      var redeemPoint =
        this.state.addPoint == undefined ? 0 : this.state.moneyPoint;
      totalBayar = this.state.totalBayar - (redeemVoucer + redeemPoint);

      if (totalBayar < 0 && this.state.addPoint != undefined) {
        let reducedMoneyPoint = this.state.moneyPoint + totalBayar;
        await this.recalculatePoint(reducedMoneyPoint);
      }
    } else {
      totalBayar = this.props.pembayaran.payment;
    }
    // check whether the total pay <0 after deducting the discount vouchers and points
    if (totalBayar < 0) {
      totalBayar = 0;
    }
    this.setState({totalBayar});
  };

  calculateMoneyPoint = async () => {
    const {campign} = this.props;
    try {
      let jumPointRatio = this.props.campign.points.pointsToRebateRatio0;
      let jumMoneyRatio = this.props.campign.points.pointsToRebateRatio1;

      let ratio = this.state.addPoint / jumPointRatio;
      let money = parseFloat(ratio * jumMoneyRatio);
      await this.setState({moneyPoint: money});
    } catch (e) {
      return 0;
    }
  };

  recalculatePoint = async price => {
    const {campign} = this.props;
    let {addPoint} = this.state;
    try {
      var jumPointRatio = campign.points.pointsToRebateRatio0;
      var jumMoneyRatio = campign.points.pointsToRebateRatio1;

      let ratio = jumPointRatio / jumMoneyRatio;

      // create default point to set based on the ratio of point to rebate
      let setDefault = parseFloat((price * ratio).toFixed(2));

      if (setDefault <= 0) {
        this.cencelPoint();
        return;
      }

      if (
        campign.points.roundingOptions != undefined &&
        campign.points.roundingOptions == 'INTEGER'
      ) {
        setDefault = Math.ceil(setDefault);
        await this.setState({addPoint: setDefault});
      }
      await this.calculateMoneyPoint();
    } catch (e) {
      return addPoint;
    }
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
    const {totalBayar} = this.state;
    if (totalBayar == 0) {
      Alert.alert(
        'Sorry',
        "Can't add more vouchers, your total payment is already 0.",
      );
      return;
    }

    const {intlData} = this.props;
    let originalVouchers = this.props.myVoucers;
    originalVouchers = JSON.stringify(originalVouchers);
    originalVouchers = JSON.parse(originalVouchers);
    const {dataVoucer} = this.state;
    var myVoucers = [];
    this.setState({loading: true});
    try {
      // REMOVE VOUCHER SELECTED FROM LIST
      if (!isEmptyArray(dataVoucer)) {
        for (let x = 0; x < dataVoucer.length; x++) {
          for (let y = 0; y < originalVouchers.length; y++) {
            if (dataVoucer[x].isVoucher == true) {
              if (
                dataVoucer[x].serialNumber == originalVouchers[y].serialNumber
              ) {
                originalVouchers.splice(y, 1);
              }
            }
          }
        }
      }

      if (originalVouchers != undefined) {
        _.forEach(
          _.groupBy(
            originalVouchers.filter(voucher => voucher.deleted == false),
            // 'id',
            'uniqueID',
          ),
          function(value, key) {
            value[0].totalRedeem = value.length;
            myVoucers.push(value[0]);
          },
        );
      }

      // if (
      //   this.state.cancelVoucher == false &&
      //   this.state.dataVoucer != undefined
      // ) {
      //   var jumlah = _.find(myVoucers, {id: this.state.dataVoucer.id})
      //     .totalRedeem;
      //
      //   var index = _.findIndex(myVoucers, {
      //     id: this.state.dataVoucer.id,
      //   });
      //
      //   _.updateWith(
      //     myVoucers,
      //     '[' + index + "]['totalRedeem']",
      //     _.constant(jumlah - 1),
      //     Object,
      //   );
      // }

      Actions.paymentAddVoucers({
        intlData,
        dataVoucer,
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
    this.setState({loading: false});
  };

  myPoint = () => {
    let {intlData} = this.props;
    let {totalBayar, dataVoucer} = this.state;

    let pembayaran = JSON.stringify(this.props.pembayaran);
    pembayaran = JSON.parse(pembayaran);

    // Adjust total
    try {
      let total = pembayaran.payment;
      if (!isEmptyArray(dataVoucer)) {
        for (let i = 0; i < dataVoucer.length; i++) {
          if (dataVoucer[i].isVoucher == true) {
            total -= dataVoucer[i].paymentAmount;
          }
        }
        if (total < 0) total = 0;
        pembayaran.payment = total;
      }
    } catch (e) {}

    Actions.paymentAddPoint({
      intlData,
      data: this.props.totalPoint,
      pembayaran: pembayaran,
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

        // send order mode value to server
        pembayaran.validateOutletSetting = {};

        //  check if ordering mode is still active
        try {
          const {outlet} = this.state;
          if (this.props.pembayaran.orderingMode == 'TAKEAWAY') {
            pembayaran.validateOutletSetting.enableTakeAway = true;
            if (outlet.enableTakeAway == false) {
              Alert.alert(
                'Sorry',
                `Order mode Take Away is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'DINEIN') {
            pembayaran.validateOutletSetting.enableDineIn = true;
            if (outlet.enableDineIn == false) {
              Alert.alert(
                'Sorry',
                `Order mode Dine In is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'DELIVERY') {
            pembayaran.validateOutletSetting.enableDelivery = true;
            if (outlet.enableDelivery == false) {
              Alert.alert(
                'Sorry',
                `Order mode Delivery is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'STOREPICKUP') {
            pembayaran.validateOutletSetting.enableStorePickUp = true;
            if (outlet.enableStorePickUp == false) {
              Alert.alert(
                'Sorry',
                `Order mode Store Pickup is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'STORECHECKOUT') {
            pembayaran.validateOutletSetting.enableStoreCheckOut = true;
            if (outlet.enableStoreCheckOut == false) {
              Alert.alert(
                'Sorry',
                `Order mode Store Checkout is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          }
        } catch (e) {}
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

  doPayment = async () => {
    const {intlData, selectedAccount, companyInfo} = this.props;
    let {totalBayar, dataVoucer} = this.state;
    let realTotal = 0;

    let payload = {};
    try {
      await this.setState({loading: true});
      payload.cartID = this.props.pembayaran.cartID;

      // ADJUST POINT IF THERE ARE ANY REDUCE
      try {
        for (let x = 0; x < dataVoucer.length; x++) {
          if (dataVoucer[x].isPoint == true) {
            dataVoucer[x].redeemValue = this.state.addPoint;
            dataVoucer[x].paymentAmount = this.state.moneyPoint;
          }
          realTotal += dataVoucer[x].paymentAmount;
        }
      } catch (e) {}

      // ADJUST VOUCHER IF PAYMENT IS ALREADY 0
      try {
        if (totalBayar == 0 && dataVoucer.length > 0) {
          if (dataVoucer[dataVoucer.length - 1].isVoucher == true) {
            const diff = parseFloat(
              realTotal - this.props.pembayaran.totalNettAmount,
            );
            dataVoucer[dataVoucer.length - 1].paymentAmount -= diff;
          }
        }
      } catch (e) {}

      let payments = [];
      if (!isEmptyArray(dataVoucer)) {
        for (let i = 0; i < dataVoucer.length; i++) {
          if (dataVoucer[i].isVoucher == true) {
            payments.push({
              paymentType: 'voucher',
              voucherId: dataVoucer[i].id,
              serialNumber: dataVoucer[i].serialNumber,
              paymentAmount: dataVoucer[i].paymentAmount,
              isVoucher: true,
            });
          } else if (dataVoucer[i].isPoint == true) {
            payments.push({
              paymentType: 'point',
              redeemValue: dataVoucer[i].redeemValue,
              paymentAmount: dataVoucer[i].paymentAmount,
              isPoint: true,
            });
          } else {
            payments.push(dataVoucer[i]);
          }
        }
      }

      payload.payments = payments;

      // if price is 0, then dont add payment method
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

        payments.push({
          accountId: paymentPayload.accountId,
          paymentType: paymentPayload.paymentID,
          paymentRefNo: paymentPayload.paymentName,
          paymentID: paymentPayload.paymentID,
          paymentName: this.selectedPaymentMethod(selectedAccount),
          paymentAmount: this.state.totalBayar,
        });
      }

      try {
        delete payload.payment;
        delete payload.storeId;
        delete payload.dataVoucer;
      } catch (e) {}

      // if ordering mode is exist
      if (this.props.pembayaran.orderingMode != undefined) {
        payload.orderingMode = this.props.pembayaran.orderingMode;
        payload.tableNo = this.props.pembayaran.tableNo;

        // send order mode value to server
        payload.validateOutletSetting = {};

        //  check if ordering mode is still active
        try {
          const {outlet} = this.state;
          if (this.props.pembayaran.orderingMode == 'TAKEAWAY') {
            payload.validateOutletSetting.enableTakeAway = true;
            if (outlet.enableTakeAway == false) {
              Alert.alert(
                'Sorry',
                `Order mode Take Away is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'DINEIN') {
            payload.validateOutletSetting.enableDineIn = true;
            if (outlet.enableDineIn == false) {
              Alert.alert(
                'Sorry',
                `Order mode Dine In is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'DELIVERY') {
            payload.validateOutletSetting.enableDelivery = true;
            if (outlet.enableDelivery == false) {
              Alert.alert(
                'Sorry',
                `Order mode Delivery is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'STOREPICKUP') {
            payload.validateOutletSetting.enableStorePickUp = true;
            if (outlet.enableStorePickUp == false) {
              Alert.alert(
                'Sorry',
                `Order mode Store Pickup is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          } else if (this.props.pembayaran.orderingMode == 'STORECHECKOUT') {
            payload.validateOutletSetting.enableStoreCheckOut = true;
            if (outlet.enableStoreCheckOut == false) {
              Alert.alert(
                'Sorry',
                `Order mode Store Checkout is currently inactive, please choose another order mode.`,
              );
              this.setState({loading: false});
              return;
            }
          }
        } catch (e) {}
      }

      // check if delivery address is exist
      if (this.props.pembayaran.deliveryAddress != undefined) {
        payload.deliveryAddress = this.props.pembayaran.deliveryAddress;
      }

      // check if delivery fee is exist
      if (this.props.pembayaran.deliveryFee != undefined) {
        payload.deliveryFee = this.props.pembayaran.deliveryFee;
        // add delivery fee to total
        payload.price = Number(
          payload.price + this.props.pembayaran.deliveryFee,
        );
      }

      // check if delivery provider is exist
      if (this.props.pembayaran.deliveryProvider != undefined) {
        payload.deliveryProviderId = this.props.pembayaran.deliveryProvider.id;
        payload.deliveryProvider = this.props.pembayaran.deliveryProvider.name;
        payload.deliveryProviderName = this.props.pembayaran.deliveryProvider.name;
        payload.deliveryService = '-';
      }

      try {
        payload.cartDetails = {
          partitionKey: this.props.pembayaran.cartDetails.partitionKey,
          sortKey: this.props.pembayaran.cartDetails.sortKey,
        };
      } catch (e) {}

      // get url
      let {url} = this.props;

      console.log('Payload settle order ', payload);
      console.log('URL settle order ', url);

      const response = await this.props.dispatch(settleOrder(payload, url));
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
        // this.cencelPoint();
        // this.cencelVoucher();
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
      // this.cencelPoint();
      // this.cencelVoucher();
      console.log(e);
      Alert.alert('Oppss', 'Something went wrong, please try again');
      this.setState({loading: false, failedPay: true});
    }
  };

  detailPayment = pembayaran => {
    const {intlData} = this.props;
    Actions.paymentDetailItem({
      intlData,
      dataVoucer: this.state.dataVoucer,
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

  cencelOneVoucher = async i => {
    let {dataVoucer} = this.state;
    await this.setState({loading: true});
    await this.setState({totalBayar: this.props.pembayaran.payment});

    // reset applied products length
    await this.resetAppliedVouchers();

    try {
      if (dataVoucer.length > 1) {
        dataVoucer.splice(i, 1);
      } else {
        dataVoucer = [];
      }
      await this.setState({dataVoucer});
      await this.setDataPayment(false);
    } catch (e) {
      await this.setDataPayment(true);
    }
    await this.setState({loading: false});
  };

  cencelPoint = async () => {
    let {dataVoucer} = this.state;
    await this.setState({loading: true});
    await this.setState({totalBayar: this.props.pembayaran.payment});
    await this.resetAppliedVouchers();
    try {
      if (dataVoucer.length > 0) {
        dataVoucer = dataVoucer.filter(i => i.isPoint != true);
      } else {
        dataVoucer = [];
      }
      await this.setState({dataVoucer, addPoint: undefined});
      this.setState({cancelPoint: true});
      await this.setDataPayment(false);
    } catch (e) {
      await this.setDataPayment(true);
    }
    await this.setState({loading: false});
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
    const {totalBayar} = this.state;

    var pembayaran = {};
    try {
      await this.setState({loading: true});
      const UUID = await UUIDGenerator.getRandomUUID();
      this.setState({loading: true});
      pembayaran.price = Number(this.props.pembayaran.payment.toFixed(3));
      pembayaran.cartID = this.props.pembayaran.cartID;

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

      pembayaran.payAtPOS = true;

      // get url
      let {url} = this.props;

      console.log('Payload settle order ', pembayaran);

      const response = await this.props.dispatch(settleOrder(pembayaran, url));
      console.log('reponse pembayaran settle order ', response);
      this.setState({
        loading: false,
        prompPayAtPOS: true,
        pendingCart: response.responseBody.data,
      });
      if (response.success) {
        try {
          this.props.dispatch(afterPayment(true));
          this.getPendingOrder(response.responseBody.data);
        } catch (e) {}
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
              borderWidth: 0.4,
              borderColor: colorConfig.pageIndex.grayColor,
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
          style={{backgroundColor: '#f5f5f5'}}
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
              marginTop: 3,
              backgroundColor: 'white',
              paddingVertical: 30,
              borderWidth: 0.4,
              width: '100%',
              borderColor: colorConfig.pageIndex.grayColor,
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
            style={{
              marginTop: 13,
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  marginBottom: 13,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  width: '100%',
                  backgroundColor: colorConfig.pageIndex.backgroundColor,
                  borderWidth: 0.4,
                  borderColor: colorConfig.pageIndex.grayColor,
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
                        backgroundColor: colorConfig.store.defaultColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                        paddingTop: 3,
                      }}>
                      <Icon
                        size={20}
                        name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
                        style={{color: 'white'}}
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
                          color: colorConfig.store.titleSelected,
                          fontFamily: 'Lato-Medium',
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
                        marginRight: 10,
                        fontFamily: 'Lato-Bold',
                        fontSize: 15,
                        color: colorConfig.store.defaultColor,
                      }}>
                      Order Detail
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 5,
                width: '100%',
                borderWidth: 0.4,
                padding: 13,
                backgroundColor: 'white',
                borderColor: colorConfig.pageIndex.grayColor,
              }}>
              <TouchableOpacity
                style={styles.btnMethodUnselected}
                onPress={this.myVouchers}>
                <View style={{flexDirection: 'row'}}>
                  <Fa
                    size={21}
                    name={'ticket'}
                    style={{
                      color: colorConfig.store.defaultColor,
                      marginRight: 10,
                    }}
                  />
                  <Text style={styles.descMethodUnselected}>Use Vouchers</Text>
                </View>
                <Icon
                  size={25}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-arrow-dropright'
                      : 'md-arrow-dropright'
                  }
                  style={{
                    color: colorConfig.store.defaultColor,
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
              {!isEmptyArray(this.state.dataVoucer)
                ? this.state.dataVoucer.map(
                    (item, i) =>
                      item.isVoucher == true && (
                        <View
                          style={{
                            margin: 5,
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontFamily: 'Lato-Bold',
                              color: colorConfig.store.secondaryColor,
                            }}>
                            {item.name}
                          </Text>
                          <TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => this.cencelOneVoucher(i)}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  color: colorConfig.store.colorError,
                                  fontFamily: 'Lato-Bold',
                                  fontSize: 14,
                                }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </View>
                      ),
                  )
                : null}
            </View>
            {this.props.campaignActive &&
            campign != undefined &&
            campign.points &&
            campign.points.pointsToRebateRatio1 != 0 &&
            detailPoint != undefined &&
            !isEmptyObject(detailPoint.trigger) &&
            (detailPoint.trigger.status === true ||
              detailPoint.trigger.campaignTrigger === 'USER_SIGNUP') ? (
              <View
                style={{
                  marginTop: 5,
                  width: '100%',
                  borderWidth: 0.4,
                  padding: 13,
                  backgroundColor: 'white',
                  borderColor: colorConfig.pageIndex.grayColor,
                }}>
                {this.state.cancelPoint == false &&
                this.state.addPoint != undefined ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: '20%', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={this.cencelPoint}>
                        <Text
                          style={{
                            color: colorConfig.store.colorError,
                            fontFamily: 'Lato-Bold',
                            fontSize: 14,
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.btnMethodSelectedPoints}
                      onPress={this.myPoint}>
                      <Text style={styles.descMethodSelected}>
                        {this.state.addPoint} points
                      </Text>
                      <Icon
                        size={25}
                        name={
                          Platform.OS === 'ios'
                            ? 'ios-arrow-dropright'
                            : 'md-arrow-dropright'
                        }
                        style={{
                          color: colorConfig.store.defaultColor,
                          marginLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.btnMethodUnselected}
                    onPress={this.myPoint}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Fa
                        size={18}
                        name={'tags'}
                        style={{
                          color: colorConfig.store.defaultColor,
                          marginRight: 10,
                        }}
                      />
                      <Text style={styles.descMethodUnselected}>
                        Use Points
                      </Text>
                    </View>
                    <Icon
                      size={25}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-arrow-dropright'
                          : 'md-arrow-dropright'
                      }
                      style={{
                        color: colorConfig.store.defaultColor,
                        marginLeft: 10,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            <View
              style={{
                marginTop: 13,
                width: '100%',
                borderWidth: 0.4,
                padding: 13,
                backgroundColor: 'white',
                borderColor: colorConfig.pageIndex.grayColor,
              }}>
              <TouchableOpacity
                style={styles.btnPaymentMethod}
                onPress={() => Actions.paymentMethods({page: 'settleOrder'})}>
                <Text
                  style={[
                    styles.descMethodUnselected,
                    {
                      color: colorConfig.store.titleSelected,
                      fontWeight: 'bold',
                    },
                  ]}>
                  {' '}
                  {selectedAccount != undefined
                    ? this.selectedPaymentMethod(selectedAccount)
                    : 'Payment Method'}
                </Text>
                <Icon
                  size={25}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-arrow-dropright'
                      : 'md-arrow-dropright'
                  }
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 50}} />
            <TouchableOpacity
              onPress={this.doPayment}
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
                borderRadius: 7,
                width: '88%',
                alignSelf: 'center',
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
          </View>
          <View style={{paddingBottom: 100}} />
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
        {this.renderPrompPayAtPOS()}
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderWidth: 0.6,
    borderColor: '#bababa',
    paddingVertical: 7,
    borderRadius: 5,
  },
  btnMethodSelectedPoints: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderWidth: 0.6,
    borderColor: '#bababa',
    paddingVertical: 7,
    borderRadius: 5,
  },
  btnPaymentMethod: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontFamily: 'Lato-Medium',
    borderRadius: 5,
  },
  descMethodSelected: {
    color: colorConfig.store.secondaryColor,
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5,
  },
  payAtPOS: {
    borderWidth: 0.7,
    borderColor: colorConfig.store.defaultColor,
    padding: 15,
    borderRadius: 7,
    width: '88%',
    alignSelf: 'center',
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
