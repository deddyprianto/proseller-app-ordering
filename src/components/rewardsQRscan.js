import React, { Component } from 'react';
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
import {connect} from "react-redux";
import {compose} from "redux";
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from "../config/colorConfig";
import appConfig from '../config/appConfig';
import {notifikasi} from "../actions/auth.actions";
import {sendPayment, campaign, dataPoint} from "../actions/rewards.action";

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

  goBack(){
    Actions.pop()
  }

  onSuccess = (e) => {
    const scan = JSON.parse(e.data);
    var pembayaran = {
      'payment': scan.payment,
      'storeName': scan.storeName,
      'paymentType': scan.paymentType
    } 
    console.log(pembayaran);
    this.sendPayment(pembayaran);
  }

  sendPayment = async(pembayaran) => {
    const response =  await this.props.dispatch(sendPayment(pembayaran));
    if(response.statusCode != 400) {
      await this.props.dispatch(campaign());
      await this.props.dispatch(dataPoint());
      this.setState({
        showAlert: true,
        pesanAlert: response.message+' point',
        titleAlert: 'Payment Success!'
      });
    } else {
      this.setState({
        showAlert: true,
        pesanAlert: response.message,
        titleAlert: 'Payment Error!'
      });
    }
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack}
          onPress={this.goBack}>
            <Icon size={28} name={ Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back' } style={styles.btnBackIcon} />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line}/>
        </View>
        <View style={styles.card}>
          <View style={{marginTop:60}}>
            <QRCodeScanner
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
          confirmText={(this.state.titleAlert == 'Payment Success!') ? 'Oke' : 'Close'}
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            (this.state.titleAlert == 'Payment Success!') ? Actions.pop() : this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor, 
    margin:10
  },
  btnBack: {
    flexDirection:'row', 
    alignItems:'center'
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor, 
    fontWeight: 'bold'
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor, 
    borderBottomWidth:2
  },
  card: {
    flex:1,
    // backgroundColor: colorConfig.pageIndex.activeTintColor
  },
});

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(null, mapDispatchToProps),
)(RewardsQRscan);
