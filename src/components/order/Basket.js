import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Picker,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  clearTableType,
  getBasket,
  getDeliveryFee,
  getDeliveryProvider,
  getProductByOutlet,
  getProductsUnavailable,
  getTimeslot,
  removeBasket,
  setOrderType,
  submitOder,
  updateProductToBasket,
  updateSurcharge,
} from '../../actions/order.action';
import Loader from '../../components/loader';
import ModalOrder from '../../components/order/Modal';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {
  isEmptyArray,
  isEmptyData,
  isEmptyObject,
} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as _ from 'lodash';
import {dataStores, getOutletById} from '../../actions/stores.action';
import * as geolib from 'geolib';
import appConfig from '../../config/appConfig';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {selectedAddress} from '../../actions/payment.actions';
import {SwipeListView} from 'react-native-swipe-list-view';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {dataPoint} from '../../actions/rewards.action';
import {format} from 'date-fns';

class Basket extends Component {
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
      selectedProvider: {},
      deliveryFee: null,
      isOpen: true,
      loadingDelte: false,
      productsUnavailable: [],
      datePickup: null,
      timePickup: null,
      timeslot: '',
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
      // Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  getProductsByOutlet = async outletID => {
    try {
      if (this.props.products != undefined) {
        // check data products on local storage
        let data = await this.props.products.find(item => item.id == outletID);

        if (data != undefined && !isEmptyObject(data)) {
          await this.setState({
            products: data.products,
            dataLength: data.dataLength,
          });
        } else {
          // get data from server
          let response = await this.props.dispatch(
            getProductByOutlet(outletID),
          );
          if (response.success) {
            this.pushDataProductsToState(outletID);
          }
        }
      } else {
        // get data from server
        let response = await this.props.dispatch(getProductByOutlet(outletID));
        if (response.success) {
          this.pushDataProductsToState(outletID);
        }
      }
    } catch (e) {
      // Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount = async () => {
    try {
      // refresh token
      // await this.props.dispatch(refreshToken());
      // await this.props.dispatch(clearAddress());
      // get data basket
      await this.getBasket();
      // this.refreshOpeningHours();

      // get previous data products from this outlet, for modifier detail purpose
      if (this.props.dataBasket != undefined) {
        let outletID = this.props.dataBasket.outlet.id;
        await this.props.dispatch(getOutletById(outletID));
        await this.initializePickupTime();
        await this.getTimeslot(outletID);
        // GET PRODUCTS UNAVAILABLE
        await this.fetchProductsUnavailable(outletID);
        // this.getProductsByOutlet(outletID);

        this.props.dispatch(dataPoint());
        // await Promise.all([
        //   this.getProductsByOutlet(outletID),
        //   this.props.dispatch(getOutletById(outletID)),
        // ]);

        this.setState({
          isOpen: this.isOpen(),
        });

        // check if user not yet select order mode, then open modal
        if (this.props.orderType == undefined) {
          this.RBSheet.open();
        }

        this.getDeliveryAddress();

        if (
          this.props.orderType == 'DELIVERY' &&
          !isEmptyObject(this.props.selectedAddress)
        ) {
          await this.calculateDeliveryFee();
        }
        await this.setState({loading: false});
      }
      await this.setState({loading: false});
    } catch (e) {
      Alert.alert('Opss..', "Can't get data basket, please try again.");
    }

    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
  };

  getTimeslot = async outletID => {
    try {
      const clientTimeZone = Math.abs(new Date().getTimezoneOffset());
      const response = await this.props.dispatch(
        getTimeslot(outletID, this.state.datePickup, clientTimeZone),
      );
      if (response != false && !isEmptyArray(response)) {
        const find = response.find(item => item.isAvailable == true);
        if (find != undefined) {
          this.setState({timePickup: find.time});
        } else {
          this.setState({timePickup: null});
        }
      } else {
        this.setState({timePickup: null});
      }
    } catch (e) {}
  };

  fetchProductsUnavailable = async outletID => {
    try {
      const productsUnavailable = await this.props.dispatch(
        getProductsUnavailable(outletID),
      );

      if (productsUnavailable == false || isEmptyArray(productsUnavailable)) {
        this.setState({productsUnavailable: []});
      } else {
        this.setState({productsUnavailable});
      }
    } catch (e) {}
  };

  initializePickupTime = () => {
    const {outletSingle} = this.props;
    let pickerItem = [];
    let value = '';
    let timeslot = '';
    try {
      const day = new Date().getDay();
      let current = new Date().getTime();
      if (isEmptyArray(outletSingle.operationalHours)) {
        let datePickup = format(new Date(), 'yyyy-MM-dd');

        this.setState({datePickup});
        return;
      } else {
        const find = outletSingle.operationalHours.find(
          item => item.day == day,
        );
        if (find == undefined) {
          const findNextDay = outletSingle.operationalHours.find(
            item => item.day >= day,
          );
          if (findNextDay == undefined) return null;
          else {
            let diff = findNextDay.day;
            if (findNextDay.day < day) {
              diff += 7;
            } else {
              diff = diff - day;
            }
            let nextDate = diff * 86400000;
            let finalDate = new Date(current + nextDate);

            let arrayTime = [];
            for (
              let i = parseInt(findNextDay.open);
              i <= parseInt(findNextDay.close);
              i++
            ) {
              arrayTime.push(i);
            }
            let goal = parseInt(new Date().getHours() + 1);
            let closest = arrayTime.reduce(function(prev, curr) {
              return Math.abs(curr - goal) < Math.abs(prev - goal)
                ? curr
                : prev;
            });
            this.setState({
              datePickup: finalDate,
            });
          }
        } else {
          let arrayTime = [];
          let datePickup = format(new Date(), 'yyyy-MM-dd');
          for (let i = parseInt(find.open); i <= parseInt(find.close); i++) {
            arrayTime.push(i);
          }
          let goal = parseInt(new Date().getHours() + 1);
          let closest = arrayTime.reduce(function(prev, curr) {
            return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
          });
          this.setState({datePickup});
        }
      }
    } catch (e) {
      let datePickup = format(new Date(), 'yyyy-MM-dd');

      this.setState({datePickup});
    }
  };

  setPickupDate = datePickup => {
    try {
      this.setState({datePickup});
    } catch (e) {}
  };

  setPickupTime = timePickup => {
    try {
      this.setState({timePickup});
    } catch (e) {}
  };

  refreshOpeningHours = () => {
    try {
      clearInterval(this.intervalOutlet);
    } catch (e) {}
    try {
      this.intervalOutlet = setInterval(async () => {
        await this.setState({isOpen: this.isOpen()});
      }, 10000);
    } catch (e) {}
  };

