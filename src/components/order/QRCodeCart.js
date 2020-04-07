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
import appConfig from '../../config/appConfig';
import QRCode from 'react-native-qrcode-svg';

class WaitingFood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      dataBasket: this.props.dataBasket
    };
  }

  componentDidMount = async () => {
    try {
      // get data basket
      await this.getBasket();
      await this.setState({loading: false});

      // check if status basket for TAKE AWAY IS CONFIRMED, then request continoustly to get basket
      if (this.props.dataBasket != undefined) {
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

  renderTextWaiting = () => {
    const {intlData} = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          marginVertical: 30,
        }}>
        <Text
          style={{
            fontSize: 23,
            color: colorConfig.store.defaultColor,
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
            textAlign: 'center',
          }}>
          Show QRCode to the cashier.
        </Text>
      </View>
    );
  };

  render() {
    const {intlData, dataBasket} = this.props;
    try {
      if (dataBasket == undefined) {
        clearInterval(this.interval);
        this.interval = undefined;
        Actions.reset('pageIndex');
      }
    } catch (e) {}

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
            <Text style={styles.btnBackText}>Cart QRCode</Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        {this.renderTextWaiting()}
        <View style={styles.card}>
          <QRCode
            value={JSON.stringify({
              cartID: this.state.dataBasket.id,
            })}
            logo={appConfig.appLogoQR}
            logoSize={this.state.screenWidth / 6 - 20}
            size={this.state.screenWidth - 60}
          />
        </View>
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
