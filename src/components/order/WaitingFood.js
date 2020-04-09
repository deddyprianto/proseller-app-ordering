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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getBasket} from '../../actions/order.action';
import LottieView from 'lottie-react-native';

class WaitingFood extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    try {
      // get data basket
      await this.getBasket();
      await this.setState({loading: false});

      // check if status basket for TAKE AWAY IS CONFIRMED, then request continoustly to get basket
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.status == 'PROCESSING'
      ) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getBasket());
        }, 2000);
      }
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
    await await this.props.dispatch(getBasket());
    await this.setState({refreshing: false});
  };

  getBasket = async () => {
    this.setState({loading: true});
    await this.props.dispatch(getBasket());
    // await this.setState({loading: false});
    // setTimeout(() => {
    //   this.setState({loading: false});
    // }, 10);
  };

  componentWillUnmount() {
    this.backHandler.remove();
    clearInterval(this.interval);
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  renderBottomButton = () => {
    const {intlData, dataBasket} = this.props;
    // if basket is canceled by admin, then give template status
    if (dataBasket == undefined) {
      dataBasket.status == 'READY_FOR_COLLECTION';
    }
    return (
      <View
        style={{
          width: '100%',
          paddingBottom: 20,
          backgroundColor: 'white',
          shadowColor: '#00000021',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.9,
          shadowRadius: 16,
          elevation: 10,
          // padding: 10,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => Actions.basket()}
            style={styles.btnCancelBasketModal}>
            <Icon
              size={21}
              name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>View Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Actions.replace('QRCodeCart')}
            disabled={
              dataBasket.status == 'READY_FOR_COLLECTION' ? false : true
            }
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor:
                  dataBasket.status == 'READY_FOR_COLLECTION'
                    ? colorConfig.store.defaultColor
                    : colorConfig.store.disableButton,
              },
            ]}>
            <Icon
              size={21}
              name={Platform.OS === 'ios' ? 'ios-qr-scanner' : 'md-qr-scanner'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>Show QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTextWaiting = () => {
    const {intlData, dataBasket} = this.props;
    // if basket is canceled by admin, then give template status
    if (dataBasket == undefined) {
      dataBasket.status == 'READY_FOR_COLLECTION';
    }
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          marginVertical: 30,
        }}>
        {dataBasket.status == 'READY_FOR_COLLECTION' ? (
          <Text
            style={{
              fontSize: 23,
              color: colorConfig.store.defaultColor,
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
              textAlign: 'center',
            }}>
            Yeay, your order is ready. {'\n'} {'\n'}
            <Text style={{color: colorConfig.pageIndex.grayColor}}>
              Please come to the cashier and tap the QR Code button below.
            </Text>
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 25,
              color: colorConfig.pageIndex.inactiveTintColor,
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
            }}>
            Please wait, We are preparing your food in the kitchen.
          </Text>
        )}
      </View>
    );
  };

  render() {
    const {intlData, dataBasket, orderType} = this.props;
    try {
      if (
        dataBasket.status == 'READY_FOR_COLLECTION' &&
        this.interval != undefined &&
        (dataBasket.outlet.outletType == 'QUICKSERVICE' ||
          orderType == 'TAKEAWAY')
      ) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
    } catch (e) {
      clearInterval(this.interval);
      this.interval = undefined;
    }

    // if basket is canceled by admin, then push back to basket page
    if (dataBasket == undefined) {
      Actions.replace('basket');
    }

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}>Waiting Order</Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <View style={{height: '40%'}}>
          {dataBasket != undefined ? (
            <LottieView
              speed={1}
              source={
                dataBasket.status == 'READY_FOR_COLLECTION'
                  ? require('../../assets/animate/food-ready')
                  : require('../../assets/animate/cooking')
              }
              autoPlay
              loop={true}
            />
          ) : null}
        </View>
        {dataBasket != undefined ? this.renderTextWaiting() : null}

        {dataBasket != undefined ? this.renderBottomButton() : null}
      </View>
    );
  }
}

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
  orderType: state.orderReducer.orderType.orderType,
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
    marginVertical: 10,
    borderColor: colorConfig.pageIndex.inactiveTintColor,
    borderWidth: 1,
    borderRadius: 5,
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
    fontFamily: 'Lato-Bold',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subTitle: {
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.title,
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    marginVertical: 10,
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Medium',
  },
  descModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    fontSize: 11,
    fontStyle: 'italic',
    marginLeft: 10,
    fontFamily: 'Lato-Medium',
  },
  descPrice: {
    color: colorConfig.store.title,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 13,
    fontFamily: 'Lato-Medium',
  },
  descPriceModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 10,
    fontFamily: 'Lato-Medium',
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
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