  getDeliveryAddress = async () => {
    try {
      const {defaultAddress} = this.props;

      let user = {};
      try {
        let bytes = CryptoJS.AES.decrypt(
          this.props.userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        user = {};
      }

      if (!isEmptyObject(defaultAddress)) {
        this.props.dispatch(selectedAddress(defaultAddress));
        return;
      }

      let address = {};
      if (
        isEmptyObject(defaultAddress) &&
        !isEmptyData(user.address) &&
        isEmptyObject(this.props.selectedAddress) &&
        isEmptyArray(user.deliveryAddress)
      ) {
        address = {
          addressName: 'Home',
          address: user.address,
          postalCode: '-',
          city: '-',
        };
        this.props.dispatch(selectedAddress(address));
      } else {
        if (
          isEmptyObject(this.props.selectedAddress) &&
          !isEmptyArray(user.deliveryAddress)
        ) {
          this.props.dispatch(selectedAddress(user.deliveryAddress[0]));
          return;
        }
        if (isEmptyObject(this.props.selectedAddress)) {
          address = {};
          this.props.dispatch(selectedAddress(address));
        }
      }
    } catch (e) {
      let address = {
        addressName: '-',
        address: '-',
        postalCode: '-',
        city: '-',
      };
      this.props.dispatch(selectedAddress(address));
    }
  };

  updateSelectedCategory = idx => {
    this.setState({selectedCategoryModifier: idx});
  };

  askUserToSelectOrderType = () => {
    const {intlData, dataBasket, outletSingle} = this.props;
    let item = {};

    if (dataBasket != undefined) {
      item = dataBasket;
    }

    if (outletSingle != undefined) {
      item = outletSingle;
      item.enableStoreCheckOut =
        outletSingle.enableStoreCheckOut == true ? true : false;
      item.enableStorePickUp =
        outletSingle.enableStorePickUp == true ? true : false;
      item.enableTakeAway = outletSingle.enableTakeAway == true ? true : false;
      item.enableDineIn = outletSingle.enableDineIn == true ? true : false;
      item.enableDelivery = outletSingle.enableDelivery == true ? true : false;
    }

    let height = 330;
    if (item.outletType === 'RETAIL') {
      if (item.enableStoreCheckOut == false) height -= 50;
      if (item.enableStorePickUp == false) height -= 50;
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
          {item.enableStoreCheckOut == true ? (
            <TouchableOpacity
              disabled={item.enableStoreCheckOut == false ? true : false}
              onPress={() => this.setOrderType('STORECHECKOUT')}
              style={styles.activeTAKEAWAYButton}>
              <Icon
                size={30}
                name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
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
                {item.storeCheckOutName != undefined &&
                item.storeCheckOutName != ''
                  ? item.storeCheckOutName
                  : 'Store Checkout'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {item.enableStorePickUp == true ? (
            <TouchableOpacity
              onPress={() => this.setOrderType('STOREPICKUP')}
              style={styles.activeDINEINButton}>
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
                {item.storePickUpName != undefined && item.storePickUpName != ''
                  ? item.storePickUpName
                  : 'Store Pickup'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {item.enableDelivery == true ? (
            <TouchableOpacity
              disabled={item.enableDelivery == false ? true : false}
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
                {item.deliveryName != undefined && item.deliveryName != ''
                  ? item.deliveryName
                  : 'DELIVERY'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </RBSheet>
      );
    } else {
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
                name={
                  Platform.OS === 'ios' ? 'ios-restaurant' : 'md-restaurant'
                }
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
                {item.dineInName != undefined && item.dineInName != ''
                  ? item.dineInName
                  : 'DINE IN'}
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
                {item.takeAwayName != undefined && item.takeAwayName != ''
                  ? item.takeAwayName
                  : 'TAKE AWAY'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {item.enableDelivery == true ? (
            <TouchableOpacity
              disabled={item.enableDelivery == false ? true : false}
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
                {item.deliveryName != undefined && item.deliveryName != ''
                  ? item.deliveryName
                  : 'DELIVERY'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </RBSheet>
      );
    }
  };

  getDeliveryFee = () => {
    // const {providers} = this.props;
    try {
      this.calculateDeliveryFee();
      // if (!isEmptyArray(providers)) {
      //   const item = providers[0];
      //   this.setState({selectedProvider: item});
      //   this.calculateDeliveryFee(item);
      // }
    } catch (e) {}
  };

  calculateDeliveryFee = async item => {
    const {dataBasket, selectedAddress} = this.props;
    try {
      await this.setState({loading: true});
      const payload = {
        cartID: dataBasket.id,
        outletId: dataBasket.outlet.id,
        deliveryAddress: selectedAddress,
      };

      const response = await this.props.dispatch(getDeliveryFee(payload));
      if (response != false) {
        this.setState({selectedProvider: response.data.dataProfider[0]});
      } else {
        this.setState({selectedProvider: {}});
      }
    } catch (e) {}
    await this.setState({loading: false});
  };

  askUserToSelectProviders = () => {
    const {intlData, providers} = this.props;
    const {selectedProvider} = this.state;

    let height = 330;
    return (
      <RBSheet
        ref={ref => {
          this.RBproviders = ref;
        }}
        animationType={'slide'}
        height={height}
        duration={10}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          container: {
            backgroundColor: colorConfig.store.textWhite,
            paddingHorizontal: 5,
            paddingTop: 20,
          },
        }}>
        {providers != undefined ? (
          <ScrollView>
            <FlatList
              getItemLayout={(data, index) => {
                return {length: 30, offset: 30 * index, index};
              }}
              data={providers}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({selectedProvider: item});
                    this.RBproviders.close();
                  }}
                  style={styles.listProviders}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.total}>
                      {item.name}
                      {'     '}
                      {item.id == selectedProvider.id ? (
                        <Icon
                          size={20}
                          name={
                            Platform.OS === 'ios'
                              ? 'ios-checkmark'
                              : 'md-checkmark'
                          }
                          style={{
                            color: colorConfig.store.colorSuccess,
                            marginLeft: 20,
                          }}
                        />
                      ) : null}
                    </Text>
                  </View>
                  <Text style={styles.total}>
                    SGD {this.format(CurrencyFormatter(item.deliveryFee))}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(product, index) => index.toString()}
            />
          </ScrollView>
        ) : null}
      </RBSheet>
    );
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    await this.props.dispatch(getBasket());

    // fetch data provider
    // await this.props.dispatch(getDeliveryProvider());

    // fetch details outlet
    const outletID = this.props.dataBasket.outlet.id;
    await this.props.dispatch(getOutletById(outletID));
    await this.getTimeslot(outletID);
    await this.setState({refreshing: false});
    this.props.dispatch(dataStores());
  };

  getBasket = async () => {
    this.setState({loading: true});
    await this.props.dispatch(getBasket());
    // this.props.dispatch(getDeliveryProvider());
    // await this.setState({loading: false});
    // setTimeout(() => {
    //   this.setState({loading: false});
    // }, 10);
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
      clearInterval(this.interval);
      clearInterval(this.intervalOutlet);
      this.props.dispatch(selectedAddress(undefined));
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

      if (
        this.props.orderType != undefined &&
        this.props.previousTableNo == undefined
      ) {
        Actions.scanQRTable({
          basket: this.props.dataBasket,
          orderType: this.props.orderType,
        });
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getBasket());
        }, 4000);
      } else {
        this.submitDineInOrder();
      }
    } catch (e) {}
  };

  submitDineInOrder = async () => {
    try {
      await this.setState({loading: true});

      let payload = {
        tableNo: this.props.previousTableNo,
        orderingMode: this.props.orderType,
      };
      let results = await this.props.dispatch(submitOder(payload));
      if (results.resultCode == 200) {
        // if cart has been submitted, then go back and give info
        if (results.status == 'FAILED') {
          Alert.alert('Info!', results.data.message);
        }

        this.props.dispatch(getBasket());
        Actions.reset('pageIndex', {fromPayment: true});
      } else {
        this.setState({
          loading: false,
        });
      }
    } catch (e) {
      Alert.alert('Oppps..', 'Something went wrong, please try again.');
      Actions.pop();
    }
  };

  checkActivateButtonClearRestaurant = dataBasket => {
    const {orderType, outletSingle} = this.props;

    if (
      dataBasket.status == 'PENDING' ||
      dataBasket.status == 'PENDING_PAYMENT'
    ) {
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
        if (
          dataBasket.status == 'PENDING' ||
          dataBasket.status == 'PENDING_PAYMENT'
        )
          return true;
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

  clearDelivery = () => {
    this.setState({
      deliveryFee: null,
      selectedProvider: {},
    });
  };

  renderSettleButtonQuickService = () => {
    const {intlData, dataBasket, orderType} = this.props;
    let deliveryFee = 0;
    if (
      !isEmptyObject(this.state.selectedProvider) &&
      orderType === 'DELIVERY'
    ) {
      deliveryFee = this.state.selectedProvider.deliveryFee;
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
            CurrencyFormatter(
              this.props.dataBasket.totalNettAmount + deliveryFee,
            ),
          )}
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.alertRemoveBasket}
            style={[
              styles.btnCancelBasketModal,
              {
                backgroundColor: colorConfig.store.colorError,
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
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor: colorConfig.store.secondaryColor,
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
            <Text style={styles.textBtnBasketModal}>Check Out</Text>
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
              this.checkActivateButton(dataBasket) ? !this.state.isOpen : true
            }
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor: this.checkActivateButton(dataBasket)
                  ? this.state.isOpen
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
            <Text style={styles.textBtnBasketModal}>Check Out</Text>
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
        [{text: 'Create', onPress: () => this.goToAddAddress()}],
        {cancelable: false},
      );
      return false;
    }

    if (selectedAddress.streetName == undefined) {
      Alert.alert(
        'Incomplete Delivery Address',
        'Looks like your address is incomplete, please check it again',
        [{text: 'Ok', onPress: () => this.goToEditAddress()}],
        {cancelable: false},
      );
    } else {
      return true;
    }
  };

  isDeliveryFeeValid = () => {
    const {deliveryFee, selectedProvider} = this.state;

    if (isEmptyObject(selectedProvider)) {
      Alert.alert(
        'Delivery Provider Not Set',
        'It seems you have not selected a delivery provider for this order.',
      );
      return false;
    } else {
      return true;
    }
  };

  isPassValidationOrder = async outlet => {
    try {
      let store = outlet;
      const {orderType} = this.props;
      if (store.orderValidation == undefined || store.orderValidation == null) {
        return true;
      } else {
        if (orderType === 'TAKEAWAY') {
          store.orderValidation[orderType] = store.orderValidation.takeAway;
        } else if (orderType === 'DINEIN') {
          store.orderValidation[orderType] = store.orderValidation.dineIn;
        } else if (orderType === 'DELIVERY') {
          store.orderValidation[orderType] = store.orderValidation.delivery;
        }

        console.log(store);

        const {dataBasket} = this.props;
        let totalQty = 0;
        let totalAmount = 0;

        await dataBasket.details.map(item => {
          totalQty += item.quantity;
          totalAmount += item.grossAmount;
        });

        if (
          store.orderValidation[orderType] == undefined ||
          store.orderValidation[orderType] == null
        )
          return true;

        if (store.orderValidation[orderType].maxAmount > 0) {
          if (totalAmount > store.orderValidation[orderType].maxAmount) {
            Alert.alert(
              'Sorry',
              `Maximum order amount for ${orderType.toLowerCase()} is ` +
                CurrencyFormatter(store.orderValidation[orderType].maxAmount),
            );
            return false;
          }
        }
        if (store.orderValidation[orderType].minAmount > 0) {
          if (totalAmount < store.orderValidation[orderType].minAmount) {
            Alert.alert(
              'Sorry',
              `Minimum order amount for ${orderType.toLowerCase()} is ` +
                CurrencyFormatter(store.orderValidation[orderType].minAmount),
            );
            return false;
          }
        }
        if (store.orderValidation[orderType].maxQty > 0) {
          if (totalQty > store.orderValidation[orderType].maxQty) {
            Alert.alert(
              'Sorry',
              `Maximum order quantity for ${orderType.toLowerCase()} is ` +
                store.orderValidation[orderType].maxQty,
            );
            return false;
          }
        }
        if (store.orderValidation[orderType].minQty > 0) {
          if (totalQty < store.orderValidation[orderType].minQty) {
            Alert.alert(
              'Sorry',
              `Minimum order quantity for ${orderType.toLowerCase()} is ` +
                store.orderValidation[orderType].minQty,
            );
            return false;
          }
        }
        return true;
      }
    } catch (e) {}
  };

  isPassValidationOrder = async outlet => {
    try {
      let store = outlet;
      const {orderType} = this.props;
      if (store.orderValidation == undefined || store.orderValidation == null) {
        return true;
      } else {
        if (orderType === 'TAKEAWAY') {
          store.orderValidation[orderType] = store.orderValidation.takeAway;
        } else if (orderType === 'DINEIN') {
          store.orderValidation[orderType] = store.orderValidation.dineIn;
        } else if (orderType === 'DELIVERY') {
          store.orderValidation[orderType] = store.orderValidation.delivery;
        } else if (orderType === 'STORECHECKOUT') {
          store.orderValidation[orderType] =
            store.orderValidation.storeCheckOut;
        } else if (orderType === 'STOREPICKUP') {
          store.orderValidation[orderType] = store.orderValidation.storePickUp;
        }

        const {dataBasket} = this.props;
        let totalQty = 0;
        let totalAmount = 0;

        await dataBasket.details.map(item => {
          totalQty += item.quantity;
          totalAmount += item.grossAmount;
        });

        if (
          store.orderValidation[orderType] == undefined ||
          store.orderValidation[orderType] == null
        )
          return true;

        if (store.orderValidation[orderType].maxAmount > 0) {
          if (totalAmount > store.orderValidation[orderType].maxAmount) {
            Alert.alert(
              'Sorry',
              `Maximum order amount for ${orderType.toLowerCase()} is ` +
                CurrencyFormatter(store.orderValidation[orderType].maxAmount),
            );
            return false;
          }
        }
        if (store.orderValidation[orderType].minAmount > 0) {
          if (totalAmount < store.orderValidation[orderType].minAmount) {
            Alert.alert(
              'Sorry',
              `Minimum order amount for ${orderType.toLowerCase()} is ` +
                CurrencyFormatter(store.orderValidation[orderType].minAmount),
            );
            return false;
          }
        }
        if (store.orderValidation[orderType].maxQty > 0) {
          if (totalQty > store.orderValidation[orderType].maxQty) {
            Alert.alert(
              'Sorry',
              `Maximum order quantity for ${orderType.toLowerCase()} is ` +
                store.orderValidation[orderType].maxQty,
            );
            return false;
          }
        }
        if (store.orderValidation[orderType].minQty > 0) {
          if (totalQty < store.orderValidation[orderType].minQty) {
            Alert.alert(
              'Sorry',
              `Minimum order quantity for ${orderType.toLowerCase()} is ` +
                store.orderValidation[orderType].minQty,
            );
            return false;
          }
        }
        return true;
      }
    } catch (e) {}
  };

  anyProductsUnavailable = () => {
    try {
      const {productsUnavailable} = this.state;
      const {dataBasket} = this.props;
      for (let i = 0; i < dataBasket.details.length; i++) {
        if (productsUnavailable.includes(dataBasket.details[i].productID)) {
          return true;
        }
      }
      return false;
    } catch (e) {}
  };

  goToSettle = async () => {
    try {
      const {outletSingle, oderType} = this.props;
      let message = 'Please select pickup date & time.';
      if (oderType === 'DELIVERY') {
        message = 'Please select delivery date & time.';
      }

      if (this.state.timePickup === null) {
        Alert.alert('Sorry', message);
        return;
      }

      try {
        await this.setState({loading: true});
        if (!(await this.isPassValidationOrder(outletSingle))) {
          await this.setState({loading: false});
          return;
        }
      } catch (e) {
        await this.setState({loading: false});
      }
      await this.setState({loading: false});

      if (this.anyProductsUnavailable()) {
        Alert.alert(
          'Sorry',
          'There are items that are currently unavailable on your cart.',
        );
        return;
      }

      try {
        await this.setState({loading: true});
        if (!(await this.isPassValidationOrder(outletSingle))) {
          await this.setState({loading: false});
          return;
        }
      } catch (e) {
        await this.setState({loading: false});
      }
      await this.setState({loading: false});

      if (
        this.props.orderType == 'DELIVERY' ||
        this.props.dataBasket.orderingMode == 'DELIVERY'
      ) {
        if (!this.isDeliveryAddressValid()) {
          return;
        }

        if (!this.isDeliveryFeeValid()) {
          return;
        }
      }

      // if (!this.checkLastOrder()) {
      //   Alert.alert(
      //     'Sorry..',
      //     `Last ordering for this outlet is ${
      //       outletSingle.lastOrderOn
      //     } minutes before closing. Please try again later.`,
      //   );
      //   return;
      // }

      //  refresh cart
      // clearInterval(this.interval);
      // this.interval = setInterval(() => {
      //   this.props.dispatch(getBasket());
      // }, 3000);

      let details = [];
      // create dataPay item
      let data = {};

      this.props.dataBasket.details.map((item, index) => {
        data.quantity = item.quantity;
        data.unitPrice = item.unitPrice;
        data.product = item.product;

        // if data have modifiers, then add
        if (!isEmptyArray(item.modifiers)) {
          data.modifiers = item.modifiers;
        }

        // details;
        details.push(data);
        // make data empty before push again
        data = {};
      });

      const pembayaran = {
        payment: this.props.dataBasket.totalNettAmount,
        totalNettAmount: this.props.dataBasket.totalNettAmount,
        totalGrossAmount: this.props.dataBasket.totalGrossAmount,
        storeName: this.props.dataBasket.outlet.name,
        details: details,
        storeId: this.props.dataBasket.outlet.id,
        // referenceNo: 'scan.referenceNo',
      };

      // set url to pay
      let url;
      const {orderType, tableType, dataBasket, selectedAddress} = this.props;
      if (
        orderType == 'TAKEAWAY' ||
        orderType == 'DELIVERY' ||
        dataBasket.outlet.outletType == 'QUICKSERVICE' ||
        dataBasket.outlet.outletType == 'RETAIL'
      ) {
        if (tableType != undefined) {
          pembayaran.tableNo = tableType.tableNo;
        } else {
          pembayaran.tableNo = '-';
        }
        pembayaran.orderingMode = orderType;
        pembayaran.cartID = this.props.dataBasket.cartID;
        url = '/cart/submitAndPay';
      } else {
        url = '/cart/customer/settle';
      }

      // for delivery order
      if (orderType == 'DELIVERY') {
        pembayaran.deliveryAddress = selectedAddress;
        pembayaran.deliveryProvider = this.state.selectedProvider;
        pembayaran.totalNettAmount += this.state.selectedProvider.deliveryFee;
        pembayaran.payment += this.state.selectedProvider.deliveryFee;
      }

      try {
        pembayaran.cartDetails = dataBasket;
      } catch (e) {}

      try {
        if (
          orderType == 'DELIVERY' ||
          orderType == 'TAKEAWAY' ||
          orderType == 'STOREPICKUP'
        ) {
          pembayaran.orderActionDate = this.state.datePickup;
          pembayaran.orderActionTime = this.state.timePickup.substr(0, 5);
          pembayaran.orderActionTimeSlot = this.state.timePickup;
        }
      } catch (e) {}

      Actions.settleOrder({
        pembayaran: pembayaran,
        url: url,
        outlet: outletSingle,
      });
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
              !this.state.isOpen || outletSingle.orderingStatus == 'UNAVAILABLE'
                ? true
                : false
            }
            style={
              !this.state.isOpen || outletSingle.orderingStatus == 'UNAVAILABLE'
                ? styles.btnAddBasketModalDisabled
                : styles.btnAddBasketModal
            }>
            {this.props.previousTableNo == undefined ? (
              <>
                <Icon
                  size={20}
                  name={
                    Platform.OS === 'ios' ? 'ios-qr-scanner' : 'md-qr-scanner'
                  }
                  style={{color: 'white', marginRight: 5}}
                />
                <Text style={styles.textBtnBasketModal}>Scan QR Code</Text>
              </>
            ) : (
              <>
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
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  removeBasket = async () => {
    clearInterval(this.interval);
    const {dataBasket} = this.props;
    await this.setState({loading: true});
    await this.props.dispatch(removeBasket());
    await this.getBasket();
    try {
      this.props.refreshQuantityProducts(dataBasket);
    } catch (e) {}
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

  openEditModal = product => {
    this.openModal(product);
  };

  addQty = () => {
    this.setState({qtyItem: this.state.qtyItem + 1});
  };

  minQty = () => {
    if (this.state.qtyItem > 0) {
      if (this.state.selectedProduct.mode == 'update') {
        this.setState({qtyItem: this.state.qtyItem - 1});
      }
    }
  };

  changeRemarkText = value => {
    this.setState({remark: value});
  };

  checkIfItemExistInBasket = item => {
    try {
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.details != undefined
      ) {
        let productFound = this.props.dataBasket.details.find(
          data => data.productID == item.productID,
        );
        if (productFound != undefined) return productFound;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  };

  openModal = async product => {
    try {
      // get current quantity from product
      let existProduct = product;

      if (existProduct != false) {
        //  FIND PRODUCTS
        let originalProduct = {};
        const {products} = this.state;

        // for (let i = 0; i < products.length; i++) {
        //   if (!isEmptyArray(products[i].items)) {
        //     for (let j = 0; j < products[i].items.length; j++) {
        //       if (products[i].items[j].product != undefined) {
        //         if (
        //           products[i].items[j].product.id == existProduct.product.id
        //         ) {
        //           originalProduct = products[i].items[j];
        //           break;
        //         }
        //       }
        //     }
        //   }
        // }
        originalProduct = JSON.stringify(products);
        originalProduct = JSON.parse(originalProduct);

        product.mode = 'update';
        product.remark = existProduct.remark;
        product.quantity = existProduct.quantity;
        product.name = existProduct.product.name;

        try {
          product.product.description = originalProduct.product.description;
        } catch (e) {}

        if (product.product.productModifiers != undefined) {
          product.product.productModifiers =
            originalProduct.product.productModifiers;

          // remove quantity temp from props
          product.product.productModifiers.map((group, i) => {
            if (!isEmptyArray(group.modifier.details))
              group.modifier.details.map((detail, j) => {
                delete detail.quantity;

                // return back to normal
                if (group.modifier.max == 1) {
                  product.product.productModifiers[i].modifier.show = false;
                } else {
                  product.product.productModifiers[i].modifier.show = true;
                }

                if (group.modifier.isYesNo == true) {
                  if (
                    group.modifier.yesNoDefaultValue == true &&
                    detail.yesNoValue == 'no'
                  ) {
                    product.product.productModifiers[i].modifier.details[
                      j
                    ].isSelected = false;
                  }

                  if (
                    group.modifier.yesNoDefaultValue == false &&
                    detail.yesNoValue == 'yes'
                  ) {
                    product.product.productModifiers[i].modifier.details[
                      j
                    ].isSelected = true;
                  }
                }
              });
          });

          // process modifier
          let find = product;
          if (find != undefined && !isEmptyArray(find.modifiers)) {
            existProduct.product.productModifiers.map((group, i) => {
              if (!isEmptyArray(group.modifier.details))
                group.modifier.details.map((detail, j) => {
                  find.modifiers.map(data => {
                    data.modifier.details.map(item => {
                      // make mark that item is in basket
                      if (data.modifierID == group.modifierID) {
                        existProduct.product.productModifiers[
                          i
                        ].postToServer = true;
                        // set quantity basket to product that openend
                        if (item.id == detail.id) {
                          // check for radio button selected
                          if (group.modifier.max == 1) {
                            product.product.productModifiers[i].modifier.show =
                              data.modifier.show;
                          }

                          existProduct.product.productModifiers[
                            i
                          ].modifier.details[j].quantity = item.quantity;
                          existProduct.product.productModifiers[
                            i
                          ].modifier.details[j].isSelected = item.isSelected;
                        }
                      }
                    });
                  });
                });
            });
          }
        }

        // open modal
        this.setState({
          selectedCategoryModifier: 0,
          selectedProduct: existProduct,
          isModalVisible: !this.state.isModalVisible,
        });
      } else {
        Alert.alert('Sorry', 'Cant find selected product.');
      }
    } catch (e) {
      const message1 = "Cannot read property 'productModifiers' of undefined";
      const message2 = "Cannot read property 'length' of undefined";
      if (e.message === message1 || e.message === message2) {
        try {
          await this.setState({loading: true});
          // await this.getDataProducts();
          await this.setState({loading: false});
          // await this.openModal();
          console.log(e);
        } catch (e) {}
      } else {
        // Alert.alert('Opps..', 'Something went wrong, please try again.');
      }
    }
  };

  getDataProducts = async () => {
    const outletID = this.props.dataBasket.outlet.id;
    let response = await this.props.dispatch(
      getProductByOutlet(outletID, true),
    );
    if (response.success) {
      this.pushDataProductsToState(outletID);
    }
  };

  modalShow = () => {
    let qtyItem = 9;
    let remark = '';
    qtyItem = this.state.selectedProduct.quantity;
    remark = this.state.selectedProduct.remark;

    this.setState({
      qtyItem,
      remark,
      selectedCategoryModifier: 0,
      loadModifierTime: true,
    });
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
    // if (!this.checkMaxOrderQty(qty)) {
    //   Alert.alert(
    //     'Sorry..',
    //     'Maximum order quantity per Item is ' + outletSingle.maxOrderQtyPerItem,
    //   );
    //   return;
    // }

    if (mode == 'update') {
      await this.updateItem(product, qty, remark);
      await this.getBasket();
      await this.setState({loading: false});

      // refresh update recyclerViewList in product page
      try {
        this.props.refreshQuantityProducts(product);
      } catch (e) {}
    }
  };

  removeItem = async product => {
    try {
      let data = {};
      data.details = [];
      let dataproduct = {
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: 0,
      };

      data.details.push(dataproduct);

      // send data to action
      await this.setState({loadingDelte: true});
      let response = await this.props.dispatch(
        updateProductToBasket(data, product),
      );

      if (response.success == false) {
        Alert.alert('Oppss..', response.response.data.message);
        this.props.dispatch(getBasket());
      } else {
        await this.props.dispatch(getBasket());
      }
      await this.props.refreshQuantityProducts(product);
      await this.setState({loadingDelte: false});
    } catch (e) {
      await this.setState({loadingDelte: false});
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
      if (product.product.productModifiers != undefined) {
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
                // check if price is undefined
                if (data.modifier.details[j].price == undefined) {
                  data.modifier.details[j].price = 0;
                }

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
                  totalModifier += parseFloat(detail.quantity * detail.price);
                }
              });
            }
          });

          // check if item modifier was deleted, if yes, then remove array modifier
          dataproduct.modifiers = await _.remove(
            dataproduct.modifiers,
            group => {
              return group.modifier.details.length > 0;
            },
          );

          //  add total item modifier to subtotal product
          dataproduct.unitPrice += totalModifier;
        }
      }

      // if remark is available, then push to array
      if (remark != undefined && remark != '') dataproduct.remark = remark;
      data.details.push(dataproduct);

      // check max order value outlet
      // if (!this.checkMaxOrderValue('update', data)) {
      //   Alert.alert(
      //     'Sorry..',
      //     'Maximum order amount is ' +
      //       CurrencyFormatter(parseFloat(outletSingle.maxOrderAmount)),
      //   );
      //   return;
      // }

      // send data to action
      let response = await this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });
      if (response.success == false) {
        Alert.alert('Oppss..', response.response.data.message);
        this.props.dispatch(getBasket());
      }
    } catch (e) {
      Alert.alert('Oppss..', 'Please try again.');
      this.props.dispatch(getBasket());
    }
  };

  setOrderType = async type => {
    const {dataBasket} = this.props;
    // if (dataBasket.outlet.outletType == 'QUICKSERVICE') {
    //   this.props.dispatch(setOrderType('TAKEAWAY'));
    // } else {
    //   this.props.dispatch(setOrderType(type));
    // }
    await this.props.dispatch(setOrderType(type));

    if (type == 'DELIVERY' && !isEmptyObject(this.props.selectedAddress)) {
      this.getDeliveryFee();
    }

    this.RBSheet.close();

    await this.setState({loading: true});
    try {
      if (dataBasket.orderingMode != type)
        await this.props.dispatch(updateSurcharge(this.props.orderType));
    } catch (e) {}

    await this.setState({loading: false});
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
          item.modifier.details.map((mod, idx) => (
            <Text key={idx} style={[styles.descModifier]}>
              •{' '}
              {item.modifier.isYesNo != true ? (
                <Text
                  style={{
                    color: colorConfig.store.defaultColor,
                  }}>
                  {mod.quantity}x
                </Text>
              ) : null}{' '}
              {mod.name} ( {this.format(CurrencyFormatter(mod.price))} )
            </Text>
          ))
        }
      />
    );
  };

  getTableNo = () => {
    const {tableType, dataBasket, orderType} = this.props;
    try {
      if (orderType == 'TAKEAWAY' && tableType != undefined) {
        return dataBasket.tableNo;
      } else {
        return dataBasket.tableNo;
      }
    } catch (e) {
      return undefined;
    }
  };

  getInfoOrder = () => {
    const {dataBasket, tableType} = this.props;
    if (dataBasket.outlet.outletType == 'QUICKSERVICE') {
      if (dataBasket.orderingMode == 'TAKEAWAY') {
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

          if (dataBasket.tableNo == undefined && tableType != undefined) {
            table = tableType.tableNo;
          } else {
            table = dataBasket.tableNo;
          }
          return table;
        }
      }
    } else {
      if (dataBasket.orderingMode == 'TAKEAWAY') {
        return dataBasket.queueNo;
      } else {
        let table = '';
        if (dataBasket.tableNo == undefined && tableType != undefined) {
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
      if (dataBasket.orderingMode == 'TAKEAWAY') {
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
      if (dataBasket.orderingMode == 'TAKEAWAY') {
        return 'Queue No.';
      } else {
        return 'Table No';
      }
    }
  };

  goToProducts = () => {
    try {
      const {userPosition, outletSingle} = this.props;
      let item = outletSingle;

      // check if user enabled their position permission
      let statusLocaiton;
      if (userPosition == undefined || userPosition == false) {
        statusLocaiton = false;
      } else {
        statusLocaiton = true;
      }

      let position = userPosition;

      let location = {};
      let coordinate = {};
      location = {
        region: item.region,
        address: item.location,
        coordinate: {
          lat: item.latitude,
          lng: item.longitude,
        },
      };

      item.location = location;

      let data = {
        storeId: item.id,
        storeName: item.name,
        storeStatus: this.isOpen(item),
        storeJarak: statusLocaiton
          ? geolib.getDistance(position.coords, {
              latitude: Number(item.latitude),
              longitude: Number(item.longitude),
            }) / 1000
          : '-',
        image: item.defaultImageURL != undefined ? item.defaultImageURL : '',
        region: item.region,
        address: item.location.address,
        city: item.city,
        operationalHours: item.operationalHours,
        openAllDays: item.openAllDays,
        defaultImageURL: item.defaultImageURL,
        coordinate: item.location.coordinate,
        orderingStatus: item.orderingStatus,
        outletType: item.outletType,
        offlineMessage: item.offlineMessage,
        maxOrderQtyPerItem: item.maxOrderQtyPerItem,
        maxOrderAmount: item.maxOrderAmount,
        lastOrderOn: item.lastOrderOn,
        takeAwayName: item.takeAwayName,
        dineInName: item.dineInName,
        storePickUpName: item.storePickUpName,
        storeCheckOutName: item.storeCheckOutName,
        deliveryName: item.deliveryName,
        enableStoreCheckOut: item.enableStoreCheckOut == true ? true : false,
        enableStorePickUp: item.enableStorePickUp == true ? true : false,
        enableTakeAway: item.enableTakeAway == true ? true : false,
        enableDineIn: item.enableDineIn == true ? true : false,
        enableTableScan: item.enableTableScan == true ? true : false,
        enableDelivery: item.enableDelivery == true ? true : false,
        enableItemSpecialInstructions: item.enableItemSpecialInstructions,
        enableRedeemPoint: item.enableRedeemPoint,
        orderValidation: item.orderValidation,
      };

      if (this.props.from == 'products') {
        Actions.pop();
      } else {
        Actions.push('productsMode2', {item: data});
      }
    } catch (e) {
      Actions.pop();
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
            Date.parse(`${currentDate} ${time}`) >=
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
    else return false;
  };

  getOfflineMessage = outletSingle => {
    try {
      if (
        outletSingle.offlineMessage == undefined ||
        outletSingle.offlineMessage == '' ||
        outletSingle.offlineMessage == '-'
      ) {
        return 'Sorry, Ordering is not available now.';
      } else {
        return outletSingle.offlineMessage;
      }
    } catch (e) {
      return 'Sorry, Ordering is not available now.';
    }
  };

  goToAddress = () => {
    Actions.selectAddress({
      clearDelivery: this.clearDelivery,
      getDeliveryFee: this.getDeliveryFee,
      from: 'basket',
    });
  };

  goToAddAddress = () => {
    Actions.push('addAddress', {
      from: 'basket',
      getDeliveryFee: this.getDeliveryFee,
    });
  };

  goToEditAddress = () => {
    Actions.editAddress({
      from: 'basket',
      myAddress: this.props.selectedAddress,
      getDeliveryFee: this.getDeliveryFee,
      clearDelivery: this.clearDelivery,
    });
  };

  deliveryAddress = (orderType, dataBasket) => {
    try {
      if (orderType == 'DELIVERY') {
        return (
          <TouchableOpacity
            onPress={this.goToAddress}
            style={styles.itemSummary}>
            <Text style={styles.total}>
              {this.props.selectedAddress.addressName == undefined ? (
                <Text style={{color: colorConfig.store.colorError}}>
                  Delivery Address
                </Text>
              ) : (
                'Delivery Address'
              )}
            </Text>
            <View>
              <Text style={[styles.total, styles.badge]}>
                {this.props.selectedAddress.addressName == undefined ? (
                  <Text style={{color: colorConfig.store.colorError}}>-</Text>
                ) : (
                  this.props.selectedAddress.addressName
                )}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    } catch (e) {
      return null;
    }
  };

  deliveryProvider = (orderType, dataBasket) => {
    const {selectedProvider} = this.state;
    const {selectedAddress, providers} = this.props;
    try {
      if (orderType == 'DELIVERY' && !isEmptyObject(selectedAddress)) {
        return (
          <View style={styles.itemSummary}>
            <Text style={styles.total}>
              {this.props.selectedAddress.addressName == undefined ? (
                <Text style={{color: 'red'}}>No Set</Text>
              ) : (
                'Delivery Provider'
              )}
            </Text>
            <View>
              {isEmptyObject(selectedProvider) ? (
                <TouchableOpacity onPress={() => this.RBproviders.open()}>
                  <Text
                    style={[
                      styles.total,
                      {
                        letterSpacing: 1,
                        backgroundColor: colorConfig.store.darkColor,
                        borderRadius: 5,
                        padding: 5,
                        color: 'white',
                      },
                    ]}>
                    Select Provider
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (!isEmptyArray(providers) && providers.length > 1) {
                      this.RBproviders.open();
                    } else {
                      return false;
                    }
                  }}>
                  <Text style={[styles.total, styles.badge]}>
                    {selectedProvider.name}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }
    } catch (e) {
      return null;
    }
  };

  backButtonClicked = () => {
    this.setState({isModalVisible: false});
  };

  goToPickUpTime = () => {
    let {outletSingle, orderType} = this.props;
    try {
      Actions.push('pickUpTime', {
        setPickupDate: this.setPickupDate,
        setPickupTime: this.setPickupTime,
        date: this.state.datePickup,
        time: this.state.timePickup,
        outlet: outletSingle,
        orderType: orderType,
        header:
          orderType == 'DELIVERY'
            ? 'Delivery Date & Time'
            : 'Pickup Date & Time',
      });
    } catch (e) {}
  };

  formatDatePickup = () => {
    try {
      if (this.state.datePickup != null) {
        return format(new Date(this.state.datePickup), 'dd MMM yyyy');
      } else {
        return this.state.datePickup;
      }
    } catch (e) {
      return this.state.datePickup;
    }
  };

  isUseTimingSetting = () => {
    let {outletSingle, orderType} = this.props;
    try {
      if (orderType === 'DINEIN' || orderType === 'STORECHECKOUT') return false;
      return true;
    } catch (e) {}
  };

  getImageUrl = image => {
    try {
      if (image != undefined && image != '-' && image != null) {
        return {uri: image};
      }
    } catch (e) {
      return appConfig.foodPlaceholder;
    }
    return appConfig.foodPlaceholder;
  };

  render() {
    const {intlData, dataBasket, orderType, tableType} = this.props;

    let {outletSingle} = this.props;
    if (outletSingle == undefined || outletSingle == null) {
      outletSingle = {};
    }

    try {
      // clear table type if basket is cancelled by admin
      if (dataBasket == undefined) {
        this.props.dispatch(clearTableType());
        clearInterval(this.interval);
        this.interval = undefined;
      }
    } catch (e) {}

    return (
      <SafeAreaView style={styles.container}>
        <ModalOrder
          outlet={outletSingle}
          isModalVisible={this.state.isModalVisible}
          qtyItem={this.state.qtyItem}
          remark={this.state.remark}
          closeModal={this.closeModal}
          backButtonClicked={this.backButtonClicked}
          toggleModal={this.toggleModal}
          addQty={this.addQty}
          minQty={this.minQty}
          changeRemarkText={this.changeRemarkText}
          modalShow={this.modalShow}
          calculateSubTotalModal={this.calculateSubTotalModal}
          product={this.state.selectedProduct}
          addItemToBasket={this.addItemToBasket}
          loadingAddItem={this.state.loadingAddItem}
          dataBasket={this.props.dataBasket}
          updateSelectedCategory={this.updateSelectedCategory}
          selectedCategoryModifier={this.state.selectedCategoryModifier}
          loadModifierTime={this.state.loadModifierTime}
        />

        {this.askUserToSelectProviders()}
        {this.askUserToSelectOrderType()}

        {this.state.loadingDelte && <Loader />}

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
            <Text style={styles.btnBackText}>
              {' '}
              {intlData.messages.detailOrder}{' '}
            </Text>
          </TouchableOpacity>
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
                {!this.state.isOpen ? (
                  <Text style={styles.titleClosed}>Outlet is Closed</Text>
                ) : null}
                {outletSingle.orderingStatus == 'UNAVAILABLE' ? (
                  <Text style={styles.titleClosed}>
                    {this.getOfflineMessage(outletSingle)}
                  </Text>
                ) : null}
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.subTitle}>
                    {intlData.messages.detailOrder}
                  </Text>
                  {(dataBasket.status == 'PENDING' ||
                    dataBasket.status == 'PENDING_PAYMENT') &&
                  (outletSingle.orderingStatus == 'AVAILABLE' ||
                    outletSingle.orderingStatus == undefined) ? (
                    <TouchableOpacity onPress={this.goToProducts}>
                      <Text style={styles.subTitleAddItems}>+ Add Items</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  <SwipeListView
                    useFlatList={true}
                    data={this.props.dataBasket.details}
                    renderItem={(rowData, rowMap) => (
                      <View style={styles.item}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // padding: 3,
                          }}>
                          <View style={{width: '75%', flexDirection: 'row'}}>
                            <Image
                              source={this.getImageUrl(
                                rowData.item.product.defaultImageURL,
                              )}
                              style={{
                                marginRight: 7,
                                borderRadius: 3,
                                width: 60,
                                height: 60,
                                resizeMode: 'contain',
                              }}
                            />
                            <View>
                              <Text style={[styles.desc]}>
                                <Text
                                  style={{
                                    color: colorConfig.store.defaultColor,
                                  }}>
                                  {rowData.item.quantity}x
                                </Text>{' '}
                                {rowData.item.product != undefined
                                  ? rowData.item.product.name
                                  : '-'}{' '}
                                ({' '}
                                {this.format(
                                  CurrencyFormatter(
                                    rowData.item.product != undefined
                                      ? rowData.item.product.retailPrice
                                      : 0,
                                  ),
                                )}{' '}
                                )
                              </Text>
                              {/* loop item modifier */}
                              {!isEmptyArray(rowData.item.modifiers) ? (
                                <Text
                                  style={{
                                    color:
                                      colorConfig.pageIndex.inactiveTintColor,
                                    fontSize: 10,
                                    marginLeft: 17,
                                    fontStyle: 'italic',
                                  }}>
                                  Add On:
                                </Text>
                              ) : null}
                              {this.renderItemModifier(rowData.item)}
                              {rowData.item.remark != undefined &&
                              rowData.item.remark != '' ? (
                                <Text
                                  style={{
                                    marginTop: 3,
                                    color:
                                      colorConfig.pageIndex.inactiveTintColor,
                                    fontSize: 12,
                                    marginLeft: 17,
                                    fontStyle: 'italic',
                                  }}>
                                  Note: {rowData.item.remark}
                                </Text>
                              ) : null}
                              {/* loop item modifier */}
                              {(this.props.dataBasket.status == 'PENDING' ||
                                this.props.dataBasket.status ==
                                  'PENDING_PAYMENT') &&
                              this.props.tableType == undefined &&
                              (outletSingle.orderingStatus == 'AVAILABLE' ||
                                outletSingle.orderingStatus == undefined) ? (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.openEditModal(rowData.item)
                                  }
                                  style={{paddingVertical: 5}}>
                                  <Text
                                    style={{
                                      color: colorConfig.store.colorSuccess,
                                      fontWeight: 'bold',
                                      fontFamily: 'Lato-Bold',
                                      fontSize: 14,
                                    }}>
                                    Edit
                                  </Text>
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                          <View>
                            <Text style={styles.descPrice}>
                              {this.format(
                                CurrencyFormatter(rowData.item.grossAmount),
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    disableRightSwipe={true}
                    rightOpenValue={-80}
                    onRowOpen={(rowKey, rowMap) => {
                      try {
                        const options = {
                          enableVibrateFallback: true,
                          ignoreAndroidSystemSettings: true,
                        };

                        ReactNativeHapticFeedback.trigger(
                          'impactLight',
                          options,
                        );
                      } catch (e) {}
                    }}
                    renderHiddenItem={(rowData, rowMap) => (
                      <View style={styles.rowBack}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: colorConfig.store.colorError,
                            height: '100%',
                            width: '20%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: 25,
                          }}
                          onPress={() => {
                            try {
                              Alert.alert(
                                `Delete Item ?`,
                                `Are you sure want to delete ${
                                  rowData.item.product.name
                                } from basket ?`,
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () =>
                                      console.log('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'Delete',
                                    onPress: () => {
                                      this.removeItem(rowData.item);
                                    },
                                  },
                                ],
                                {cancelable: true},
                              );
                              // rowMap[rowData.item.key].closeRow();
                            } catch (e) {}
                          }}>
                          <Icon
                            size={30}
                            name={
                              Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'
                            }
                            style={{color: 'white'}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
                <View style={{marginTop: 20}} />
                {dataBasket != undefined ? (
                  dataBasket.status != 'PENDING' || tableType != undefined ? (
                    <View style={styles.itemSummary}>
                      <Text style={styles.total}>
                        {this.getInfoTextOrder()}
                      </Text>
                      <Text style={styles.total}>{this.getInfoOrder()}</Text>
                    </View>
                  ) : null
                ) : null}
                {this.props.previousTableNo && (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>Table No</Text>
                    <Text style={styles.total}>
                      {this.props.previousTableNo}
                    </Text>
                  </View>
                )}
                {/*<View style={styles.itemSummary}>*/}
                {/*  <Text style={styles.total}>*/}
                {/*    {intlData.messages.statusOrder}*/}
                {/*  </Text>*/}
                {/*  {this.renderStatusOrder()}*/}
                {/*</View>*/}
                <TouchableOpacity
                  onPress={() =>
                    this.props.dataBasket.status == 'PENDING' &&
                    this.props.tableType == undefined
                      ? this.RBSheet.open()
                      : null
                  }
                  style={styles.itemSummary}>
                  <Text style={styles.total}>
                    {intlData.messages.orderMode}
                  </Text>
                  <Text style={[styles.total, styles.badge]}>{orderType}</Text>
                </TouchableOpacity>

                {this.deliveryAddress(orderType, this.props.dataBasket)}

                {this.deliveryProvider(orderType, this.props.dataBasket)}

                {this.props.dataBasket.totalTaxAmount != undefined &&
                  this.props.dataBasket.totalTaxAmount != 0 && (
                    <View style={styles.itemSummary}>
                      <Text style={styles.total}>
                        {appConfig.appName === 'QIJI'
                          ? 'Tax Amount Inclusive'
                          : 'Tax Amount'}
                      </Text>
                      <Text style={styles.total}>
                        {this.format(
                          CurrencyFormatter(
                            this.props.dataBasket.totalTaxAmount,
                          ),
                        )}
                      </Text>
                    </View>
                  )}

                {this.props.dataBasket.totalSurchargeAmount != undefined &&
                  this.props.dataBasket.totalSurchargeAmount != 0 && (
                    <View style={styles.itemSummary}>
                      <Text style={styles.total}>Surcharge Amount</Text>
                      <Text style={styles.total}>
                        {this.format(
                          CurrencyFormatter(
                            this.props.dataBasket.totalSurchargeAmount,
                          ),
                        )}
                      </Text>
                    </View>
                  )}

                {this.isUseTimingSetting() ? (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>
                      {orderType == 'DELIVERY'
                        ? 'Delivery Date & Time'
                        : 'Pickup Date & Time'}
                    </Text>
                    <TouchableOpacity onPress={this.goToPickUpTime}>
                      {this.state.timePickup != null ? (
                        <Text style={[styles.total, styles.badge]}>
                          {this.formatDatePickup()} at {this.state.timePickup}
                        </Text>
                      ) : (
                        <Text style={[styles.total, styles.badgeDanger]}>
                          Please select timeslot
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null}

                {!isEmptyObject(this.state.selectedProvider) &&
                orderType === 'DELIVERY' ? (
                  <View style={styles.itemSummary}>
                    <Text
                      style={[
                        styles.total,
                        {
                          color: colorConfig.store.secondaryColor,
                          fontWeight: 'bold',
                        },
                      ]}>
                      Delivery Fee
                    </Text>
                    <Text
                      style={[
                        styles.total,
                        {
                          color: colorConfig.store.secondaryColor,
                          fontWeight: 'bold',
                        },
                      ]}>
                      {appConfig.appMataUang}{' '}
                      {this.format(
                        CurrencyFormatter(
                          this.state.selectedProvider.deliveryFee,
                        ),
                      )}
                    </Text>
                  </View>
                ) : null}

                {/*<View style={styles.itemSummary}>*/}
                {/*  <Text style={styles.total}>Total</Text>*/}
                {/*  <Text style={styles.total}>*/}
                {/*    {' '}*/}
                {/*    {CurrencyFormatter(this.props.dataBasket.totalNettAmount)}*/}
                {/*  </Text>*/}
                {/*</View>*/}
              </View>
            </ScrollView>
          ) : (
            this.renderNullBasker()
          )
        ) : (
          <Loader />
        )}
        {dataBasket != undefined ? this.renderSettleButtonQuickService() : null}
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
  dataBasket: state.orderReducer.dataBasket.product,
  providers: state.orderReducer.dataProvider.providers,
  outletSingle: state.storesReducer.dataOutletSingle.outletSingle,
  orderType: state.userReducer.orderType.orderType,
  tableType: state.orderReducer.tableType.tableType,
  products: state.orderReducer.productsOutlet.products,
  userPosition: state.userReducer.userPosition.userPosition,
  userDetail: state.userReducer.getUser.userDetails,
  defaultAddress: state.userReducer.defaultAddress.defaultAddress,
  selectedAddress: state.userReducer.selectedAddress.selectedAddress,
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
)(Basket);

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
    borderBottomColor: colorConfig.store.containerColor,
    borderBottomWidth: 1.5,
    margin: 5,
    paddingVertical: 5,
    paddingRight: 5,
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'white',
  },
  itemSummary: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 0.7,
    alignItems: 'baseline',
    // margin: 5,
  },
  listProviders: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 0.7,
    alignItems: 'center',
    // margin: 5,
  },
  title: {
    color: colorConfig.store.title,
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
    fontFamily: 'Lato-Medium',
    color: colorConfig.store.titleSelected,
    fontSize: 14,
    padding: 3,
    // fontWeight: 'bold',
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
    marginLeft: 17,
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
    backgroundColor: colorConfig.card.otherCardColor,
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
  rowBack: {
    alignItems: 'center',
    marginTop: 5,
    // padding: 5,
    marginBottom: 6,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    backgroundColor: colorConfig.store.secondaryColor,
    color: 'white',
    borderRadius: 5,
    padding: 5,
  },
  badgeDanger: {
    backgroundColor: colorConfig.store.colorError,
    color: 'white',
    borderRadius: 5,
    padding: 5,
  },
});
