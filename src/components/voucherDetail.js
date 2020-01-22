import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {notifikasi} from '../actions/auth.actions';
import {redeemVoucher, campaign, dataPoint} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';

class VoucherDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      currentDay: new Date(),
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

  btnRedeem = async dataVoucher => {
    try {
      let date = new Date();
      let timeZone = date.getTimezoneOffset();
      const data = {voucher: dataVoucher, timeZoneOffset: timeZone};
      const response = await this.props.dispatch(redeemVoucher(data));
      console.log(response);
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      await this.props.dispatch(myVoucers());
      if (response.message == 'Succcessfull redeem Voucher') {
        this.setState({
          showAlert: true,
          pesanAlert: response.message,
          titleAlert: 'Redeem Success!',
        });
      } else {
        this.setState({
          showAlert: true,
          pesanAlert: response.message,
          titleAlert: 'Oppss!',
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        showAlert: true,
        pesanAlert: error.responseBody.message,
        titleAlert: 'Redeem error!',
      });
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
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
              <Text style={styles.btnBackText}> Back </Text>
            </TouchableOpacity>
            <View style={styles.point}>
              <Image
                style={{height: 18, width: 25, marginRight: 5}}
                source={require('../assets/img/ticket.png')}
              />
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontWeight: 'bold',
                }}>
                {this.props.totalPoint == undefined
                  ? 0 + ' Point'
                  : this.props.totalPoint + ' Point'}
              </Text>
            </View>
          </View>
          <View style={styles.line} />
        </View>
        <ScrollView>
          <View style={styles.voucherItem}>
            <View style={{alignItems: 'center'}}>
              <Image
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
                  backgroundColor: 'rgba(2, 168, 80, 0.8)',
                  height: 30,
                  // width: this.state.screenWidth / 2 - 11,
                  borderTopRightRadius: 9,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <Text
                  style={{
                    color: colorConfig.pageIndex.backgroundColor,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}>
                  {this.props.dataVoucher['redeemValue'] + ' Points'}
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
                  {this.props.dataVoucher['voucherName']}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    size={15}
                    name={
                      Platform.OS === 'ios'
                        ? 'ios-arrow-dropright'
                        : 'md-arrow-dropright-circle'
                    }
                    style={{
                      color: colorConfig.pageIndex.inactiveTintColor,
                      marginRight: 3,
                    }}
                  />
                  <Text style={styles.descVoucher}>
                    {this.props.dataVoucher['voucherDesc']}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    size={15}
                    name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
                    style={{
                      color: colorConfig.pageIndex.inactiveTintColor,
                      marginRight: 3,
                    }}
                  />
                  {this.props.dataVoucher['validity']['longTerm'] ? (
                    <Text style={styles.descVoucher}>
                      {this.props.dataVoucher['validity']['activeWeekDays'][
                        this.state.currentDay.getDay()
                      ]['validHour']['from'] +
                        ' - ' +
                        this.props.dataVoucher['validity']['activeWeekDays'][
                          this.state.currentDay.getDay()
                        ]['validHour']['to']}
                    </Text>
                  ) : (
                    <Text style={styles.descVoucher}>
                      {this.getDate(
                        this.props.dataVoucher['validity']['validDate'][
                          'startDate'
                        ],
                      ) +
                        ' - ' +
                        this.getDate(
                          this.props.dataVoucher['validity']['validDate'][
                            'endDate'
                          ],
                        )}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.btnRedeem(this.props.dataVoucher)}
              style={{
                height: 40,
                backgroundColor: colorConfig.pageIndex.activeTintColor,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  fontWeight: 'bold',
                  paddingTop: 10,
                  fontSize: 16,
                }}>
                Redeem
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
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={
            this.state.titleAlert == 'Redeem Success!' ? 'Oke' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.state.titleAlert == 'Redeem Success!'
              ? Actions.pop()
              : this.hideAlert();
          }}
        />
      </View>
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
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  voucherItem: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width - 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    borderTopColor: colorConfig.pageIndex.activeTintColor,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameVoucher: {
    fontSize: 14,
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
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
