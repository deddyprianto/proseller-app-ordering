/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

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
import AwesomeAlert from 'react-native-awesome-alerts';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';

export default class PaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: true,
      pesanAlert: this.props.dataRespons.message,
      titleAlert: 'Thank You !',
    };
  }

  goBack() {
    Actions.pageIndex();
  }

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear() +
      ' • ' +
      tanggal.getHours() +
      ':' +
      tanggal.getMinutes()
    );
  }

  getMonth(value) {
    var mount = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return mount[value];
  }

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View
            style={{
              position: 'absolute',
              height: 60,
              width: 60,
              borderColor: colorConfig.store.colorSuccess,
              borderWidth: 1,
              borderRadius: 60,
              top: -30,
              left: this.state.screenWidth / 2 - 60,
              backgroundColor: colorConfig.store.colorSuccess,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              size={40}
              name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
              style={{color: colorConfig.pageIndex.backgroundColor}}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              marginTop: 40,
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.activeTintColor,
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              You've Paid
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                left: -10,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  fontSize: 10,
                  marginRight: 5,
                }}>
                {appConfig.appMataUang}
              </Text>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  fontSize: 30,
                  fontWeight: 'bold',
                }}>
                {this.props.dataRespons.price}
              </Text>
            </View>
            {this.props.dataRespons.earnedPoint > 0 ? (
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 12,
                }}>
                {'+' + this.props.dataRespons.earnedPoint + ' Points'}
              </Text>
            ) : null}
          </View>
          <View
            style={{
              backgroundColor: colorConfig.pageIndex.grayColor,
              height: 1,
            }}
          />
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                borderColor: colorConfig.pageIndex.activeTintColor,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                paddingTop: 3,
              }}>
              <Icon
                size={20}
                name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
                style={{color: colorConfig.pageIndex.activeTintColor}}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: colorConfig.pageIndex.activeTintColor,
                }}>
                {appConfig.appName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {this.props.dataRespons.storeName}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: colorConfig.pageIndex.activeTintColor,
              height: 1,
            }}
          />
          <View
            style={{
              padding: 10,
              backgroundColor: '#F0F0F0',
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                }}>
                Date & Time
              </Text>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {this.getDate(this.props.dataRespons.createdAt)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                }}>
                Paid by
              </Text>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                }}>
                Pay
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colorConfig.pageIndex.grayColor,
                height: 1,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  height: 35,
                  width: 100,
                  borderColor: colorConfig.pageIndex.activeTintColor,
                  borderWidth: 1,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colorConfig.pageIndex.activeTintColor,
                  borderRadius: 10,
                }}
                onPress={this.goBack}>
                <Text
                  style={{
                    color: colorConfig.pageIndex.backgroundColor,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Ok
                </Text>
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
          confirmText="Close"
          titleStyle={{
            fontSize: 25,
            color: colorConfig.store.defaultColor,
            fontWeight: 'bold',
          }}
          messageStyle={{fontSize: 16, textAlign: 'center'}}
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    marginTop: 50,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
});
