/* eslint-disable react/jsx-no-duplicate-props */
import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {checkStatusPayment} from '../../actions/payment.actions';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getBasket, getCart, getPendingCart} from '../../actions/order.action';
import {myVoucers} from '../../actions/account.action';
import LoaderWithoutIcon from '../LoaderWithoutIcon';
import {getSVCBalance} from '../../actions/SVC.action';

const CYBERSOURCE_URL = '/receipt';
const SUCCESS_URL = `/success`;
const FAILED_URL = `/failed`;

class HostedTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
      openLoader: false,
      isFetching: false,
    };
  }

  componentDidMount = async () => {};

  componentWillUnmount() {
    try {
      this.props.dispatch(getBasket());
      if (this.props.isSubmitSales) {
        this.props.dispatch(checkStatusPayment(this.props.referenceNo));
      }
      this.props.dispatch(getSVCBalance());
      try {
        this.props.getCustomerActivity();
      } catch (e) {}
      clearInterval(this.interval);
    } catch (e) {}
  }

  checkStatus = async () => {
    const {url, page, referenceNo, intlData} = this.props;
    await this.setState({isFetching: true});
    const response = await this.props.dispatch(getBasket());
    console.log('fetching data sales');
    if (
      response.response.data.confirmationInfo != undefined &&
      response.response.data.isPaymentComplete == true
    ) {
      clearInterval(this.interval);
      this.props.dispatch(getBasket());
      if (this.props.page === 'settleOrder') {
        // this.props.dispatch(getCart(this.props.cartID));
        Actions.replace('paymentSuccess', {
          outlet: this.props.outlet,
          intlData,
          url: this.props.urlSettle,
          dataRespons: response.response.data.confirmationInfo,
        });
        return;
      } else {
        Actions.replace('paymentSuccess', {
          outlet: this.props.outlet,
          intlData,
          dataRespons: response.responseBody.Data,
        });
        return;
      }
    } else if (response.response.data.status === 'PENDING') {
      clearInterval(this.interval);
      this.props.dispatch(getBasket());
      this.props.dispatch(myVoucers());
      Actions.popTo(page);
      // Alert.alert('Sorry', 'Payment Failed.');
      return false;
    }
    await this.setState({isFetching: false});
  };

  checkStatusSales = async () => {
    const {url, page, referenceNo, intlData} = this.props;
    await this.setState({isFetching: true});
    const response = await this.props.dispatch(checkStatusPayment(referenceNo));
    console.log('fetching data sales', response);
    if (response.Data.status === 'COMPLETED') {
      this.props.dispatch(myVoucers());
      if (this.props.page === 'settleOrder') {
        // this.props.dispatch(getCart(this.props.cartID));
        Actions.replace('paymentSuccess', {
          outlet: this.props.outlet,
          intlData,
          url: this.props.urlSettle,
          dataRespons: response.Data,
          fromPage: this.props.fromPage,
          payVoucher: this.props.payVoucher,
          paySVC: this.props.paySVC,
        });
        return;
      } else {
        Actions.replace('paymentSuccess', {
          outlet: this.props.outlet,
          intlData,
          dataRespons: response.Data,
          fromPage: this.props.fromPage,
          payVoucher: this.props.payVoucher,
        });
        return;
      }
    }
    await this.setState({isFetching: false});
  };

  getCartStatus = () => {
    try {
      this.props.dispatch(getBasket());
      if (this.props.isSubmitSales) {
        this.props.dispatch(checkStatusPayment(this.props.referenceNo));
      }
      Actions.pop();
    } catch (e) {}
  };

  alertClose = () => {
    Alert.alert(
      'Payment',
      'Are you sure you want to close this?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.getCartStatus()},
      ],
      {cancelable: false},
    );
  };

  render() {
    const {url, page, referenceNo} = this.props;
    const {openLoader, isFetching} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {openLoader && <LoaderWithoutIcon />}
        {!openLoader ? (
          <TouchableOpacity
            onPress={this.alertClose}
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
                fontFamily: 'Poppins-Medium',
              }}>
              x
            </Text>
          </TouchableOpacity>
        ) : null}

        <WebView
          onNavigationStateChange={async navState => {
            let url = navState.url;
            if (
              url.includes(CYBERSOURCE_URL) ||
              url.includes(SUCCESS_URL) ||
              url.includes(FAILED_URL)
            ) {
              this.setState({openLoader: true});
            }
          }}
          source={{uri: url}}
        />
        {openLoader ? (
          <View style={{height: 150, backgroundColor: 'white'}} />
        ) : null}
        {this.state.openLoader ? (
          <TouchableOpacity
            disabled={isFetching}
            onPress={() => {
              if (this.props.isSubmitSales) {
                this.checkStatusSales();
              } else {
                this.checkStatus();
              }
            }}
            style={
              isFetching ? styles.btnBottomFixedDisabled : styles.btnBottomFixed
            }>
            <Text style={styles.textAddCard}>
              {isFetching ? 'Loading...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        ) : null}
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
    fontFamily: 'Poppins-Medium',
  },
  btnBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 100,
  },
  btnBottomFixedDisabled: {
    backgroundColor: colorConfig.store.disableButton,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 100,
  },
});

mapStateToProps = state => ({
  myCardAccount: state.cardReducer.myCardAccount.card,
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
)(HostedTransaction);
