import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../config/colorConfig';
import {sendPayment, campaign, dataPoint} from '../actions/rewards.action';
import {myVoucers} from '../actions/account.action';

class RewardsQRscan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(myVoucers());
  };

  goBack() {
    Actions.pop();
  }

  onSuccess = e => {
    try {
      const scan = JSON.parse(e.data);
      console.log('scan ', scan);
      if (
        scan.price == undefined ||
        scan.dataPay == undefined ||
        scan.referenceNo == undefined
      ) {
        this.setState({
          showAlert: true,
          pesanAlert: 'Looks like you scan wrong Qr Code.',
          titleAlert: 'Opps...',
        });
      } else {
        var pembayaran = {
          payment: scan.price,
          storeName: scan.outletName,
          dataPay: scan.dataPay,
          storeId: scan.outletId,
          referenceNo: scan.referenceNo,
          paymentType: scan.paymentType,
        };
        // console.log('hasil pembayaran', pembayaran);
        // this.sendPayment(pembayaran);
        // this.paymentDetail(pembayaran);
        Actions.paymentDetail({pembayaran: pembayaran});
      }
    } catch (e) {
      this.setState({
        showAlert: true,
        pesanAlert: 'Please try again',
        titleAlert: 'Opps...',
      });
    }
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

  render() {
    return (
      <View style={styles.container}>
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
      </View>
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

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(RewardsQRscan);
