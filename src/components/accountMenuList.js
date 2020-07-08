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
import {updateUser} from '../actions/user.action';

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      dialogChangeLanguage: false,
      loadingLogout: false,
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

  renderPaymentMethodOptions = () => {
    const {intlData, myCardAccount, companyInfo} = this.props;
    let paymentTypes = [];
    if (companyInfo.paymentTypes != undefined)
      paymentTypes = companyInfo.paymentTypes;
    if (!isEmptyArray(paymentTypes)) {
      return paymentTypes.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => Actions.listCard({intlData, item})}
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
              {myCardAccount != undefined && myCardAccount.length > 0 ? (
                <Text style={styles.title}>
                  {item.paymentName} ({myCardAccount.length})
                </Text>
              ) : (
                <Text style={styles.title}>ADD {item.paymentName}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ));
    }
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
        <Text style={styles.headingMenu}>
          {intlData.messages.defaultPaymentAccount}
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
              <Text style={styles.title}>
                {!isEmptyObject(defaultAccount) ? (
                  <>
                    <Text>
                      {defaultAccount.details.cardIssuer != undefined
                        ? defaultAccount.details.cardIssuer.toUpperCase()
                        : null}
                    </Text>{' '}
                    <Text>{defaultAccount.details.maskedAccountNumber}</Text>
                  </>
                ) : (
                  <Text style={{color: colorConfig.store.colorError}}>
                    {intlData.messages.notYesAdded}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.headingMenu}>
          {intlData.messages.myPaymentOptions}
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
              </Text>
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
              </Text>
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
          }}>
          Version: {packageJson.version}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
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
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  headingMenu: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    marginBottom: 13,
  },
  cardMenu: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 5,
    marginBottom: 12,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
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
