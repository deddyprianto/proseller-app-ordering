/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  BackHandler,
  Vibration,
  SafeAreaView,
  ActivityIndicator,
  Button,
  TextInput,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {RNCamera} from 'react-native-camera';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../config/colorConfig';
import {Dialog} from 'react-native-paper';
import {getProductByBarcode} from '../actions/order.action';

class ScanBarcode extends Component {
  constructor(props) {
    super(props);

    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
      loadingDialog: false,
      enterBarcode: false,
      // camera: {
      //   type: RNCamera.Constants.Type.back,
      //   flashMode: RNCamera.Constants.FlashMode.off,
      // },
      flashStatus: false,
      barcode: '',
      hasPermission: null,
    };
  }

  componentDidMount = async () => {
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    if (status === 'granted') {
      await this.setState({hasPermission: true});
    }
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
              fontFamily: 'Poppins-Medium',
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
                marginTop: 10,
                textAlign: 'center',
                fontFamily: 'Poppins-Italic',
                fontSize: 11,
                color: colorConfig.store.titleSelected,
              }}>
              Barcode : {this.state.barcode}
            </Text>
            <Text
              style={{
                marginTop: 20,
                textAlign: 'center',
                fontFamily: 'Poppins-Regular',
                fontSize: 15,
                color: colorConfig.store.defaultColor,
              }}>
              Finding items...
            </Text>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  enterManualBarcode = () => {
    return (
      <Dialog
        dismissable={false}
        visible={this.state.enterBarcode}
        onDismiss={() => {
          this.setState({enterBarcode: false});
        }}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-Medium',
              fontSize: 20,
              color: colorConfig.store.defaultColor,
            }}>
            Enter Product Barcode
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <TextInput
              placeholder={'Product Barcode...'}
              autoFocus={true}
              value={this.state.barcode}
              onChangeText={value => {
                this.setState({barcode: value});
              }}
              style={{
                backgroundColor: '#f2f2f2',
                borderRadius: 7,
                padding: 10,
                width: '100%',
                fontSize: 14,
                color: colorConfig.store.title,
                fontFamily: 'Poppins-Medium',
              }}
            />
            <View
              style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colorConfig.store.defaultColor,
                  padding: 8,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '40%',
                  marginRight: '10%',
                }}
                onPress={() => this.onBarCodeRead({data: this.state.barcode})}>
                <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
                  Submit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colorConfig.store.colorError,
                  borderRadius: 5,
                  padding: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '40%',
                }}
                onPress={() => this.setState({enterBarcode: false})}>
                <Text style={{color: 'white', fontFamily: 'Poppins-Medium'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  onBarCodeRead = async data => {
    // console.log(type, 'type');
    if (data) {
      let scanResult = {
        data: data,
      };
      this.setState({enterBarcode: false});
      if (!this.barcodeCodes.includes(scanResult.data)) {
        await this.setState({loadingDialog: true});
        Vibration.vibrate();
        console.log(scanResult.data);
        this.barcodeCodes.push(scanResult.data);
        await this.setState({barcode: scanResult.data});

        const response = await this.props.dispatch(
          getProductByBarcode(scanResult.data),
        );
        await this.setState({loadingDialog: false});
        if (response === false) {
          Alert.alert('Sorry', 'Product not found');
          Actions.pop();
          return;
        }

        Actions.pop();
        let product = {
          product: response.data,
          productID: `product::${response.data.id}`,
        };
        await setTimeout(() => {
          this.props.setProductFromBarcode(product);
        }, 10);
      }
    }
    return true;
  };

  // toggleFlash = () => {
  //   const {flashStatus} = this.state;
  //   let statusFlashMode = RNCamera.Constants.FlashMode.torch;
  //   if (flashStatus) {
  //     statusFlashMode = RNCamera.Constants.FlashMode.off;
  //   }
  //   this.setState({
  //     camera: {
  //       type: RNCamera.Constants.Type.back,
  //       flashMode: statusFlashMode,
  //     },
  //     flashStatus: !flashStatus,
  //   });
  // };

  render() {
    const {flashStatus, hasPermission, enterBarcode} = this.state;

    return (
      <SafeAreaView
        style={[
          styles.container,
          enterBarcode ? {backgroundColor: 'white'} : null,
        ]}>
        <View
          style={[
            styles.container,
            enterBarcode ? {backgroundColor: 'white'} : null,
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={32}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
          </TouchableOpacity>
          {!enterBarcode ? (
            <>
              <View style={[styles.overlay, styles.topOverlay]}>
                <Text style={styles.scanScreenMessage}>
                  Please point your camera at the product barcode.
                </Text>
              </View>
              <View style={styles.cameraWindow}>
                <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  style={styles.preview}
                  type={RNCamera.Constants.Type.back}
                  flashMode={RNCamera.Constants.FlashMode.on}
                  androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                  androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                  onBarCodeRead={barcodes => {
                    // console.log(barcodes);
                    if (barcodes && barcodes.data) {
                      this.onBarCodeRead(barcodes.data);
                    }
                  }}
                />
              </View>
              <View style={[styles.overlay, styles.bottomOverlay]}>
                <Button
                  onPress={() => {
                    this.setState({enterBarcode: true});
                    this.barcodeCodes = [];
                  }}
                  style={styles.enterBarcodeManualButton}
                  title="Enter Barcode Manually"
                />
              </View>
            </>
          ) : (
            <View style={{height: '100%'}} />
          )}
        </View>
        {this.renderDialogLoading()}
        {this.enterManualBarcode()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
  },
  btnBackIcon: {
    color: 'white',
  },
  overlay: {
    // position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins-Bold',
  },
  cameraWindow: {
    flex: 1,
  },
});

mapStateToProps = state => ({});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(ScanBarcode);
