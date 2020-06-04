import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import ProgressiveImage from '../../components/helper/ProgressiveImage';
import ModalOrder from '../../components/order/Modal';
import {
  getProductByOutlet,
  addProductToBasket,
  updateProductToBasket,
  getBasket,
  setOrderType,
  getCategoryByOutlet,
  getProductByCategory,
  saveProductsOutlet,
} from '../../actions/order.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../../components/loader';
import ButtonViewBasket from '../../components/order/ButtonViewBasket';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {
  isEmptyArray,
  isEmptyData,
  isEmptyObject,
} from '../../helper/CheckEmpty';
import * as _ from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import {dataStores} from '../../actions/stores.action';
import {StatusBarHeight} from '../../helper/StatusBarChecker';
import EmptySearch from '../atom/EmptySearch';
import NewSearch from '../atom/NewSearch';

class Products2 extends Component {
  constructor(props) {
    super(props);

    this.RBSheet = null;
    this.productsLength = 0;
    this.products = [];
    this.heightHeader = 0;
    this.heightNavBar = 0;
    this.heightCategoryPicker = 0;

    this.state = {
      item: this.props.item,
      products: undefined,
      dataLength: undefined,
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      indexRender: false,
      showBasketButton: true,
      isModalVisible: false,
      qtyItem: 1,
      remark: '',
      take: 1,
      idx: 0,
      selectedCategory: 0,
      selectedProduct: {},
      // orderType: null,
      loadingAddItem: false,
      selectedCategoryModifier: 0,
      loadProducts: true,
      productTemp: {},
      orderType: this.props.orderType,
      refresh: false,
      productsWithMofidier: [],
      selectedproductsWithMofidier: {},
      visibleMenu: false,
      dialogSearch: false,
      searchQuery: '',
      categories: [],
      productsSearch: undefined,
      loadingSearch: false,
    };
  }

  _viewabilityConfig = {
    itemVisiblePercentThreshold: 10,
  };

  _onViewableItemsChanged = ({viewableItems, changed}) => {
    // console.log('Visible items are', viewableItems);
    // console.log('Changed in this iteration', changed);

    if (viewableItems.length == 1) {
      try {
        if (viewableItems[0].index != undefined) {
          this.updateCategoryPosition(viewableItems[0].index);
        }
      } catch (e) {}
    }
  };

