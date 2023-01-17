import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  BackHandler,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import Loader from '../loader';
import {getSVCBalance, transferSVC} from '../../actions/SVC.action';
import {VirtualKeyboard} from '../../helper/react-native-screen-keyboard';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import AwesomeAlert from 'react-native-awesome-alerts';
import {parse} from 'react-native-svg';
import {isEmptyArray} from '../../helper/CheckEmpty';

class VirtualKeyboardCom extends Component {
  constructor(props) {
    super(props);

    let amount = 0;
    let tempAmountSVC = 0;
    try {
      if (this.props.amountSVC !== undefined && this.props.amountSVC > 0) {
        amount = this.props.amountSVC;
        tempAmountSVC = this.props.amountSVC;
      }

      const {totalPurchase, balance} = this.props;
      if (amount === '' || amount === 0) {
        if (balance >= totalPurchase) {
          amount = Number(totalPurchase.toFixed(2));
          tempAmountSVC = Number(totalPurchase.toFixed(2));
        } else if (balance < totalPurchase) {
          amount = balance;
          tempAmountSVC = balance;
        }
      }
    } catch (e) {}

    this.state = {
      currentDay: new Date(),
      refreshing: false,
      isLoading: true,
      amount,
      titleAlert: '',
      showAlert: false,
      message: '',
      tempAmountSVC,
      totalPurchase: this.props.totalPurchase,
    };
  }

  componentWillMount = async () => {
    try {
      await this.setState({isLoading: true});
      await this.props.dispatch(getSVCBalance());
      // await this.setDefaultValue();
      await this.setState({isLoading: false});
    } catch (e) {
      await this.setState({isLoading: false});
    }
  };

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  setDefaultValue = async () => {
    const {amount} = this.state;
    const {balance} = this.props;
    const {totalPurchase} = this.state;
    if (amount === '' || amount === 0) {
      if (balance >= totalPurchase) {
        await this.setState({
          amount: totalPurchase,
          tempAmountSVC: totalPurchase,
        });
      } else if (balance < totalPurchase) {
        await this.setState({amount: balance, tempAmountSVC: balance});
      }
    }
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.dispatch(getSVCBalance());
    this.setState({refreshing: false});
  };

  changeText(newText) {
    this.setState({amount: newText});
  }

