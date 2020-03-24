import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {logoutUser} from '../actions/auth.actions';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {isEmptyArray} from '../helper/CheckEmpty';

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

  updateLanguage = () => {
    this.props.setLanguage();
  };

  renderPaymentMethodOptions = () => {
    const {intlData, myCardAccount, companyInfo} = this.props;
    const paymentTypes = companyInfo.paymentTypes;
    if (!isEmptyArray(paymentTypes))
      return (
        <FlatList
          data={paymentTypes}
          renderItem={({item}) => (
            <TouchableOpacity
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
          )}
          keyExtractor={(product, index) => index.toString()}
        />
      );
  };

  render() {
    const {intlData, myCardAccount, companyInfo} = this.props;
    const paymentTypes = companyInfo.paymentTypes;
    return (
      <View style={styles.container}>
        <Text style={styles.headingMenu}>My Payment Options</Text>

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

        <Text style={styles.headingMenu}>Settings</Text>

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

        <TouchableOpacity onPress={this.updateLanguage} style={styles.cardMenu}>
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

        <TouchableOpacity onPress={this.logout} style={styles.cardMenu}>
          <View
            style={[
              styles.itemMenu,
              {backgroundColor: colorConfig.store.colorError},
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
                  style={[styles.title, {color: colorConfig.store.colorError}]}>
                  {intlData.messages.logout}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
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
    paddingVertical: 12,
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
  myCardAccount: state.cardReducer.myCardAccount.card,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
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
