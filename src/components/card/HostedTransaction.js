import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {Alert, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {checkStatusPayment} from '../../actions/payment.actions';
import {compose} from 'redux';
import {connect} from 'react-redux';

class HostedTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };
  }

  componentDidMount(): void {
    this.checkStatus();
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
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
        Actions.replace('paymentSuccess', {
          intlData,
          dataRespons: response.responseBody.Data,
        });
      } else if (response.responseBody.Data.status === 'FAILED') {
        clearInterval(this.interval);
        Actions.popTo(page);
        Alert.alert('Sorry', 'Payment Failed.');
      }
    }, 1500);
  };

  render() {
    const {url, page, referenceNo} = this.props;
    return (
      <>
        <WebView source={{uri: url}} style={{marginTop: 10}} />
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
