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
  TouchableWithoutFeedback,
  ScrollView,
  Picker,
  BackHandler,
  Platform,
  TextInput,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import awsConfig from '../../config/awsConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Loader from './../loader';
import {
  getAccountPayment,
  selectedAccount,
} from '../../actions/payment.actions';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import {defaultPaymentAccount} from '../../actions/user.action';
import LoadingScreen from '../loadingScreen/LoadingScreen';
import {navigate} from '../../utils/navigation.utils';

class PaymentMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      refreshing: false,
      isLoading: false,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  getDataCard = async () => {
    await this.props.dispatch(getAccountPayment());
    await this.setState({refreshing: false});
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataCard();
  };

  paymentMethodSelected = item => {
    const {selectedAccount} = this.props;
    try {
      if (
        selectedAccount != undefined &&
        selectedAccount.paymentID == item.paymentID
      )
        return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  gotoAccounts = async (intlData, item, page) => {
    try {
      if (item.isAccountRequired) {
        navigate('paymentAddCard', {intlData, item, page});
      } else {
        await this.props.dispatch(selectedAccount(item));
        if (isEmptyObject(this.props.defaultAccount)) {
          await this.props.dispatch(defaultPaymentAccount(item));
        }
        Actions.pop();
      }
    } catch (e) {}
  };

  renderPaymentMethodOptions = () => {
    const {intlData, myCardAccount, companyInfo, page} = this.props;
    let paymentTypes = [];
    if (companyInfo?.paymentTypes != undefined)
      paymentTypes = companyInfo?.paymentTypes;

    if (this.props.paySVC) {
      paymentTypes = paymentTypes.filter(i => i.allowTopUpSVC === true);
    } else {
      paymentTypes = paymentTypes.filter(i => i.allowSalesTransaction === true);
    }

    if (!isEmptyArray(paymentTypes)) {
      return (
        <FlatList
          data={paymentTypes}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={async () => {
                this.setState({isLoading: true});
                await this.gotoAccounts(intlData, item, page);
                this.setState({isLoading: false});
              }}
              style={[styles.card]}>
              <View style={styles.headingCard}>
                <View style={{flexDirection: 'row'}}>
                  {item.image && item.image !== '' && (
                    <Image
                      source={{uri: item.image}}
                      style={{width: 30, marginRight: 8, resizeMode: 'contain'}}
                    />
                  )}
                  <Text style={styles.cardText}>{item.paymentName}</Text>
                </View>
                {this.paymentMethodSelected(item) ? (
                  <Icon
                    size={22}
                    name={
                      Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'
                    }
                    style={{color: colorConfig.store.colorSuccess}}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(product, index) => index.toString()}
        />
      );
    }
  };

  render() {
    const {intlData, companyInfo} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <LoadingScreen loading={this.state.isLoading} />
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}>Select Payment Methods</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <Text style={styles.headingMenu}>Available Payment Methods</Text>
          {this.renderPaymentMethodOptions()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  companyInfo: state.userReducer.getCompanyInfo?.companyInfo,
  myCardAccount: state.cardReducer.myCardAccount.card,
  selectedAccount: state.cardReducer.selectedAccount.selectedAccount,
  defaultAccount: state.userReducer.defaultPaymentAccount.defaultAccount,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentMethods);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  header: {
    // height: ,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 15,
  },
  primaryButton: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    padding: 12,
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    marginHorizontal: 13,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  headingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cardNumber: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 25,
  },
  cardName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 25,
  },
  cardText: {
    fontSize: 17,
    letterSpacing: 2,
    color: colorConfig.store.title,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  cardNumberText: {
    fontSize: 24,
    opacity: 0.6,
    color: 'white',
    // fontWeight: 'bold',
    // fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 2,
  },
  cardNameText: {
    fontSize: 18,
    width: '50%',
    opacity: 0.8,
    color: 'white',
    fontWeight: 'bold',
    // fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    // letterSpacing: 2,
  },
  cardValid: {
    fontSize: 13,
    opacity: 0.6,
    color: 'white',
    // fontWeight: 'bold',
    // fontFamily: 'monospace',
    textAlign: 'center',
    // letterSpacing: 2,
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.colorError,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headingMenu: {
    marginHorizontal: 15,
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
    marginBottom: 13,
  },
});
