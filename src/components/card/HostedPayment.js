import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {Alert, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {
  getAccountPayment,
  selectedAccount,
} from '../../actions/payment.actions';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {compose} from 'redux';
import {connect} from 'react-redux';
import awsConfig from '../../config/awsConfig';
import {defaultPaymentAccount} from '../../actions/user.action';

const URL = awsConfig.base_url_payment;

const SUCCESS_URL = `${URL}account/registration/success`;
const FAILED_URL = `${URL}account/registration/failed`;

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
      // set selected account for latest added card
      if (!isEmptyArray(myCardAccount)) {
        this.props.dispatch(
          selectedAccount(myCardAccount[myCardAccount.length - 1]),
        );
      }

      // if customer have only 1 card, then set as default
      if (!isEmptyArray(myCardAccount) && myCardAccount.length == 1) {
        await this.props.dispatch(defaultPaymentAccount(myCardAccount[0]));
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
            let url = navState.url;
            if (url == SUCCESS_URL && openOne) {
              // if page come from payment, then return back with selected account that has been created
              // if (page == 'paymentDetail' || page == 'settleOrder') {
              //   await this.setSelectedAccount();
              // }
              await this.setSelectedAccount();
              Actions.popTo(page);
              // openOne = false;
            } else if (url == FAILED_URL && openOne) {
              Actions.popTo(page);
              Alert.alert('Sorry', `Can't register your credit card.`);
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
