import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import {isEmptyArray, isEmptyData} from '../helper/CheckEmpty';
import {format} from 'date-fns';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

export default class AccountUserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  editProfil = () => {
    var dataDiri = {dataDiri: this.props.userDetail};
    Actions.accountEditProfil(dataDiri);
  };

  renderCustomerGroupBG = cg => {
    try {
      return '#ff6b6b';
    } catch (e) {
      return '#414141';
    }
  };

  openQRCode = () => {
    try {
      this.props.setQrCodeVisibility(true);
    } catch (e) {}
  };

  getMaxRanking = () => {
    try {
      const {memberships} = this.props;
      let largest = 0;
      for (let i = 0; i < memberships.length; i++) {
        if (memberships[i].ranking > largest) {
          largest = memberships[i].ranking;
        }
      }
      return largest;
    } catch (e) {}
  };

  getLabel = dataCustomer => {
    return 'UPGRADE';
  };

  isRenew = () => {
    const {userDetail, memberships} = this.props;
    try {
      if (userDetail.expiryCustomerGroup === undefined) {
        return false;
      }
      if (
        userDetail.customerGroupLevel === 1 ||
        !userDetail.customerGroupLevel
      ) {
        return false;
      }
      const result = differenceInCalendarDays(
        new Date(userDetail.expiryCustomerGroup),
        new Date(),
      );

      // check renewal

      let dateRenewal = 366; // default renewal info is 1 year
      const findMembership = memberships.data.find(
        item => item.sortKey === userDetail.customerGroupId,
      );

      if (findMembership === undefined) {
        return false;
      }

      const dayRenewal = findMembership.renewalReminders.filter(
        item => item.periodUnit === 'DAY',
      );
      const monthRenewal = findMembership.renewalReminders.filter(
        item => item.periodUnit === 'MONTH',
      );

      let maxDay = dayRenewal.reduce(function(prev, current) {
        return prev.period > current.period ? prev : current;
      });
      if (maxDay !== undefined) {
        dateRenewal = maxDay.period;
      }

      let maxMonth = monthRenewal.reduce(function(prev, current) {
        return prev.period > current.period ? prev : current;
      });
      if (maxMonth !== undefined) {
        dateRenewal = maxMonth.period * 30;
      }
      // Check if customer groupp exipry less then 8 months
      // console.log(result, 'dateRenewal');
      if (result <= dateRenewal) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  goToRenewal = async () => {
    try {
      const {userDetail, memberships} = this.props;
      const mem = memberships.listRenew.find(
        item => item.ranking === userDetail.customerGroupLevel,
      );

      if (mem) {
        Actions.detailMembership({membership: mem, userDetail});
      }
    } catch (e) {}
  };

  render() {
    const {userDetail} = this.props;
    return (
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: colorConfig.pageIndex.backgroundColor,
        }}>
        <View style={{padding: 12}}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              marginBottom: 10,
              fontSize: 21,
            }}>
            Profile
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={this.openQRCode}>
              <Image
                style={{
                  height: 80,
                  width: 80,
                  marginBottom: 10,
                  borderRadius: 10,
                  marginRight: 20,
                }}
                source={appConfig.userQRCode}
              />
            </TouchableOpacity>
            <View
              style={{
                marginBottom: 7,
                flexDirection: 'column',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                }}>
                {userDetail !== undefined ? userDetail.name : ''}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Poppins-Regular',
                  color: colorConfig.store.titleSelected,
                }}>
                {userDetail !== undefined ? userDetail.phoneNumber : ''}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Poppins-Regular',
                  color: colorConfig.store.titleSelected,
                }}>
                {userDetail !== undefined ? userDetail.email : ''}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                marginHorizontal: 5,
                borderTopWidth: 0.4,
                borderTopColor: colorConfig.pageIndex.grayColor,
                paddingVertical: 15,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Bold',
                    color: colorConfig.store.secondaryColor,
                  }}>
                  {userDetail != undefined
                    ? userDetail.customerGroupName != undefined
                      ? userDetail.customerGroupName.toUpperCase()
                      : ''
                    : ''}
                </Text>
                {userDetail && userDetail.expiryCustomerGroup && (
                  <Text style={styles.customerGroupExpiry}>
                    Expire on{' '}
                    {format(
                      new Date(userDetail.expiryCustomerGroup),
                      'dd MMMM yyyy',
                    )}
                  </Text>
                )}
              </View>
              <View style={{flexDirection: 'row'}}>
                {!isEmptyArray(this.props.memberships.data) && this.isRenew() && (
                  <TouchableOpacity
                    onPress={this.goToRenewal}
                    style={styles.btnUpgrade}>
                    <Text style={styles.textUpgrade}>RENEW</Text>
                  </TouchableOpacity>
                )}
                {!isEmptyArray(this.props.memberships.listUpgrade) && (
                  <TouchableOpacity
                    onPress={() => Actions.listMembership({userDetail})}
                    style={styles.btnUpgrade}>
                    <Text style={styles.textUpgrade}>
                      {this.getLabel(userDetail)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnUpgrade: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    width: 80,
    marginLeft: 20,
    height: 40,
    borderColor: colorConfig.pageIndex.grayColor,
  },
  customerGroupExpiry: {
    fontFamily: 'Poppins-Italic',
    fontSize: 10,
    color: colorConfig.store.titleSelected,
  },
  textUpgrade: {
    color: colorConfig.store.titleSelected,
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
});
