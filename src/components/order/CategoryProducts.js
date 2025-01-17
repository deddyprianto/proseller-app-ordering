import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Picker,
  ActivityIndicator,
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
  removeProducts,
  setOrderType,
} from '../../actions/order.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../../components/loader';
import ButtonViewBasket from '../../components/order/ButtonViewBasket';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {isEmptyArray} from '../../helper/CheckEmpty';
import * as _ from 'lodash';
import RBSheet from 'react-native-raw-bottom-sheet';
import {navigate} from '../../utils/navigation.utils';

class StoreDetailStores extends Component {
  constructor(props) {
    super(props);

    this.RBSheet = null;
    this.productsLength = 0;
    this.products = [];
    this.heightHeader = 0;
    this.heightNavBar = 0;
    this.heightCategoryPicker = 0;

    this.state = {
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
      selectedCategory: 'ALL PRODUCTS',
      selectedProduct: {},
      orderType: null,
      loadingAddItem: false,
      selectedCategoryModifier: 0,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    // berfore get new products, delete old products first, so different outlet got different products
    await this.props.dispatch(removeProducts());
    // get product outlet
    await this.getProductsByOutlet();
    // check if basket soutlet is not same as current outlet
    await this.checkBucketExist();

    // check bucket exist or not
    // only status order PENDING is allowed to order
    // check whether outlet is open and allowed to order, then ask user to select ordering status
    if (this.checkBucketExist() || this.props.dataBasket == undefined) {
      if (
        this.props.dataBasket == undefined ||
        this.props.dataBasket.status == 'PENDING'
      ) {
        if (this.outletAvailableToOrder()) {
          this.RBSheet.open();
        }
      }
    }
  };

  updateSelectedCategory = idx => {
    this.setState({selectedCategoryModifier: idx});
  };

  setOrderType = type => {
    this.props.dispatch(setOrderType(type));
    this.RBSheet.close();
  };

  askUserToSelectPaymentType = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'slide'}
        height={250}
        duration={10}
        closeOnDragDown={false}
        closeOnPressMask={false}
        closeOnPressBack={false}
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
        <TouchableOpacity
          onPress={() => this.setOrderType('DINEIN')}
          style={{
            padding: 15,
            backgroundColor: colorConfig.store.colorSuccess,
            borderRadius: 15,
            width: '60%',
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
              textAlign: 'center',
            }}>
            DINE IN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setOrderType('TAKEAWAY')}
          style={{
            padding: 15,
            backgroundColor: colorConfig.store.secondaryColor,
            borderRadius: 15,
            width: '60%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
              textAlign: 'center',
            }}>
            TAKE AWAY
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  checkBucketExist = product => {
    let outletId = this.props.item.storeId;
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
      'Change Restaurant ?',
      'You will delete order in previous restaurant..',
      [
        {text: 'Cancel', onPress: () => Actions.pop()},
        {
          text: 'Process',
          onPress: () => this.openModal(product),
        },
      ],
      {cancelable: false},
    );
  };

  getProductsByOutlet = async () => {
    try {
      const outletID = this.props.item.storeId;
      let response = await this.props.dispatch(getProductByOutlet(outletID));
      console.log('response get product ', response);
      if (response.success) {
        if (
          this.props.products != undefined &&
          this.props.products.length != 0
        ) {
          let data = await this.props.products.find(
            item => item.id == outletID,
          );
          await this.setState({
            products: data.products,
            dataLength: data.dataLength,
          });
          this.products.push(data.products[0]);
        }
      } else {
        Alert.alert('Opss..', 'Something went wrong, please try again.');
      }
      // this.products.push(this.state.products[0]);
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
    Actions.pop();
  };

  openModal = async product => {
    // get current quantity from product
    let existProduct = await this.checkIfItemExistInBasket(product);
    product.quantity = 1;
    product.remark = '';
    // add initial status to modal order
    product.mode = 'add';

    // remove quantity temp from props
    product.product.productModifiers.map((group, i) => {
      group.modifier.details.map((detail, j) => {
        delete detail.quantity;
      });
    });

    // if quantity exist, then mode is update
    if (existProduct != false) {
      product.mode = 'update';
      product.remark = existProduct.remark;
      product.quantity = existProduct.quantity;

      // process modifier
      let find = this.props.dataBasket.details.find(
        item => item.product.id == product.id,
      );
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
                  }
                }
              });
            });
          });
        });
      }
    }
    this.setState({
      selectedCategoryModifier: 0,
      selectedProduct: product,
      isModalVisible: !this.state.isModalVisible,
    });
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
      this.openModal(product);
    }
  };

  checkIfItemExistInBasket = item => {
    try {
      let outletId = `outlet::${this.props.item.storeId}`;
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

  postItem = async (product, qty, remark) => {
    try {
      let data = {};
      data.details = [];

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
        id: `${this.props.item.storeId}`,
      };
      // if remark is available, then push to array
      if (remark != undefined && remark != '') {
        dataproduct.remark = remark;
      }
      data.outletID = `outlet::${this.props.item.storeId}`;
      data.outlet = outlet;
      data.id = this.props.item.storeId;
      data.details.push(dataproduct);

      // if data basket is not empty, then hide modal and syncronously add to server
      // let outletId = `outlet::${this.props.item.storeId}`;
      // if (
      //   this.props.dataBasket != undefined &&
      //   this.props.dataBasket.outletID == outletId
      // ) {
      //   this.setState({
      //     selectedProduct: {},
      //     isModalVisible: false,
      //   });
      // }

      // post data to server
      let response = await this.props.dispatch(addProductToBasket(data));
      console.log('response add ', response);

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
      // make payload format to pass to action
      let data = {};
      data.details = [];
      let dataproduct = {
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: qty,
      };

      // search detail ID on previous data
      let previousData = this.props.dataBasket.details.find(
        item => item.productID == product.productID,
      );

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
      if (remark != undefined && remark != '') {
        dataproduct.remark = remark;
      }
      data.outletID = `outlet::${this.props.item.storeId}`;
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

      if (response.response.resultCode != 200) {
        Alert.alert('Oppss..', response.response.data.message);
        this.props.dispatch(getBasket());
      }
    } catch (e) {
      Alert.alert('Sorry', 'Something went wrong, please try again.');
      this.props.dispatch(getBasket());
    }
  };

  addItemToBasket = async (product, qty, remark, mode) => {
    if (mode == 'add') {
      // to show loading button at Modal, check status data basket is empty or not
      let outletId = `outlet::${this.props.item.storeId}`;
      // conditional loading if basket is null
      // if (this.props.dataBasket == undefined) {
      //   await this.setState({loadingAddItem: true});
      // }
      // if (
      //   this.props.dataBasket != undefined &&
      //   this.props.dataBasket.outletID != outletId
      // ) {
      //   await this.setState({loadingAddItem: true});
      // }
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
    }, 1000);
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

  renderFooter = () => {
    let dataLength = this.state.dataLength;
    let productsLength = this.products.length;
    if (
      productsLength < dataLength &&
      this.state.selectedCategory == 'ALL PRODUCTS'
    ) {
      return <ActivityIndicator size="large" style={{color: '#000'}} />;
    } else {
      return null;
    }
  };

  handleLoadMore = () => {
    try {
      let dataLength = this.state.dataLength;
      let productsLength = this.products.length;
      if (
        productsLength < dataLength &&
        this.state.selectedCategory == 'ALL PRODUCTS'
      ) {
        this.setState({idx: this.state.idx + 1}, () => {
          if (this.productsLength <= dataLength) {
            this.products.push(this.state.products[this.state.idx]);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  outletAvailableToOrder = () => {
    // check ordering status outlet
    if (
      this.props.item.orderingStatus == undefined ||
      this.props.item.orderingStatus == 'AVAILABLE'
    ) {
      // check open / close
      if (this.props.item.storeStatus == true) {
        // check ordering status product
        return true;
      }
    }
    return false;
  };

  availableToOrder = item => {
    // check ordering status outlet
    if (
      this.props.item.orderingStatus == undefined ||
      this.props.item.orderingStatus == 'AVAILABLE'
    ) {
      // check open / close
      if (this.props.item.storeStatus == true) {
        // check ordering status product
        if (
          item.product.orderingStatus == undefined ||
          item.product.orderingStatus == 'AVAILABLE'
        ) {
          return true;
        }
      }
    }
    return false;
  };

  renderCategoryWithProducts = item => {
    return (
      <View style={styles.card}>
        <Text style={styles.titleCategory}>{item.name}</Text>
        <FlatList
          data={item.items}
          renderItem={({item}) =>
            item.product != null ? (
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
                    <ProgressiveImage
                      style={styles.imageProduct}
                      source={this.getImageUrl(item.product.defaultImageURL)}
                    />
                    <View>
                      <Text style={[styles.productTitle]}>
                        {this.checkIfItemExistInBasket(item) != false ? (
                          <Text
                            style={{
                              color: colorConfig.store.defaultColor,
                              fontWeight: 'bold',
                            }}>
                            x {this.checkIfItemExistInBasket(item).quantity}{' '}
                          </Text>
                        ) : null}
                        {item.product.name}
                      </Text>
                      <Text style={[styles.productDesc]}>
                        Product description here ...
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.productPrice]}>
                    {item.product.retailPrice != undefined &&
                    item.product.retailPrice != '-' &&
                    !isNaN(item.product.retailPrice)
                      ? CurrencyFormatter(item.product.retailPrice)
                      : CurrencyFormatter(0)}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null
          }
          keyExtractor={(product, index) => index.toString()}
        />
      </View>
    );
  };

  find_dimesions = layout => {
    const {height} = layout;
    this.heightHeader = height;
  };

  renderHeaderOutlet = () => {
    return (
      <View
        onLayout={event => {
          this.find_dimesions(event.nativeEvent.layout);
        }}>
        <View>
          <View style={styles.cardImage}>
            {this.props.item.defaultImageURL != undefined ? (
              <ProgressiveImage
                resizeMode="cover"
                style={styles.image}
                source={{
                  uri: this.props.item.defaultImageURL,
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
                {this.props.item.storeName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigate('storeDetailStores', {item: this.props.item})
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
                    color: this.props.item.storeStatus
                      ? colorConfig.store.colorSuccess
                      : colorConfig.store.colorError,
                    paddingRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: this.props.item.storeStatus
                      ? colorConfig.store.colorSuccess
                      : colorConfig.store.colorError,
                  }}>
                  {' '}
                  {this.props.item.storeStatus ? 'Open' : 'Closed'}
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
                  {this.props.item.region} - {this.props.item.city}
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
                  {this.props.item.storeJarak.toFixed(1) + ' KM'}
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
            paddingBottom: 10,
            marginBottom: 10,
          }}>
          <Picker
            selectedValue={this.state.selectedCategory}
            style={{
              height: 40,
              padding: 5,
              marginHorizontal: 10,
              marginTop: 10,
              textAlign: 'center',
              fontFamily: 'Poppins-Medium',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
            }}
            onValueChange={(itemValue, itemIndex) => {
              try {
                if (itemIndex > 0) {
                  this.products = [];
                  this.setState({idx: 0});
                  this.products.push(this.state.products[itemIndex - 1]);
                } else {
                  this.products = [];
                  this.products.push(this.state.products[0]);
                }

                this.setState({selectedCategory: itemValue});
              } catch (e) {
                console.log(e);
              }
            }}>
            <Picker.Item label="ALL PRODUCTS" value="ALL PRODUCTS" />
            {this.state.products != undefined
              ? this.state.products.map((cat, idx) => (
                  <Picker.Item key={idx} label={cat.name} value={cat.name} />
                ))
              : null}
          </Picker>
        </View>
      </View>
    );
  };

  renderProgressiveLoadItem = () => {
    let itemsToLoad = (
      <View>
        {this.renderHeaderOutlet()}
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

  render() {
    let products = this.products;
    console.log('DATA PRODUCTS ', products);
    return (
      <View style={styles.container}>
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
        {this.askUserToSelectPaymentType()}
        <View
          style={styles.headerImage}
          onLayout={event => {
            let {height} = event.nativeEvent.layout;
            this.heightNavBar = height;
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
              {this.props.item.storeName}{' '}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.indexRender ? (
          <View
            style={[
              {
                backgroundColor: '#e1e4e8',
                paddingBottom: 10,
                marginBottom: 10,
                position: 'absolute',
                zIndex: 2,
                top: this.heightNavBar,
                width: '100%',
              },
            ]}>
            <Picker
              selectedValue={this.state.selectedCategory}
              style={{
                height: 40,
                padding: 5,
                marginHorizontal: 10,
                marginTop: 10,
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
                backgroundColor: colorConfig.pageIndex.backgroundColor,
              }}
              onValueChange={(itemValue, itemIndex) => {
                try {
                  if (itemIndex > 0) {
                    this.products = [];
                    this.setState({idx: 0});
                    this.products.push(this.state.products[itemIndex - 1]);
                  } else {
                    this.products = [];
                    this.products.push(this.state.products[0]);
                  }

                  this.setState({selectedCategory: itemValue});
                } catch (e) {
                  console.log(e);
                }
              }}>
              <Picker.Item label="ALL PRODUCTS" value="ALL PRODUCTS" />
              {this.state.products != undefined
                ? this.state.products.map((cat, idx) => (
                    <Picker.Item key={idx} label={cat.name} value={cat.name} />
                  ))
                : null}
            </Picker>
          </View>
        ) : null}
        {this.state.products != undefined ? (
          this.state.products.length != 0 ? (
            <FlatList
              // onMomentumScrollEnd={() =>
              //   this.setState({showBasketButton: true})
              // }
              // onScrollBeginDrag={() => this.setState({showBasketButton: false})}
              onScroll={e => {
                let offset = e.nativeEvent.contentOffset.y;
                let index = parseInt(offset / this.heightHeader);
                if (index > 0) {
                  this.setState({indexRender: true});
                } else {
                  this.setState({indexRender: false});
                }
              }}
              removeClippedSubviews={true}
              ListHeaderComponent={this.renderHeaderOutlet}
              data={products}
              extraData={this.props}
              renderItem={({item}) => {
                return this.renderCategoryWithProducts(item);
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={this.renderFooter}
              onEndReachedThreshold={0.01}
              onEndReached={this.handleLoadMore}
            />
          ) : (
            <View>
              <View>
                <View style={styles.cardImage}>
                  {this.props.item.defaultImageURL != undefined ? (
                    <ProgressiveImage
                      resizeMode="cover"
                      style={styles.image}
                      source={{
                        uri: this.props.item.defaultImageURL,
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
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      textAlign: 'center',
                      marginVertical: 17,
                    }}>
                    {this.props.item.storeName}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 10,
                    }}>
                    <Text>
                      <Icon
                        size={18}
                        name={Platform.OS === 'ios' ? 'ios-time' : 'md-time'}
                        style={{
                          color: this.props.item.storeStatus
                            ? colorConfig.store.colorSuccess
                            : colorConfig.store.colorError,
                          paddingRight: 10,
                        }}
                      />
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 15,
                          color: this.props.item.storeStatus
                            ? colorConfig.store.colorSuccess
                            : colorConfig.store.colorError,
                        }}>
                        {' '}
                        {this.props.item.storeStatus ? 'Open' : 'Closed'}
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
                        {this.props.item.region} - {this.props.item.city}
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
                        {this.props.item.storeJarak.toFixed(1) + ' KM'}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  textAlign: 'center',
                  fontSize: 25,
                  justifyContent: 'center',
                  marginTop: 50,
                }}>
                Opps, this outlet doesn't have any products yet :(
              </Text>
            </View>
          )
        ) : (
          this.renderProgressiveLoadItem()
        )}
        {/* button basket */}
        {this.state.showBasketButton ? (
          this.props.dataBasket != undefined &&
          this.props.dataBasket.outlet != undefined &&
          this.props.dataBasket.outlet.id != undefined &&
          this.props.dataBasket.outlet.id == this.props.item.storeId ? (
            <ButtonViewBasket />
          ) : null
        ) : null}
      </View>
    );
  }
}
mapStateToProps = state => ({
  products: state.orderReducer.productsOutlet.products,
  dataBasket: state.orderReducer.dataBasket.product,
  dataLength: state.orderReducer.productsOutlet.dataLength,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(StoreDetailStores);

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
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Poppins-Medium',
  },
  productTitle: {
    color: colorConfig.store.title,
    marginLeft: 6,
    fontSize: 17,
    maxWidth: Dimensions.get('window').width / 2 - 50,
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
    fontSize: 10,
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
});
