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
  Image,
  Button,
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
  updateSurcharge,
  productByCategory,
  getSetting,
} from '../../actions/order.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../../components/loader';
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
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import CartIcon from './CartIcon';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1.changed || r2.changed;
});

class ProductsSpecific extends Component {
  constructor(props) {
    super(props);

    /* CHECK IF ONLY ONE OUTLET IS ACTIVATED */
    if (this.props.item === undefined) {
      this.props.item = this.props.oneOutlet;
    }

    this.RBSheet = null;
    this.productsLength = 0;
    this.products = [];

    let {width} = Dimensions.get('window');

    this._layoutProvider = new LayoutProvider(
      index => {
        if (index !== null) {
          return ViewTypes.FULL;
        }
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.FULL:
            dim.width = width;
            dim.height = 100;
            break;
          default:
            dim.width = width;
            dim.height = 100;
        }
      },
    );

    this._gridLayoutProvider = new LayoutProvider(
      index => {
        if (index !== null) {
          return ViewTypes.FULL;
        }
      },
      (type, dim) => {
        switch (type) {
          case ViewTypes.FULL:
            dim.width = width / 2 - 10;
            dim.height = 320;
            break;
          default:
            dim.width = width / 2 - 10;
            dim.height = 275;
        }
      },
    );

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
      indexLoaded: 1,
      deliveryInfo: false,
      categoryDetail: this.props.categoryDetail,
      search: this.props.search,
      productPlaceholder: null,
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

