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
import Fontisto from 'react-native-vector-icons/Feather';

import {logoutUser} from '../actions/auth.actions';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import {defaultPaymentAccount, updateUser} from '../actions/user.action';
import VersionCheck from 'react-native-version-check';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import {
  netsclickDeregister,
  netsclickRegister,
} from '../actions/payment.actions';
import Loader from './loader';
import {getTermsConditions} from '../actions/order.action';

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      dialogChangeLanguage: false,
      loadingLogout: false,
      selectedAccount: {},
      loading: false,
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

    try {
      if (this.props.netsclickStatus == true) {
        await this.props.dispatch(netsclickDeregister());
      }
    } catch (e) {}

    await this.props.dispatch(logoutUser());
    this.props.dispatch(getTermsConditions());
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
          {item.image && item.image != '' ? (
            <Image
              source={{uri: item.image}}
              style={{width: 35, marginLeft: 5, resizeMode: 'contain'}}
            />
          ) : (
            <View style={styles.itemMenu}>
              <Icon
                size={20}
                name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                style={{color: 'white'}}
              />
            </View>
          )}
          <View>
            <View style={styles.item}>
              {myCardAccount != undefined ? (
                <Text style={styles.title}>
                  {item.paymentName} {this.getLengthAccount(item)}
                </Text>
              ) : null}
              {item.isAccountRequired != false ? (
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
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
            fontFamily: 'Poppins-Regular',
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
              fontFamily: 'Poppins-Medium',
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

  netsClickOptions = () => {
    const {intlData} = this.props;
    return (
      <RBSheet
        ref={ref => {
          this.RBNetsClick = ref;
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
            fontFamily: 'Poppins-Regular',
            marginBottom: 10,
          }}>
          NETS Click Options
        </Text>
        <TouchableOpacity
          onPress={() => this.setDefaultAccount()}
          style={{
            padding: 12,
            paddingVertical: 15,
            backgroundColor: colorConfig.store.colorSuccess,
            borderRadius: 15,
            width: '60%',
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              textAlign: 'center',
            }}>
            Set as Default Payment
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.netsClickDeregister}
          style={{
            padding: 12,
            paddingVertical: 15,
            backgroundColor: colorConfig.store.colorError,
            borderRadius: 15,
            width: '60%',
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              fontSize: 13,
              textAlign: 'center',
            }}>
            Remove NETS Click Account
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  handleNetsClick = async () => {
    await this.setState({loading: true});
    try {
      try {
        const value = await AsyncStorage.getItem('@netsclick_register_status');
        if (value !== null) {
          this.RBNetsClick.open();
        } else {
          this.props.dispatch(netsclickRegister());
        }
      } catch (e) {}
    } catch (e) {}
    await this.setState({loading: false});
  };

  netsClickDeregister = async () => {
    this.RBNetsClick.close();
    setTimeout(async () => {
      await this.setState({loading: true});
      try {
        await this.props.dispatch(netsclickDeregister());
      } catch (e) {}
      await this.setState({loading: false});
    }, 200);
  };

  goToInbox = () => {
    try {
      Actions.inbox();
    } catch (e) {}
  };

  countUnreadInbox = () => {
    try {
      const {dataInbox} = this.props;
      let count = dataInbox.Data.filter(item => item.isRead != true);
      if (count.length > 0) return `( ${count.length} )`;
      else return null;
    } catch (e) {
      return null;
    }
  };

  render() {
    const {
      intlData,
      myCardAccount,
      companyInfo,
      defaultAccount,
      referral,
      netsclickStatus,
      balance,
    } = this.props;
    const {loading} = this.state;
    return (
      <View style={styles.container}>
        {loading && <Loader />}
        {this.askUserToSelectPaymentType()}
        {/*{this.netsClickOptions()}*/}
        {/*<View style={styles.svcCard}>*/}
        {/*  <TouchableOpacity*/}
        {/*    style={styles.buttonSVC}*/}
        {/*    onPress={() => Actions.summary()}>*/}
        {/*    <Fontisto*/}
        {/*      size={23}*/}
        {/*      name={'box'}*/}
        {/*      style={{color: '#747d8c', marginRight: 16, marginTop: -5}}*/}
        {/*    />*/}
        {/*    <Text style={styles.textCard}>Store Value Card</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
        {/*{!isEmptyObject(defaultAccount) ? (*/}
        {/*  <View style={styles.singleCard}>*/}
        {/*    <Text style={{fontFamily: 'Poppins-Medium', marginBottom: 10}}>*/}
        {/*      Default Payment Account*/}
        {/*    </Text>*/}
        {/*    <View*/}
        {/*      style={{*/}
        {/*        flexDirection: 'row',*/}
        {/*        paddingVertical: 10,*/}
        {/*        alignItems: 'center',*/}
        {/*      }}>*/}
        {/*      <Fontisto*/}
        {/*        size={23}*/}
        {/*        name={'check-circle'}*/}
        {/*        style={{*/}
        {/*          color: colorConfig.store.secondaryColor,*/}
        {/*          marginRight: 20,*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <Text style={{fontFamily: 'Poppins-Regular', letterSpacing: 1.4}}>*/}
        {/*        {!isEmptyObject(defaultAccount) ? (*/}
        {/*          defaultAccount.isAccountRequired !== false ? (*/}
        {/*            <>*/}
        {/*              <Text>*/}
        {/*                {defaultAccount.details.cardIssuer != undefined*/}
        {/*                  ? defaultAccount.details.cardIssuer.toUpperCase()*/}
        {/*                  : null}*/}
        {/*              </Text>{' '}*/}
        {/*              <Text>{defaultAccount.details.maskedAccountNumber}</Text>*/}
        {/*            </>*/}
        {/*          ) : (*/}
        {/*            <Text>{defaultAccount.paymentName}</Text>*/}
        {/*          )*/}
        {/*        ) : null}*/}
        {/*      </Text>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*) : null}*/}

        <View style={styles.singleCard}>
          <Text style={{fontFamily: 'Poppins-Medium', marginBottom: 10}}>
            Payment Methods
          </Text>
          <View
            style={{
              // flexDirection: 'row',
              // paddingVertical: 10,
              alignItems: 'center',
            }}>
            {this.renderPaymentMethodOptions()}
          </View>
        </View>

        {/*{companyInfo.companyName === 'USTARS' && (*/}
        {/*  <TouchableOpacity*/}
        {/*    style={styles.cardMenu}*/}
        {/*    onPress={this.handleNetsClick}>*/}
        {/*    <View style={styles.itemMenu}>*/}
        {/*      <Icon*/}
        {/*        size={20}*/}
        {/*        name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}*/}
        {/*        style={{color: 'white'}}*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*    <View>*/}
        {/*      <View style={styles.item}>*/}
        {/*        <View>*/}
        {/*          <Text style={styles.title}>NETS Click</Text>*/}
        {/*          {netsclickStatus == true ? (*/}
        {/*            <Text style={styles.subTitle}>*/}
        {/*              NETS Click Registered*/}
        {/*            </Text>*/}
        {/*          ) : (*/}
        {/*            <Text style={styles.subTitleGray}>*/}
        {/*              Add NETS Bank Card*/}
        {/*            </Text>*/}
        {/*          )}*/}
        {/*        </View>*/}
        {/*        <Icon*/}
        {/*          size={20}*/}
        {/*          name={*/}
        {/*            Platform.OS === 'ios'*/}
        {/*              ? 'ios-arrow-dropright'*/}
        {/*              : 'md-arrow-dropright'*/}
        {/*          }*/}
        {/*          style={{*/}
        {/*            color: colorConfig.store.defaultColor,*/}
        {/*            marginRight: 20,*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*  y</TouchableOpacity>*/}
        {/*)}*/}

        <View style={styles.singleCard}>
          <Text style={{fontFamily: 'Poppins-Medium', marginBottom: 10}}>
            Settings
          </Text>
          <TouchableOpacity onPress={this.editProfil} style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Fontisto
                size={21}
                name={'user'}
                style={{
                  color: colorConfig.store.titleSelected,
                  marginRight: 20,
                }}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>
                  {intlData.messages.editProfile}
                </Text>
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          {referral != undefined && referral.capacity > 0 ? (
            <TouchableOpacity
              onPress={() => Actions.listReferral()}
              style={styles.cardMenu}>
              <View style={styles.itemMenu}>
                <Fontisto
                  size={21}
                  name={'send'}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
              <View>
                <View style={styles.item}>
                  <Text style={styles.title}>
                    Referral ( {referral.amount}/{referral.capacity} )
                  </Text>
                  <Fontisto
                    name={'chevron-right'}
                    size={25}
                    style={{
                      color: colorConfig.store.titleSelected,
                      marginRight: 20,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={this.address} style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Fontisto
                size={21}
                name={'home'}
                style={{
                  color: colorConfig.store.titleSelected,
                  marginRight: 20,
                }}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>
                  {intlData.messages.myDeliveryAddress}
                </Text>
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.notifications}
            style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Fontisto
                size={21}
                name={'bell'}
                style={{
                  color: colorConfig.store.titleSelected,
                  marginRight: 20,
                }}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>
                  {intlData.messages.notifications}
                </Text>
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Actions.listLanguages()}
            style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Fontisto
                size={21}
                name={'globe'}
                style={{
                  color: colorConfig.store.titleSelected,
                  marginRight: 20,
                }}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>{intlData.messages.languages}</Text>
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Actions.termsCondition()}
            style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Fontisto
                size={21}
                name={'book-open'}
                style={{
                  color: colorConfig.store.titleSelected,
                  marginRight: 20,
                }}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>Terms & Conditions</Text>
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.prompLogout} style={styles.cardMenu}>
            <View style={styles.itemMenu}>
              <Fontisto
                size={21}
                name={'log-out'}
                style={{
                  color: colorConfig.store.titleSelected,
                  marginRight: 20,
                }}
              />
            </View>
            <View>
              <View style={styles.item}>
                <Text style={styles.title}>{intlData.messages.logout}</Text>
                <Fontisto
                  name={'chevron-right'}
                  size={25}
                  style={{
                    color: colorConfig.store.titleSelected,
                    marginRight: 20,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

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
    marginHorizontal: 10,
    // paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 60,
  },
  itemMenu: {
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 8,
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    marginTop: 3,
    color: colorConfig.store.title,
    letterSpacing: 1,
    fontSize: 14,
    // fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  subTitle: {
    color: colorConfig.store.colorSuccess,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  subTitleGray: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  headingMenu: {
    marginLeft: 15,
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 7,
  },
  cardMenu: {
    flexDirection: 'row',
    // alignItems: 'center',
    borderRadius: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    paddingVertical: 15,
    width: '100%',
  },
  svcCard: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
  },
  buttonSVC: {
    borderWidth: 0.5,
    borderColor: colorConfig.pageIndex.grayColor,
    padding: 15,
    width: '98%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCard: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.title,
  },
  singleCard: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    padding: 10,
    paddingLeft: 15,
    marginBottom: 13,
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
  netsclickStatus: state.accountsReducer.netsclickStatus.netsclickStatus,
  dataInbox: state.inboxReducer.dataInbox.broadcast,
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