  updateCategoryPosition = index => {
    this.setState({selectedCategory: index});
    this.setState({idx: index});
    this.categoryMenuRef.scrollToIndex({animation: true, index: index});
  };

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );

    await this.firstMethodToRun(false);

    // check if outlet is open
    this.prompOutletIsClosed();

    // berfore get new products, delete old products first, so different outlet got different products
    // await this.props.dispatch(removeProducts());

    //  if outlet type is Quick Service, then ignore popup select ordering mode, force set to TAKEAWAY
    // if (this.state.item.outletType == 'QUICKSERVICE') {
    //   this.props.dispatch(setOrderType('TAKEAWAY'));
    // }
  };

  prompOutletIsClosed = () => {
    const {item} = this.state;
    if (item.storeStatus == false) {
      Alert.alert(
        'Outlet is Closed.',
        'Outlet is closed now, but you can still add items to the cart first. :)',
      );
    }
  };

  firstMethodToRun = async refresh => {
    // get product outlet only if outlet ordering status is available
    if (
      this.state.item.orderingStatus == undefined ||
      this.state.item.orderingStatus == 'AVAILABLE'
    ) {
      await this.getCategoryByOutlet(refresh);
      // await this.getProductsByOutlet(refresh);
      // check if basket outlet is not same as current outlet
      await this.checkBucketExist();
    } else {
      await this.setState({products: []});
      this.products = [];
    }
  };

  openOrderingMode = () => {
    // check bucket exist or not
    // only status order PENDING is allowed to order
    // check whether outlet is open and allowed to order, then ask user to select ordering status
    if (this.checkBucketExist() || this.props.dataBasket == undefined)
      if (
        this.props.dataBasket == undefined ||
        this.props.dataBasket.status == 'PENDING'
      ) {
        if (this.outletAvailableToOrder()) this.RBSheet.open();
      }
  };

  updateSelectedCategory = idx => {
    this.setState({selectedCategoryModifier: idx});
  };

  setOrderType = type => {
    const {productTemp} = this.state;
    // check outlet type
    // if (this.state.item.outletType == 'QUICKSERVICE') {
    //   this.props.dispatch(setOrderType('TAKEAWAY'));
    //   this.RBSheet.close();
    // } else {
    //   this.props.dispatch(setOrderType(type));
    //   this.RBSheet.close();
    // }
    this.props.dispatch(setOrderType(type));
    this.RBSheet.close();
    if (!isEmptyObject(productTemp)) {
      setTimeout(() => {
        this.openModal(productTemp);
      }, 30);
    }
  };

  askUserToSelectOrderType = () => {
    const {intlData} = this.props;
    const {item} = this.state;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'slide'}
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
          Order Mode
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
            disabled={item.enableTakeAway == false ? true : false}
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

  askUserToSelectProductModifier = () => {
    const {intlData} = this.props;
    const {
      item,
      productsWithMofidier,
      selectedproductsWithMofidier,
    } = this.state;
    return (
      <RBSheet
        ref={ref => {
          this.RBmodifier = ref;
        }}
        animationType={'slide'}
        // height={250}
        duration={10}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          container: {
            backgroundColor: colorConfig.store.textWhite,
            // justifyContent: 'center',
            // alignItems: 'center',
          },
        }}>
        <Text
          style={{
            color: colorConfig.store.darkColor,
            fontSize: 20,
            paddingBottom: 15,
            fontWeight: 'bold',
            fontFamily: 'Lato-Bold',
            marginLeft: 10,
          }}>
          Item in cart :
        </Text>

        <ScrollView>
          {productsWithMofidier.map(item => (
            <TouchableOpacity
              style={styles.detail}
              onPress={() =>
                this.openModal(selectedproductsWithMofidier, item)
              }>
              <View style={styles.detailItem}>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={[styles.productTitleInModal]}>
                      <Text
                        style={{
                          color: colorConfig.store.defaultColor,
                          fontWeight: 'bold',
                        }}>
                        x {item.quantity}{' '}
                      </Text>
                      {item.product.name}
                    </Text>
                    <Text style={[styles.productTitleInModal]}>
                      <Text
                        style={{
                          color: colorConfig.store.colorSuccess,
                          fontWeight: 'bold',
                          fontSize: 11,
                        }}>
                        Edit
                      </Text>
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productPrice]}>
                  {CurrencyFormatter(item.grossAmount)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => this.openModal(selectedproductsWithMofidier, false)}
          style={styles.makeAnotherProduct}>
          <Icon
            size={25}
            name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
            style={{color: 'white'}}
          />
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              textAlign: 'center',
            }}>
            Make Another
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  checkBucketExist = product => {
    let outletId = this.state.item.storeId;
    try {
      if (this.props.dataBasket != undefined) {
        if (this.props.dataBasket.outlet.id != outletId) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  showAlertBasketNotEmpty = async product => {
    Alert.alert(
      'Change outlet ?',
      'You will delete order in previous outlet..',
      [
        {text: 'Cancel', onPress: () => Actions.pop()},
        {
          text: 'Process',
          onPress: () => this.selectOrderModeAndOpenModal(product),
        },
      ],
      {cancelable: false},
    );
  };

  selectOrderModeAndOpenModal = async product => {
    // save product selected to temporary state
    await this.setState({productTemp: product});
    this.RBSheet.open();
  };

  pushDataProductsToState = async () => {
    try {
      const outletID = this.state.item.storeId;
      let data = await this.props.products.find(item => item.id == outletID);
      // if data is found
      if (
        data != undefined &&
        !isEmptyObject(data) &&
        !isEmptyArray(data.products)
      ) {
        // check if products is exist, then ask user to select ordering mode
        if (!isEmptyObject(data.products[0])) this.openOrderingMode();
        this.products = [];
        this.products.push(data.products[0]);
        // push data with index 0, (first category products)
        await this.setState({
          products: data.products,
          dataLength: data.dataLength,
        });
      } else {
        this.products = [];
        this.setState({
          products: [],
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

  getCategoryByOutlet = async refresh => {
    try {
      const outletID = this.state.item.storeId;
      let response = await this.props.dispatch(
        getCategoryByOutlet(outletID, refresh),
      );
      if (response && !isEmptyArray(response.data)) {
        await this.setState({
          categories: response.data,
        });
        const firstCategoryID = response.data[0].id;
        // const firstDatLength = response.data[0].dataLength;
        await this.getProductsByCategory(firstCategoryID, 0, 100, refresh);

        this.setState({refresh: false});
        // turn back to first category
        try {
          await this.updateCategory([], 0);
        } catch (e) {}

        this.openOrderingMode();
        //  asynchronously get all items for every categories
        if (response.data.length > 1) {
          for (let i = 1; i < response.data.length; i++) {
            let categoryId = response.data[i].id;
            await this.getProductsByCategory(categoryId, 0, 100, refresh);
          }
        }
        let categories = JSON.stringify(response.data);
        categories = JSON.parse(categories);
        categories.finished = true;

        await this.setState({categories});
      }
    } catch (e) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  getProductsByCategory = async (category, skip, take, refresh) => {
    try {
      const outletID = this.state.item.storeId;
      let {categories} = this.state;
      let response = await this.props.dispatch(
        getProductByCategory(outletID, category, skip, take),
      );

      if (response && !isEmptyArray(response.data)) {
        const idxCategory = categories.findIndex(item => item.id == category);
        // if category products is empty
        if (isEmptyArray(categories[idxCategory].items)) {
          categories[idxCategory].items = response.data;
          categories[idxCategory].dataLength = response.dataLength;
          categories[idxCategory].skip = take;
          categories[idxCategory].take = take;
        } else if (
          categories[idxCategory].items.length <
          categories[idxCategory].dataLength
        ) {
          const items = [...categories[idxCategory].items, ...response.data];
          categories[idxCategory].items = items;
          categories[idxCategory].skip += take;
          categories[idxCategory].take = take;
        }
        await this.setState({
          products: categories,
        });
        this.products.push(categories);
        // console.log(categories);
        this.props.dispatch(saveProductsOutlet(categories, outletID, refresh));
      } else {
        await this.setState({
          products: [],
        });
        this.products.push(categories);
      }
    } catch (e) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  getProductsByOutlet = async refresh => {
    try {
      const outletID = this.state.item.storeId;
      if (this.props.products != undefined) {
        // check data products on local storage
        let data = await this.props.products.find(item => item.id == outletID);
        if (
          data != undefined &&
          !isEmptyObject(data) &&
          !isEmptyArray(data.products) &&
          refresh == false
        ) {
          // check if products is exist, then ask user to select ordering mode
          if (!isEmptyObject(data.products[0])) this.openOrderingMode();
          // delay push data 1 second because Flatlist too slow to process large data
          setTimeout(async () => {
            // push data with index 0, (first category products)
            this.products.push(data.products[0]);
            await this.setState({
              products: data.products,
              dataLength: data.dataLength,
            });
          }, 500);
        } else {
          // get data from server
          let response = await this.props.dispatch(
            getProductByOutlet(outletID, refresh),
          );
          if (response.success) {
            this.pushDataProductsToState();
          }
        }
      } else {
        // get data from server
        let response = await this.props.dispatch(
          getProductByOutlet(outletID, refresh),
        );
        if (response.success) {
          this.pushDataProductsToState();
        }
      }
    } catch (e) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    const {orderType} = this.state;
    // roll back order type if user is canceled to select outlet
    if (orderType != undefined) this.props.dispatch(setOrderType(orderType));

    Actions.popTo('pageIndex');
    // console.log(Actions)
  };

  openModal = async (product, skipCheckItem) => {
    this.RBmodifier.close();
    // make modal empty first
    await this.setState({
      selectedProduct: {},
      loadModifierTime: false,
    });
    // get current quantity from product
    let existProduct = false;

    // check if open modal is from modal modifier
    if (skipCheckItem == undefined) {
      existProduct = await this.checkIfItemExistInBasket(product);
    } else if (skipCheckItem != undefined && skipCheckItem != false) {
      existProduct = skipCheckItem;
    }

    // replace ID product with ID Details
    product.id = existProduct.id;

    product.quantity = 1;
    product.remark = '';
    // add initial status to modal order
    product.mode = 'add';

    // remove quantity temp from props
    product.product.productModifiers.map((group, i) => {
      if (!isEmptyArray(group.modifier.details))
        group.modifier.details.map((detail, j) => {
          delete detail.quantity;

          if (
            group.modifier.isYesNo == true &&
            detail.orderingStatus == 'AVAILABLE'
          ) {
            product.product.productModifiers[i].postToServer = true;
            product.product.productModifiers[i].modifier.details[
              j
            ].isSelected = false;
            product.product.productModifiers[i].modifier.details[
              j
            ].quantity = 0;

            // create default value
            if (
              group.modifier.yesNoDefaultValue == true &&
              detail.yesNoValue == 'yes'
            ) {
              product.product.productModifiers[i].modifier.details[
                j
              ].isSelected = true;
              product.product.productModifiers[i].modifier.details[
                j
              ].quantity = 1;
            }

            if (
              group.modifier.yesNoDefaultValue == false &&
              detail.yesNoValue == 'no'
            ) {
              product.product.productModifiers[i].modifier.details[
                j
              ].isSelected = true;
              product.product.productModifiers[i].modifier.details[
                j
              ].quantity = 1;
            }
          }
        });
    });

    // if quantity exist, then mode is update
    if (existProduct != false) {
      product.mode = 'update';
      product.remark = existProduct.remark;
      product.quantity = existProduct.quantity;

      // process modifier
      let find = {};
      if (skipCheckItem != undefined) {
        find = skipCheckItem;
      } else {
        find = this.props.dataBasket.details.find(
          item => item.product.id == product.product.id,
        );
      }

      if (find != undefined && !isEmptyArray(find.modifiers)) {
        product.product.productModifiers.map((group, i) => {
          group.modifier.details.map((detail, j) => {
            find.modifiers.map(data => {
              data.modifier.details.map(item => {
                // make mark that item is in basket
                if (data.modifierID == group.modifierID) {
                  product.product.productModifiers[i].postToServer = true;
                  // set quantity basket to product that openend
                  if (item.id == detail.id) {
                    product.product.productModifiers[i].modifier.details[
                      j
                    ].quantity = item.quantity;
                    // for is selected
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
    }

    if (skipCheckItem == undefined) {
      await this.setState({
        selectedCategoryModifier: 0,
        selectedProduct: product,
        isModalVisible: !this.state.isModalVisible,
      });
    } else {
      setTimeout(async () => {
        await this.setState({
          selectedCategoryModifier: 0,
          selectedProduct: product,
          isModalVisible: !this.state.isModalVisible,
        });
      }, 30);
    }
  };

  isItemsFinishedToLoad = value => {
    const {categories} = this.state;
    if (value != '' && value != undefined && value != null) {
      this.setState({loadingSearch: true});
      // if products not finished loaded, then wait 5sec to search
      if (categories.finished != true) {
        setTimeout(() => {
          this.searchItem(value);
        }, 5000);
      } else {
        this.searchItem(value);
      }
    } else {
      this.setState({
        productsSearch: undefined,
      });
    }
  };

  searchItem = async value => {
    this.setState({loadingSearch: true, productsSearch: undefined});
    const {products} = this.state;
    let productsSearch = undefined;
    //  Client search
    for (let i = 0; i < products.length; i++) {
      let items = [];
      try {
        for (let j = 0; j < products[i].items.length; j++) {
          if (
            products[i].items[j].product.name
              .toLowerCase()
              .includes(value.toLowerCase())
          ) {
            items.push(products[i].items[j]);
          }
        }
      } catch (e) {}

      if (items.length != 0) {
        productsSearch == undefined ? (productsSearch = []) : null;
        let data = JSON.stringify(products[i]);
        data = JSON.parse(data);
        data.items = items;
        productsSearch.push(data);
      }
    }

    if (productsSearch == undefined) productsSearch = [];

    await this.setState({productsSearch, loadingSearch: false});
  };

  toggleModal = async product => {
    try {
      if (
        this.props.dataBasket.status == 'SUBMITTED' ||
        this.props.dataBasket.status == 'CONFIRMED'
      ) {
        Alert.alert(
          'Sorry',
          `Cant update cart now, your previous basket has been ${
            this.props.dataBasket.status
          }`,
        );
        return;
      }
    } catch (e) {}
    if (this.checkBucketExist(product)) {
      this.showAlertBasketNotEmpty(product);
    } else {
      // check if product have modifier, then ask customer to select mode add
      const hasModifier = product.product.productModifiers.length;
      const {dataBasket} = this.props;
      // check if product has in basket
      let isInBasket = false;
      if (dataBasket != undefined) {
        isInBasket = await this.checkIfItemExistInBasket(product);
      }

      if (hasModifier == 0 || isInBasket == false) {
        this.openModal(product);
      } else {
        const productsWithMofidier = dataBasket.details.filter(
          data => data.productID == product.productID,
        );
        await this.setState({
          selectedproductsWithMofidier: product,
          productsWithMofidier,
        });
        this.RBmodifier.open();
      }
    }
  };

  checkIfItemExistInBasket = item => {
    try {
      let outletId = `outlet::${this.state.item.storeId}`;
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.outletID == outletId
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

  getQuantityInBasket = item => {
    try {
      let outletId = `outlet::${this.state.item.storeId}`;
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.outletID == outletId
      ) {
        let productFound = this.props.dataBasket.details.filter(
          data => data.productID == item.productID,
        );

        if (productFound != undefined) {
          if (productFound.length == 1) {
            return productFound[0].quantity;
          } else {
            return _.sumBy(productFound, 'quantity');
          }
        } else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  postItem = async (product, qty, remark) => {
    try {
      let data = {};
      data.details = [];
      const {item} = this.state;

      // check if retail price is not in number format
      if (
        isNaN(product.product.retailPrice) ||
        product.product.retailPrice == '' ||
        product.product.retailPrice == null
      ) {
        product.product.retailPrice = 0;
      }

      let dataproduct = {
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: qty,
      };

      // if product have modifier
      if (product.product.productModifiers.length > 0) {
        // copy object
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
          // replace details
          dataproduct.modifiers[i].modifier.details = tempDetails;
        }

        // check if item modifier was deleted, if yes, then remove array modifier
        dataproduct.modifiers = await _.remove(dataproduct.modifiers, group => {
          return group.modifier.details.length > 0;
        });

        //  calculate total modifier
        let totalModifier = 0;
        await dataproduct.modifiers.map(group => {
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

        //  add total item modifier to subtotal product
        dataproduct.unitPrice += totalModifier;
      }

      let outlet = {
        id: `${this.state.item.storeId}`,
      };
      // if remark is available, then push to array
      if (remark != undefined && remark != '') dataproduct.remark = remark;
      data.outletID = `outlet::${this.state.item.storeId}`;
      data.outlet = outlet;
      data.id = this.state.item.storeId;
      data.details.push(dataproduct);

      // if data basket is not empty, then hide modal and syncronously add to server
      // let outletId = `outlet::${this.state.item.storeId}`;
      // if (
      //   this.props.dataBasket != undefined &&
      //   this.props.dataBasket.outletID == outletId
      // ) {
      //   this.setState({
      //     selectedProduct: {},
      //     isModalVisible: false,
      //   });
      // }

      // check max order value outlet
      if (!this.checkMaxOrderValue('add', data)) {
        Alert.alert(
          'Sorry..',
          'Maximum order amount is ' +
            CurrencyFormatter(parseFloat(item.maxOrderAmount)),
        );
        return;
      }

      // post data to server
      let response = await this.props.dispatch(addProductToBasket(data));
      console.log('response add ', response);

      // hide modal add modifier
      this.RBmodifier.close();

      // if data basket is empty, then post data to server first, then hide modal
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

  updateItem = async (product, qty, remark) => {
    try {
      const {item} = this.state;
      // hide modal add modifier
      this.RBmodifier.close();

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
      data.outletID = `outlet::${this.state.item.storeId}`;
      data.details.push(dataproduct);

      // check max order value outlet
      if (!this.checkMaxOrderValue('update', data)) {
        Alert.alert(
          'Sorry..',
          'Maximum order amount is ' +
            CurrencyFormatter(parseFloat(item.maxOrderAmount)),
        );
        return;
      }

      // hide modal
      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });

      // send data to action
      let response = await this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      if (response.response.resultCode != 200) {
        Alert.alert('Oppss..', response.response.data.message);
        this.props.dispatch(getBasket());
      }
    } catch (e) {
      Alert.alert('Sorry', 'Something went wrong, please try again.');
      this.props.dispatch(getBasket());
    }
  };

  checkMaxOrderQty = qty => {
    try {
      const {item} = this.state;
      if (
        qty > item.maxOrderQtyPerItem &&
        item.maxOrderQtyPerItem != undefined
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
      const {item} = this.state;
      const {dataBasket} = this.props;
      let basketAmount = 0;
      let priceItem = data.details[0].quantity * data.details[0].unitPrice;

      if (mode == 'add') {
        if (dataBasket != undefined) {
          dataBasket.details.map(item => {
            basketAmount += parseFloat(item.nettAmount);
          });
        } else {
          basketAmount = 0;
        }

        let total = basketAmount + priceItem;

        if (total > item.maxOrderAmount && item.maxOrderAmount != undefined) {
          return false;
        }
      } else {
        let result = '';
        result = JSON.stringify(dataBasket);
        result = JSON.parse(result);
        result.details.map(item => {
          if (item.productID != data.details[0].productID) {
            basketAmount += parseFloat(item.nettAmount);
          }
        });
        let total = basketAmount + priceItem;

        if (total > item.maxOrderAmount && item.maxOrderAmount != undefined) {
          return false;
        }

        return true;
      }

      return true;
    } catch (e) {
      return true;
    }
  };

  addItemToBasket = async (product, qty, remark, mode) => {
    const {item} = this.state;
    // check outlet rules
    if (!this.checkMaxOrderQty(qty)) {
      Alert.alert(
        'Sorry..',
        'Maximum order quantity per Item is ' + item.maxOrderQtyPerItem,
      );
      return;
    }

    if (mode == 'add') {
      // to show loading button at Modal, check status data basket is empty or not
      let outletId = `outlet::${this.state.item.storeId}`;
      // conditional loading if basket is null
      await this.setState({loadingAddItem: true});
      await this.postItem(product, qty, remark);
      await this.setState({loadingAddItem: false});
    } else if (mode == 'update') {
      await this.updateItem(product, qty, remark);
      await this.props.dispatch(getBasket());
    }
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  };

  backButtonClicked = () => {
    this.setState({isModalVisible: false, qtyItem: 1, selectedProduct: {}});
  };

  modalShow = () => {
    let qtyItem = 1;
    let remark = '';
    qtyItem = this.state.selectedProduct.quantity;
    remark = this.state.selectedProduct.remark;

    this.setState({
      selectedCategoryModifier: 0,
      loadModifierTime: false,
      qtyItem,
      remark,
    });

    setTimeout(() => {
      this.setState({loadModifierTime: true});
    }, 700);
  };

  addQty = () => {
    this.setState({qtyItem: this.state.qtyItem + 1});
  };

  minQty = () => {
    if (this.state.qtyItem > 0) {
      // if status is add, then 0 quantity is not allowed
      if (this.state.selectedProduct.mode == 'add' && this.state.qtyItem != 1) {
        this.setState({qtyItem: this.state.qtyItem - 1});
      } else if (this.state.selectedProduct.mode == 'update') {
        this.setState({qtyItem: this.state.qtyItem - 1});
      }
    }
  };

  changeRemarkText = value => {
    this.setState({remark: value});
  };

  getImageUrl = image => {
    try {
      if (image != undefined && image != '-' && image != null) {
        return {uri: image};
      }
    } catch (e) {
      return appConfig.appImageNull;
    }
    return appConfig.appImageNull;
  };

  outletAvailableToOrder = () => {
    // check ordering status outlet
    if (
      this.state.item.orderingStatus == undefined ||
      this.state.item.orderingStatus == 'AVAILABLE'
    ) {
      // check basket is empty then open modal mode order
      if (this.props.dataBasket == undefined) return true;
      // check open / close & outlet ID
      const currentOutletId = this.state.item.storeId;
      const outletIDSelected = this.props.dataBasket.outlet.id;
      if (
        this.state.item.storeStatus == true &&
        currentOutletId == outletIDSelected
      ) {
        return true;
      }
    }
    return false;
  };

  availableToOrder = item => {
    // check ordering status outlet
    if (
      this.state.item.orderingStatus == undefined ||
      this.state.item.orderingStatus == 'AVAILABLE'
    ) {
      return true;
    }
    return false;
  };

  formatNumber = item => {
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

  templateItem = item => {
    return (
      <TouchableOpacity
        disabled={this.availableToOrder(item) ? false : true}
        style={styles.detail}
        onPress={() =>
          this.availableToOrder(item) ? this.toggleModal(item) : false
        }>
        {!this.availableToOrder(item) ? (
          <View
            style={{
              backgroundColor: 'rgba(52, 73, 94, 0.2)',
              width: '100%',
              height: 95,
              position: 'absolute',
              zIndex: 2,
            }}
          />
        ) : null}
        <View style={styles.detailItem}>
          <View style={{flexDirection: 'row'}}>
            {!isEmptyData(item.product.defaultImageURL) ? (
              <ProgressiveImage
                style={styles.imageProduct}
                source={this.getImageUrl(item.product.defaultImageURL)}
              />
            ) : null}
            <View
              style={
                isEmptyData(item.product.defaultImageURL) ? {height: 80} : {}
              }>
              <Text
                style={[
                  styles.productTitle,
                  isEmptyData(item.product.defaultImageURL)
                    ? {maxWidth: Dimensions.get('window').width / 2}
                    : null,
                ]}>
                {this.checkIfItemExistInBasket(item) != false ? (
                  <Text
                    style={{
                      color: colorConfig.store.defaultColor,
                      fontWeight: 'bold',
                    }}>
                    x {this.getQuantityInBasket(item)}{' '}
                  </Text>
                ) : null}
                {item.product.name}
              </Text>
              {item.product.description != undefined &&
              item.product.description != '' ? (
                <Text style={[styles.productDesc]}>
                  {item.product.description}
                </Text>
              ) : null}
            </View>
          </View>
          <Text style={[styles.productPrice]}>
            {item.product.retailPrice != undefined &&
            item.product.retailPrice != '-' &&
            !isNaN(item.product.retailPrice)
              ? this.formatNumber(CurrencyFormatter(item.product.retailPrice))
              : CurrencyFormatter(0)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderCategoryWithProducts = item => {
    return (
      <View style={styles.card}>
        <Text style={styles.titleCategory}>{item.name}</Text>
        <FlatList
          data={item.items}
          getItemLayout={(data, index) => {
            return {length: 95, offset: 95 * index, index};
          }}
          renderItem={({item}) =>
            item.product != null ? this.templateItem(item) : null
          }
          keyExtractor={(product, index) => index.toString()}
          ListFooterComponent={() => this.renderFooter(item)}
          // onEndReachedThreshold={0.01}
          // onEndReached={() => this.handleLoadMoreItems(item)}
        />
      </View>
    );
  };

  handleLoadMoreItems = async item => {
    try {
      const {selectedCategory} = this.state;
      const {categories} = this.state;

      const viewableID = categories[selectedCategory].id;

      if (!isEmptyArray(item.items)) {
        if (item.dataLength > item.items.length) {
          await this.getProductsByCategory(item.id, item.skip, 10, true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  find_dimesions = layout => {
    const {height} = layout;
    this.heightHeader = height;
  };

  goToSearch = () => {
    // this.updateCategory([], 0);
    this.setState({dialogSearch: true, visibleMenu: true});
  };

  updateCategory = async (item, itemIndex) => {
    try {
      this.setState({selectedCategory: itemIndex});
      this.setState({idx: itemIndex});

      this.flatListRef.scrollToItem({
        animated: true,
        item: this.state.products[itemIndex],
      });
    } catch (e) {
      console.log(e);
    }
  };

  renderCategoryProducts = (item, idx) => {
    return (
      <TouchableOpacity
        onPress={() => this.updateCategory(item, idx)}
        style={{
          padding: 8,
          flexDirection: 'row',
        }}>
        <View
          style={[
            this.state.selectedCategory == idx
              ? styles.categoryActive
              : styles.categoryNonActive,
          ]}>
          <Text style={{padding: 8, fontFamily: 'Lato-Medium', color: 'white'}}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderOutlet = () => {
    const {intlData} = this.props;
    return (
      <View
        onLayout={event => {
          this.find_dimesions(event.nativeEvent.layout);
        }}>
        <View>
          {/* Button Close */}
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'transparent',
              zIndex: 2,
              top: 0,
              flexDirection: 'row',
              width: '100%',
            }}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={27}
                name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                style={styles.btnBackIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSearch}
              onPress={this.goToSearch}>
              <Icon
                size={27}
                name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
                style={styles.btnBackIcon}
              />
            </TouchableOpacity>
          </View>
          {/* Button Close */}
          <View style={styles.cardImage}>
            {this.state.item.defaultImageURL != undefined ? (
              <ProgressiveImage
                resizeMode="cover"
                style={styles.image}
                source={{
                  uri: this.state.item.defaultImageURL,
                }}
              />
            ) : (
              <ProgressiveImage
                resizeMode="cover"
                style={[styles.image, {width: '100%'}]}
                source={appConfig.appImageNull}
              />
            )}
          </View>
          <View style={styles.storeDescription}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 17,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginRight: 10,
                }}>
                {this.state.item.storeName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Actions.storeDetailStores({item: this.state.item, intlData})
                }>
                <Icon
                  size={26}
                  name={
                    Platform.OS === 'ios' ? 'ios-information' : 'md-information'
                  }
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    width: 25,
                    borderRadius: 50,
                    height: 25,
                    backgroundColor: colorConfig.pageIndex.inactiveTintColor,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}>
              <Text>
                <Icon
                  size={18}
                  name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
                  style={{
                    color: this.state.item.storeStatus
                      ? colorConfig.store.colorSuccess
                      : colorConfig.store.colorError,
                    paddingRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: this.state.item.storeStatus
                      ? colorConfig.store.colorSuccess
                      : colorConfig.store.colorError,
                  }}>
                  {' '}
                  {this.state.item.storeStatus
                    ? intlData.messages.open
                    : intlData.messages.closed}
                </Text>
              </Text>
              <Text>
                <Icon
                  size={18}
                  name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                  style={{color: 'red', paddingRight: 10}}
                />
                <Text style={{fontSize: 13}}>
                  {' '}
                  {this.state.item.region} - {this.state.item.city}
                </Text>
              </Text>
              <Text>
                <Icon
                  size={18}
                  name={Platform.OS === 'ios' ? 'ios-map' : 'md-map'}
                  style={{
                    color: colorConfig.store.defaultColor,
                    paddingRight: 10,
                  }}
                />
                <Text style={{fontSize: 13}}>
                  {' '}
                  {this.state.item.storeJarak != '-'
                    ? this.state.item.storeJarak.toFixed(1) + ' KM'
                    : '-'}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          onLayout={event => {
            let {height} = event.nativeEvent.layout;
            this.heightCategoryPicker = height;
          }}
          style={{
            backgroundColor: '#e1e4e8',
          }}>
          <FlatList
            horizontal={true}
            getItemLayout={(data, index) => {
              return {length: 8, offset: 8 * index, index};
            }}
            data={this.state.products}
            extraData={this.props}
            renderItem={({item, index}) => {
              return this.renderCategoryProducts(item, index);
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  };

  renderHeaderOutletTemplate = () => {
    const {intlData} = this.props;
    return (
      <View>
        {/* Button Close */}
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            zIndex: 2,
            top: 0,
          }}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={27}
              name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
              style={styles.btnBackIcon}
            />
          </TouchableOpacity>
        </View>
        {/* Button Close */}
        <View>
          <View style={styles.cardImage}>
            {this.state.item.defaultImageURL != undefined ? (
              <ProgressiveImage
                resizeMode="cover"
                style={styles.image}
                source={{
                  uri: this.state.item.defaultImageURL,
                }}
              />
            ) : (
              <ProgressiveImage
                resizeMode="cover"
                style={[styles.image, {width: '100%'}]}
                source={appConfig.appImageNull}
              />
            )}
          </View>
          <View style={styles.storeDescription}>
            <View
              style={{
                // flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 17,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  marginRight: 10,
                }}>
                {this.state.item.storeName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Actions.storeDetailStores({item: this.state.item, intlData})
                }>
                <Icon
                  size={26}
                  name={
                    Platform.OS === 'ios' ? 'ios-information' : 'md-information'
                  }
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    width: 25,
                    borderRadius: 50,
                    height: 25,
                    backgroundColor: colorConfig.pageIndex.inactiveTintColor,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                // flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}>
              <Text>
                <Icon
                  size={18}
                  name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
                  style={{
                    color: this.state.item.storeStatus
                      ? colorConfig.store.colorSuccess
                      : colorConfig.store.colorError,
                    paddingRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: this.state.item.storeStatus
                      ? colorConfig.store.colorSuccess
                      : colorConfig.store.colorError,
                  }}>
                  {' '}
                  {this.state.item.storeStatus
                    ? intlData.messages.open
                    : intlData.messages.closed}
                </Text>
              </Text>
              <Text>
                <Icon
                  size={18}
                  name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                  style={{color: 'red', paddingRight: 10}}
                />
                <Text style={{fontSize: 13}}>
                  {' '}
                  {this.state.item.region} - {this.state.item.city}
                </Text>
              </Text>
              <Text>
                <Icon
                  size={18}
                  name={Platform.OS === 'ios' ? 'ios-map' : 'md-map'}
                  style={{
                    color: colorConfig.store.defaultColor,
                    paddingRight: 10,
                  }}
                />
                <Text style={{fontSize: 13}}>
                  {' '}
                  {this.state.item.storeJarak != '-'
                    ? this.state.item.storeJarak.toFixed(1) + ' KM'
                    : '-'}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderProgressiveLoadItem = search => {
    let itemsToLoad = (
      <View style={{height: '100%', backgroundColor: 'white'}}>
        {!search ? this.renderHeaderOutletTemplate() : null}
        <Loader />
        <View style={styles.card}>
          <View style={styles.titleCategory}>
            <View style={{backgroundColor: colorConfig.pageIndex.grayColor}} />
          </View>
          <View style={styles.detail}>
            <View style={styles.detailItem}>
              <View style={{flexDirection: 'row'}}>
                <ProgressiveImage style={styles.imageProduct} />
                <View>
                  <View style={[styles.productDesc]}>
                    <ShimmerPlaceHolder
                      autoRun={true}
                      duration={500}
                      height={15}
                      width={100}
                      colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.productPrice]}>
                <ShimmerPlaceHolder
                  autoRun={true}
                  duration={500}
                  height={15}
                  width={100}
                  colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.titleCategory}>
            <View style={{backgroundColor: colorConfig.pageIndex.grayColor}} />
          </View>
          <View style={styles.detail}>
            <View style={styles.detailItem}>
              <View style={{flexDirection: 'row'}}>
                <ProgressiveImage style={styles.imageProduct} />
                <View>
                  <View style={[styles.productDesc]}>
                    <ShimmerPlaceHolder
                      autoRun={true}
                      duration={500}
                      height={15}
                      width={100}
                      colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.productPrice]}>
                <ShimmerPlaceHolder
                  autoRun={true}
                  duration={500}
                  height={15}
                  width={100}
                  colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );

    return itemsToLoad;
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

  isOpen = outletSingle => {
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

  refreshOutlet = async () => {
    try {
      await this.props.dispatch(dataStores());
      let {item} = this.state;
      let outlet = this.props.dataStores.find(data => data.id == item.storeId);
      item.storeStatus = this.isOpen(outlet);
      item.maxOrderQtyPerItem = outlet.maxOrderQtyPerItem;
      item.maxOrderAmount = outlet.maxOrderAmount;
      item.lastOrderOn = outlet.lastOrderOn;
      item.offlineMessage = outlet.offlineMessage;
      item.enableDineIn =
        outlet.enableDineIn == false || outlet.enableDineIn == '-'
          ? false
          : true;
      item.enableTakeAway =
        outlet.enableTakeAway == false || outlet.enableTakeAway == '-'
          ? false
          : true;
      item.enableTableScan =
        outlet.enableTableScan == false || outlet.enableTableScan == '-'
          ? false
          : true;
      item.storeName = outlet.name;
      item.outletType = outlet.outletType;
      item.orderingStatus = outlet.orderingStatus;
    } catch (e) {}
  };

  _onRefresh = async () => {
    let {item} = this.state;
    await this.setState({products: undefined, refresh: true, item});
    await this.refreshOutlet();
    await this.firstMethodToRun(true);
    await this.setState({refresh: false});
    this.prompOutletIsClosed();
  };

  renderFooter = item => {
    try {
      if (item.items == undefined) {
        return (
          <ActivityIndicator
            size={30}
            color={colorConfig.store.secondaryColor}
          />
        );
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  };

  renderMainList = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this._onRefresh}
          />
        }
        ListHeaderComponent={this.renderHeaderOutlet}
        ref={ref => {
          this.flatListRef = ref;
        }}
        onViewableItemsChanged={this._onViewableItemsChanged}
        viewabilityConfig={this._viewabilityConfig}
        // initialNumToRender={2}
        initialScrollIndex={0}
        data={this.state.products}
        extraData={this.props}
        onScroll={event => {
          let yOffset = event.nativeEvent.contentOffset.y;
          try {
            if (yOffset >= this.heightHeader) {
              this.setState({visibleMenu: true});
            } else {
              this.setState({visibleMenu: false});
            }
          } catch (e) {
            this.setState({visibleMenu: false});
          }
        }}
        renderItem={({item}) => {
          return this.renderCategoryWithProducts(item);
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  renderSearchList = () => {
    const {productsSearch, searchQuery, loadingSearch} = this.state;
    if (!isEmptyArray(productsSearch)) {
      return (
        <View style={[styles.card, {height: '100%'}]}>
          <FlatList
            data={productsSearch}
            renderItem={({item}) => this.renderCategoryWithProducts(item)}
            keyExtractor={(product, index) => index.toString()}
          />
        </View>
      );
    } else {
      if (loadingSearch) {
        return this.renderProgressiveLoadItem(true);
      } else if (isEmptyArray(productsSearch) && productsSearch != undefined) {
        return <EmptySearch />;
      } else {
        return <NewSearch />;
      }
    }
  };

  render() {
    const {intlData, item} = this.props;
    let {loadProducts, visibleMenu, dialogSearch} = this.state;
    let products = this.products;

    return (
      <SafeAreaView style={styles.container}>
        <ModalOrder
          intlData={intlData}
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
        {this.askUserToSelectProductModifier()}
        <>
          {/* MENU FIXED */}
          {visibleMenu ? (
            <View
              style={{
                backgroundColor: 'white',
                // position: 'absolute',
                top: StatusBarHeight,
                zIndex: 99,
                width: '100%',
                shadowColor: '#00000021',
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.9,
                shadowRadius: 7.49,
                elevation: 16,
              }}>
              {!dialogSearch ? (
                <View>
                  <View style={styles.outletHeaderFixed}>
                    <TouchableOpacity
                      onPress={this.goBack}
                      style={{alignItems: 'center', flexDirection: 'row'}}>
                      <Icon
                        size={25}
                        name={
                          Platform.OS === 'ios'
                            ? 'ios-arrow-back'
                            : 'md-arrow-back'
                        }
                        style={{color: colorConfig.pageIndex.grayColor}}
                      />
                      <Text style={styles.outletHeaderFixedTitle}>
                        {item.storeName.substr(0, 20)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{padding: 2, paddingRight: 15}}
                      onPress={() => this.setState({dialogSearch: true})}>
                      <Icon
                        size={28}
                        name={
                          Platform.OS === 'ios' ? 'ios-search' : 'md-search'
                        }
                        style={{color: colorConfig.store.defaultColor}}
                      />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    ref={ref => {
                      this.categoryMenuRef = ref;
                    }}
                    horizontal={true}
                    data={this.state.products}
                    extraData={this.props}
                    renderItem={({item, index}) => {
                      return this.renderCategoryProducts(item, index);
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : (
                <View style={styles.outletHeaderFixed}>
                  <TextInput
                    placeholder={'Product name...'}
                    autoFocus={true}
                    value={this.state.searchQuery}
                    onChangeText={value => {
                      this.setState({searchQuery: value});
                      this.isItemsFinishedToLoad(value);
                    }}
                    style={{
                      backgroundColor: '#f2f2f2',
                      borderRadius: 10,
                      padding: 10,
                      width: '80%',
                      fontSize: 15,
                      color: colorConfig.store.title,
                      fontFamily: 'Lato-Bold',
                    }}
                  />
                  <TouchableOpacity
                    style={styles.clearInputSearch}
                    onPress={() =>
                      this.setState({
                        productsSearch: undefined,
                        searchQuery: '',
                      })
                    }>
                    <Icon
                      size={20}
                      name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                      style={{color: colorConfig.pageIndex.grayColor}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButtonSearch}
                    onPress={() =>
                      this.setState({
                        dialogSearch: false,
                        visibleMenu: false,
                        productsSearch: undefined,
                        searchQuery: '',
                      })
                    }>
                    <Text
                      style={{
                        color: colorConfig.store.colorError,
                        fontFamily: 'Lato-Bold',
                        fontSize: 17,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
          {/* MENU FIXED */}

          {this.state.products != undefined ? (
            !isEmptyArray(this.state.products) ? (
              loadProducts ? (
                <>
                  <View>{this.renderMainList()}</View>
                  {dialogSearch ? (
                    <View
                      style={{
                        position: 'absolute',
                        zIndex: 99,
                        marginTop: 50,
                        width: '100%',
                        height: '100%',
                      }}>
                      {this.renderSearchList()}
                    </View>
                  ) : null}
                </>
              ) : (
                this.renderProgressiveLoadItem()
              )
            ) : (
              <View style={{height: Dimensions.get('window').height}}>
                {item.orderingStatus == undefined ||
                item.orderingStatus == 'AVAILABLE' ? (
                  <View>
                    {this.renderHeaderOutletTemplate()}
                    <Text style={styles.productEmptyText}>
                      Sorry, products is empty :(
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refresh}
                        onRefresh={this._onRefresh}
                      />
                    }>
                    {this.renderHeaderOutletTemplate()}
                    <Text style={styles.offlineOutlet}>
                      {item.offlineMessage != undefined &&
                      item.offlineMessage != '-'
                        ? item.offlineMessage
                        : 'Sorry, ordering is not available now.'}
                    </Text>
                    <TouchableOpacity
                      onPress={this.goBack}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.findAnotherOutlet}>
                        Let's find another outlet
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                )}
              </View>
            )
          ) : (
            this.renderProgressiveLoadItem()
          )}
        </>
        {/* button basket */}
        {this.state.showBasketButton ? (
          this.props.dataBasket != undefined &&
          this.props.dataBasket.outlet != undefined &&
          this.props.dataBasket.outlet.id != undefined &&
          this.props.dataBasket.outlet.id == this.state.item.storeId ? (
            <ButtonViewBasket />
          ) : null
        ) : null}
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  products: state.orderReducer.productsOutlet.products,
  dataBasket: state.orderReducer.dataBasket.product,
  orderType: state.userReducer.orderType.orderType,
  dataStores: state.storesReducer.dataStores.stores,
  dataLength: state.orderReducer.productsOutlet.dataLength,
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
)(Products2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  headerImage: {
    backgroundColor: colorConfig.splash.container,
    padding: 6,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBottom: {
    backgroundColor: colorConfig.store.defaultColor,
    height: 56,
    justifyContent: 'center',
  },
  textBtnBottom: {
    color: colorConfig.splash.container,
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  btnBackIcon: {
    color: 'white',
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: colorConfig.store.transparent,
    height: 40,
    borderRadius: 50,
  },
  btnSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    marginTop: 5,
    marginLeft: '75%',
    backgroundColor: colorConfig.store.transparent,
    height: 40,
    borderRadius: 50,
  },
  imageProduct: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
  },
  storeDescription: {
    backgroundColor: colorConfig.splash.container,
    paddingBottom: 20,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  cardImage: {
    backgroundColor: colorConfig.splash.container,
  },
  card: {
    marginBottom: 10,
    paddingBottom: 40,

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
  cardModal: {
    marginBottom: 10,
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
    alignItems: 'center',
    margin: 10,
  },
  titleCategory: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'bold',
    padding: 14,
  },
  titleModifierModal: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontSize: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    padding: 14,
  },
  title: {
    color: colorConfig.store.defaultColor,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 15,
    marginRight: 15,
    // marginBottom: 5,
  },
  detailOptionsModal: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
  },
  image: {
    height: 180,
    resizeMode: 'stretch',
  },
  imageModal: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'cover',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginBottom: 5,
  },
  detailItemModal: {
    marginTop: 20,
    paddingBottom: 15,
    marginBottom: 10,
  },
  productPrice: {
    color: colorConfig.store.title,
    fontWeight: 'bold',
  },
  productPriceModal: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    marginTop: 27,
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
  },
  productTitle: {
    color: colorConfig.store.title,
    marginLeft: 6,
    fontSize: 17,
    maxWidth: Dimensions.get('window').width / 2 - 50,
  },
  productTitleInModal: {
    color: colorConfig.store.title,
    marginLeft: 6,
    fontSize: 14,
    // maxWidth: Dimensions.get('window').width / 2 - 50,
  },
  productTitleModal: {
    color: colorConfig.store.title,
    marginHorizontal: 6,
    fontFamily: 'Lato-Bold',
    fontSize: 23,
    fontWeight: 'bold',
    maxWidth: Dimensions.get('window').width,
  },
  productDesc: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 6,
    fontSize: 10,
    maxWidth: Dimensions.get('window').width / 2 + 2,
  },
  productDescModal: {
    color: colorConfig.pageIndex.grayColor,
    marginHorizontal: 6,
    fontFamily: 'Lato-Medium',
    fontSize: 13,
    marginTop: 5,
    maxWidth: Dimensions.get('window').width,
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
  panelQty: {
    width: Dimensions.get('window').width / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colorConfig.store.defaultColor,
    marginBottom: 20,
  },
  buttonQty: {
    justifyContent: 'center',
    backgroundColor: colorConfig.store.defaultColor,

    width: 40,
    height: 40,
    borderRadius: 10,
    borderColor: colorConfig.store.defaultColor,
  },
  descQty: {
    alignContent: 'center',
    // padding: 10,
    fontSize: 27,
    color: colorConfig.pageIndex.grayColor,
  },
  btnIncreaseDecrease: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    color: 'white',
  },
  panelAddBasketModal: {
    position: 'absolute',
    bottom: -0,
    height: 70,
    flex: 1,
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
    marginHorizontal: 45,
    backgroundColor: colorConfig.store.defaultColor,
  },
  textBtnBasketModal: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    fontSize: 17,
    textAlign: 'center',
  },
  categoryActive: {
    justifyContent: 'center',
    backgroundColor: colorConfig.store.defaultColor,
    padding: 2,
    borderRadius: 20,
  },
  categoryNonActive: {
    justifyContent: 'center',
    backgroundColor: colorConfig.pageIndex.inactiveTintColor,
    padding: 2,
    borderRadius: 20,
  },
  makeAnotherProduct: {
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colorConfig.store.colorSuccess,
    borderRadius: 15,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  offlineOutlet: {
    marginTop: 50,
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    padding: 5,
    borderRadius: 10,
    fontSize: 24,
    fontFamily: 'Lato-Medium',
    backgroundColor: colorConfig.pageIndex.inactiveTintColor,
    color: 'white',
  },
  productEmptyText: {
    marginTop: 50,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 27,
    color: colorConfig.pageIndex.grayColor,
  },
  findAnotherOutlet: {
    textAlign: 'center',
    marginTop: 25,
    backgroundColor: colorConfig.store.darkColor,
    color: 'white',
    padding: 8,
    fontFamily: 'Lato-Medium',
    borderRadius: 13,
  },
  outletHeaderFixed: {
    width: '100%',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outletHeaderFixedTitle: {
    marginLeft: 20,
    fontSize: 17,
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.defaultColor,
  },
  clearInputSearch: {
    padding: 2,
    position: 'absolute',
    alignItems: 'center',
    marginLeft: '66%',
  },
  closeButtonSearch: {
    padding: 2,
    alignItems: 'center',
    marginLeft: '1%',
  },
});
