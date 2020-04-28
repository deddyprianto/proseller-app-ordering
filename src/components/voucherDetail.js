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
  AsyncStorage,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {notifikasi, refreshToken} from '../actions/auth.actions';
import {redeemVoucher, campaign, dataPoint} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';
import Loader from './loader';
import * as _ from 'lodash';

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
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(myVoucers());
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

  componentWillUnmount(): void {
    this.setState({
      showAlert: false,
    });
  }

  render() {
    const {intlData} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loadRedeem && <Loader />}
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
            <TouchableOpacity
              onPress={() => this.prompRedeem(this.props.dataVoucher)}
              style={{
                height: 50,
                backgroundColor: colorConfig.pageIndex.activeTintColor,
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
              this.hideAlert();
            } else if (this.state.titleAlert == `${this.intlData.messages.redeemVoucher} ?`) {
              this.btnRedeem(this.props.dataVoucher);
            } else {
              this.hideAlert();
            }
          }}
        />
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
    color: colorConfig.pageIndex.inactiveTintColor,
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
});

mapStateToProps = state => ({
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
