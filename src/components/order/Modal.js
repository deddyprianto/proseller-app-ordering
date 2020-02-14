import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  CheckBox,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import ProgressiveImage from '../../components/helper/ProgressiveImage';
// import {formatter} from '../../helper/CurrencyFormat';

export default class ModalOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
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

  getImageUrl = image => {
    try {
      if (image != undefined && image != '-' && image != null) {
        return {uri: image};
      }
    } catch (e) {
      console.log(e);
    }
    return appConfig.appImageNull;
  };

  calculateSubTotalModal = () => {
    try {
      let subTotal = 0;
      if (
        this.props.product.product.retailPrice != undefined &&
        this.props.product.product.retailPrice != '-'
      ) {
        subTotal = this.props.product.product.retailPrice;
      }
      subTotal = parseFloat(subTotal * this.props.qtyItem).toFixed(2);
      return subTotal;
    } catch (e) {
      return 0;
    }
  };

  render() {
    return (
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={this.props.isModalVisible}
        transparent={false}
        hardwareAccelerated={true}
        onShow={this.props.modalShow}
        onRequestClose={this.props.backButtonClicked}>
        <View
          style={{
            height: '100%',
            backgroundColor: colorConfig.store.containerColor,
          }}>
          <ScrollView>
            <View style={styles.cardModal}>
              <TouchableOpacity
                onPress={this.props.closeModal}
                style={{
                  top: 10,
                  left: 10,
                  position: 'absolute',
                  zIndex: 2,
                  width: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  backgroundColor: '#e1e4e8',
                  borderRadius: 50,
                }}>
                <Icon
                  size={28}
                  name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                  style={{color: 'white'}}
                />
              </TouchableOpacity>
              <ProgressiveImage
                resizeMode="cover"
                style={styles.imageModal}
                source={this.getImageUrl(this.props.product.defaultImageURL)}
              />
              <View style={styles.detailItemModal}>
                <Text style={[styles.productTitleModal]}>
                  {this.props.product.name}
                </Text>
                <Text style={[styles.productDescModal]}>
                  {this.props.product.description}
                </Text>
              </View>
            </View>
            {/*<View style={styles.cardModal}>*/}
            {/*  <Text style={styles.titleModifierModal}>*/}
            {/*    Flavour, pick 1, max 3*/}
            {/*  </Text>*/}
            {/*  <View style={styles.detailOptionsModal}>*/}
            {/*    <CheckBox*/}
            {/*      value={this.state.checked}*/}
            {/*      onValueChange={() =>*/}
            {/*        this.setState({checked: !this.state.checked})*/}
            {/*      }*/}
            {/*    />*/}
            {/*    <Text style={{marginTop: 5}}> Sayur</Text>*/}
            {/*    <Text style={{marginTop: 5, position: 'absolute', right: 3}}>*/}
            {/*      {' '}*/}
            {/*      0*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*  <View style={styles.detailOptionsModal}>*/}
            {/*    <CheckBox*/}
            {/*      value={this.state.checked}*/}
            {/*      onValueChange={() =>*/}
            {/*        this.setState({checked: !this.state.checked})*/}
            {/*      }*/}
            {/*    />*/}
            {/*    <Text style={{marginTop: 5}}> Sayur</Text>*/}
            {/*    <Text style={{marginTop: 5, position: 'absolute', right: 3}}>*/}
            {/*      {' '}*/}
            {/*      0*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*</View>*/}

            {/*<View style={styles.cardModal}>*/}
            {/*  <Text style={styles.titleModifierModal}>Drink, pick 1</Text>*/}
            {/*  <View style={styles.detailOptionsModal} />*/}
            {/*  <View style={styles.detailOptionsModal}>*/}
            {/*    <RadioButton*/}
            {/*      value="first"*/}
            {/*      status={'checked'}*/}
            {/*      onPress={() => {*/}
            {/*        // this.setState({checked: 'first'});*/}
            {/*      }}*/}
            {/*    />*/}
            {/*    <Text style={{marginTop: 5}}> Sayur</Text>*/}
            {/*    <Text style={{marginTop: 5, position: 'absolute', right: 3}}>*/}
            {/*      {' '}*/}
            {/*      0*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*</View>*/}

            <KeyboardAvoidingView style={styles.cardModal}>
              <Text style={styles.titleModifierModal}>Remark</Text>
              <View style={{flexDirection: 'column', paddingBottom: 20}}>
                <TextInput
                  value={this.props.remark}
                  onChangeText={value => this.props.changeRemarkText(value)}
                  placeholder={'Type your remark...'}
                  style={{
                    marginHorizontal: 14,
                    padding: 5,
                    height: 50,
                    borderWidth: 1,
                    fontSize: 13,
                    color: colorConfig.pageIndex.grayColor,
                    fontFamily: 'Lato-Medium',
                    borderColor: colorConfig.pageIndex.inactiveTintColor,
                    textAlignVertical: 'top',
                  }}
                  multiline={true}
                />
              </View>
            </KeyboardAvoidingView>

            <View style={styles.cardModal}>
              <Text style={styles.titleModifierModal}>Quantity</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <View style={styles.panelQty}>
                  <TouchableOpacity
                    onPress={this.props.minQty}
                    style={styles.buttonQty}>
                    <Text style={styles.btnIncreaseDecrease}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.descQty}>{this.props.qtyItem}</Text>
                  <TouchableOpacity
                    onPress={this.props.addQty}
                    style={styles.buttonQty}>
                    <Text style={styles.btnIncreaseDecrease}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/*<View style={[styles.cardModal, {height: 60}]} />*/}
          </ScrollView>
          <View style={styles.panelAddBasketModal}>
            <TouchableOpacity
              onPress={() => {
                this.props.addItemToBasket(
                  this.props.product,
                  this.props.qtyItem,
                  this.props.remark,
                  this.props.product.mode,
                );
              }}
              style={[
                styles.btnAddBasketModal,
                this.props.qtyItem == 0
                  ? {backgroundColor: colorConfig.store.colorError}
                  : null,
              ]}>
              {this.props.qtyItem != 0 ? (
                <Text style={styles.textBtnBasketModal}>
                  {this.props.product.mode == 'add' ? 'Add to ' : 'Update '}
                  Basket - {this.calculateSubTotalModal()}
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
    width: '100%',
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
