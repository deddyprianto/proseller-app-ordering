import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  getBasket,
  getCart,
  getHistoryBasket,
  getPendingCart,
} from '../../actions/order.action';
import appConfig from '../../config/appConfig';
import QRCode from 'react-native-qrcode-svg';

class WaitingFood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      dataBasket: this.props.myCart,
    };
  }

  componentDidMount = async () => {
    try {
      // get data basket
      await this.getBasket();
      await this.setState({loading: false});

      // check if status basket for TAKE AWAY IS CONFIRMED, then request continoustly to get basket
      // if (this.props.dataBasket != undefined) {
      //   clearInterval(this.interval);
      //   this.interval = setInterval(() => {
      //     this.props.dispatch(getCart(this.props.myCart.id));
      //   }, 60000);
      // }
    } catch (e) {
      Alert.alert('Opss..', "Can't get data basket, please try again.");
    }

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    this.props.dispatch(getCart(this.props.myCart.id));
    await this.setState({refreshing: false});
  };

  getBasket = async () => {
    this.setState({loading: true});
    this.props.dispatch(getCart(this.props.myCart.id));
  };

  componentWillUnmount() {
    this.backHandler.remove();
    // clearInterval(this.interval);
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  getInfoCart = () => {
    let {intlData, dataBasket} = this.props;
    if (dataBasket == undefined) {
      dataBasket = {};
      dataBasket.outlet = {};
    }

    if (dataBasket.orderingMode == 'DELIVERY') {
      let trackingNo = '';
      if (dataBasket.trackingNo != undefined) {
        trackingNo = `\n\nTracking No: ${dataBasket.trackingNo}`;
      }
      return `Queue No: ${dataBasket.queueNo} ${trackingNo}`;
    } else {
      if (dataBasket.queueNo != undefined) {
        return `Queue No: ${dataBasket.queueNo}`;
      } else {
        return `Table No: ${dataBasket.tableNo}`;
      }
    }
  };

  renderTextWaiting = () => {
    const {intlData, dataBasket} = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          marginVertical: 27,
        }}>
        <Text
          style={{
            fontSize: 23,
            color: colorConfig.store.title,
            fontWeight: 'bold',
            fontFamily: 'Poppins-Medium',
            textAlign: 'center',
          }}>
          Show QRCode to the cashier.
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: colorConfig.store.defaultColor,
            fontWeight: 'bold',
            fontFamily: 'Poppins-Medium',
            textAlign: 'center',
          }}>
          {this.getInfoCart()}
        </Text>
      </View>
    );
  };

  close = async () => {
    try {
      this.props.dispatch(getCart(this.props.myCart.id));
      this.props.dispatch(getPendingCart());
      Actions.pop();
    } catch (e) {}
  };

  render() {
    const {intlData, dataBasket} = this.props;
    try {
      // if (dataBasket == undefined) {
      //   Actions.pop();
      // }
    } catch (e) {}

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            backgroundColor: colorConfig.pageIndex.backgroundColor,
            marginBottom: 10,
            paddingVertical: 3,
            shadowColor: '#00000021',
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 12,
          }}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}>Cart QRCode</Text>
          </TouchableOpacity>
        </View>

        {this.renderTextWaiting()}
        <View style={styles.card}>
          <QRCode
            value={JSON.stringify({
              cartID: this.state.dataBasket.id,
            })}
            logo={appConfig.logoMerchant}
            logoSize={this.state.screenWidth / 6 - 45}
            size={this.state.screenWidth - 230}
          />
        </View>

        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 60,
          }}>
          <TouchableOpacity
            onPress={this.close}
            style={styles.buttonBottomFixed}>
            <Text style={styles.textAddCard}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataCartSingle.cartSingle,
  orderType: state.userReducer.orderType.orderType,
  tableType: state.orderReducer.tableType.tableType,
  products: state.orderReducer.productsOutlet.products,
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
)(WaitingFood);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.secondaryColor,
    padding: 13,
    width: '80%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  containerBody: {
    marginHorizontal: 5,
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
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
    alignItems: 'center',
  },
  item: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    margin: 5,
    padding: 5,
    width: '100%',
    maxWidth: '100%',
  },
  itemSummary: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    // margin: 5,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subTitle: {
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.title,
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    marginVertical: 10,
    fontFamily: 'Poppins-Medium',
    color: colorConfig.pageIndex.grayColor,
    fontSize: 14,
    padding: 3,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.store.title,
    maxWidth: Dimensions.get('window').width,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  descModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    fontSize: 11,
    fontStyle: 'italic',
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  descPrice: {
    color: colorConfig.store.title,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  descPriceModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    flex: 1,
  },
  imageStamp: {
    width: '100%',
    height: 130,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  panelAddBasketModal: {
    // position: 'absolute',
    // bottom: 0,
    height: 80,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnAddBasketModal: {
    fontFamily: 'Poppins-Medium',
    borderRadius: 10,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    width: '40%',
    backgroundColor: colorConfig.store.defaultColor,
  },
  btnCancelBasketModal: {
    fontFamily: 'Poppins-Medium',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    marginRight: 20,
    width: '40%',
    backgroundColor: colorConfig.store.colorSuccess,
  },
  textBtnBasketModal: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    textAlign: 'center',
  },
});