  refreshQuantityProducts = async product => {
    // update recyclerViewList
    try {
      const {products} = this.state;

      // if products is undefined, then clear all list
      if (!isEmptyArray(product.details)) {
        let arrayID = [];
        for (let i = 0; i < product.details.length; i++) {
          if (
            product.details[i].product != undefined &&
            product.details[i].product != null
          ) {
            arrayID.push(product.details[i].product.id);
          }
        }

        try {
          for (let i = 0; i < products.data.length; i++) {
            if (
              products.data[i].product != null &&
              products.data[i].product != undefined
            ) {
              if (products.data[i].product.id == product.product.id) {
                products.data[i].changed = true;
                await this.setState({products});
                return;
              }
            }
          }
        } catch (e) {}
      } else {
        try {
          const {products} = this.state;
          for (let i = 0; i < products.data.length; i++) {
            if (
              products.data[i].product != null &&
              products.data[i].product != undefined
            ) {
              if (products.data[i].product.id == product.product.id) {
                products.data[i].changed = true;
                await this.setState({products});
                return;
              }
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
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

    const productPlaceholder = await this.props.dispatch(
      getSetting('ProductPlaceholder'),
    );
    if (!isEmptyData(productPlaceholder)) {
      await this.setState({productPlaceholder});
    }

    await this.firstMethodToRun();
  };

  firstMethodToRun = async () => {
    await this.setState({products: undefined});
    await this.getProductsByCategory();
  };

  refreshPage = async (categoryDetail, search) => {
    await this.setState({categoryDetail, search});
    await this.setState({products: undefined});
    await this.getProductsByCategory();
  };

  openOrderingMode = () => {
    // check bucket exist or not
    // only status order PENDING is allowed to order
    // check whether outlet is open and allowed to order, then ask user to select ordering status
    if (this.checkBucketExist() || this.props.dataBasket == undefined) {
      if (
        this.props.dataBasket == undefined ||
        this.props.dataBasket.status == 'PENDING'
      ) {
        if (
          this.outletAvailableToOrder() &&
          this.props.previousOrderingMode == undefined
        ) {
          this.RBSheet.open();
        } else {
          this.props.dispatch(setOrderType(this.props.previousOrderingMode));
        }
      }
    }
  };

  setOrderType = type => {
    const {productTemp, item} = this.state;
    this.props.dispatch(setOrderType(type));
    this.RBSheet.close();
    if (!isEmptyObject(productTemp)) {
      setTimeout(() => {
        this.openModal(productTemp);
      }, 600);
    }
    if (type === 'DELIVERY') {
      if (
        !isEmptyObject(item.orderValidation) &&
        !isEmptyObject(item.orderValidation.delivery)
      ) {
        const data = item.orderValidation.delivery;
        console.log(data, 'datadatadatadatadata');
        if (
          data.maxAmount > 0 ||
          data.minAmount > 0 ||
          data.minQty > 0 ||
          data.maxQty > 0
        ) {
          setTimeout(() => {
            this.setState({deliveryInfo: true});
          }, 700);
        }
      }
    }
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
            fontFamily: 'Poppins-Medium',
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
                        {item.quantity} x{' '}
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
              fontFamily: 'Poppins-Medium',
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
    let outletId = this.state.item.id;
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
      const outletID = this.state.item.id;
      let data = await this.props.products.find(item => item.id == outletID);
      // if data is found
      if (
        data != undefined &&
        !isEmptyObject(data) &&
        !isEmptyArray(data.products)
      ) {
        // check if products is exist, then ask user to select ordering mode
        if (!isEmptyObject(data.products[0])) {
          this.openOrderingMode();
        }
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

  getProductsByCategory = async () => {
    try {
      const {categoryDetail, search} = this.state;
      const outletID = this.state.item.id;
      let response = await this.props.dispatch(
        productByCategory(outletID, categoryDetail, 0, 10, search),
      );

      if (response && !isEmptyArray(response.data)) {
        await this.setState({
          products: response,
        });
      } else {
        await this.setState({
          products: [],
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
      clearInterval(this.intervalOutlet);
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
    if (product.product.productModifiers != undefined) {
      product.product.productModifiers.map((group, i) => {
        if (!isEmptyArray(group.modifier.details)) {
          group.modifier.details.map((detail, j) => {
            delete detail.quantity;

            if (group.modifier.max == 1) {
              product.product.productModifiers[i].modifier.show = false;
              // delete product.product.productModifiers[i].modifier.selected;
            } else {
              product.product.productModifiers[i].modifier.show = true;
            }

            if (
              group.modifier.isYesNo == true &&
              detail.orderingStatus == 'AVAILABLE'
            ) {
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
        }
      });
    }

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
                    // check for radio button
                    if (group.modifier.max == 1) {
                      product.product.productModifiers[i].modifier.show =
                        data.modifier.show;
                    }

                    product.product.productModifiers[i].modifier.details[
                      j
                    ].quantity = item.quantity;
                    // for is selected
                    product.product.productModifiers[i].modifier.details[
                      j
                    ].isSelected = item.isSelected;
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
        isModalVisible: true,
      });
    } else {
      setTimeout(async () => {
        await this.setState({
          selectedCategoryModifier: 0,
          selectedProduct: product,
          isModalVisible: true,
        });
      }, 800);
    }
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
      let hasModifier = false;
      if (
        product.product.productModifiers != undefined &&
        product.product.productModifiers.length > 0
      ) {
        hasModifier = true;
      }
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
      let outletId = `outlet::${this.state.item.id}`;
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.outletID == outletId
      ) {
        let productFound = this.props.dataBasket.details.find(
          data => data.productID == item.productID,
        );
        if (productFound != undefined) {
          return productFound;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  getQuantityInBasket = item => {
    try {
      let outletId = `outlet::${this.state.item.id}`;
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
        } else {
          return false;
        }
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
      if (
        product.product.productModifiers != undefined &&
        product.product.productModifiers.length > 0
      ) {
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
              // check if price is undefined
              if (data.modifier.details[j].price == undefined) {
                data.modifier.details[j].price = 0;
              }

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
                totalModifier += parseFloat(detail.quantity * detail.price);
              }
            });
          }
        });

        //  add total item modifier to subtotal product
        dataproduct.unitPrice += totalModifier;
      }

      let outlet = {
        id: `${this.state.item.id}`,
      };
      // if remark is available, then push to array
      if (remark != undefined && remark != '') {
        dataproduct.remark = remark;
      }
      data.outletID = `outlet::${this.state.item.id}`;
      data.outlet = outlet;
      data.id = this.state.item.id;
      data.details.push(dataproduct);

      // post data to server
      let response = await this.props.dispatch(addProductToBasket(data));
      console.log('response add ', response);

      // hide modal add modifier
      this.RBmodifier.close();

      //count surcharge
      try {
        const {dataBasket} = this.props;
        if (
          dataBasket == undefined ||
          isEmptyObject(dataBasket) ||
          dataBasket.details.length == 1
        ) {
          this.props.dispatch(updateSurcharge(this.props.orderType));
        }
      } catch (e) {}

      // if data basket is empty, then post data to server first, then hide modal
      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });

      if (response.success == false) {
        Alert.alert('Oppss..', response.response.message);
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
      if (
        product.product.productModifiers != undefined &&
        product.product.productModifiers.length > 0
      ) {
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
        dataproduct.modifiers = await _.remove(dataproduct.modifiers, group => {
          return group.modifier.details.length > 0;
        });

        //  add total item modifier to subtotal product
        dataproduct.unitPrice += totalModifier;
      }

      // if remark is available, then push to array
      if (remark != undefined && remark != '') {
        dataproduct.remark = remark;
      }
      data.outletID = `outlet::${this.state.item.id}`;
      data.details.push(dataproduct);

      // hide modal
      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });

      // send data to action
      let response = await this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      if (response.success == false) {
        Alert.alert('Oppss..', response.response.data.message);
        this.props.dispatch(getBasket());
      }
    } catch (e) {
      Alert.alert('Sorry', 'Something went wrong, please try again.');
      this.props.dispatch(getBasket());
    }
  };

  addItemToBasket = async (product, qty, remark, mode) => {
    const {item} = this.state;
    if (mode == 'add') {
      // to show loading button at Modal, check status data basket is empty or not
      let outletId = `outlet::${this.state.item.id}`;
      // conditional loading if basket is null
      await this.setState({loadingAddItem: true});
      await this.postItem(product, qty, remark);
      await this.setState({loadingAddItem: false});
    } else if (mode == 'update') {
      await this.updateItem(product, qty, remark);
      await this.props.dispatch(getBasket());
    }

    // update recyclerViewList
    try {
      const {products} = this.state;
      for (let i = 0; i < products.data.length; i++) {
        if (
          products.data[i].product != null &&
          products.data[i].product != undefined
        ) {
          if (products.data[i].product.id == product.product.id) {
            products.data[i].changed = true;
            await this.setState({products});
            return;
          }
        }
      }
    } catch (e) {}
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
    }, 300);
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
    const {productPlaceholder} = this.state;
    try {
      if (image != undefined && image != '-' && image != null) {
        return {uri: image};
      }
      if (!isEmptyData(productPlaceholder)) {
        return {uri: productPlaceholder};
      }
    } catch (e) {
      return appConfig.foodPlaceholder;
    }
    return appConfig.foodPlaceholder;
  };

  outletAvailableToOrder = () => {
    // check ordering status outlet
    if (
      this.state.item.orderingStatus == undefined ||
      this.state.item.orderingStatus == 'AVAILABLE'
    ) {
      // check basket is empty then open modal mode order
      if (this.props.dataBasket == undefined) {
        return true;
      }
      // check open / close & outlet ID
      const currentOutletId = this.state.item.id;
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
      item.product.orderingStatus == undefined ||
      item.product.orderingStatus == 'AVAILABLE'
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

  renderPromotions = promotions => {
    return promotions.map(item => (
      <View style={{flexDirection: 'row', marginHorizontal: 8}}>
        <Icon
          size={12}
          name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
          style={{color: colorConfig.store.defaultColor, marginRight: 7}}
        />
        <Text style={styles.textPromotion}>{item.name}</Text>
      </View>
    ));
  };

  templateItemGrid = (type, item) => {
    if (item.product != undefined && item.product != null) {
      return (
        <TouchableOpacity
          disabled={this.availableToOrder(item) ? false : true}
          onPress={() =>
            this.availableToOrder(item) ? this.toggleModal(item) : false
          }
          style={styles.gridView}>
          <View>
            {!isEmptyData(item.product.defaultImageURL) ? (
              <Image
                source={this.getImageUrl(item.product.defaultImageURL)}
                style={[
                  {
                    alignSelf: 'center',
                    borderRadius: 5,
                    height: 180,
                    width: Dimensions.get('window').width / 2 - 30,
                    resizeMode: 'cover',
                  },
                  !this.availableToOrder(item) ? {opacity: 0.2} : null,
                ]}
              />
            ) : (
              <Image
                source={this.getImageUrl(item.product.defaultImageURL)}
                style={{
                  alignSelf: 'center',
                  borderRadius: 5,
                  height: 180,
                  width: Dimensions.get('window').width / 2 - 30,
                  resizeMode: 'cover',
                }}
              />
            )}
            <Text
              style={[
                {
                  marginTop: 15,
                  marginLeft: 10,
                  fontSize: 12,
                  fontFamily: 'Poppins-Medium',
                  color: colorConfig.store.title,
                },
                !this.availableToOrder(item) ? {opacity: 0.3} : null,
              ]}>
              {this.checkIfItemExistInBasket(item) != false ? (
                <Text
                  style={{
                    color: colorConfig.store.defaultColor,
                    fontFamily: 'Poppins-Medium',
                  }}>
                  {this.getQuantityInBasket(item)} x{' '}
                </Text>
              ) : null}
              {item.product != undefined
                ? item.product.name.substr(0, 25)
                : '-'}
            </Text>
            {item.product &&
              !isEmptyArray(item.product.promotions) &&
              this.renderPromotions(item.product.promotions)}
            {/* Display Promotion */}
            {this.availableToOrder(item) ? (
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 5,
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  color: colorConfig.store.secondaryColor,
                }}>
                $
                {item.product != undefined &&
                item.product.retailPrice != undefined &&
                item.product.retailPrice != '-' &&
                !isNaN(item.product.retailPrice)
                  ? this.formatNumber(
                      CurrencyFormatter(item.product.retailPrice),
                    )
                  : CurrencyFormatter(0)}
              </Text>
            ) : (
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 5,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                  opacity: 0.3,
                  color: colorConfig.store.title,
                }}>
                Unavailable
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  renderCategoryWithProducts = (item, search) => {
    if (item.dataLength != undefined) {
      let length = 1;
      const outletID = this.state.item.id;
      if (!search) {
        length = item.dataLength;
      } else {
        length = item.dataLength;
      }
      if (length == 0) {
        length = 1;
      }

      let dataProducts = item.data;
      console.log(dataProducts, 'dataProductsdataProducts');
      return (
        <RecyclerListView
          style={{marginLeft: 15}}
          layoutProvider={this._gridLayoutProvider}
          dataProvider={dataProvider.cloneWithRows(dataProducts)}
          rowRenderer={this.templateItemGrid}
          renderFooter={this.renderFooter}
          onEndReached={this.loadMoreProducts}
        />
      );
    } else {
      return (
        <View style={[styles.card, {height: 100}]}>
          <ActivityIndicator
            size={30}
            color={colorConfig.store.secondaryColor}
          />
        </View>
      );
    }
  };

  loadMoreProducts = async () => {
    try {
      try {
        const {categoryDetail, search} = this.state;
        let {products} = this.state;
        const outletID = this.state.item.id;
        let response = await this.props.dispatch(
          productByCategory(
            outletID,
            categoryDetail,
            products.data.length,
            10,
            search,
          ),
        );

        if (response && !isEmptyArray(response.data)) {
          products.data = [...products.data, ...response.data];
          await this.setState({
            products: products,
          });
        }
      } catch (e) {}
    } catch (e) {}
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
    requestAnimationFrame(async () => {
      try {
        let {products} = this.state;
        if (this.state.selectedCategory != itemIndex) {
          this.setState({selectedCategory: itemIndex});
          this.updateCategoryPosition(itemIndex);
          await this.setState({idx: itemIndex});
          await this.setState({loadProducts: false});

          if (isEmptyArray(products[itemIndex].items) && itemIndex != 0) {
            await this.setState({loadProducts: true});
            // await this.getProductsByCategory(item.id, 0, 20, false, itemIndex);
            this.getCategoryData(itemIndex);
          } else {
            setTimeout(() => {
              this.setState({loadProducts: true});
            }, 1500);
          }

          if (itemIndex === 0) {
            try {
              products[products.length - 1].items = undefined;
              this.setState({products});
            } catch (e) {}
            this.setState({indexLoaded: 1});
          }
        }

        // this.flatListRef.scrollToItem({
        //   animated: true,
        //   item: this.state.products[itemIndex],
        // });
      } catch (e) {
        console.log(e);
      }
    });
  };

  renderProgressiveLoadItem = search => {
    let itemsToLoad = (
      <View style={{height: '100%', backgroundColor: 'white'}}>
        {/*{!search ? this.renderHeaderOutletTemplate() : null}*/}
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
            Date.parse(`${currentDate} ${time}`) >=
              Date.parse(`${currentDate} ${day.open}`) &&
            Date.parse(`${currentDate} ${time}`) <
              Date.parse(`${currentDate} ${day.close}`)
          ) {
            open = true;
          }
        });

      if (open) {
        return true;
      } else {
        if (operationalHours.leading == 0) {
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      return false;
    }
  };

  isOpen = outletSingle => {
    if (outletSingle != undefined) {
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
    } else {
      return false;
    }
  };

  refreshOutlet = async () => {
    try {
      await this.props.dispatch(dataStores());
      let {item} = this.state;
      let outlet = await this.props.dataStores.find(data => data.id == item.id);

      item.storeStatus = this.isOpen(outlet);
      item.maxOrderQtyPerItem = outlet.maxOrderQtyPerItem;
      item.maxOrderAmount = outlet.maxOrderAmount;
      item.lastOrderOn = outlet.lastOrderOn;
      item.offlineMessage = outlet.offlineMessage;
      item.takeAwayName = outlet.takeAwayName;
      item.dineInName = outlet.dineInName;
      item.storePickUpName = outlet.storePickUpName;
      item.storeCheckOutName = outlet.storeCheckOutName;
      item.deliveryName = outlet.deliveryName;
      item.enableStoreCheckOut =
        outlet.enableStoreCheckOut == true ? true : false;
      item.enableStorePickUp = outlet.enableStorePickUp == true ? true : false;
      item.enableTakeAway = outlet.enableTakeAway == true ? true : false;
      item.enableDineIn = outlet.enableDineIn == true ? true : false;
      item.enableTableScan = outlet.enableTableScan == true ? true : false;
      item.enableDelivery = outlet.enableDelivery == true ? true : false;
      item.name = outlet.name;
      item.outletType = outlet.outletType;
      item.orderingStatus = outlet.orderingStatus;
      item.enableItemSpecialInstructions = outlet.enableItemSpecialInstructions;
      item.enableRedeemPoint = outlet.enableRedeemPoint;

      this.props.item = item;

      if (outlet.orderingStatus == 'UNAVAILABLE') {
        this.setState({products: []});
      }

      this.setState({item});
    } catch (e) {}
  };

  _onRefresh = async () => {
    let {item} = this.state;
    await this.setState({products: undefined, refresh: true, item});
    try {
      clearInterval(this.interval);
    } catch (e) {}
    await this.refreshOutlet();
    this.checkOpeningHours();
    await this.firstMethodToRun();
    await this.setState({refresh: false});
    // this.prompOutletIsClosed();

    try {
      this.refreshOutletStatus();
    } catch (e) {}
  };

  renderFooter = item => {
    try {
      const {products} = this.state;
      if (products.dataLength != products.data.length) {
        return (
          <ActivityIndicator
            size={50}
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

  getCategoryData = async index => {
    try {
      let {products} = this.state;
      const outletID = this.state.item.id;
      const categorySelected = products[index];
      const categoryIndex = index;
      if (categoryIndex > -1) {
        // await this.setState({selectedCategory: categoryIndex});
        await this.getProductsByCategory(
          categorySelected.id,
          0,
          20,
          false,
          categoryIndex,
        );
        if (this.state.products[categoryIndex].dataLength > 0) {
          let skip = 20;
          for (
            let i = 0;
            i < Math.floor(this.state.products[categoryIndex].dataLength / 20);
            i++
          ) {
            await this.loadMoreProducts(
              this.state.products[categoryIndex].id,
              outletID,
              skip,
              categoryIndex,
            );
            skip += 20;
          }
        }
      }
    } catch (e) {}
  };

  renderSearchList = () => {
    return <NewSearch />;
  };

  askUserToSelectOrderType = () => {
    const {intlData} = this.props;
    const {item} = this.state;
    let height = 330;

    if (item.outletType === 'RETAIL') {
      if (item.enableStoreCheckOut == false) {
        height -= 50;
      }
      if (item.enableStorePickUp == false) {
        height -= 50;
      }
      if (item.enableDelivery == false) {
        height -= 50;
      }

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
              fontFamily: 'Poppins-Medium',
            }}>
            Order Mode
          </Text>
          {item.enableStoreCheckOut == true ? (
            <TouchableOpacity
              disabled={item.enableStoreCheckOut == false ? true : false}
              onPress={() => this.setOrderType('STORECHECKOUT')}
              style={styles.activeTAKEAWAYButton}>
              <Icon
                size={25}
                name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                style={{color: 'white'}}
              />
              <Text
                style={{
                  marginLeft: 10,
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                {item.storeCheckOutName != undefined &&
                item.storeCheckOutName != ''
                  ? item.storeCheckOutName
                  : 'Srore Checkout'}
              </Text>
            </TouchableOpacity>
          ) : null}
          {item.enableStorePickUp == true ? (
            <TouchableOpacity
              onPress={() => this.setOrderType('STOREPICKUP')}
              style={styles.activeDINEINButton}>
              <Icon
                size={25}
                name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
                style={{color: 'white'}}
              />
              <Text
                style={{
                  marginLeft: 10,
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Medium',
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
              <View style={{flexDirection: 'row'}}>
                <Icon
                  size={25}
                  name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'}
                  style={{color: 'white'}}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  {item.deliveryName != undefined && item.deliveryName != ''
                    ? item.deliveryName
                    : 'DELIVERY'}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </RBSheet>
      );
    } else {
      if (item.enableDineIn == false) {
        height -= 50;
      }
      if (item.enableTakeAway == false) {
        height -= 50;
      }
      if (item.enableDelivery == false) {
        height -= 50;
      }

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
              fontFamily: 'Poppins-Medium',
            }}>
            Order Mode
          </Text>
          {item.enableDineIn == true ? (
            <TouchableOpacity
              onPress={() => this.setOrderType('DINEIN')}
              style={styles.activeDINEINButton}>
              <Icon
                size={25}
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
                  fontFamily: 'Poppins-Medium',
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
                size={25}
                name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
                style={{color: 'white'}}
              />
              <Text
                style={{
                  marginLeft: 10,
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Medium',
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
                size={25}
                name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'}
                style={{color: 'white'}}
              />
              <Text
                style={{
                  marginLeft: 10,
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Medium',
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

  render() {
    const {intlData, item} = this.props;
    let {loadProducts, dialogSearch} = this.state;
    let products = this.products;

    return (
      <SafeAreaView style={styles.container}>
        <ModalOrder
          outlet={item}
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
        {this.askUserToSelectProductModifier()}
        {this.askUserToSelectOrderType()}
        <>
          {/* MENU FIXED */}
          {/*{visibleMenu ? (*/}
          <View
            style={{
              backgroundColor: 'white',
              zIndex: 99,
              width: '100%',
              marginBottom: 2,
            }}>
            {!dialogSearch ? (
              <View>
                <View style={styles.outletHeaderFixed}>
                  <TouchableOpacity
                    onPress={this.goBack}
                    style={{
                      alignItems: 'center',
                      flexDirection: 'row',
                      // width: '8%',
                      paddingHorizontal: 10,
                    }}>
                    <Icon
                      size={25}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-arrow-back'
                          : 'md-arrow-back'
                      }
                      style={{color: colorConfig.pageIndex.grayColor}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 2,
                      paddingRight: 15,
                      marginLeft: 15,
                      width: '70%',
                      borderRadius: 7,
                      backgroundColor: '#e1e4e8',
                      flexDirection: 'row',
                      paddingVertical: 7,
                      alignItems: 'center',
                    }}
                    onPress={() => this.setState({dialogSearch: true})}>
                    <Icon
                      size={22}
                      name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'}
                      style={{
                        color: colorConfig.pageIndex.grayColor,
                        marginLeft: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: colorConfig.pageIndex.grayColor,
                        fontSize: 13,
                        marginLeft: 10,
                        fontFamily: 'Poppins-Regular',
                      }}>
                      {this.state.search != undefined
                        ? this.state.search
                        : `Search in ${this.state.item.name.substr(0, 15)}`}
                    </Text>
                  </TouchableOpacity>
                  <CartIcon
                    outletID={this.state.item.id}
                    dataBasket={this.props.dataBasket}
                    refreshQuantityProducts={this.refreshQuantityProducts}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.outletHeaderFixed}>
                <TextInput
                  placeholder={'Product name...'}
                  autoFocus={true}
                  returnKeyType={'search'}
                  value={this.state.searchQuery}
                  onChangeText={value => {
                    this.setState({searchQuery: value});
                  }}
                  onSubmitEditing={() => {
                    const {item, searchQuery} = this.state;
                    if (searchQuery != '') {
                      this.setState({searchQuery: '', dialogSearch: false});
                      this.refreshPage(
                        {
                          name: searchQuery,
                        },
                        searchQuery,
                      );
                    }
                  }}
                  style={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: 7,
                    padding: 10,
                    width: '80%',
                    fontSize: 15,
                    color: colorConfig.store.title,
                    fontFamily: 'Poppins-Medium',
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
                      fontFamily: 'Poppins-Medium',
                      fontSize: 17,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* MENU FIXED */}
          <View
            style={{
              backgroundColor: 'white',
            }}>
            <Text style={styles.titleCategory}>
              {this.state.search != undefined && 'Result for : '}
              {this.state.categoryDetail.name.substr(0, 35)}
            </Text>
          </View>
          {this.state.products != undefined ? (
            !isEmptyArray(this.state.products.data) ? (
              loadProducts ? (
                <>
                  {this.renderCategoryWithProducts(this.state.products)}
                  {dialogSearch ? (
                    <View
                      style={{
                        position: 'absolute',
                        // zIndex: 99,
                        top: StatusBarHeight + 50,
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
              <View style={{flex: 1}}>
                {item.orderingStatus == undefined ||
                item.orderingStatus == 'AVAILABLE' ? (
                  <View>
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
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  products: state.orderReducer.productsOutlet.products,
  dataBasket: state.orderReducer.dataBasket.product,
  orderType: state.userReducer.orderType.orderType,
  dataStores: state.storesReducer.dataStores.stores,
  oneOutlet: state.storesReducer.oneOutlet.oneOutlet,
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
)(ProductsSpecific);

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
    // margin: 10,
    textAlign: 'center',
  },
  btnBack: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: colorConfig.store.transparentItem,
    height: 40,
    borderRadius: 50,
  },
  btnSearch: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    marginTop: 5,
    marginLeft: '75%',
    backgroundColor: colorConfig.store.transparentItem,
    height: 40,
    borderRadius: 50,
  },
  imageProduct: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  imageProductUnavailable: {
    width: 80,
    height: 80,
    borderRadius: 5,
    opacity: 0.2,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
  },
  storeDescription: {
    backgroundColor: colorConfig.splash.container,
    paddingBottom: 20,
    paddingTop: 10,
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
    // shadowColor: '#00000021',
    // shadowOffset: {
    //   width: 0,
    //   height: 9,
    // },
    // shadowOpacity: 0.7,
    // shadowRadius: 7.49,
    // elevation: 12,
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
    color: colorConfig.store.defaultColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: colorConfig.store.containerColor,
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
    maxHeight: 95,
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
    height: 250,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  imageModal: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'cover',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 0.6,
    paddingBottom: 10,
    marginBottom: 5,
    overflow: 'hidden',
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
    fontFamily: 'Poppins-Medium',
  },
  productTitle: {
    color: colorConfig.store.title,
    marginLeft: 6,
    fontSize: 15,
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
    fontFamily: 'Poppins-Medium',
    fontSize: 23,
    fontWeight: 'bold',
    maxWidth: Dimensions.get('window').width,
  },
  productDesc: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 6,
    fontSize: 12,
    maxWidth: Dimensions.get('window').width / 2 + 2,
  },
  productUnavailable: {
    color: colorConfig.pageIndex.grayColor,
    opacity: 0.5,
    fontFamily: 'Poppins-Regular',
    marginLeft: 6,
    marginTop: 3,
    fontSize: 14,
    maxWidth: Dimensions.get('window').width / 2 + 2,
  },
  productDescModal: {
    color: colorConfig.pageIndex.grayColor,
    marginHorizontal: 6,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Medium',
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
    fontFamily: 'Poppins-Medium',
    borderRadius: 10,
    padding: 13,
    marginHorizontal: 45,
    backgroundColor: colorConfig.store.defaultColor,
  },
  textBtnBasketModal: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    textAlign: 'center',
  },
  categoryActive: {
    justifyContent: 'center',
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: `rgba(${colorConfig.PRIMARY_COLOR_RGB}, 0.05)`,
    // marginBottom: -8,
    // padding: 2,
  },
  categoryNonActive: {
    justifyContent: 'center',
    // backgroundColor: colorConfig.pageIndex.inactiveTintColor,
    padding: 2,
    // borderRadius: 20,
  },
  // categoryActive: {
  //   justifyContent: 'center',
  //   backgroundColor: colorConfig.store.defaultColor,
  //   padding: 2,
  //   borderRadius: 20,
  // },
  // categoryNonActive: {
  //   justifyContent: 'center',
  //   backgroundColor: colorConfig.pageIndex.inactiveTintColor,
  //   padding: 2,
  //   borderRadius: 20,
  // },
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
    padding: 14,
    backgroundColor: colorConfig.card.otherCardColor,
    borderRadius: 10,
    width: '60%',
    marginBottom: 15,
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
    padding: 14,
    backgroundColor: colorConfig.store.secondaryColor,
    borderRadius: 10,
    width: '60%',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDELIVERYButton: {
    padding: 14,
    backgroundColor: colorConfig.store.defaultColor,
    borderRadius: 10,
    width: '60%',
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
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
    borderRadius: 13,
  },
  outletHeaderFixed: {
    width: '100%',
    height: 55,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  outletHeaderFixedTitle: {
    marginLeft: 20,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.titleSelected,
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
  gridView: {
    flex: 1,
    height: 320,
    // alignItems: 'stretch',
    backgroundColor: 'white',
    marginRight: 13,
    borderRadius: 3,
    alignItems: 'center',
    marginBottom: 8,
    paddingTop: 5,
  },
  textInfoDelivery: {
    color: colorConfig.store.titleSelected,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    lineHeight: 30,
  },
  textPromotion: {
    textTransform: 'capitalize',
    fontFamily: 'Poppins-Italic',
    fontSize: 9,
    color: colorConfig.store.secondaryColor,
  },
});
