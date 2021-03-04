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
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      barcode: '',
    };
  }

  componentDidMount = async () => {};

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
            <View style={{marginTop: 10}}>
              <Button
                title={'Submit'}
                onPress={() => this.onBarCodeRead({data: this.state.barcode})}
              />
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  onBarCodeRead = async scanResult => {
    if (scanResult.data != null) {
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={32}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            defaultTouchToFocus
            flashMode={this.state.camera.flashMode}
            mirrorImage={false}
            onBarCodeRead={e => this.onBarCodeRead(e)}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={
              'We need your permission to use your camera phone to scan the product barcode.'
            }
            style={styles.preview}
            type={this.state.camera.type}
          />
          <View style={[styles.overlay, styles.topOverlay]}>
            <Text style={styles.scanScreenMessage}>
              Please point your camera at the product barcode.
            </Text>
          </View>
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <Button
              onPress={() => {
                this.setState({enterBarcode: true});
              }}
              style={styles.enterBarcodeManualButton}
              title="Enter Barcode Manually"
            />
          </View>
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
    position: 'absolute',
    zIndex: 99,
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
  },
  btnBackIcon: {
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 50,
    flex: 1,
    flexDirection: 'row',
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
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
