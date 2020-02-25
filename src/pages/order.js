import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Button,
  Modal,
  CheckBox,
  RefreshControl,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import createOpenLink from 'react-native-open-maps';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import ProgressiveImage from '../components/helper/ProgressiveImage';
import ModalOrder from '../components/order/Modal';
import {getProductByOutlet} from '../actions/order.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../components/loader';
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
    marginVertical: 5,
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
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
    textAlign: 'left',
    fontWeight: 'bold',
    padding: 14,
  },
  subMenuCategory: {
    color: colorConfig.store.title,
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
    resizeMode: 'cover',
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
    maxWidth: Dimensions.get('window').width / 2 + 2,
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

class StoreDetailStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      isModalVisible: false,
      qtyItem: 1,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    await this.getProductsByOutlet();
  };

  getProductsByOutlet = async () => {
    await this.props.dispatch(
      getProductByOutlet('46f8b506-a716-43ef-b8c5-e1824c504110'),
    );
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

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  };

  backButtonClicked = () => {
    this.setState({isModalVisible: false, qtyItem: 1});
    console.log('Modal has been closed when back button is clicked');
  };

  modalShow = () => {
    console.log('modal ditutup');
    this.setState({qtyItem: 1});
  };

  addQty = () => {
    this.setState({qtyItem: this.state.qtyItem + 1});
  };

  minQty = () => {
    if (this.state.qtyItem > 0) {
      this.setState({qtyItem: this.state.qtyItem - 1});
    }
  };

  calculateSubTotalModal = () => {
    let subTotal = 15;
    subTotal = parseFloat(subTotal * this.state.qtyItem);
    return subTotal;
  };

  render() {
    return (
      <View style={styles.container}>
        <ModalOrder
          isModalVisible={this.state.isModalVisible}
          qtyItem={this.state.qtyItem}
          closeModal={this.closeModal}
          backButtonClicked={this.backButtonClicked}
          toggleModal={this.toggleModal}
          addQty={this.addQty}
          minQty={this.minQty}
          modalShow={this.modalShow}
          calculateSubTotalModal={this.calculateSubTotalModal}
        />
        <View style={styles.headerImage}>
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
        <ScrollView>
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
                style={styles.image}
                source={{
                  uri:
                    'https://cdnph.upi.com/svc/sv/upi_com/8961462650364/2016/1/a058b8e2364d66fea34084fd5af461a0/Walmart-to-bring-back-store-greeters-and-beef-up-security.jpg',
                }}
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
          <View>
            <Text style={styles.subMenuCategory}>Category Products</Text>
          </View>
          {this.props.products != undefined ? (
            this.props.products.length != 0 ? (
              <View style={styles.card}>
                <FlatList
                  data={this.props.products}
                  extraData={this.props}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => Actions.products(item)}
                      style={{
                        borderBottomWidth: 1,
                        borderColor: colorConfig.pageIndex.inactiveTintColor,
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.titleCategory}>{item.name}</Text>
                      <Icon
                        size={20}
                        name={Platform.OS === 'ios' ? 'ios-open' : 'md-open'}
                        style={{
                          position: 'absolute',
                          right: 20,
                          color: colorConfig.pageIndex.grayColor,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            ) : (
              <Text>Products is empty</Text>
            )
          ) : (
            <View>
              <View style={styles.card}>
                <Loader />
                <View style={styles.titleCategory}>
                  <View
                    style={{backgroundColor: colorConfig.pageIndex.grayColor}}
                  />
                </View>
                <TouchableOpacity
                  style={styles.detail}
                  onPress={this.toggleModal}>
                  <View style={styles.detailItem}>
                    <View style={{flexDirection: 'row'}}>
                      <ProgressiveImage style={styles.imageProduct} />
                      <View>
                        <View style={[styles.productDesc]}>
                          <View
                            style={{
                              width: 100,
                              height: 15,
                              borderRadius: 5,
                              backgroundColor: '#e1e4e8',
                            }}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={[styles.productPrice]}>
                      <View
                        style={{
                          width: 30,
                          height: 15,
                          borderRadius: 5,
                          backgroundColor: '#e1e4e8',
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
mapStateToProps = state => ({
  products: state.orderReducer.productsOutlet.products,
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
