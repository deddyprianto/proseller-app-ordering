import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  FlatList,
  ScrollView,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  updateProductToBasket,
  removeBasket,
  setOrderType,
  clearTableType,
  getCart,
} from '../../actions/order.action';
import Loader from '../../components/loader';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as _ from 'lodash';
import {getOutletById} from '../../actions/stores.action';
import appConfig from '../../config/appConfig';
import {refreshToken} from '../../actions/auth.actions';

class Cart extends Component {
  constructor(props) {
    super(props);

    this.request = null;
    this.RBSheet = null;

    this.state = {
      products: [],
      screenWidth: Dimensions.get('window').width,
      loading: true,
      showBasketButton: true,
      isModalVisible: false,
      qtyItem: 1,
      remark: '',
      take: 1,
      idx: 0,
      selectedCategory: 'ALL PRODUCTS',
      selectedProduct: {},
      visible: false,
      refreshing: false,
      loadModifierTime: false,
      selectedCategoryModifier: 0,
    };
  }

  pushDataProductsToState = async outletID => {
    try {
      let data = await this.props.products.find(item => item.id == outletID);
      // if data is found
      if (data != undefined && !isEmptyObject(data)) {
        await this.setState({
          products: data.products,
          dataLength: data.dataLength,
        });
      } else {
        Alert.alert('Sorry', 'Cant get data products, please try again');
        this.setState({
          loading: false,
        });
      }
    } catch (e) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount = async () => {
    try {
      // refresh token
      await this.props.dispatch(refreshToken());
      // get data basket
      await this.getBasket();

      // If ordering mode is DINE IN, then fetch again data outlet to know outlet is available or closed
      if (this.props.dataBasket != undefined) {
        if (this.props.dataBasket.orderingMode == 'DINEIN') {
          let outletID = this.props.dataBasket.outlet.id;
          await this.props.dispatch(getOutletById(outletID));
        } else {
          if (this.props.outletSingle != undefined) {
            this.props.outletSingle.openAllDays = true;
            this.props.outletSingle.orderingStatus = 'AVAILABLE';
          }
        }
      }

      await this.setState({loading: false});

      // check if status basket is submitted, then request continoustly to get basket
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.status == 'SUBMITTED' &&
        this.props.dataBasket.orderingMode == 'DINEIN'
      ) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getCart(this.props.myCart.id));
        }, 4000);
      }

      // check if status basket for TAKE AWAY IS CONFIRMED or SUBMITTED, then request continoustly to get basket
      if (
        this.props.dataBasket != undefined &&
        (this.props.dataBasket.status == 'CONFIRMED' ||
          this.props.dataBasket.status == 'SUBMITTED') &&
        (this.props.dataBasket.outlet.outletType == 'QUICKSERVICE' ||
          this.props.dataBasket.orderingMode == 'TAKEAWAY' ||
          this.props.dataBasket.orderingMode == 'DELIVERY')
      ) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getCart(this.props.myCart.id));
        }, 4000);
      }
    } catch (e) {
      Alert.alert('Opss..', e.message);
    }

    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
  };

  askUserToSelectOrderType = () => {
    const {intlData, dataBasket} = this.props;
    let item = {};
    if (dataBasket != undefined) {
      item = dataBasket.outlet;
    }
    let height = 330;
    if (item.enableDineIn == false) height -= 50;
    if (item.enableTakeAway == false) height -= 50;
    if (item.enableDelivery == false) height -= 50;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'slide'}
        height={height}
        duration={10}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          container: {
            backgroundColor: colorConfig.store.darkColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        <Text
          style={{
            color: colorConfig.pageIndex.inactiveTintColor,
            fontSize: 25,
            paddingBottom: 5,
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
          }}>
          Order Mode
        </Text>
        {item.enableDineIn == true ? (
          <TouchableOpacity
            onPress={() => this.setOrderType('DINEIN')}
            style={styles.activeDINEINButton}>
            <Icon
              size={30}
              name={Platform.OS === 'ios' ? 'ios-restaurant' : 'md-restaurant'}
              style={{color: 'white'}}
            />
            <Text
              style={{
                marginLeft: 10,
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Lato-Bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {intlData.messages.dineIn}
            </Text>
          </TouchableOpacity>
        ) : null}
        {item.enableTakeAway == true ? (
          <TouchableOpacity
            disabled={item.enableTakeAway == false ? true : false}
            onPress={() => this.setOrderType('TAKEAWAY')}
            style={styles.activeTAKEAWAYButton}>
            <Icon
              size={30}
              name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
              style={{color: 'white'}}
            />
            <Text
              style={{
                marginLeft: 10,
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Lato-Bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {intlData.messages.takeAway}
            </Text>
          </TouchableOpacity>
        ) : null}
        {item.enableTakeAway == true ? (
          <TouchableOpacity
            disabled={item.enableTakeAway == false ? true : false}
            onPress={() => this.setOrderType('DELIVERY')}
            style={styles.activeDELIVERYButton}>
            <Icon
              size={30}
              name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'}
              style={{color: 'white'}}
            />
            <Text
              style={{
                marginLeft: 10,
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'Lato-Bold',
                fontSize: 18,
                textAlign: 'center',
              }}>
              DELIVERY
            </Text>
          </TouchableOpacity>
        ) : null}
      </RBSheet>
    );
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    this.props.dispatch(getCart(this.props.myCart.id));
    // fetch details outlet
    const outletID = this.props.dataBasket.outlet.id;
    await this.props.dispatch(getOutletById(outletID));
    await this.setState({refreshing: false});
  };

  getBasket = async () => {
    this.setState({loading: true});
    const {myCart} = this.props;
    await this.props.dispatch(getCart(myCart.id));
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
      clearInterval(this.interval);
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  goToScanTable = () => {
    try {
      const {outletSingle} = this.props;

      if (!this.checkLastOrder()) {
        Alert.alert(
          'Sorry..',
          `Last ordering for this outlet is ${
            outletSingle.lastOrderOn
          } minutes before closing. Please try again later.`,
        );
        return;
      }

      if (this.props.orderType == undefined) {
        this.RBSheet.open();
        // Alert.alert('Sorry', 'Please select your ordering mode first.');
      }

      if (this.props.orderType != undefined) {
        Actions.scanQRTable({
          basket: this.props.dataBasket,
          orderType: this.props.orderType,
        });
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getCart(this.props.myCart.id));
        }, 4000);
      }
    } catch (e) {}
  };

  checkActivateButtonClearRestaurant = dataBasket => {
    const {orderType, outletSingle} = this.props;

    if (dataBasket.status == 'PENDING') {
      return false;
    } else {
      return true;
    }
  };

  checkActivateButton = (dataBasket, button) => {
    const {orderType} = this.props;
    let {outletSingle} = this.props;

    if (outletSingle == undefined || outletSingle == null) {
      outletSingle = {};
    }

    if (outletSingle.orderingStatus == 'UNAVAILABLE' && button != 'cancel') {
      return false;
    }

    if (
      dataBasket.outlet.outletType == 'QUICKSERVICE' ||
      orderType == 'TAKEAWAY' ||
      dataBasket.orderingMode == 'TAKEAWAY' ||
      orderType == 'DELIVERY' ||
      dataBasket.orderingMode == 'DELIVERY'
    ) {
      if (
        dataBasket.status == 'PROCESSING' ||
        dataBasket.status == 'READY_FOR_COLLECTION' ||
        dataBasket.status == 'READY_FOR_DELIVERY' ||
        dataBasket.status == 'ON_THE_WAY'
      ) {
        return false;
      } else {
        if (dataBasket.status == 'PENDING') return true;
        else return false;
      }
    } else {
      if (dataBasket.status == 'CONFIRMED') {
        return true;
      } else {
        return false;
      }
    }
  };

  renderSettleButtonQuickService = () => {
    const {intlData, dataBasket} = this.props;
    let fee = dataBasket.deliveryFee == undefined ? 0 : dataBasket.deliveryFee;
    try {
      fee = parseFloat(fee);
    } catch (e) {
      fee = 0;
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
        <Text
          style={{
            color: colorConfig.store.title,
            textAlign: 'right',
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
            paddingVertical: 8,
            fontSize: 15,
            marginRight: 20,
          }}>
          TOTAL : {appConfig.appMataUang}
          {this.format(
            CurrencyFormatter(this.props.dataBasket.totalNettAmount + fee),
          )}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            disabled={
              this.checkActivateButton(dataBasket, 'cancel') ? false : true
            }
            onPress={this.alertRemoveBasket}
            style={[
              styles.btnCancelBasketModal,
              {
                backgroundColor: this.checkActivateButton(dataBasket, 'cancel')
                  ? colorConfig.store.colorError
                  : colorConfig.store.disableButtonError,
              },
            ]}>
            <Icon
              size={23}
              name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>
              {intlData.messages.clear}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goToSettle}
            disabled={
              this.checkActivateButton(dataBasket) ? !this.isOpen() : true
            }
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor: this.checkActivateButton(dataBasket)
                  ? this.isOpen()
                    ? colorConfig.store.defaultColor
                    : colorConfig.store.disableButton
                  : colorConfig.store.disableButton,
              },
            ]}>
            <Icon
              size={23}
              name={
                Platform.OS === 'ios'
                  ? 'ios-checkbox-outline'
                  : 'md-checkbox-outline'
              }
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>Settle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSettleButtonRestaurant = () => {
    const {intlData, dataBasket} = this.props;
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
        <Text
          style={{
            color: colorConfig.store.title,
            textAlign: 'right',
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
            paddingVertical: 8,
            fontSize: 15,
            marginRight: 20,
          }}>
          TOTAL : {appConfig.appMataUang}
          {this.format(
            CurrencyFormatter(this.props.dataBasket.totalNettAmount),
          )}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            disabled={
              this.checkActivateButtonClearRestaurant(dataBasket) ? true : false
            }
            onPress={this.alertRemoveBasket}
            style={[
              styles.btnCancelBasketModal,
              {
                backgroundColor: this.checkActivateButtonClearRestaurant(
                  dataBasket,
                )
                  ? colorConfig.store.disableButtonError
                  : colorConfig.store.colorError,
              },
            ]}>
            <Icon
              size={23}
              name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>
              {intlData.messages.clear}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goToSettle}
            disabled={
              this.checkActivateButton(dataBasket) ? !this.isOpen() : true
            }
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor: this.checkActivateButton(dataBasket)
                  ? this.isOpen()
                    ? colorConfig.store.defaultColor
                    : colorConfig.store.disableButton
                  : colorConfig.store.disableButton,
              },
            ]}>
            <Icon
              size={23}
              name={
                Platform.OS === 'ios'
                  ? 'ios-checkbox-outline'
                  : 'md-checkbox-outline'
              }
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>Settle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  isDeliveryAddressValid = () => {
    const {selectedAddress} = this.props;

    if (isEmptyObject(selectedAddress)) {
      Alert.alert(
        'Delivery Address Not Set',
        'Looks like your delivery address is invalid, please check again.',
        [{text: 'Create', onPress: () => this.goToAddress()}],
        {cancelable: false},
      );
      return false;
    }

    if (selectedAddress.city == '-') {
      Alert.alert(
        'Incomplete Delivery Address',
        'Looks like your address is incomplete, please check it again',
        [{text: 'Ok', onPress: () => this.goToAddress()}],
        {cancelable: false},
      );
    } else {
      return true;
    }
  };

  goToSettle = () => {
    try {
      const {outletSingle} = this.props;

      if (
        this.props.orderType == 'DELIVERY' ||
        this.props.dataBasket.orderingMode == 'DELIVERY'
      ) {
        if (!this.isDeliveryAddressValid()) {
          return;
        }
      }

      if (!this.checkLastOrder()) {
        Alert.alert(
          'Sorry..',
          `Last ordering for this outlet is ${
            outletSingle.lastOrderOn
          } minutes before closing. Please try again later.`,
        );
        return;
      }

      //  refresh cart
      // clearInterval(this.interval);
      // this.interval = setInterval(() => {
      //   this.props.dispatch(getBasket());
      // }, 3000);

      let dataPay = [];
      // create dataPay item
      let data = {};

      this.props.dataBasket.details.map((item, index) => {
        data.itemName = item.product.name;
        data.qty = item.quantity;
        data.price = item.unitPrice;

        // if data have modifiers, then add
        if (!isEmptyArray(item.modifiers)) {
          data.modifiers = item.modifiers;
        }

        dataPay.push(data);
        // make data empty before push again
        data = {};
      });

      const pembayaran = {
        payment: this.props.dataBasket.totalNettAmount,
        totalGrossAmount: this.props.dataBasket.totalGrossAmount,
        storeName: this.props.dataBasket.outlet.name,
        dataPay: dataPay,
        storeId: this.props.dataBasket.outlet.id,
      };

      // set url to pay
      let url;
      const {orderType, tableType, dataBasket, selectedAddress} = this.props;
      if (
        orderType == 'TAKEAWAY' ||
        dataBasket.outlet.outletType == 'QUICKSERVICE'
      ) {
        if (tableType != undefined) {
          pembayaran.tableNo = tableType.tableNo;
        } else {
          pembayaran.tableNo = '-';
        }
        pembayaran.orderingMode = orderType;
        url = '/cart/submitTakeAway';
      } else {
        url = '/cart/settle';
        pembayaran.cartID = this.props.dataBasket.cartID;
      }

      // for delivery order
      if (orderType == 'DELIVERY') {
        pembayaran.deliveryAddress = selectedAddress;
      }

      Actions.settleOrder({pembayaran: pembayaran, url: url});
    } catch (e) {
      this.setState({
        showAlert: true,
        pesanAlert: 'Please try again',
        titleAlert: 'Opps...',
      });
    }
  };

  renderButtonScanQRCode = () => {
    let {intlData, outletSingle} = this.props;
    if (outletSingle == undefined || outletSingle == null) {
      outletSingle = {};
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
        <Text
          style={{
            color: colorConfig.store.title,
            textAlign: 'right',
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
            paddingVertical: 8,
            fontSize: 15,
            marginRight: 20,
          }}>
          TOTAL : {CurrencyFormatter(this.props.dataBasket.totalNettAmount)}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.alertRemoveBasket}
            style={styles.btnCancelBasketModal}>
            <Icon
              size={23}
              name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>
              {intlData.messages.clear}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.goToScanTable}
            disabled={
              !this.isOpen() || outletSingle.orderingStatus == 'UNAVAILABLE'
                ? true
                : false
            }
            style={
              !this.isOpen() || outletSingle.orderingStatus == 'UNAVAILABLE'
                ? styles.btnAddBasketModalDisabled
                : styles.btnAddBasketModal
            }>
            <Icon
              size={23}
              name={
                Platform.OS === 'ios'
                  ? 'ios-checkbox-outline'
                  : 'md-checkbox-outline'
              }
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>
              {intlData.messages.submit}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  removeBasket = async () => {
    clearInterval(this.interval);
    await this.setState({loading: true});
    await this.props.dispatch(removeBasket());
    await this.getBasket();
    await this.setState({loading: false});
  };

  alertRemoveBasket = () => {
    Alert.alert(
      'Are you sure ?',
      'Delete all product selected from this cart ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Remove', onPress: () => this.removeBasket()},
      ],
      {cancelable: false},
    );
  };

  renderNullBasker = () => {
    const {intlData} = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          height: '90%',
        }}>
        <Text
          style={{
            fontSize: 25,
            color: colorConfig.pageIndex.inactiveTintColor,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          {intlData.messages.bucketEmpty}.
        </Text>
      </View>
    );
  };

  checkMaxOrderQty = qty => {
    try {
      const {outletSingle} = this.props;
      if (
        qty > outletSingle.maxOrderQtyPerItem &&
        outletSingle.maxOrderQtyPerItem != undefined
      ) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  };

  checkMaxOrderValue = (mode, data) => {
    try {
      const {outletSingle} = this.props;
      const {dataBasket} = this.props;
      let basketAmount = 0;
      let priceItem = data.details[0].quantity * data.details[0].unitPrice;

      let result = '';
      result = JSON.stringify(dataBasket);
      result = JSON.parse(result);
      result.details.map(item => {
        if (item.productID != data.details[0].productID) {
          basketAmount += parseFloat(item.nettAmount);
        }
      });
      let total = basketAmount + priceItem;

      if (
        total > outletSingle.maxOrderAmount &&
        outletSingle.maxOrderAmount != undefined
      ) {
        return false;
      }

      return true;
    } catch (e) {
      console.log(e);
      return true;
    }
  };

  pad = date => {
    try {
      const item = date.toString();
      if (item.length == 1) {
        return `0${item}`;
      } else {
        return date;
      }
    } catch (e) {
      return date;
    }
  };

  dateCreator = dateString => {
    // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"
    try {
      let dateParam = dateString.split(/[\s-:]/);
      dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString();
      return new Date(...dateParam);
    } catch (e) {
      return dateString;
    }
  };

  checkLastOrder = () => {
    const {outletSingle} = this.props;
    const currentTime = new Date().getTime();

    try {
      const currentDay = new Date().getDay();
      const yy = new Date().getFullYear();
      const dd = new Date().getDate();
      const mm = new Date().getMonth() + 1;
      let currentDate = `${yy}-${this.pad(mm)}-${this.pad(dd)}`;
      // Alert.alert('x', currentDate.toString());
      if (outletSingle.openAllDays == true) return true;

      if (!isEmptyArray(outletSingle.operationalHours)) {
        let data = outletSingle.operationalHours;
        for (let i = 0; i < data.length; i++) {
          if (data[i].day == currentDay) {
            // date must be format first, bcouse date in JS Core is not same as in debugger
            let outletDate = this.dateCreator(
              `${currentDate} ${data[i].close}:00`,
            );
            let outletTime = new Date(outletDate);
            let remainTime = parseFloat((outletTime - currentTime) / 60000);
            if (
              remainTime >= parseFloat(outletSingle.lastOrderOn) ||
              outletSingle.lastOrderOn == undefined ||
              outletSingle.lastOrderOn == '-'
            ) {
              return true;
            }
          }
        }
      } else {
        return false;
      }
    } catch (e) {}

    return false;
  };

  addItemToBasket = async (product, qty, remark, mode) => {
    const {outletSingle} = this.props;
    // check outlet rules
    if (!this.checkMaxOrderQty(qty)) {
      Alert.alert(
        'Sorry..',
        'Maximum order quantity per Item is ' + outletSingle.maxOrderQtyPerItem,
      );
      return;
    }

    if (mode == 'update') {
      await this.updateItem(product, qty, remark);
      await this.getBasket();
      await this.setState({loading: false});
    }
  };

  updateItem = async (product, qty, remark) => {
    try {
      const {outletSingle} = this.props;
      // make payload format to pass to action
      let data = {};
      data.details = [];
      let dataproduct = {
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: qty,
      };
      // search detail ID on previous data
      // let previousData = this.props.dataBasket.details.find(
      //   item => item.productID == product.productID,
      // );
      let previousData = product;

      // if product have modifier
      if (product.product.productModifiers.length > 0) {
        let totalModifier = 0;
        const productModifierClone = JSON.stringify(
          product.product.productModifiers,
        );
        let productModifiers = JSON.parse(productModifierClone);
        productModifiers = productModifiers.filter(
          item => item.postToServer == true,
        );
        // add moodifier to data product
        dataproduct.modifiers = productModifiers;

        let tempDetails = [];
        for (let i = 0; i < dataproduct.modifiers.length; i++) {
          tempDetails = [];
          let data = dataproduct.modifiers[i];

          for (let j = 0; j < data.modifier.details.length; j++) {
            if (
              data.modifier.details[j].quantity != undefined &&
              data.modifier.details[j].quantity > 0
            ) {
              tempDetails.push(data.modifier.details[j]);
            }
          }

          // if not null, then replace details
          dataproduct.modifiers[i].modifier.details = tempDetails;
        }

        //  calculate total modifier
        await dataproduct.modifiers.map((group, i) => {
          if (group.postToServer == true) {
            group.modifier.details.map(detail => {
              if (detail.quantity != undefined && detail.quantity > 0) {
                totalModifier += parseFloat(
                  detail.quantity * detail.productPrice,
                );
              }
            });
          }
        });

        // check if item modifier was deleted, if yes, then remove array modifier
        dataproduct.modifiers = await _.remove(dataproduct.modifiers, group => {
          return group.modifier.details.length > 0;
        });

        //  add total item modifier to subtotal product
        dataproduct.unitPrice += totalModifier;
      }

      // if remark is available, then push to array
      if (remark != undefined && remark != '') dataproduct.remark = remark;
      data.details.push(dataproduct);

      // check max order value outlet
      if (!this.checkMaxOrderValue('update', data)) {
        Alert.alert(
          'Sorry..',
          'Maximum order amount is ' +
            CurrencyFormatter(parseFloat(outletSingle.maxOrderAmount)),
        );
        return;
      }

      // send data to action
      let response = await this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });
      if (response.response.resultCode != 200) {
        Alert.alert('Oppss..', response.response.data.message);
        this.props.dispatch(getCart(this.props.myCart.id));
      }
    } catch (e) {
      Alert.alert('Oppss..', 'Please try again.');
      this.props.dispatch(getCart(this.props.myCart.id));
    }
  };

  setOrderType = async type => {
    this.props.dispatch(setOrderType(type));
    this.RBSheet.close();
  };

  renderStatusOrder = () => {
    let data;
    if (this.props.dataBasket.status == 'PENDING') {
      data = colorConfig.store.secondaryColor;
    } else if (this.props.dataBasket.status == 'SUBMITTED') {
      data = colorConfig.store.colorSuccess;
    } else {
      data = colorConfig.store.defaultColor;
    }
    return (
      <Text
        style={[
          styles.total,
          {
            backgroundColor: data,
            color: 'white',
            borderRadius: 5,
            padding: 5,
          },
        ]}>
        {this.props.dataBasket.status}
      </Text>
    );
  };

  format = item => {
    try {
      const curr = appConfig.appMataUang;
      item = item.replace(curr, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  renderItemModifier = item => {
    return (
      <FlatList
        data={item.modifiers}
        renderItem={({item}) =>
          item.modifier.details.map(mod => (
            <Text style={[styles.descModifier]}>
              •{' '}
              {item.modifier.isYesNo != true ? (
                <Text
                  style={{
                    color: colorConfig.store.defaultColor,
                  }}>
                  {mod.quantity}x
                </Text>
              ) : null}{' '}
              {mod.name} ( {this.format(CurrencyFormatter(mod.productPrice))} )
            </Text>
          ))
        }
      />
    );
  };

  getInfoOrder = () => {
    const {dataBasket, tableType} = this.props;
    if (dataBasket.outlet.outletType == 'QUICKSERVICE') {
      if (
        dataBasket.orderingMode == 'TAKEAWAY' ||
        dataBasket.orderingMode == 'DELIVERY'
      ) {
        return dataBasket.queueNo;
      } else {
        if (
          dataBasket.outlet.enableTableScan != undefined &&
          (dataBasket.outlet.enableTableScan == false ||
            dataBasket.outlet.enableTableScan == '-')
        ) {
          return dataBasket.queueNo;
        } else {
          let table = '';

          if (dataBasket.tableNo == undefined) {
            table = tableType.tableNo;
          } else {
            table = dataBasket.tableNo;
          }
          return table;
        }
      }
    } else {
      if (
        dataBasket.orderingMode == 'TAKEAWAY' ||
        dataBasket.orderingMode == 'DELIVERY'
      ) {
        return dataBasket.queueNo;
      } else {
        let table = '';
        if (dataBasket.tableNo == undefined) {
          table = tableType.tableNo;
        } else {
          table = dataBasket.tableNo;
        }
        return table;
      }
    }
  };

  getInfoTextOrder = () => {
    const {dataBasket} = this.props;
    if (dataBasket.outlet.outletType == 'QUICKSERVICE') {
      if (
        dataBasket.orderingMode == 'TAKEAWAY' ||
        dataBasket.orderingMode == 'DELIVERY'
      ) {
        return 'Queue No.';
      } else {
        if (
          dataBasket.outlet.enableTableScan != undefined &&
          (dataBasket.outlet.enableTableScan == false ||
            dataBasket.outlet.enableTableScan == '-')
        ) {
          return 'Queue No.';
        } else {
          return 'Table No';
        }
      }
    } else {
      if (
        dataBasket.orderingMode == 'TAKEAWAY' ||
        dataBasket.orderingMode == 'DELIVERY'
      ) {
        return 'Queue No.';
      } else {
        return 'Table No';
      }
    }
  };

  getOperationalHours = data => {
    try {
      let operationalHours = data.operationalHours;
      let date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      let currentDate = mm + '/' + dd + '/' + yyyy;
      let day = date.getDay();
      let time = date.getHours() + ':' + date.getMinutes();

      let open;
      operationalHours
        .filter(item => item.day == day && item.active == true)
        .map(day => {
          if (
            Date.parse(`${currentDate} ${time}`) >
              Date.parse(`${currentDate} ${day.open}`) &&
            Date.parse(`${currentDate} ${time}`) <
              Date.parse(`${currentDate} ${day.close}`)
          )
            open = true;
        });

      if (open) return true;
      else {
        if (operationalHours.leading == 0) return true;
        else return false;
      }
    } catch (e) {
      return false;
    }
  };

  isOpen = () => {
    const {outletSingle} = this.props;
    if (outletSingle != undefined)
      if (!isEmptyArray(outletSingle.operationalHours)) {
        if (this.getOperationalHours(outletSingle)) {
          return true;
        } else {
          if (outletSingle.openAllDays == true) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (outletSingle.openAllDays == true) {
          return true;
        } else {
          return false;
        }
      }
    else return true;
  };

  goToAddress = () => {
    Actions.selectAddress();
  };

  deliveryAddress = (orderType, dataBasket) => {
    try {
      if (orderType == 'DELIVERY' || dataBasket.orderingMode == 'DELIVERY') {
        return (
          <View style={styles.itemSummary}>
            <Text style={styles.total}>Delivery Address</Text>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={styles.totalAddress}>
                {dataBasket.deliveryAddress.addressName}
              </Text>
              <Text style={styles.totalAddress}>
                {dataBasket.deliveryAddress.address}
              </Text>
              <Text style={styles.totalAddress}>
                {dataBasket.deliveryAddress.city}
              </Text>
              <Text style={styles.totalAddress}>
                Postal Code: {dataBasket.deliveryAddress.postalCode}
              </Text>
            </View>
          </View>
        );
      }
    } catch (e) {
      return null;
    }
  };

  getInfoProvider = id => {
    const {providers} = this.props;
    try {
      const data = providers.find(item => item.id == id);
      return data.name;
    } catch (e) {
      return false;
    }
  };

  render() {
    const {intlData, dataBasket, orderType, tableType} = this.props;

    let {outletSingle} = this.props;
    if (outletSingle == undefined || outletSingle == null) {
      outletSingle = {};
    }

    // give message to user if order has been confirmed
    try {
      if (dataBasket != undefined) {
        //  for outlet type quick service
        if (
          (dataBasket.status == 'PROCESSING' ||
            dataBasket.status == 'READY_FOR_DELIVERY' ||
            dataBasket.status == 'READY_FOR_COLLECTION') &&
          this.interval != undefined &&
          (Actions.currentScene == 'cart' ||
            Actions.currentScene == 'waitingFood') &&
          (dataBasket.outlet.outletType == 'QUICKSERVICE' ||
            dataBasket.orderingMode == 'TAKEAWAY' ||
            dataBasket.orderingMode == 'DELIVERY')
        ) {
          clearInterval(this.interval);
          this.interval = undefined;
          Actions.replace('waitingFood', {myCart: dataBasket});
        }
      }

      // clear table type if basket is cancelled by admin
      if (dataBasket == undefined) {
        try {
          this.props.dispatch(clearTableType());
          clearInterval(this.interval);
          Actions.pop();
          this.interval = undefined;
        } catch (e) {}
      }
    } catch (e) {}

    return (
      <SafeAreaView style={styles.container}>
        {this.askUserToSelectOrderType()}

        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}>
              {' '}
              {/*{intlData.messages.detailOrder}{' '}*/}
              Detail Cart
            </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        {this.state.loading == false ? (
          this.props.dataBasket != undefined &&
          this.props.dataBasket.outlet != undefined ? (
            <ScrollView
              style={{marginBottom: '30%'}}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
              <View style={styles.containerBody}>
                <Text style={styles.title}>
                  {this.props.dataBasket.outlet.name}
                </Text>
                {!this.isOpen() ? (
                  <Text style={styles.titleClosed}>Outlet is Closed</Text>
                ) : null}
                {outletSingle.orderingStatus == 'UNAVAILABLE' ? (
                  <Text style={styles.titleClosed}>
                    {this.getOfflineMessage(outletSingle)}
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.subTitle}>
                    {intlData.messages.detailOrder}
                  </Text>
                </View>
                <View>
                  <FlatList
                    data={this.props.dataBasket.details}
                    renderItem={({item}) => (
                      <View style={styles.item}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 3,
                          }}>
                          <View style={{width: '80%'}}>
                            <View>
                              <Text style={[styles.desc]}>
                                <Text
                                  style={{
                                    color: colorConfig.store.defaultColor,
                                  }}>
                                  {item.quantity}x
                                </Text>{' '}
                                {item.product.name} ({' '}
                                {this.format(CurrencyFormatter(item.unitPrice))}{' '}
                                )
                              </Text>
                              {item.remark != undefined && item.remark != '' ? (
                                <Text
                                  style={{
                                    color:
                                      colorConfig.pageIndex.inactiveTintColor,
                                    fontSize: 12,
                                    fontStyle: 'italic',
                                  }}>
                                  note: {item.remark}
                                </Text>
                              ) : null}
                              {/* loop item modifier */}
                              {!isEmptyArray(item.modifiers) ? (
                                <Text
                                  style={{
                                    color:
                                      colorConfig.pageIndex.inactiveTintColor,
                                    fontSize: 10,
                                    marginLeft: 10,
                                    fontStyle: 'italic',
                                  }}>
                                  Add On:
                                </Text>
                              ) : null}
                              {this.renderItemModifier(item)}
                              {/* loop item modifier */}
                            </View>
                          </View>
                          <View>
                            <Text style={styles.descPrice}>
                              {this.format(CurrencyFormatter(item.grossAmount))}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(product, index) => index.toString()}
                  />
                </View>
                <View style={{marginTop: 20}} />
                {dataBasket != undefined ? (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>{this.getInfoTextOrder()}</Text>
                    <Text style={styles.total}>{this.getInfoOrder()}</Text>
                  </View>
                ) : null}
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>
                    {intlData.messages.statusOrder}
                  </Text>
                  {this.renderStatusOrder()}
                </View>
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>
                    {intlData.messages.orderMode}
                  </Text>
                  {this.props.orderType == 'TAKEAWAY' ? (
                    <Text
                      style={[
                        styles.total,
                        {
                          backgroundColor:
                            this.props.dataBasket.status == 'PENDING'
                              ? colorConfig.store.secondaryColor
                              : null,
                          color:
                            this.props.dataBasket.status == 'PENDING'
                              ? 'white'
                              : colorConfig.pageIndex.grayColor,
                          borderRadius: 5,
                          padding: 5,
                        },
                      ]}>
                      {this.props.dataBasket.orderingMode != undefined
                        ? this.props.dataBasket.orderingMode
                        : this.props.orderType}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.total,
                        {
                          backgroundColor: colorConfig.store.colorSuccess,
                          color: 'white',
                          borderRadius: 5,
                          padding: 5,
                        },
                      ]}>
                      {this.props.dataBasket.orderingMode != undefined
                        ? this.props.dataBasket.orderingMode
                        : this.props.orderType}
                    </Text>
                  )}
                </View>

                {this.deliveryAddress(
                  this.props.orderType,
                  this.props.dataBasket,
                )}

                {dataBasket.deliveryProvider != undefined ? (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>Delivery Provider</Text>
                    <Text style={styles.total}>
                      {dataBasket.deliveryProvider} |{' '}
                      {dataBasket.deliveryService}
                    </Text>
                  </View>
                ) : null}

                {dataBasket.deliveryProviderId != undefined ? (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>Delivery Provider : </Text>
                    <Text style={[styles.total, {textAlign: 'right'}]}>
                      {this.getInfoProvider(dataBasket.deliveryProviderId)}
                    </Text>
                  </View>
                ) : null}

                {dataBasket.deliveryFee != undefined ? (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>Delivery Fee</Text>
                    <Text style={styles.total}>
                      {CurrencyFormatter(dataBasket.deliveryFee)}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.itemSummary}>
                  <Text style={styles.total}>
                    {intlData.messages.totalTaxAmmount}
                  </Text>
                  <Text style={styles.total}>
                    {CurrencyFormatter(this.props.dataBasket.totalTaxAmount)}
                  </Text>
                </View>
              </View>
            </ScrollView>
          ) : (
            this.renderNullBasker()
          )
        ) : (
          <Loader />
        )}
        {dataBasket != undefined
          ? // check type outlet
            dataBasket.outlet.outletType == 'RESTO'
            ? this.isTakeAwayOrDelivery(orderType, dataBasket)
              ? this.renderSettleButtonRestaurant()
              : dataBasket.status == 'PENDING'
              ? this.renderButtonScanQRCode()
              : this.renderSettleButtonRestaurant()
            : this.isTakeAwayOrDelivery(orderType, dataBasket)
            ? this.renderSettleButtonQuickService()
            : dataBasket.outlet.enableTableScan != undefined &&
              (dataBasket.outlet.enableTableScan == false ||
                dataBasket.outlet.enableTableScan == '-')
            ? this.renderSettleButtonQuickService()
            : dataBasket.status == 'PENDING' && tableType == undefined
            ? this.renderButtonScanQRCode()
            : this.renderSettleButtonQuickService()
          : null}
      </SafeAreaView>
    );
  }

  isTakeAwayOrDelivery = (orderType, dataBasket) => {
    try {
      if (
        orderType == 'TAKEAWAY' ||
        orderType == 'DELIVERY' ||
        dataBasket.orderingMode == 'TAKEAWAY' ||
        dataBasket.orderingMode == 'DELIVERY'
      ) {
        return true;
      } else return false;
    } catch (e) {
      return false;
    }
  };
}

mapStateToProps = state => ({
  outletSingle: state.storesReducer.dataOutletSingle.outletSingle,
  providers: state.orderReducer.dataProvider.providers,
  dataBasket: state.orderReducer.dataCartSingle.cartSingle,
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
)(Cart);

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
  titleClosed: {
    color: 'white',
    marginHorizontal: '33%',
    borderRadius: 4,
    fontSize: 12,
    backgroundColor: colorConfig.store.colorError,
    fontFamily: 'Lato-Bold',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.title,
    fontSize: 14,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitleAddItems: {
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.defaultColor,
    fontSize: 14,
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
    textAlign: 'right',
  },
  totalAddress: {
    // marginVertical: -,
    // fontFamily: 'Lato-Bold',
    color: colorConfig.pageIndex.grayColor,
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'right',
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
    backgroundColor: colorConfig.store.colorSuccess,
  },
  btnAddBasketModalDisabled: {
    fontFamily: 'Lato-Bold',
    borderRadius: 10,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    width: '40%',
    backgroundColor: colorConfig.store.colorSuccessDisabled,
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
    backgroundColor: colorConfig.store.colorError,
  },
  textBtnBasketModal: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    textAlign: 'center',
  },
  activeDINEINButton: {
    padding: 13,
    backgroundColor: colorConfig.store.colorSuccess,
    borderRadius: 15,
    width: '60%',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deactiveDINEINButton: {
    padding: 15,
    backgroundColor: colorConfig.store.colorSuccessDisabled,
    borderRadius: 15,
    width: '60%',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTAKEAWAYButton: {
    padding: 13,
    backgroundColor: colorConfig.store.secondaryColor,
    borderRadius: 15,
    width: '60%',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDELIVERYButton: {
    padding: 13,
    backgroundColor: colorConfig.store.defaultColor,
    borderRadius: 15,
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deactiveTAKEAWAYButton: {
    padding: 15,
    backgroundColor: colorConfig.store.secondaryColorDisabled,
    borderRadius: 15,
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
