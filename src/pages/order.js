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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import createOpenLink from 'react-native-open-maps';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import ProgressiveImage from '../components/helper/ProgressiveImage';

export default class StoreDetailStores extends Component {
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
    console.log('this.props.item ', this.props.item);
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          presentationStyle="fullScreen"
          isVisible={true}
          visible={this.state.isModalVisible}
          transparent={false}
          onShow={this.modalShow}
          onRequestClose={this.backButtonClicked}>
          <View
            style={{
              height: '100%',
              backgroundColor: colorConfig.store.containerColor,
            }}>
            <ScrollView>
              <View style={styles.cardModal}>
                <ProgressiveImage
                  resizeMode="cover"
                  style={styles.imageModal}
                  source={{
                    uri:
                      'https://upload.wikimedia.org/wikipedia/commons/6/62/Nasi_Lemak%2C_Mamak%2C_Sydney.jpg',
                  }}
                />
                <View style={styles.detailItemModal}>
                  <Text style={[styles.productTitleModal]}>
                    Mie Pangsit Goreng Pedas Lemak
                  </Text>
                  <Text style={[styles.productDescModal]}>
                    Nasi + telur goreng ditambah dengan ayam goreng + es teh
                    goreng
                  </Text>
                </View>
              </View>
              <View style={styles.cardModal}>
                <Text style={styles.titleModifierModal}>
                  Flavour, pick 1, max 3
                </Text>
                <View style={styles.detailOptionsModal}>
                  <CheckBox
                    value={this.state.checked}
                    onValueChange={() =>
                      this.setState({checked: !this.state.checked})
                    }
                  />
                  <Text style={{marginTop: 5}}> Sayur</Text>
                  <Text style={{marginTop: 5, position: 'absolute', right: 3}}>
                    {' '}
                    0
                  </Text>
                </View>
                <View style={styles.detailOptionsModal}>
                  <CheckBox
                    value={this.state.checked}
                    onValueChange={() =>
                      this.setState({checked: !this.state.checked})
                    }
                  />
                  <Text style={{marginTop: 5}}> Sayur</Text>
                  <Text style={{marginTop: 5, position: 'absolute', right: 3}}>
                    {' '}
                    0
                  </Text>
                </View>
              </View>

              <View style={styles.cardModal}>
                <Text style={styles.titleModifierModal}>Drink, pick 1</Text>
                <View style={styles.detailOptionsModal}>
                  <CheckBox
                    value={this.state.checked}
                    onValueChange={() =>
                      this.setState({checked: !this.state.checked})
                    }
                  />
                  <Text style={{marginTop: 5}}> Sayur</Text>
                  <Text style={{marginTop: 5, position: 'absolute', right: 3}}>
                    {' '}
                    0
                  </Text>
                </View>
                <View style={styles.detailOptionsModal}>
                  <CheckBox
                    value={this.state.checked}
                    onValueChange={() =>
                      this.setState({checked: !this.state.checked})
                    }
                  />
                  <Text style={{marginTop: 5}}> Sayur</Text>
                  <Text style={{marginTop: 5, position: 'absolute', right: 3}}>
                    {' '}
                    0
                  </Text>
                </View>
              </View>

              <View style={styles.cardModal}>
                <Text style={styles.titleModifierModal}>Quantity</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <View style={styles.panelQty}>
                    <TouchableOpacity
                      onPress={this.minQty}
                      style={styles.buttonQty}>
                      <Text style={styles.btnIncreaseDecrease}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.descQty}>{this.state.qtyItem}</Text>
                    <TouchableOpacity
                      onPress={this.addQty}
                      style={styles.buttonQty}>
                      <Text style={styles.btnIncreaseDecrease}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={[styles.cardModal, {height: 60}]} />
            </ScrollView>
            <View style={styles.panelAddBasketModal}>
              <TouchableOpacity
                onPress={
                  this.state.qtyItem != 0 ? this.toggleModal : this.toggleModal
                }
                style={[
                  styles.btnAddBasketModal,
                  this.state.qtyItem == 0
                    ? {backgroundColor: colorConfig.store.colorError}
                    : null,
                ]}>
                {this.state.qtyItem != 0 ? (
                  <Text style={styles.textBtnBasketModal}>
                    Add to Basket - {appConfig.appMataUang}{' '}
                    {this.calculateSubTotalModal()}
                  </Text>
                ) : (
                  <Text style={styles.textBtnBasketModal}>
                    Remove from basket
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
          <View style={styles.card}>
            <Text style={styles.titleCategory}>Kategori Menu</Text>
            <TouchableOpacity style={styles.detail} onPress={this.toggleModal}>
              <View style={styles.detailItem}>
                <View style={{flexDirection: 'row'}}>
                  <ProgressiveImage
                    style={styles.imageProduct}
                    source={{
                      uri:
                        'https://upload.wikimedia.org/wikipedia/commons/6/62/Nasi_Lemak%2C_Mamak%2C_Sydney.jpg',
                    }}
                  />
                  <View>
                    <Text style={[styles.productTitle]}>
                      <Text
                        style={{
                          color: colorConfig.store.defaultColor,
                          fontWeight: 'bold',
                        }}>
                        x 3
                      </Text>{' '}
                      Mie Pangsit Goreng Pedas Lemak
                    </Text>
                    <Text style={[styles.productDesc]}>
                      Nasi + telur goreng ditambah dengan ayam goreng + es teh
                      goreng
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productPrice]}>SGD 10</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.imageProduct}
                    source={{
                      uri:
                        'https://upload.wikimedia.org/wikipedia/commons/6/62/Nasi_Lemak%2C_Mamak%2C_Sydney.jpg',
                    }}
                  />
                  <View>
                    <Text style={[styles.productTitle]}>
                      Mie Pangsit Goreng Pedas Lemak
                    </Text>
                    <Text style={[styles.productDesc]}>
                      Nasi + telur goreng ditambah dengan ayam goreng + es teh
                      goreng
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productPrice]}>SGD 12</Text>
              </View>
            </View>

            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.imageProduct}
                    source={{
                      uri:
                        'https://upload.wikimedia.org/wikipedia/commons/6/62/Nasi_Lemak%2C_Mamak%2C_Sydney.jpg',
                    }}
                  />
                  <View>
                    <Text style={[styles.productTitle]}>
                      Mie Pangsit Goreng Pedas Lemak
                    </Text>
                    <Text style={[styles.productDesc]}>
                      Nasi + telur goreng ditambah dengan ayam goreng + es teh
                      goreng
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productPrice]}>SGD 12</Text>
              </View>
            </View>

            <View style={styles.detail}>
              <View style={styles.detailItem}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.imageProduct}
                    source={{
                      uri:
                        'https://upload.wikimedia.org/wikipedia/commons/6/62/Nasi_Lemak%2C_Mamak%2C_Sydney.jpg',
                    }}
                  />
                  <View>
                    <Text style={[styles.productTitle]}>
                      Mie Pangsit Goreng Pedas Lemak
                    </Text>
                    <Text style={[styles.productDesc]}>
                      Nasi + telur goreng ditambah dengan ayam goreng + es teh
                      goreng
                    </Text>
                  </View>
                </View>
                <Text style={[styles.productPrice]}>SGD 12</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

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
    marginVertical: 10,
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
