import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
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
} from '../../actions/order.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../../components/loader';
import ButtonViewBasket from '../../components/order/ButtonViewBasket';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

class StoreDetailStores extends Component {
  constructor(props) {
    super(props);

    this.productsLength = 0;
    this.products = [];
    this.heightHeader = 0;
    this.heightNavBar = 0;
    this.heightCategoryPicker = 0;

    this.state = {
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
      'Opps...',
      "Looks like your previous basket wasn't empty",
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
      let payload = {
        skip: 0,
        take: 1000,
      };
      let response = await this.props.dispatch(
        getProductByOutlet(this.props.item.storeId, payload),
      );
      console.log('response get product ', response);
      if (response.success) {
        if (
          this.props.products != undefined &&
          this.props.products.length != 0
        ) {
          this.products.push(this.props.products[0]);
        }
      } else {
        Alert.alert('Opss..', 'Something went wrong, please try again.');
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
    Actions.pop();
  };

  openModal = async product => {
    // get current quantity from product
    let existProduct = await this.checkIfItemExistInBasket(product);
    product.quantity = 1;
    product.remark = '';
    // add initial status to modal order
    product.mode = 'add';
    // if quantity exist, then mode is update
    if (existProduct != false) {
      product.mode = 'update';
      product.remark = existProduct.remark;
      product.quantity = existProduct.quantity;
    }
    this.setState({
      selectedProduct: product,
      isModalVisible: !this.state.isModalVisible,
    });
  };

  toggleModal = async product => {
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
        if (productFound != undefined) return productFound;
        else return false;
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
      let dataproduct = {
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: qty,
      };
      let outlet = {
        id: `${this.props.item.storeId}`,
      };
      // if remark is available, then push to array
      if (remark != undefined && remark != '') dataproduct.remark = remark;
      data.outletID = `outlet::${this.props.item.storeId}`;
      data.outlet = outlet;
      data.id = this.props.item.storeId;
      data.details.push(dataproduct);
      let response = this.props.dispatch(addProductToBasket(data));
      // console.log('response add ', response);
      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });

      if (response.success == false) {
        Alert.alert('Oppss..', 'Failed to add item to basket.');
      }
    } catch (e) {
      Alert.alert('Oppss..', 'Please try again.');
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
      // if remark is available, then push to array
      if (remark != undefined && remark != '') dataproduct.remark = remark;
      data.outletID = `outlet::${this.props.item.storeId}`;
      data.details.push(dataproduct);

      // search detail ID on previous data
      let previousData = this.props.dataBasket.details.find(
        item => item.productID == product.productID,
      );

      // hide modal
      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });

      // send data to action
      let response = await this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      if (response.resultCode != 200) {
        Alert.alert('Oppss..', 'Failed to update item to basket.');
      }
    } catch (e) {
      Alert.alert('Sorry', 'Something went wrong, please try again.');
    }
  };

  addItemToBasket = async (product, qty, remark, mode) => {
    if (mode == 'add') {
      await this.postItem(product, qty, remark);
      // await this.props.dispatch(getBasket());
    } else if (mode == 'update') {
      await this.updateItem(product, qty, remark);
      await this.props.dispatch(getBasket());
    }
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  };

  backButtonClicked = () => {
    this.setState({isModalVisible: false, qtyItem: 1});
    // console.log('Modal has been closed when back button is clicked');
  };

  modalShow = () => {
    let qtyItem = 1;
    let remark = '';
    qtyItem = this.state.selectedProduct.quantity;
    remark = this.state.selectedProduct.remark;
    // if (this.state.selectedProduct.quantity != false) {
    //   qtyItem = this.state.selectedProduct.quantity;
    // }
    this.setState({qtyItem, remark});
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
    let dataLength = this.props.dataLength;
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
      let dataLength = this.props.dataLength;
      let productsLength = this.products.length;
      if (
        productsLength < dataLength &&
        this.state.selectedCategory == 'ALL PRODUCTS'
      ) {
        this.setState({idx: this.state.idx + 1}, () => {
          if (this.productsLength <= dataLength) {
            console.log('product sekarang ', this.products);
            this.products.push(this.props.products[this.state.idx]);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
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
                style={styles.detail}
                onPress={() => this.toggleModal(item)}>
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
                    item.product.retailPrice != '-'
                      ? CurrencyFormatter(item.product.retailPrice)
                      : 0}
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
              fontFamily: 'Lato-Bold',
              backgroundColor: colorConfig.pageIndex.backgroundColor,
            }}
            onValueChange={(itemValue, itemIndex) => {
              try {
                if (itemIndex > 0) {
                  this.products = [];
                  this.setState({idx: 0});
                  this.products.push(this.props.products[itemIndex - 1]);
                } else {
                  this.products = [];
                  this.products.push(this.props.products[0]);
                }

                this.setState({selectedCategory: itemValue});
              } catch (e) {
                console.log(e);
              }
            }}>
            <Picker.Item label="ALL PRODUCTS" value="ALL PRODUCTS" />
            {this.props.products != undefined
              ? this.props.products.map((cat, idx) => (
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
    // console.log('DATA BASKET ', this.props.dataBasket);
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
        />
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
                fontFamily: 'Lato-Bold',
                backgroundColor: colorConfig.pageIndex.backgroundColor,
              }}
              onValueChange={(itemValue, itemIndex) => {
                try {
                  if (itemIndex > 0) {
                    this.products = [];
                    this.setState({idx: 0});
                    this.products.push(this.props.products[itemIndex - 1]);
                  } else {
                    this.products = [];
                    this.products.push(this.props.products[0]);
                  }

                  this.setState({selectedCategory: itemValue});
                } catch (e) {
                  console.log(e);
                }
              }}>
              <Picker.Item label="ALL PRODUCTS" value="ALL PRODUCTS" />
              {this.props.products != undefined
                ? this.props.products.map((cat, idx) => (
                    <Picker.Item key={idx} label={cat.name} value={cat.name} />
                  ))
                : null}
            </Picker>
          </View>
        ) : null}
        {this.props.products != undefined ? (
          this.props.products.length != 0 ? (
            <FlatList
              onMomentumScrollEnd={() =>
                this.setState({showBasketButton: true})
              }
              onScrollBeginDrag={() => this.setState({showBasketButton: false})}
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
    marginBottom: 10,
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
    marginBottom: 10,
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
});
