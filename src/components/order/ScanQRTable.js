import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import colorConfig from '../../config/colorConfig';
import {setTableType, submitOder} from '../../actions/order.action';

class ScanQRTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      loadingPushData: false,
      responseFailed: null,
    };
  }

  goBack() {
    Actions.pop();
  }

  onSuccess = e => {
    try {
      const scan = JSON.parse(e.data);
      if (!scan.tableNo || !scan.outletId || !scan.tableType) {
        this.setState({
          showAlert: true,
          pesanAlert: 'Looks like you scan wrong Qr Code',
          titleAlert: 'Opps...',
        });
      } else {
        this.pushDataToServer(scan);
      }
      // Actions.confirmTable({scan: scan});
      // Actions.pop();
    } catch (e) {
      this.setState({
        showAlert: true,
        pesanAlert: 'Please try again',
        titleAlert: 'Opps...',
      });
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  pushDataToServer = async data => {
    try {
      await this.setState({loadingPushData: true});
      await this.props.dispatch(setTableType(data));
      let payload = {
        tableNo: data.tableNo,
        // tableNo: '10',
      };
      let results = await this.props.dispatch(submitOder(payload));
      console.log('result ', results);
      if (results.resultCode == 200) {
        // if cart has been submitted, then go back and give info
        if (results.status == 'FAILED') {
          Alert.alert('Info!', results.data.message);
        }
        Actions.pop();
      } else {
        this.setState({
          loadingPushData: false,
          responseFailed: results.data.message,
        });
      }
    } catch (e) {
      Alert.alert('Oppps..', 'Something went wrong, please try again.');
      Actions.pop();
    }
  };

  renderFailedToSubmit = () => {
    if (
      this.state.responseFailed != null &&
      this.state.responseFailed != undefined
    ) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <Text
            style={{
              color: colorConfig.pageIndex.inactiveTintColor,
              fontSize: 27,
              marginTop: 10,
              marginBottom: 0,
              textAlign: 'center',
              marginRight: 5,
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
            }}>
            SORRY..
          </Text>
          <Text
            style={{
              color: colorConfig.pageIndex.inactiveTintColor,
              fontSize: 25,
              marginTop: 10,
              textAlign: 'center',
              marginRight: 5,
              fontFamily: 'Lato-Bold',
            }}>
            {this.state.responseFailed.toUpperCase()}
          </Text>

          <TouchableOpacity
            onPress={() => this.setState({responseFailed: null})}
            style={styles.btnErrror}>
            <Text style={styles.textButton}>Scan Another Table</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
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
            {this.renderFailedToSubmit()}

            {this.state.loadingPushData ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}>
                <ActivityIndicator
                  size={'large'}
                  color={colorConfig.store.defaultColor}
                />
                <Text
                  style={{
                    color: colorConfig.pageIndex.inactiveTintColor,
                    fontSize: 27,
                    marginTop: 10,
                    marginBottom: 0,
                    textAlign: 'center',
                    marginRight: 5,
                    fontWeight: 'bold',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Please wait
                </Text>
                <Text
                  style={{
                    color: colorConfig.pageIndex.inactiveTintColor,
                    fontSize: 23,
                    marginTop: 10,
                    textAlign: 'center',
                    marginRight: 5,
                    fontWeight: 'bold',
                    fontFamily: 'Lato-Bold',
                  }}>
                  We are submit your order.
                </Text>
              </View>
            ) : this.state.responseFailed != undefined &&
              this.state.responseFailed != null ? null : (
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
            if (this.state.titleAlert == 'Opps!') {
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
  btnErrror: {
    backgroundColor: colorConfig.store.secondaryColor,
    padding: 13,
    marginTop: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '50%',
    justifyContent: 'center',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  textButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
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
)(ScanQRTable);
