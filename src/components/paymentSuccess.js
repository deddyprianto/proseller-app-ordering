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
  BackHandler,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import LottieView from 'lottie-react-native';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import CurrencyFormatter from '../helper/CurrencyFormatter';

export default class PaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      showAlert: false,
      pesanAlert: this.props.dataRespons.message,
      titleAlert: `${this.props.intlData.messages.thankYou} !`,
      showDetail: false,
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
    // Actions.pageIndex();
    Actions.reset('pageIndex');
  };

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

  formatCurrency = value => {
    try {
      return CurrencyFormatter(value).match(/[a-z]+|[^a-z]+/gi)[1];
    } catch (e) {
      return value;
    }
  };

  renderPaymentDetails = () => {
    const {intlData} = this.props;
    return (
      <View style={styles.card}>
        <View
          style={{
            position: 'absolute',
            height: 70,
            width: 70,
            borderColor: 'white',
            borderWidth: 5,
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
            style={{
              color: colorConfig.pageIndex.backgroundColor,
            }}
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
            {intlData.messages.youPaid}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              left: -10,
              marginTop: 10,
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
                fontSize: 35,
                fontWeight: 'bold',
              }}>
              {this.formatCurrency(this.props.dataRespons.price)}
            </Text>
          </View>
          {/*{this.props.dataRespons.earnedPoint > 0 ? (*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      color: colorConfig.pageIndex.activeTintColor,*/}
          {/*      fontSize: 12,*/}
          {/*    }}>*/}
          {/*    {'+' +*/}
          {/*      this.props.dataRespons.earnedPoint +*/}
          {/*      ` ${intlData.messages.point}`}*/}
          {/*  </Text>*/}
          {/*) : null}*/}
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
              marginVertical: 10,
              color: colorConfig.pageIndex.activeTintColor,
            }}>
            {this.props.dataRespons.message}
          </Text>
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
              {appConfig.appName.toUpperCase()}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colorConfig.pageIndex.grayColor,
              }}>
              {this.props.dataRespons.outletName}
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
              {intlData.messages.dateAndTime}
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
              {intlData.messages.paymentType}
            </Text>
            <Text
              style={{
                color: colorConfig.pageIndex.grayColor,
              }}>
              {this.props.dataRespons.paymentType}
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
                height: 45,
                width: 150,
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
                {intlData.messages.ok}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  renderAnimateSuccess = () => {
    try {
      return (
        <LottieView
          speed={0.8}
          source={require('../assets/animate/1708-success')}
          autoPlay
          loop={false}
        />
      );
    } catch (e) {
      return null;
    }
  };

  render() {
    const {showDetail} = this.state;
    setTimeout(() => {
      this.setState({showDetail: true});
    }, 2000);
    return (
      <View style={styles.container}>
        {showDetail ? this.renderPaymentDetails() : this.renderAnimateSuccess()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colorConfig.store.darkColor,
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
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
});
