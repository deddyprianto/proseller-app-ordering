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
  Image,
  Platform,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as _ from 'lodash';
// import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import SwipeButton from 'rn-swipe-button';
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {campaign, dataPoint, getStamps} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';
import {sendPayment} from '../actions/sales.action';
import Loader from './loader';
import {refreshToken} from '../actions/auth.actions';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {isEmptyArray} from '../helper/CheckEmpty';
import {clearAccount} from '../actions/payment.actions';

class PaymentDetail extends Component {
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
    };
  }

  componentDidMount = async () => {
    await this.setDataPayment(false);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
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
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    const {from} = this.props;
    await this.props.dispatch(clearAccount());
    Actions.popTo('pageIndex');
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
      // valueSet: this.state.moneyPoint == undefined ? 0 : this.state.moneyPoint,
      valueSet: this.state.addPoint == undefined ? 0 : this.state.addPoint,
      setDataPoint: this.setDataPoint,
    });
  };

  onSlideRight = async () => {
    const {intlData} = this.props;

    var pembayaran = {};
    try {
      this.setState({loading: true});
      pembayaran.price = Number(this.state.totalBayar.toFixed(3));
      pembayaran.outletName = this.props.pembayaran.storeName;
      pembayaran.referenceNo = this.props.pembayaran.referenceNo;
      pembayaran.outletId = this.props.pembayaran.storeId;
      pembayaran.paymentType = this.props.pembayaran.paymentType;
      pembayaran.dataPay = this.props.pembayaran.dataPay;
      pembayaran.void = false;

      if (
        this.state.dataVoucer == undefined &&
        this.state.addPoint == undefined
      ) {
        pembayaran.statusAdd = null;
        pembayaran.redeemValue = 0;
      } else {
        pembayaran.beforePrice = this.props.pembayaran.payment;
        // pembayaran.afterPrice = this.state.totalBayar;
        pembayaran.afterPrice = Number(this.state.totalBayar.toFixed(3));

        if (this.state.dataVoucer != undefined) {
          pembayaran.voucherId = this.state.dataVoucer.id;
          pembayaran.voucherSerialNumber = this.state.dataVoucer.serialNumber;
          pembayaran.statusAdd = 'addVoucher';
        }
        if (this.state.addPoint != undefined) {
          pembayaran.redeemValue = this.state.addPoint;
          pembayaran.statusAdd = 'addPoint';
        }
      }
      const response = await this.props.dispatch(sendPayment(pembayaran));
      console.log('reponse pembayaran ', response);
      if (response.success) {
        //  cancel voucher and pont selected
        // this.cencelPoint();
        // this.cencelVoucher();
        // this.setState({
        //   showAlert: true,
        //   pesanAlert: response.responseBody.Data.message,
        //   titleAlert: 'Oopss!',
        //   failedPay: true,
        // });
        // return back to payment success
        Actions.paymentSuccess({
          intlData,
          dataRespons: response.responseBody.Data.data,
        });
      } else {
        //  cancel voucher and pont selected
        this.cencelPoint();
        this.cencelVoucher();
        this.setState({
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Oopss!',
          failedPay: true,
        });
      }
      this.setState({loading: false});
    } catch (e) {
      //  cancel voucher and pont selected
      this.cencelPoint();
      this.cencelVoucher();
      this.setState({
        showAlert: true,
        pesanAlert: 'Something went wrong, please try again.',
        titleAlert: 'Oopss!',
        failedPay: true,
      });
      this.setState({loading: false});
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

  showToastMessage = message => this.setState({message});

  formatCurrency = value => {
    try {
      return CurrencyFormatter(value).match(/[a-z]+|[^a-z]+/gi)[1];
    } catch (e) {
      return value;
    }
  };

  renderUsePoint = () => [
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
    </View>,
  ];

  selectedPaymentMethod = selectedAccount => {
    const {intlData, companyInfo} = this.props;
    const paymentTypes = companyInfo.paymentTypes;
    try {
      if (!isEmptyArray(paymentTypes)) {
        let paymentMethod = paymentTypes.find(
          item => item.paymentID == selectedAccount.paymentID,
        );
        if (paymentMethod != undefined) return paymentMethod.paymentName;
        else return null;
      }
    } catch (e) {
      return null;
    }
  };

  render() {
    const {intlData, selectedAccount} = this.props;
    return (
      <View style={styles.container}>
        {this.state.loading && <Loader />}
        {console.log(this.props.dataStamps)}
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              alignItems: 'center',
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
                left: -20,
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
          <View style={styles.line} />
        </View>
        <ScrollView>
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
                        {this.props.pembayaran.storeName}
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
            {this.props.campaignActive ? this.renderUsePoint() : null}

            {/*<View*/}
            {/*  style={{*/}
            {/*    marginTop: 12,*/}
            {/*    marginBottom: 10,*/}
            {/*    alignItems: 'center',*/}
            {/*    justifyContent: 'space-between',*/}
            {/*    flexDirection: 'row',*/}
            {/*  }}>*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      fontSize: 17,*/}
            {/*      fontFamily: 'Lato-Bold',*/}
            {/*      color: colorConfig.pageIndex.grayColor,*/}
            {/*    }}>*/}
            {/*    Payment Method*/}
            {/*  </Text>*/}
            {/*  <TouchableOpacity*/}
            {/*    style={*/}
            {/*      selectedAccount != undefined*/}
            {/*        ? styles.btnMethodSelected*/}
            {/*        : styles.btnMethodUnselected*/}
            {/*    }*/}
            {/*    onPress={() => Actions.paymentMethods()}>*/}
            {/*    <Icon*/}
            {/*      size={20}*/}
            {/*      name={Platform.OS === 'ios' ? 'ios-cash' : 'md-cash'}*/}
            {/*      style={{*/}
            {/*        color:*/}
            {/*          selectedAccount != undefined*/}
            {/*            ? colorConfig.store.textWhite*/}
            {/*            : colorConfig.store.defaultColor,*/}
            {/*        marginRight: 8,*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <Text*/}
            {/*      style={*/}
            {/*        selectedAccount != undefined*/}
            {/*          ? styles.descMethodSelected*/}
            {/*          : styles.descMethodUnselected*/}
            {/*      }>*/}
            {/*      {selectedAccount != undefined*/}
            {/*        ? this.selectedPaymentMethod(selectedAccount)*/}
            {/*        : 'Select Methods'}*/}
            {/*    </Text>*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}

            <View style={{marginTop: 50}} />
            <SwipeButton
              // disabled={selectedAccount == undefined ? true : false}
              disabledThumbIconBackgroundColor="#FFFFFF"
              disabledThumbIconBorderColor={
                colorConfig.pageIndex.activeTintColor
              }
              thumbIconImageSource={appConfig.arrowRight}
              height={60}
              thumbIconBackgroundColor="#FFFFFF"
              railBorderColor="#FFFFFF"
              railFillBackgroundColor={colorConfig.pageIndex.grayColor}
              thumbIconBorderColor={colorConfig.pageIndex.activeTintColor}
              titleColor="#FFFFFF"
              titleFontSize={20}
              shouldResetAfterSuccess={this.state.failedPay}
              railBackgroundColor={colorConfig.pageIndex.activeTintColor}
              title={
                'Pay ' + CurrencyFormatter(this.state.totalBayar)
                // Number(this.state.totalBayar.toFixed(3))
              }
              onSwipeSuccess={this.onSlideRight}
            />
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
      </View>
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
});

mapStateToProps = state => ({
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  campaignActive: state.rewardsReducer.dataPoint.campaignActive,
  selectedAccount: state.cardReducer.selectedAccount.selectedAccount,
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
)(PaymentDetail);
