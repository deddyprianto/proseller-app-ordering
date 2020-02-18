import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  FlatList,
  ScrollView,
  Alert,
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
} from '../../actions/order.action';
import Loader from '../../components/loader';
import ModalOrder from '../../components/order/Modal';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {Button, Dialog, Portal} from 'react-native-paper';

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount = async () => {
    try {
      await this.getBasket();
    } catch (e) {
      Alert.alert('Opss..', "Can't get data basket, please try again.");
    }
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  getBasket = async () => {
    this.setState({loading: true});
    await this.props.dispatch(getBasket());
    setTimeout(() => {
      this.setState({loading: false});
    }, 10);
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

  renderButtonConfirm = () => {
    return (
      <View
        style={{
          width: '100%',
          // marginTop: 10,
          position: 'absolute',
          bottom: 30,
          flexDirection: 'row',
          justifyContent: 'center',
          // alignItems: 'center',
          // marginHorizontal: '5%',
        }}>
        <TouchableOpacity
          onPress={this.alertRemoveBasket}
          style={styles.btnCancelBasketModal}>
          <Icon
            size={23}
            name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
            style={{color: 'white', marginRight: 5}}
          />
          <Text style={styles.textBtnBasketModal}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnAddBasketModal}>
          <Icon
            size={23}
            name={Platform.OS === 'ios' ? 'ios-qr-scanner' : 'md-qr-scanner'}
            style={{color: 'white', marginRight: 5}}
          />
          <Text style={styles.textBtnBasketModal}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>
    );
  };

  removeBasket = async () => {
    await this.props.dispatch(removeBasket());
    await this.getBasket();
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
          Sorry, your bucket is empty.
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
    // get current quantity from product
    let existProduct = await this.checkIfItemExistInBasket(product);

    if (existProduct != false) {
      product.mode = 'update';
      product.remark = existProduct.remark;
      product.quantity = existProduct.quantity;
      product.name = existProduct.product.name;
      product.description = existProduct.product.description;
    }

    this.setState({
      selectedProduct: existProduct,
      isModalVisible: !this.state.isModalVisible,
    });
  };

  modalShow = () => {
    let qtyItem = 9;
    let remark = '';
    qtyItem = this.state.selectedProduct.quantity;
    remark = this.state.selectedProduct.remark;
    // if (this.state.selectedProduct.quantity != false) {
    //   qtyItem = this.state.selectedProduct.quantity;
    // }
    this.setState({qtyItem, remark});
  };

  addItemToBasket = async (product, qty, remark, mode) => {
    if (mode == 'update') {
      await this.updateItem(product, qty, remark);
      await this.getBasket();
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
      data.details.push(dataproduct);

      // search detail ID on previous data
      let previousData = this.props.dataBasket.details.find(
        item => item.productID == product.productID,
      );
      // send data to action
      let response = this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      this.setState({
        selectedProduct: {},
        isModalVisible: false,
      });
      if (response.success == false) {
        Alert.alert('Oppss..', 'Failed to update item to basket.');
      }
    } catch (e) {
      Alert.alert('Oppss..', 'Please try again.');
    }
  };

  render() {
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
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Detail Order </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        {this.state.loading == false ? (
          this.props.dataBasket != undefined &&
          this.props.dataBasket.outlet != undefined ? (
            <View style={{height: '100%'}}>
              <View style={styles.containerBody}>
                <Text style={styles.title}>
                  {this.props.dataBasket.outlet.name}
                </Text>
                <Text style={styles.subTitle}>Detail Order</Text>
                <ScrollView style={{height: '45%'}}>
                  <FlatList
                    data={this.props.dataBasket.details}
                    renderItem={({item}) => (
                      <View style={styles.item}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 4,
                            maxWidth: '100%',
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
                                {item.product.name}
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
                            </View>
                          </View>
                          <View>
                            <Text style={styles.descPrice}>
                              {CurrencyFormatter(item.unitPrice)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(product, index) => index.toString()}
                  />
                </ScrollView>
                <View style={{marginTop: 20}} />
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>Total Tax Amount</Text>
                  <Text style={styles.total}>
                    {CurrencyFormatter(this.props.dataBasket.totalTaxAmount)}
                  </Text>
                </View>
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>Total Nett Amount</Text>
                  <Text style={styles.total}>
                    {' '}
                    {CurrencyFormatter(this.props.dataBasket.totalNettAmount)}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            this.renderNullBasker()
          )
        ) : (
          <Loader />
        )}
        {this.props.dataBasket != undefined &&
        this.props.dataBasket.outlet != undefined
          ? this.renderButtonConfirm()
          : null}
      </View>
    );
  }
}

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
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
  subTitle: {
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.title,
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    marginVertical: 10,
    fontFamily: 'Lato-Bold',
    color: colorConfig.store.title,
    fontSize: 16,
    padding: 5,
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
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    fontSize: 14,
    fontFamily: 'Lato-Medium',
  },
  descPrice: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 14,
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
    backgroundColor: colorConfig.store.defaultColor,
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
});
