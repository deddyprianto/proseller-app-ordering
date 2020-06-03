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
  getBasket,
  updateProductToBasket,
  removeBasket,
  setOrderType,
  getProductByOutlet,
  clearTableType,
} from '../../actions/order.action';
import Loader from '../../components/loader';
import ModalOrder from '../../components/order/Modal';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as _ from 'lodash';
import {getOutletById} from '../../actions/stores.action';
import * as geolib from 'geolib';
import appConfig from '../../config/appConfig';

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
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount = async () => {
    try {
      // get data basket
      await this.getBasket();
      // get previous data products from this outlet, for modifier detail purpose
      if (this.props.dataBasket != undefined) {
        let outletID = this.props.dataBasket.outlet.id;
        await this.getProductsByOutlet(outletID);
        // fetch details outlet
        await this.props.dispatch(getOutletById(outletID));
        await this.setState({loading: false});

        // check if user not yet select order mode, then open modal
        if (this.props.orderType == undefined) {
          this.RBSheet.open();
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
          this.props.dispatch(getBasket());
        }, 4000);
      }

      // check if status basket is pending and its take away, then request continoustly to get basket
      const {orderType} = this.props;
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.status == 'PENDING' &&
        orderType == 'TAKEAWAY'
      ) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getBasket());
        }, 4000);
      }

      // check if status basket for TAKE AWAY IS CONFIRMED or SUBMITTED, then request continoustly to get basket
      if (
        this.props.dataBasket != undefined &&
        (this.props.dataBasket.status == 'CONFIRMED' ||
          this.props.dataBasket.status == 'SUBMITTED') &&
        (this.props.dataBasket.outlet.outletType == 'QUICKSERVICE' ||
          this.props.dataBasket.orderingMode == 'TAKEAWAY')
      ) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getBasket());
        }, 4000);
      }
    } catch (e) {
      Alert.alert('Opss..', "Can't get data basket, please try again.");
    }

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  updateSelectedCategory = idx => {
    this.setState({selectedCategoryModifier: idx});
  };

  askUserToSelectOrderType = () => {
    const {intlData, dataBasket} = this.props;
    let item = {};
    if (dataBasket != undefined) {
      item = dataBasket.outlet;
    }
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'fade'}
        height={
          item.enableDineIn == false || item.enableTakeAway == false ? 200 : 250
        }
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
          Change Order Mode
        </Text>
        {item.enableDineIn == true ? (
          <TouchableOpacity
            onPress={() => this.setOrderType('DINEIN')}
            style={
              item.enableDineIn == false
                ? styles.deactiveDINEINButton
                : styles.activeDINEINButton
            }>
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
            onPress={() => this.setOrderType('TAKEAWAY')}
            style={
              item.enableTakeAway == false
                ? styles.deactiveTAKEAWAYButton
                : styles.activeTAKEAWAYButton
            }>
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
      </RBSheet>
    );
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    await this.props.dispatch(getBasket());
    // fetch details outlet
    const outletID = this.props.dataBasket.outlet.id;
    await this.props.dispatch(getOutletById(outletID));
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
          this.props.dispatch(getBasket());
        }, 4000);
      }
    } catch (e) {}
  };

  checkActivateButtonClearRestaurant = dataBasket => {
    const {orderType} = this.props;

    if (dataBasket.status == 'PENDING') {
      return false;
    } else {
      return true;
    }
  };

  checkActivateButton = dataBasket => {
    const {orderType} = this.props;
    if (
      dataBasket.outlet.outletType == 'QUICKSERVICE' ||
      orderType == 'TAKEAWAY' ||
      dataBasket.orderingMode == 'TAKEAWAY'
    ) {
      if (
        dataBasket.status == 'PROCESSING' ||
        dataBasket.status == 'READY_FOR_COLLECTION'
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
            disabled={this.checkActivateButton(dataBasket) ? false : true}
            onPress={this.alertRemoveBasket}
            style={[
              styles.btnCancelBasketModal,
              {
                backgroundColor: this.checkActivateButton(dataBasket)
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

  goToSettle = () => {
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

      //  refresh cart
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.props.dispatch(getBasket());
      }, 3000);

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
        // storeName: this.props.dataBasket.outlet.name,
        dataPay: dataPay,
        storeId: this.props.dataBasket.outlet.id,
        // referenceNo: 'scan.referenceNo',
      };

      // set url to pay
      let url;
      const {orderType, tableType, dataBasket} = this.props;
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
    const {intlData} = this.props;
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
            disabled={!this.isOpen() ? true : false}
            style={
              !this.isOpen()
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
      // let existProduct = await this.checkIfItemExistInBasket(product);
      let existProduct = product;

      if (existProduct != false) {
        // FIND CATEGORY EXIST PRODUCT
        // const categoryProduct = this.state.products.find(
        //   item => `category::${item.id}` == existProduct.product.categoryID,
        // );
        // // FIND PRODUCT BY CATEGORY ABOVE
        // const originalProduct = categoryProduct.items.find(
        //   item => item.id == existProduct.product.id,
        // );
        //  FIND PRODUCTS
        let originalProduct = {};
        const {products} = this.state;
        for (let i = 0; i < products.length; i++) {
          for (let j = 0; j < products[i].items.length; j++) {
            if (products[i].items[j].product.id == existProduct.product.id) {
              originalProduct = products[i].items[j];
              break;
            }
          }
        }

        product.mode = 'update';
        product.remark = existProduct.remark;
        product.quantity = existProduct.quantity;
        product.name = existProduct.product.name;

        try {
          product.product.description = originalProduct.product.description;
        } catch (e) {}

        product.product.productModifiers =
          originalProduct.product.productModifiers;

        // remove quantity temp from props
        product.product.productModifiers.map((group, i) => {
          if (!isEmptyArray(group.modifier.details))
            group.modifier.details.map((detail, j) => {
              delete detail.quantity;
            });
        });

        // process modifier
        // let find = await this.props.dataBasket.details.find(
        //   item => item.product.id == product.product.id,
        // );
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
                        existProduct.product.productModifiers[
                          i
                        ].modifier.details[j].quantity = item.quantity;
                        product.product.productModifiers[i].modifier.details[
                          j
                        ].isSelected = true;
                      } else {
                        product.product.productModifiers[i].modifier.details[
                          j
                        ].isSelected = false;
                      }
                    }
                  });
                });
              });
          });
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
          await this.getDataProducts();
          await this.setState({loading: false});
          // await this.openModal();
        } catch (e) {}
      } else {
        Alert.alert('Opps..', 'Something went wrong, please try again.');
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
        this.props.dispatch(getBasket());
      }
    } catch (e) {
      Alert.alert('Oppss..', 'Please try again.');
      this.props.dispatch(getBasket());
    }
  };

  setOrderType = async type => {
    // const {dataBasket} = this.props;
    // if (dataBasket.outlet.outletType == 'QUICKSERVICE') {
    //   this.props.dispatch(setOrderType('TAKEAWAY'));
    // } else {
    //   this.props.dispatch(setOrderType(type));
    // }
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
          if (dataBasket.tableNo == undefined) {
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
        enableDineIn:
          item.enableDineIn == false || item.enableDineIn == '-' ? false : true,
        enableTakeAway:
          item.enableTakeAway == false || item.enableTakeAway == '-'
            ? false
            : true,
        enableTableScan:
          item.enableTableScan == false || item.enableTableScan == '-'
            ? false
            : true,
      };

      // const screenStack = Actions.prevState.routes[0].routes.length;
      // if (screenStack == 3) {
      //   Actions.replace('products', {item: data});
      // } else {
      Actions.push('products', {item: data});
      // }
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
    else return false;
  };

  render() {
    const {intlData, dataBasket, orderType, tableType} = this.props;
    // give message to user if order has been confirmed
    try {
      if (dataBasket != undefined) {
        //  for outlet type restaurant
        if (
          dataBasket.status == 'CONFIRMED' &&
          this.interval != undefined &&
          dataBasket.outlet.outletType != 'QUICKSERVICE' &&
          dataBasket.orderingMode != 'TAKEAWAY'
        ) {
          // Alert.alert('Congratulation', 'Your order has been CONFIRMED');
          // clearInterval(this.interval);
          // this.interval = undefined;
        }

        //  for outlet type quick service
        if (
          (dataBasket.status == 'PROCESSING' ||
            dataBasket.status == 'READY_FOR_COLLECTION') &&
          this.interval != undefined &&
          (Actions.currentScene == 'basket' ||
            Actions.currentScene == 'waitingFood') &&
          (dataBasket.outlet.outletType == 'QUICKSERVICE' ||
            dataBasket.orderingMode == 'TAKEAWAY')
        ) {
          clearInterval(this.interval);
          this.interval = undefined;
          Actions.replace('waitingFood');
        }
      }

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
              {intlData.messages.detailOrder}{' '}
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.subTitle}>
                    {intlData.messages.detailOrder}
                  </Text>
                  {dataBasket.status == 'PENDING' ? (
                    <TouchableOpacity onPress={this.goToProducts}>
                      <Text style={styles.subTitleAddItems}>+ Add Items</Text>
                    </TouchableOpacity>
                  ) : null}
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
                              {this.props.dataBasket.status == 'PENDING' &&
                              this.props.tableType == undefined ? (
                                <TouchableOpacity
                                  onPress={() => this.openEditModal(item)}
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
                  dataBasket.status != 'PENDING' || tableType != undefined ? (
                    <View style={styles.itemSummary}>
                      <Text style={styles.total}>
                        {this.getInfoTextOrder()}
                      </Text>
                      <Text style={styles.total}>{this.getInfoOrder()}</Text>
                    </View>
                  ) : null
                ) : null}
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>
                    {intlData.messages.statusOrder}
                  </Text>
                  {this.renderStatusOrder()}
                </View>
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
                </TouchableOpacity>
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>
                    {intlData.messages.totalTaxAmmount}
                  </Text>
                  <Text style={styles.total}>
                    {CurrencyFormatter(this.props.dataBasket.totalTaxAmount)}
                  </Text>
                </View>
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
        {dataBasket != undefined
          ? // check type outlet
            dataBasket.outlet.outletType == 'RESTO'
            ? orderType == 'TAKEAWAY' || dataBasket.orderingMode == 'TAKEAWAY'
              ? this.renderSettleButtonRestaurant()
              : dataBasket.status == 'PENDING'
              ? this.renderButtonScanQRCode()
              : this.renderSettleButtonRestaurant()
            : orderType == 'TAKEAWAY' || dataBasket.orderingMode == 'TAKEAWAY'
            ? this.renderSettleButtonQuickService()
            : dataBasket.outlet.enableTableScan != undefined &&
              (dataBasket.outlet.enableTableScan == false ||
                dataBasket.outlet.enableTableScan == '-')
            ? this.renderSettleButtonQuickService()
            : dataBasket.status == 'PENDING' && tableType == undefined
            ? this.renderButtonScanQRCode()
            : this.renderSettleButtonQuickService()
          : null}
        {/*{this.props.dataBasket != undefined &&*/}
        {/*this.props.dataBasket.outlet != undefined*/}
        {/*  ? this.props.dataBasket.status == 'PENDING' &&*/}
        {/*    this.props.tableType == undefined*/}
        {/*    ? this.renderButtonScanQRCode()*/}
        {/*    : this.props.dataBasket.outlet.outletType == 'QUICKSERVICE' ||*/}
        {/*      this.props.orderType == 'TAKEAWAY'*/}
        {/*    ? this.renderSettleButtonQuickService()*/}
        {/*    : this.renderSettleButtonRestaurant()*/}
        {/*  : null}*/}
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
  outletSingle: state.storesReducer.dataOutletSingle.outletSingle,
  orderType: state.userReducer.orderType.orderType,
  tableType: state.orderReducer.tableType.tableType,
  products: state.orderReducer.productsOutlet.products,
  userPosition: state.userReducer.userPosition.userPosition,
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
    padding: 15,
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
    padding: 15,
    backgroundColor: colorConfig.store.secondaryColor,
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
