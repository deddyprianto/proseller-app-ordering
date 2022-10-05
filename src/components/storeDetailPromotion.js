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
  Platform,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import ProgressiveImage from './helper/ProgressiveImage';
import {isEmptyArray, isEmptyData, isEmptyObject} from '../helper/CheckEmpty';
import Loader from './loader';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  addProductToBasket,
  getBasket,
  getSetting,
  productByPromotion,
  updateProductToBasket,
  updateSurcharge,
} from '../actions/order.action';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import appConfig from '../config/appConfig';
import ModalOrder from './order/Modal';
import * as _ from 'lodash';
import CartIcon from './order/CartIcon';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

let dataProvider = new DataProvider((r1, r2) => {
  return r1.changed || r2.changed;
});

class StoreDetailPromotion extends Component {
  constructor(props) {
    super(props);

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
      screenWidth: Dimensions.get('window').width,
      item: this.props.item,
      products: undefined,
      dataLength: undefined,
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
      productPlaceholder: null,
      showAllCategory: false,
    };
  }

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
    await this.getProductsByPromotion();
  };

  getProductsByPromotion = async () => {
    try {
      // const {promotionID} = this.state;
      const promotionID = this.props.dataPromotion.promotionId || null;
      const outletId = this.props.item.sortKey;
      let response = await this.props.dispatch(
        productByPromotion(promotionID, outletId),
      );

      if (response && !isEmptyArray(response.data)) {
        await this.setState({
          products: response.data,
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
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
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
        product.product.productModifiers &&
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
                <View>
                  <View style={[styles.productDesc]}>
                    <ShimmerPlaceHolder
                      autoRun={true}
                      duration={500}
                      height={100}
                      width={Dimensions.get('window').width - 40}
                      colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.detail}>
            <View style={styles.detailItem}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View style={[styles.productDesc]}>
                    <ShimmerPlaceHolder
                      autoRun={true}
                      duration={500}
                      height={100}
                      width={Dimensions.get('window').width - 40}
                      colorShimmer={['#e1e4e8', 'white', '#e1e4e8']}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );

    return itemsToLoad;
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

  renderPromotionName = (itemPromo, type) => {
    try {
      if (itemPromo && itemPromo.items && itemPromo.items.length === 1) {
        if (
          itemPromo.promoDisplayName &&
          itemPromo.promoDisplayName !== null &&
          itemPromo.promoDisplayName !== ''
        ) {
          let promoName = itemPromo.promoDisplayName;
          promoName = promoName.replace(
            '{ItemName}',
            itemPromo.items[0].itemName,
          );
          promoName = promoName.replace(
            '{itemName}',
            itemPromo.items[0].itemName,
          );
          promoName = promoName.replace('{qty}', itemPromo.items[0].quantity);
          let price = this.formatNumber(
            CurrencyFormatter(Number(itemPromo.discValue)),
          );
          promoName = promoName.replace('{promoPrice}', `$${price.trim()}`);

          return promoName.substr(0, 25);
        }
      }
      if (type === 'name') return itemPromo.name.substr(0, 25);
      else return itemPromo.remark;
    } catch (e) {
      if (type === 'name') return itemPromo.name.substr(0, 25);
      else return itemPromo.remark;
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
        <Text style={styles.textPromotion}>
          {this.renderPromotionName(item, 'name')}
        </Text>
      </View>
    ));
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

  templateItemGrid = (type, item) => {
    const {categoryDetail} = this.props;
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
            {item.product != undefined ? item.product.name.substr(0, 40) : '-'}
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
                ? this.formatNumber(CurrencyFormatter(item.product.retailPrice))
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
  };

  renderCategoryWithProducts = () => {
    let dataProducts = this.state.products;
    let length = 1;
    let height = 310 * 1 + 120;
    if (!isEmptyArray(dataProducts)) {
      length = dataProducts.length;
      height = 320 * Math.ceil(length / 2) + 100;
    }
    return (
      <RecyclerListView
        style={{
          marginTop: 10,
          marginLeft: 15,
          height: height,
        }}
        layoutProvider={this._gridLayoutProvider}
        dataProvider={dataProvider.cloneWithRows(dataProducts)}
        rowRenderer={this.templateItemGrid}
      />
    );
  };

  renderMainList = () => {
    let {products} = this.state;
    if (products && !isEmptyArray(products)) {
      products = products;
    } else if (isEmptyArray(products)) {
      products = products;
    } else {
      products = undefined;
    }

    const arrayTemplate = [{data: 1}];
    return (
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.card}>
              <ProgressiveImage
                resizeMode="contain"
                style={styles.imageStamp}
                source={{uri: this.props.dataPromotion.defaultImageURL}}
              />
              <View style={styles.detail}>
                <View style={styles.detailItem}>
                  <Text style={styles.desc}>
                    {this.props.dataPromotion.description}
                  </Text>
                </View>
              </View>
            </View>
            {products && products.length > 0 ? (
              <View style={styles.card}>
                <View style={styles.headerPromotion}>
                  <Text style={styles.fontHeaderPromotion}>Products</Text>
                </View>
              </View>
            ) : null}
          </>
        }
        data={arrayTemplate}
        renderItem={({item, index}) => {
          if (products && products.length > 0) {
            return this.renderCategoryWithProducts();
          } else if (products === undefined) {
            return this.renderProgressiveLoadItem();
          }
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
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

  addItemToBasket = async (product, qty, remark, mode) => {
    const {item} = this.state;
    console.log(item, 'itemitemitem');
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
      for (let i = 0; i < products.length; i++) {
        if (products[i]) {
          if (products[i].product.id == product.product.id) {
            products[i].changed = true;
            await this.setState({products});
            return;
          }
        }
      }
    } catch (e) {}
  };

  updateItem = async (product, qty, remark) => {
    try {
      const {item} = this.state;

      // make payload format to pass to action
      let data = {};
      data.details = [];
      let dataproduct = {
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: qty,
      };

      // search detail ID on previous data

      let previousData = product;

      // if product have modifier
      if (
        product.product.productModifiers &&
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

  updateSelectedCategory = idx => {
    this.setState({selectedCategoryModifier: idx});
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
    // check if product have modifier, then ask customer to select mode add
    let hasModifier = 0;

    try {
      hasModifier = product.product.productModifiers.length;
    } catch (e) {}

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
    }
  };

  openModal = async (product, skipCheckItem) => {
    console.log(product, 'productproductproduct');
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
    try {
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
              // product.product.productModifiers[i].postToServer = true;
              // product.product.productModifiers[i].modifier.details[
              //   j
              // ].isSelected = false;
              // product.product.productModifiers[i].modifier.details[
              //   j
              // ].quantity = 0;

              // create default value
              if (
                group.modifier.yesNoDefaultValue == true &&
                detail.yesNoValue == 'no'
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = false;
                // product.product.productModifiers[i].modifier.details[
                //   j
                // ].quantity = 1;
              }

              if (
                group.modifier.yesNoDefaultValue == false &&
                detail.yesNoValue == 'yes'
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = true;
                // product.product.productModifiers[i].modifier.details[
                //   j
                // ].quantity = 1;
              }
            }
          });
        }
      });
    } catch (e) {}
    // console.log(product, 'productproductproduct');
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
                      // product.product.productModifiers[i].modifier.selected =
                      //   data.modifier.selected;
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

  render() {
    const {intlData, item, outletSelectionMode} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ModalOrder
          outlet={item || {}}
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
        <View style={styles.headerNav}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={26}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText} numberOfLines={1}>
              {this.props.dataPromotion.name.substr(0, 50)}{' '}
            </Text>
          </TouchableOpacity>
          {/* <CartIcon
             outletID={this.state.item.id}
             dataBasket={this.props.dataBasket}
             refreshQuantityProducts={this.refreshQuantityProducts}
           /> */}
        </View>

        {this.renderMainList()}
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
)(StoreDetailPromotion);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  headerNav: {
    paddingVertical: 2,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 27,
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
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    flex: 1,
    textAlign: 'center',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    // margin: 5,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 3,
  },
  item: {
    alignItems: 'center',
    // borderBottomColor: colorConfig.pageIndex.grayColor,
    // borderBottomWidth: 1,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 18,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
  },
  detail: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 15,
  },
  detailItem: {
    flexDirection: 'row',
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.store.titleSelected,
    textAlign: 'left',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  image: {
    width: Dimensions.get('window').width - 40,
    flex: 1,
  },
  imageStamp: {
    width: '100%',
    height: Dimensions.get('window').width / 3,
    resizeMode: 'contain',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  headerPromotion: {
    marginVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 5,
    backgroundColor: colorConfig.store.defaultColor,
    width: '29%',
  },
  fontHeaderPromotion: {
    fontSize: 15,
    paddingLeft: 10,
    color: 'white',
    fontFamily: 'Poppins-Bold',
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
  storeDescription: {
    backgroundColor: colorConfig.splash.container,
    paddingBottom: 20,
    paddingTop: 10,
  },
  cardImage: {
    backgroundColor: colorConfig.splash.container,
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
  detailOptionsModal: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    flexDirection: 'row',
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
  },
  imageModal: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'cover',
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
