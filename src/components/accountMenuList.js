import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {logoutUser} from '../actions/auth.actions';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import packageJson from '../../package';
import {defaultPaymentAccount, updateUser} from '../actions/user.action';
import VersionCheck from 'react-native-version-check';
import appConfig from '../config/appConfig';
import RBSheet from 'react-native-raw-bottom-sheet';

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      dialogChangeLanguage: false,
      loadingLogout: false,
      selectedAccount: {},
    };
  }

  logout = async () => {
    this.setState({loadingLogout: true});

    // remove device ID from server, so customer not receive notif again if logout
    try {
      let user = {};
      try {
        let bytes = CryptoJS.AES.decrypt(
          this.props.userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        user = {};
      }

      const payload = {
        username: user.username,
        player_ids: [],
      };
      await this.props.dispatch(updateUser(payload));
    } catch (e) {}

    await this.props.dispatch(logoutUser());
    this.setState({loadingLogout: false});
  };

  editProfil = () => {
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }

    var dataDiri = {dataDiri: userDetail};
    Actions.editProfile(dataDiri);
  };

  notifications = () => {
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }

    var dataDiri = {dataDiri: userDetail};
    Actions.notifications(dataDiri);
  };

  address = () => {
    Actions.listAddress();
  };

  prompLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure want to logout from apps ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.logout()},
      ],
      {cancelable: false},
    );
  };

  getLengthAccount = item => {
    try {
      const {myCardAccount} = this.props;
      const find = myCardAccount.filter(
        data => data.paymentID === item.paymentID,
      );
      if (find != undefined && find.length > 0) return `( ${find.length} )`;
      else return null;
    } catch (e) {}
  };

  gotoAccounts = async item => {
    const {intlData} = this.props;
    try {
      if (item.isAccountRequired != false) {
        Actions.listCard({intlData, item});
      } else {
        await this.setState({selectedAccount: item});
        this.RBSheet.open();
      }
    } catch (e) {}
  };

  renderPaymentMethodOptions = () => {
    const {intlData, myCardAccount, companyInfo} = this.props;
    let paymentTypes = [];
    if (companyInfo.paymentTypes != undefined)
      paymentTypes = companyInfo.paymentTypes;
    if (!isEmptyArray(paymentTypes)) {
      return paymentTypes.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => this.gotoAccounts(item)}
          style={styles.cardMenu}>
          <View style={styles.itemMenu}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
              style={{color: 'white'}}
            />
          </View>
          <View>
            <View style={styles.item}>
              {myCardAccount != undefined ? (
                <Text style={styles.title}>
                  {item.paymentName} {this.getLengthAccount(item)}
                </Text>
              ) : null}
              {item.isAccountRequired != false ? (
                <Icon
                  size={20}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-arrow-dropright'
                      : 'md-arrow-dropright'
                  }
                  style={{
                    color: colorConfig.store.defaultColor,
                    marginRight: 20,
                  }}
                />
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      ));
    }
  };

  setDefaultAccount = async () => {
    const {selectedAccount} = this.state;
    await this.props.dispatch(defaultPaymentAccount(selectedAccount));
    this.RBSheet.close();
  };

  askUserToSelectPaymentType = () => {
    const {intlData} = this.props;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'fade'}
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
            fontSize: 19,
            color: colorConfig.store.titleSelected,
            fontFamily: 'Lato-Medium',
            marginBottom: 10,
          }}>
          Default Payment Method
        </Text>
        <TouchableOpacity
          onPress={() => this.setDefaultAccount()}
          style={{
            padding: 12,
            backgroundColor: colorConfig.store.defaultColor,
            borderRadius: 15,
            width: '60%',
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            size={30}
            name={Platform.OS === 'ios' ? 'ios-save' : 'md-save'}
            style={{color: 'white'}}
          />
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            {/*{intlData.messages.dineIn}*/}
            Set as Default
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  render() {
    const {
      intlData,
      myCardAccount,
      companyInfo,
      defaultAccount,
      referral,
    } = this.props;
    return (
      <View style={styles.container}>
        {this.askUserToSelectPaymentType()}
        <Text style={styles.headingMenu}>
          {intlData.messages.defaultPaymentAccount}
          {/*Default Payment Account*/}
        </Text>
        <TouchableOpacity disabled={true} style={styles.cardMenu}>
          {!isEmptyObject(defaultAccount) ? (
            <View style={styles.itemMenu}>
              <Icon
                size={20}
                name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
                style={{color: 'white'}}
              />
            </View>
          ) : null}
          <View>
            <View style={styles.item}>
              <Text
                style={[styles.title, {color: colorConfig.store.defaultColor}]}>
                {!isEmptyObject(defaultAccount) ? (
                  defaultAccount.isAccountRequired != false ? (
                    <>
                      <Text>
                        {defaultAccount.details.cardIssuer != undefined
                          ? defaultAccount.details.cardIssuer.toUpperCase()
                          : null}
                      </Text>{' '}
                      <Text>{defaultAccount.details.maskedAccountNumber}</Text>
                    </>
                  ) : (
                    <Text>{defaultAccount.paymentName}</Text>
                  )
                ) : (
                  <Text style={{color: colorConfig.store.colorError}}>
                    {intlData.messages.notYesAdded}
                    {/*NOT YET ADDED*/}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.headingMenu}>
          {intlData.messages.myPaymentOptions}
          {/*My Payment Options*/}
        </Text>

        {this.renderPaymentMethodOptions()}

        {/*<TouchableOpacity*/}
        {/*  onPress={() => this.props.screen.navigation.navigate('History')}*/}
        {/*  style={styles.cardMenu}>*/}
        {/*  <View style={styles.itemMenu}>*/}
        {/*    <Icon*/}
        {/*      size={20}*/}
        {/*      name={Platform.OS === 'ios' ? 'ios-wallet' : 'md-wallet'}*/}
        {/*      style={{color: 'white'}}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*  <View>*/}
        {/*    <View style={styles.item}>*/}
        {/*      <Text style={styles.title}>DBS Paylah</Text>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</TouchableOpacity>*/}

        <Text style={styles.headingMenu}>{intlData.messages.settings}</Text>

        {referral != undefined && referral.capacity > 0 ? (
          <TouchableOpacity
            onPress={() => Actions.listReferral()}
            style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Icon
                size={20}
                name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'}
                style={{color: 'white'}}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>
                  Referral ( {referral.amount}/{referral.capacity} )
                </Text>
                <Icon
                  size={20}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-arrow-dropright'
                      : 'md-arrow-dropright'
                  }
                  style={{
                    color: colorConfig.store.defaultColor,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={this.address} style={styles.cardMenu}>
          <View style={styles.itemMenu}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-business' : 'md-business'}
              style={{color: 'white'}}
            />
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.title}>
                {intlData.messages.myDeliveryAddress}
                {/*My Delivery Address*/}
              </Text>
              <Icon
                size={20}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright'
                    : 'md-arrow-dropright'
                }
                style={{color: colorConfig.store.defaultColor, marginRight: 20}}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.notifications} style={styles.cardMenu}>
          <View style={styles.itemMenu}>
            <Icon
              size={20}
              name={
                Platform.OS === 'ios' ? 'ios-notifications' : 'md-notifications'
              }
              style={{color: 'white'}}
            />
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.title}>
                {intlData.messages.notifications}
                {/*Notifications*/}
              </Text>
              <Icon
                size={20}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright'
                    : 'md-arrow-dropright'
                }
                style={{color: colorConfig.store.defaultColor, marginRight: 20}}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.editProfil} style={styles.cardMenu}>
          <View style={styles.itemMenu}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
              style={{color: 'white'}}
            />
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.title}>{intlData.messages.editProfile}</Text>
              <Icon
                size={20}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright'
                    : 'md-arrow-dropright'
                }
                style={{color: colorConfig.store.defaultColor, marginRight: 20}}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Actions.listLanguages()}
          style={styles.cardMenu}>
          <View style={styles.itemMenu}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'}
              style={{color: 'white'}}
            />
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.title}>{intlData.messages.languages}</Text>
              <Icon
                size={20}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright'
                    : 'md-arrow-dropright'
                }
                style={{color: colorConfig.store.defaultColor, marginRight: 20}}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.prompLogout} style={styles.cardMenu}>
          <View
            style={[
              styles.itemMenu,
              {backgroundColor: colorConfig.pageIndex.inactiveTintColor},
            ]}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-exit' : 'md-exit'}
              style={{color: 'white'}}
            />
          </View>
          <View>
            <View style={styles.item}>
              {this.state.loadingLogout ? (
                <ActivityIndicator
                  size={'large'}
                  color={colorConfig.store.colorError}
                />
              ) : (
                <Text
                  style={[
                    styles.title,
                    {color: colorConfig.pageIndex.inactiveTintColor},
                  ]}>
                  {intlData.messages.logout}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <Text
          style={{
            alignSelf: 'center',
            marginTop: 10,
            color: colorConfig.pageIndex.grayColor,
            fontSize: 13,
            marginBottom: 15,
          }}>
          Version: {VersionCheck.getCurrentVersion()} (
          {VersionCheck.getCurrentBuildNumber()})
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  item: {
    margin: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 60,
  },
  itemMenu: {
    // paddingVertical: 12,
    justifyContent: 'center',
    marginLeft: 10,
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colorConfig.store.defaultColor,
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    color: colorConfig.store.title,
    letterSpacing: 1,
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  headingMenu: {
    marginLeft: 15,
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    marginBottom: 7,
  },
  cardMenu: {
    flexDirection: 'row',
    paddingLeft: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    // paddingVertical: 5,
    marginBottom: 5,
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 9,
    // },
    // shadowOpacity: 0.7,
    // shadowRadius: 7.49,
    // elevation: 12,
  },
});

mapStateToProps = state => ({
  logoutUser: state.authReducer.logoutUser,
  userDetail: state.userReducer.getUser.userDetails,
  referral: state.referralReducer.getReferral.referral,
  myCardAccount: state.cardReducer.myCardAccount.card,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  defaultAccount: state.userReducer.defaultPaymentAccount.defaultAccount,
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
)(AccountMenuList);
