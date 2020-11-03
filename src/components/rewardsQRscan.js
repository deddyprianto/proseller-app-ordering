import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../config/colorConfig';
import {
  sendPayment,
  campaign,
  dataPoint,
  vouchers,
} from '../actions/rewards.action';
import {myVoucers, paymentRefNo} from '../actions/account.action';
import {Dialog} from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import {getPaymentData} from '../actions/payment.actions';
import {isEmptyArray} from '../helper/CheckEmpty';

class RewardsQRscan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      loadingDialog: false,
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(myVoucers());

    // CHECK IF PAGE IS FROM DEEP LINKING
    try {
      if (this.props.paymentRefNo != undefined) {
        await this.setState({loadingDialog: true});
        this.props.dispatch(vouchers());
        const data = {
          id: this.props.paymentRefNo,
        };
        const e = {};
        e.data = JSON.stringify(data);
        this.onSuccess(e);
        this.props.dispatch(paymentRefNo(undefined));
      }
    } catch (e) {}

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = () => {
    Actions.pop();
  };

  onSuccess = async e => {
    try {
      let resultScan = JSON.parse(e.data);
      await this.setState({loadingDialog: true});
      const response = await this.props.dispatch(getPaymentData(resultScan.id));

      if (response.success == false) {
        this.setState({
          showAlert: true,
          pesanAlert: response.message,
          titleAlert: 'Opps...',
          loadingDialog: false,
        });
      } else {
        let paymentData = response.responseBody.Data;
        paymentData.payment = response.responseBody.Data.totalNettAmount;
        paymentData.storeId = response.responseBody.Data.outletId;

        if (!isEmptyArray(response.responseBody.Data.payments)) {
          const result = response.responseBody.Data.payments.find(
            item => item.isPoint == true,
          );
          if (result != undefined) {
            paymentData.moneyPoint = result.paymentAmount;
            paymentData.addPoint = result.redeemValue;
          }
        }

        Actions.replace('paymentDetail', {pembayaran: paymentData});
      }
    } catch (e) {
      await this.setState({loadingDialog: false});
      this.setState({
        showAlert: true,
        pesanAlert: 'Please try again',
        titleAlert: 'Opps...',
      });
    }
    await this.setState({loadingDialog: false});
  };

  sendPayment = async pembayaran => {
    const response = await this.props.dispatch(sendPayment(pembayaran));
    if (response.statusCode != 400) {
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      this.setState({
        showAlert: true,
        pesanAlert: response.message + ' point',
        titleAlert: 'Payment Success!',
      });
    } else {
      this.setState({
        showAlert: true,
        pesanAlert: response.message,
        titleAlert: 'Payment Error!',
      });
    }
  };

  paymentDetail = pembayaran => {
    Actions.paymentDetail({pembayaran: pembayaran});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  renderDialogLoading = () => {
    return (
      <Dialog
        dismissable={false}
        visible={this.state.loadingDialog}
        onDismiss={() => {
          this.setState({loadingDialog: false});
        }}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              fontSize: 20,
              color: colorConfig.store.defaultColor,
            }}>
            Please wait
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <ActivityIndicator
              size={50}
              color={colorConfig.store.secondaryColor}
            />
            <Text
              style={{
                marginTop: 20,
                textAlign: 'center',
                fontFamily: 'Lato-Medium',
                fontSize: 15,
                color: colorConfig.store.defaultColor,
              }}>
              We're getting your payment
            </Text>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View style={styles.card}>
          <View style={{marginTop: 60}}>
            {this.props.paymentRefNo != undefined ? null : (
              <QRCodeScanner
                markerStyle={{
                  borderColor: 'white',
                  borderRadius: 10,
                  borderStyle: 'dashed',
                  width: Dimensions.get('window').width - 50,
                  height: Dimensions.get('window').width - 50,
                }}
                showMarker={true}
                onRead={this.onSuccess}
              />
            )}
          </View>
        </View>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.pesanAlert}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={
            this.state.titleAlert == 'Payment Success!' ? 'Oke' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.state.titleAlert == 'Payment Success!'
              ? Actions.pop()
              : this.hideAlert();
            if (this.state.titleAlert == 'Opps...') {
              this.hideAlert();
              this.goBack();
            }
          }}
        />
        {this.renderDialogLoading()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    flex: 1,
    // backgroundColor: colorConfig.pageIndex.activeTintColor
  },
});

mapStateToProps = state => ({
  paymentRefNo: state.accountsReducer.paymentRefNo.paymentRefNo,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(RewardsQRscan);
