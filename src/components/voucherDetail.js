import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {notifikasi, refreshToken} from '../actions/auth.actions';
import {
  redeemVoucher,
  campaign,
  dataPoint,
  getStamps,
} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';
// import Loader from './loader';
import * as _ from 'lodash';
import {isEmptyArray} from '../helper/CheckEmpty';
// import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {Dialog} from 'react-native-paper';
import LoaderDarker from './LoaderDarker';
import {recentTransaction} from '../actions/sales.action';

class VoucherDetail extends Component {
  constructor(props) {
    super(props);
    this.intlData = this.props.intlData;
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      currentDay: new Date(),
      loadRedeem: false,
      cancelButton: false,
      prompQuantity: false,
      amountRedeem: 1,
    };
  }

  goBack() {
    Actions.pop();
  }

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear()
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

  prompRedeem = dataVoucher => {
    this.setState({
      showAlert: true,
      cancelButton: true,
      pesanAlert: `${this.intlData.messages.spendPoint} ${
        dataVoucher['redeemValue']
      } point`,
      titleAlert: `${this.intlData.messages.redeemVoucher} ?`,
    });
  };

  btnRedeem = async dataVoucher => {
    try {
      this.setState({loadRedeem: true});
      await this.props.dispatch(refreshToken);
      let date = new Date();
      let timeZone = date.getTimezoneOffset();
      const data = {voucher: dataVoucher, timeZoneOffset: timeZone};
      const response = await this.props.dispatch(redeemVoucher(data));
      // await this.props.dispatch(campaign());
      // await this.props.dispatch(dataPoint());
      // await this.props.dispatch(myVoucers());
      Promise.all([
        // this.props.dispatch(campaign())
        this.props.dispatch(dataPoint()),
        this.props.dispatch(myVoucers()),
      ]);
      if (response.success) {
        this.setState({
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          cancelButton: false,
          titleAlert: 'Success!',
        });
      } else {
        this.setState({
          showAlert: true,
          cancelButton: false,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Oppss...',
        });
      }
      this.setState({loadRedeem: false});
    } catch (error) {
      console.log(error);
      this.setState({
        showAlert: true,
        cancelButton: false,
        pesanAlert: error.responseBody.message,
        titleAlert: 'Oppss...',
      });
      this.setState({loadRedeem: false});
    }
  };

  btnRedeemMultiple = async (dataVoucher, amountRedeem) => {
    try {
      this.setState({loadRedeem: true, prompQuantity: false});
      await this.props.dispatch(refreshToken);
      let date = new Date();
      let timeZone = date.getTimezoneOffset();
      const data = {
        voucher: dataVoucher,
        timeZoneOffset: timeZone,
        qty: amountRedeem,
      };
      let response = '';
      response = await this.props.dispatch(redeemVoucher(data));

      Promise.all([
        // this.props.dispatch(campaign())
        this.props.dispatch(dataPoint()),
        this.props.dispatch(myVoucers()),
      ]);
      if (response.success) {
        this.setState({
          showAlert: true,
          pesanAlert: response.responseBody.Data.message,
          cancelButton: false,
          titleAlert: 'Success!',
        });
      } else {
        this.setState({
          showAlert: true,
          cancelButton: false,
          pesanAlert: response.responseBody.Data.message,
          titleAlert: 'Oppss...',
        });
        // await this.props.dispatch(dataPoint());
        // await this.props.dispatch(myVoucers());
      }
      this.setState({loadRedeem: false});
    } catch (error) {
      console.log(error);
      this.setState({
        showAlert: true,
        cancelButton: false,
        pesanAlert: error.responseBody.message,
        titleAlert: 'Oppss...',
      });
      this.setState({loadRedeem: false});
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  accountVoucher = () => {
    var myVoucers = [];
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
    Actions.accountVouchers({data: myVoucers});
  };

  componentWillUnmount() {
    this.setState({
      showAlert: false,
    });
  }

  refreshMyVouchers = () => {
    let myVoucers = [];
    try {
      if (
        this.props.myVoucers != undefined &&
        !isEmptyArray(this.props.myVoucers)
      ) {
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

        this.props.setVouchers(myVoucers);
      }
      Actions.popTo('paymentAddVoucers');
    } catch {
      Actions.pop();
    }
  };

  checkActive = () => {
    try {
      const {dataVoucher, totalPoint, pendingPoints} = this.props;

      let actualPoints = totalPoint;
      if (pendingPoints != undefined && pendingPoints > 0) {
        actualPoints -= pendingPoints;
      }

      if (actualPoints < dataVoucher.redeemValue) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return true;
    }
  };

  checkDisabledMultipleAmount = () => {
    const {amountRedeem} = this.state;
    const {dataVoucher, totalPoint, pendingPoints} = this.props;
    if (amountRedeem == '' || amountRedeem == 0) {
      return true;
    } else {
      let total = dataVoucher.redeemValue * amountRedeem;

      let actualPoints = totalPoint;
      if (pendingPoints != undefined && pendingPoints > 0) {
        actualPoints -= pendingPoints;
      }

      if (actualPoints < total) {
        return true;
      } else {
        return false;
      }
    }
  };

  addQty = () => {
    let {amountRedeem} = this.state;
    const {dataVoucher, totalPoint, pendingPoints} = this.props;

    let actualPoints = totalPoint;
    if (pendingPoints != undefined && pendingPoints > 0) {
      actualPoints -= pendingPoints;
    }

    let total = dataVoucher.redeemValue * amountRedeem;
    if (actualPoints > total) {
      amountRedeem = amountRedeem + 1;
      this.setState({amountRedeem});
    }
  };

  minQty = () => {
    let {amountRedeem} = this.state;
    if (amountRedeem > 1) {
      amountRedeem = amountRedeem - 1;
      this.setState({amountRedeem});
    }
  };

  renderQuantityVoucher = () => {
    return (
      <Dialog
        dismissable={false}
        visible={this.state.prompQuantity}
        onDismiss={() => {
          this.setState({prompQuantity: false, amountRedeem: 1});
        }}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              fontSize: 17,
              color: colorConfig.store.defaultColor,
            }}>
            How many vouchers do you want to redeem?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity onPress={this.minQty} style={styles.buttonQty}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                -
              </Text>
            </TouchableOpacity>
            <TextInput
              keyboardType="number-pad"
              value={this.state.amountRedeem.toString()}
              onChangeText={value => this.setState({amountRedeem: value})}
              style={{
                fontSize: 17,
                fontFamily: 'Lato-Bold',
                padding: 10,
                textAlign: 'center',
                color: colorConfig.store.title,
                borderColor: colorConfig.pageIndex.inactiveTintColor,
                borderWidth: 1,
                borderRadius: 6,
                width: '30%',
              }}
            />
            <TouchableOpacity onPress={this.addQty} style={styles.buttonQty}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({prompQuantity: false, amountRedeem: 1})
              }
              style={{
                width: '40%',
                borderRadius: 5,
                backgroundColor: colorConfig.pageIndex.grayColor,
                marginRight: 20,
                padding: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.btnRedeemMultiple(
                  this.props.dataVoucher,
                  this.state.amountRedeem,
                )
              }
              disabled={this.checkDisabledMultipleAmount()}
              style={{
                width: '40%',
                borderRadius: 5,
                backgroundColor: this.checkDisabledMultipleAmount()
                  ? colorConfig.store.disableButton
                  : colorConfig.store.defaultColor,
                padding: 10,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                  fontSize: 16,
                }}>
                Redeem {this.state.amountRedeem}
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  checkAmountVouchers = () => {
    const {dataVoucher, totalPoint, pendingPoints} = this.props;
    let total = dataVoucher.redeemValue * 2;

    let actualPoints = totalPoint;

    if (pendingPoints != undefined && pendingPoints > 0) {
      actualPoints -= pendingPoints;
    }

    if (actualPoints >= total) {
      this.setState({prompQuantity: true, amountRedeem: 1});
    } else {
      this.prompRedeem(this.props.dataVoucher);
    }
  };

  render() {
    const {intlData, pendingPoints} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loadRedeem && <LoaderDarker />}
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={styles.btnBackIcon}
              />
              <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
            </TouchableOpacity>
            <View style={styles.point}>
              <Icon
                size={23}
                name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
                style={{
                  color: colorConfig.store.defaultColor,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontWeight: 'bold',
                }}>
                {this.props.totalPoint == undefined
                  ? 0 + intlData.messages.point
                  : `${this.props.totalPoint} ${intlData.messages.point}`}
              </Text>
            </View>
          </View>
          <View style={styles.line} />
        </View>
        <ScrollView>
          <View style={styles.voucherItem}>
            <View style={{alignItems: 'center'}}>
              <Image
                resizeMode="cover"
                style={
                  this.props.dataVoucher['image'] != '' &&
                  this.props.dataVoucher['image'] != undefined
                    ? styles.voucherImage1
                    : styles.voucherImage2
                }
                source={
                  this.props.dataVoucher['image'] != '' &&
                  this.props.dataVoucher['image'] != undefined
                    ? {uri: this.props.dataVoucher['image']}
                    : appConfig.appImageNull
                }
              />
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  backgroundColor: colorConfig.store.transparentColor,
                  height: 30,
                  // width: this.state.screenWidth / 2 - 11,
                  // borderTopRightRadius: 9,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingLeft: 15,
                  paddingRight: 15,
                }}>
                <Text
                  style={{
                    color: colorConfig.pageIndex.backgroundColor,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}>
                  {`${this.props.dataVoucher['redeemValue']} ${
                    intlData.messages.point
                  }`}
                </Text>
              </View>
            </View>
            <View style={styles.voucherDetail}>
              <View
                style={{
                  paddingLeft: 10,
                  paddingTop: 5,
                  paddingRight: 5,
                  paddingBottom: 10,
                }}>
                <Text style={styles.nameVoucher}>
                  {this.props.dataVoucher['name']}
                </Text>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <Icon
                    size={15}
                    name={
                      Platform.OS === 'ios'
                        ? 'ios-help-circle-outline'
                        : 'md-help-circle-outline'
                    }
                    style={{
                      color: colorConfig.pageIndex.activeTintColor,
                      marginRight: 10,
                    }}
                  />
                  <Text style={styles.descVoucher}>
                    {this.props.dataVoucher['voucherDesc'] != null
                      ? this.props.dataVoucher['voucherDesc']
                      : 'No description for this voucher'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Icon
                    size={15}
                    name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
                    style={{
                      color: colorConfig.pageIndex.activeTintColor,
                      marginRight: 10,
                    }}
                  />
                  {this.props.dataVoucher['validity']['allDays'] ? (
                    <Text style={styles.descVoucher}>
                      {intlData.messages.voucherValid}
                    </Text>
                  ) : (
                    <Text style={styles.descVoucherTime}>
                      {intlData.messages.voucherValidOn}
                      {this.props.dataVoucher['validity']['activeWeekDays']
                        .filter(item => item.active == true)
                        .map(data => (
                          <Text>
                            {', '}{' '}
                            <Text style={{fontWeight: 'bold'}}>
                              {data.day.toLowerCase()}
                            </Text>{' '}
                          </Text>
                        ))}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            {pendingPoints != undefined && pendingPoints > 0 && (
              <View style={styles.pendingPointsInfo}>
                <Text
                  style={{
                    color: colorConfig.store.titleSelected,
                    textAlign: 'center',
                  }}>
                  Your {pendingPoints} points is locked, because your order has
                  not been completed.
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => this.checkAmountVouchers()}
              disabled={this.checkActive()}
              style={{
                height: 50,
                backgroundColor: this.checkActive()
                  ? colorConfig.store.disableButton
                  : colorConfig.pageIndex.activeTintColor,
                borderRadius: 8,
                marginTop: 30,
                marginHorizontal: 15,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  fontWeight: 'bold',
                  paddingTop: 10,
                  fontSize: 19,
                }}>
                {intlData.messages.redeemVoucher}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.pesanAlert}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={this.state.cancelButton}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={
            this.state.titleAlert == 'Success!' ||
            this.state.titleAlert == 'Oppss...'
              ? 'Close'
              : 'Redeem'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            if (this.state.titleAlert == 'Success!') {
              try {
                if (
                  this.props.from != undefined &&
                  this.props.from === 'paymentAddVoucers'
                ) {
                  this.refreshMyVouchers();
                } else {
                  Actions.pop();
                }
              } catch (e) {
                this.hideAlert();
              }
            } else if (
              this.state.titleAlert ==
              `${this.intlData.messages.redeemVoucher} ?`
            ) {
              this.btnRedeem(this.props.dataVoucher);
            } else {
              this.hideAlert();
            }
          }}
        />
        {this.renderQuantityVoucher()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
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
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 2,
  },
  point: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  voucherItem: {
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    // margin: 10,
    // marginTop: 10,
    // borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    height: Dimensions.get('window').width / 2,
    width: Dimensions.get('window').width,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 2,
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    borderTopColor: colorConfig.pageIndex.activeTintColor,
    borderTopWidth: 1,
    flexDirection: 'column',
    // padding: 10,
  },
  nameVoucher: {
    fontSize: 20,
    textAlign: 'center',
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 15,
    color: colorConfig.store.titleSelected,
  },
  descVoucherTime: {
    fontSize: 13,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  pointVoucher: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colorConfig.pageIndex.activeTintColor,
    paddingBottom: 0,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
  buttonQty: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 10,
    borderRadius: 5,
    width: 40,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingPointsInfo: {
    padding: 10,
    backgroundColor: colorConfig.store.transparent,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 20,
  },
});

mapStateToProps = state => ({
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  pendingPoints: state.rewardsReducer.dataPoint.pendingPoints,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(VoucherDetail);
