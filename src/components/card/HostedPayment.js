import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {
  checkAccount,
  getAccountPayment,
  selectedAccount,
} from '../../actions/payment.actions';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {compose} from 'redux';
import {connect} from 'react-redux';
import awsConfig from '../../config/awsConfig';
import {defaultPaymentAccount} from '../../actions/user.action';
import {getBasket} from '../../actions/order.action';
import {myVoucers} from '../../actions/account.action';

const URL = awsConfig.base_url_payment;

const SUCCESS_URL = `account/registration/success`;
const FAILED_URL = `account/registration/failed`;

let openOne = true;

class HostedPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }

  componentDidMount = async () => {
    this.checkStatus();
  };

  componentWillUnmount() {
    try {
      clearInterval(this.interval);
    } catch (e) {}
  }

  checkStatus = async () => {
    const {url, page, data} = this.props;

    clearInterval(this.interval);
    this.interval = setInterval(async () => {
      const response = await this.props.dispatch(checkAccount(data.accountID));
      if (
        response.response.data != undefined &&
        response.response.data.active == true &&
        response.response.data.registrationStatus === 'completed'
      ) {
        clearInterval(this.interval);
        await this.setSelectedAccount();
        Actions.popTo(page);
      } else if (
        response.response.data != undefined &&
        response.response.data.active == false &&
        response.response.data.registrationStatus === 'failed'
      ) {
        clearInterval(this.interval);
        Actions.popTo(page);
        Alert.alert('Sorry', "Can't register your credit card.");
        return;
      }
    }, 1000);
  };

  setSelectedAccount = async () => {
    try {
      const {page} = this.props;
      // if there are only 1 account, then set
      await this.props.dispatch(getAccountPayment());
      const {myCardAccount} = this.props;
      // set selected account for latest added card
      if (page === 'paymentDetail' || page == 'settleOrder') {
        if (!isEmptyArray(myCardAccount)) {
          this.props.dispatch(
            selectedAccount(myCardAccount[myCardAccount.length - 1]),
          );
        }
      }

      // if customer have only 1 card, then set as default
      if (!isEmptyArray(myCardAccount) && myCardAccount.length == 1) {
        await this.props.dispatch(defaultPaymentAccount(myCardAccount[0]));
      }
    } catch (e) {}
  };

  render() {
    const {url, page, data} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => Actions.pop()}
          style={{
            position: 'absolute',
            top: 30,
            right: 20,
            zIndex: 100,
            backgroundColor: colorConfig.store.disableButtonError,
            width: 40,
            height: 40,
            borderRadius: 50,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 25,
              color: 'white',
              fontFamily: 'Lato-Bold',
            }}>
            x
          </Text>
        </TouchableOpacity>
        <WebView
          source={{uri: url}}
          style={{marginTop: 10}}
          // onNavigationStateChange={async navState => {
          //   let url = navState.url;
          //   if (url.includes(SUCCESS_URL) && openOne) {
          //     // if page come from payment, then return back with selected account that has been created
          //     // if (page == 'paymentDetail' || page == 'settleOrder') {
          //     //   await this.setSelectedAccount();
          //     // }
          //     await this.setSelectedAccount();
          //     Actions.popTo(page);
          //     // openOne = false;
          //   } else if (url.includes(FAILED_URL) && openOne) {
          //     Actions.popTo(page);
          //     Alert.alert('Sorry', "Can't register your credit card.");
          //     // openOne = false;
          //   }
          // }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
});

mapStateToProps = state => ({
  myCardAccount: state.cardReducer.myCardAccount.card,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HostedPayment);
