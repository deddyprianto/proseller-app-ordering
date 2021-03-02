import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import colorConfig from '../../config/colorConfig';

class ConfirmTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: '',
      titleAlert: '',
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    Actions.popTo('basket');
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  confirmOrder = () => {
    Alert.alert('Yeay', 'Order confirmed');
  };

  cancelOrder = () => {
    Actions.popTo('basket');
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
          <View style={{marginTop: 50, marginHorizontal: '7%'}}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                // left: -10,
                marginBottom: 50,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.inactiveTintColor,
                  fontSize: 40,
                  left: -100,
                  marginBottom: -30,
                  textAlign: 'center',
                  marginRight: 5,
                  // padding: 100,
                }}>
                Table
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  // marginTop: 20,
                  color: colorConfig.pageIndex.inactiveTintColor,
                  fontSize: 160,
                  fontWeight: 'bold',
                }}>
                {this.props.scan.tableNo}
              </Text>
            </View>

            <View
              style={{
                marginTop: 50,
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              <TouchableOpacity
                onPress={this.confirmOrder}
                style={styles.btnSuccess}>
                <Text style={styles.textButton}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.cancelOrder}
                style={styles.btnErrror}>
                <Text style={styles.textButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
  btnSuccess: {
    backgroundColor: colorConfig.store.colorSuccess,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    marginHorizontal: 5,
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
  btnErrror: {
    backgroundColor: colorConfig.store.colorError,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    marginHorizontal: 5,
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
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
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
)(ConfirmTable);
