import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {checkStatusPayment} from '../../actions/payment.actions';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getBasket, getCart, getPendingCart} from '../../actions/order.action';

class HostedTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }

  componentDidMount = async () => {
    this.checkStatus();
  };

  componentWillUnmount(): void {
    try {
      clearInterval(this.interval);
    } catch (e) {}
  }

  checkStatus = async () => {
    const {url, page, referenceNo, intlData} = this.props;

    clearInterval(this.interval);
    this.interval = setInterval(async () => {
      const response = await this.props.dispatch(
        checkStatusPayment(referenceNo),
      );
      if (response.responseBody.Data.status === 'COMPLETED') {
        clearInterval(this.interval);
        if (this.props.page === 'settleOrder') {
          // this.props.dispatch(getCart(this.props.cartID));
          this.props.dispatch(getBasket());
          Actions.replace('paymentSuccess', {
            intlData,
            url: this.props.urlSettle,
            dataRespons: response.responseBody.Data,
          });
          return;
        } else {
          this.props.dispatch(getBasket());
          Actions.replace('paymentSuccess', {
            intlData,
            dataRespons: response.responseBody.Data,
          });
          return;
        }
      } else if (response.responseBody.Data.status === 'FAILED') {
        clearInterval(this.interval);
        Actions.popTo(page);
        Alert.alert('Sorry', 'Payment Failed.');
        return;
      }
    }, 1500);
  };

  render() {
    const {url, page, referenceNo} = this.props;
    return (
      <>
        <WebView source={{uri: url}} style={{marginTop: 10}} />
        <TouchableOpacity
          onPress={() => Actions.pop()}
          style={{
            backgroundColor: 'white',
            borderTopWidth: 0.5,
            marginTop: 10,
            borderTopColor: colorConfig.pageIndex.grayColor,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 11,
          }}>
          <Text
            style={{
              fontSize: 19,
              color: colorConfig.store.colorError,
              fontFamily: 'Lato-Bold',
            }}>
            Close
          </Text>
        </TouchableOpacity>
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
