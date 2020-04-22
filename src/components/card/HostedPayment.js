import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {
  getAccountPayment,
  selectedAccount,
} from '../../actions/payment.actions';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {compose} from 'redux';
import {connect} from 'react-redux';

const DEV = `https://payment.proseller.io`;
const DEMO = `https://payment-demo.proseller.io`;

const SUCCESS_URL = `${DEMO}/api/account/registration/success`;
const FAILED_URL = `${DEMO}/api/account/registration/failed`;

let openOne = true;

class HostedPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }

  setSelectedAccount = async () => {
    try {
      // if there are only 1 account, then set
      await this.props.dispatch(getAccountPayment());
      const {myCardAccount} = this.props;
      if (!isEmptyArray(myCardAccount) && myCardAccount.length == 1) {
        this.props.dispatch(selectedAccount(myCardAccount[0]));
      }
    } catch (e) {}
  };

  render() {
    const {url, page} = this.props;
    return (
      <>
        <WebView
          source={{uri: url}}
          style={{marginTop: 10}}
          onNavigationStateChange={async navState => {
            let url = navState.title;
            if (url == SUCCESS_URL && openOne) {
              // if page come from payment, then return back with selected account that has been created
              if (page == 'paymentDetail' || page == 'settleOrder') {
                await this.setSelectedAccount();
              }
              Actions.popTo(page);
              // openOne = false;
            } else if (url == FAILED_URL && openOne) {
              Actions.popTo(page);
              Alert.alert('Sorry', 'Cant register your account.');
              // openOne = false;
            }
          }}
        />
      </>
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