  transferSVC = async () => {
    const {payload} = this.props;
    const {amount} = this.state;
    try {
      const sendMethod =
        payload.modeInvitation === 'Email' ? 'email' : 'phoneNumber';
      const data = {
        [sendMethod]: payload.address,
        value: Number(amount),
      };
      const response = await this.props.dispatch(transferSVC(data));
      await this.props.dispatch(getSVCBalance());
      if (response.success === true) {
        await this.setState({
          showAlert: true,
          titleAlert: 'Success!',
          message: `${amount} SVC balances have been transferred!`,
        });
      } else {
        await this.setState({
          showAlert: true,
          titleAlert: 'Oppss...',
          message: response.responseBody.message,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  setAmountSVC = async dontGoBack => {
    const {amount} = this.state;
    try {
      await this.props.setSVCAmount(amount, dontGoBack);
      if (dontGoBack !== true) {
        Actions.pop();
      }
    } catch (e) {}
  };

  submitAmount = async () => {
    const {
      payload,
      balance,
      transferSVC,
      useSVC,
      originalPurchase,
    } = this.props;
    const {amount} = this.state;
    await this.setState({isLoading: true});
    try {
      let doPaymentImmediately = Number(originalPurchase) === Number(amount);
      if (transferSVC === true) {
        await this.transferSVC();
      } else if (useSVC === true) {
        await this.setAmountSVC(doPaymentImmediately);
        // Do payment immediately if using full SVC
        if (doPaymentImmediately) {
          try {
            await this.props.doPayment();
          } catch (e) {}
        }
      }
    } catch (e) {}
    await this.setState({isLoading: false});
  };

  isDisabled = () => {
    const {amount} = this.state;
    const {totalPurchase} = this.state;
    let {balance, originalPurchase} = this.props;
    let balanceOriginal = balance;
    let balance2 = balance;
    if (totalPurchase !== undefined && totalPurchase > 0) {
      // balance = Number(totalPurchase.toFixed(2));
      balance2 = Number(totalPurchase.toFixed(2));
    }
    if (originalPurchase !== undefined && originalPurchase > 0) {
      balance2 = Number(originalPurchase.toFixed(2));
    }
    console.log(balance2, 'balance2');
    console.log(balance, 'balance');
    if (
      amount > balance ||
      amount === 0 ||
      amount > balance2 ||
      amount > balanceOriginal
    ) {
      return true;
    }

    try {
      let tempTotal = Number(totalPurchase.toFixed(2)) - amount;
      if (this.props.amountSVC !== undefined) {
        tempTotal += Number(this.props.amountSVC);
      }
      if (tempTotal < 0) {
        return true;
      }
    } catch (e) {}

    return false;
  };

  render() {
    const {intlData, payload, balance, transferSVC, amountSVC} = this.props;
    const {amount} = this.state;
    return (
      <SafeAreaView>
        {this.state.isLoading && <Loader />}
        <View
          style={{
            paddingVertical: 5,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
                <Icon
                  size={35}
                  name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                  style={{color: 'black', padding: 10}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{marginTop: -30, alignItems: 'center', marginBottom: 50}}>
            <Text style={{fontFamily: 'Poppins-Medium'}}>
              {transferSVC === true ? 'Send to' : 'Amount to use'}
            </Text>
            {transferSVC === true && (
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {payload.modeInvitation} • {payload.address}
              </Text>
            )}
          </View>
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 30,
            fontFamily: 'Poppins-Medium',
            marginBottom: '25%',
          }}>
          {/* <Text style={{fontSize: 15}}>{appConfig.appMataUang}</Text>{' '} */}
          {this.state.amount ? CurrencyFormatter(Number(this.state.amount)) : 0}
        </Text>
        <View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 20,
              marginBottom: '10%',
            }}>
            <Text style={{fontSize: 17, fontFamily: 'Poppins-Regular'}}>
              SVC Balance
            </Text>
            <Text style={{fontSize: 17, fontFamily: 'Poppins-Regular'}}>
              {CurrencyFormatter(balance)}
            </Text>
          </View>
          <VirtualKeyboard
            defaultText={parseFloat(this.state.tempAmountSVC)}
            onRef={ref => (this.keyboard = ref)}
            onChange={e => {
              if (e !== null && e !== '' && !isNaN(e)) {
                const purchase = this.props.totalPurchase - Number(e);
                this.setState({
                  amount: e,
                  // totalPurchase: purchase,
                });
              } else {
                this.setState({
                  amount: '0',
                  // totalPurchase: this.props.totalPurchase,
                });
              }
            }}
            keyboardStyle={{fontFamily: 'Poppins-Regular'}}
          />
        </View>
        <TouchableOpacity
          onPress={this.submitAmount}
          disabled={this.isDisabled()}
          style={[
            styles.buttonBottomFixed,
            this.isDisabled() ? {opacity: 0.3} : null,
          ]}>
          <Icon
            size={40}
            name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
            style={{color: 'white', alignSelf: 'center'}}
          />
        </TouchableOpacity>

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={this.state.cancelButton}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={'Close'}
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.setState({showAlert: false});
          }}
          onConfirmPressed={() => {
            if (this.state.titleAlert == 'Success!') {
              try {
                this.props.getCustomerActivity();
              } catch (e) {}
              Actions.popTo('summary');
            } else {
              this.setState({showAlert: false});
            }
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
    paddingBottom: 200,
  },
  buttonBottomFixed: {
    top: '10%',
    backgroundColor: colorConfig.store.defaultColor,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 50,
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
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  btnBackText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  vourcherPoint: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colorConfig.store.transparentColor,
    height: 30,
    // width: this.state.screenWidth / 2 - 11,
    borderTopRightRadius: 9,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherImage1: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 2.5,
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
    paddingLeft: 10,
    paddingTop: 5,
    fontSize: 16,
    paddingRight: 5,
    borderTopColor: colorConfig.store.defaultColor,
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  status: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    height: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    width: 70,
  },
  statusTitle: {
    fontSize: 12,
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
  },
  nameVoucher: {
    fontSize: 18,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    maxWidth: '95%',
    marginLeft: 5,
    color: colorConfig.store.titleSelected,
  },
  pointVoucher: {
    fontSize: 12,
    color: colorConfig.pageIndex.activeTintColor,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
  point: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.backgroundColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
});

mapStateToProps = state => ({
  intlData: state.intlData,
  balance: state.SVCReducer.balance.balance,
  defaultBalance: state.SVCReducer.balance.defaultBalance,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(VirtualKeyboardCom);
