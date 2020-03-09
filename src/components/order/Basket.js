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
} from '../../actions/order.action';
import Loader from '../../components/loader';
import ModalOrder from '../../components/order/Modal';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as _ from 'lodash';

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
      let outletID = this.props.dataBasket.outlet.id;
      this.getProductsByOutlet(outletID);

      // check if status basket is submitted, then request continoustly to get basket
      if (
        this.props.dataBasket != undefined &&
        this.props.dataBasket.status == 'SUBMITTED'
      ) {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.props.dispatch(getBasket());
        }, 2000);
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

  askUserToSelectPaymentType = () => {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'fade'}
        height={250}
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
              fontFamily: 'Lato-Bold',
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
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            TAKE AWAY
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    await await this.props.dispatch(getBasket());
    await this.setState({refreshing: false});
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
    clearInterval(this.interval);
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  goToScanTable = () => {
    if (this.props.orderType == undefined) {
      Alert.alert('Sorry', 'Please select your ordering mode first.');
    }

    if (this.props.orderType != undefined) {
      Actions.scanQRTable();
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.props.dispatch(getBasket());
      }, 2000);
    }
  };

  renderSettleButton = () => {
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
          disabled={this.props.dataBasket.status == 'CONFIRMED' ? true : false}
          onPress={this.alertRemoveBasket}
          style={[
            styles.btnCancelBasketModal,
            {
              backgroundColor:
                this.props.dataBasket.status == 'CONFIRMED'
                  ? colorConfig.store.disableButtonError
                  : colorConfig.store.colorError,
            },
          ]}>
          <Icon
            size={23}
            name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
            style={{color: 'white', marginRight: 5}}
          />
          <Text style={styles.textBtnBasketModal}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goToSettle}
          disabled={this.props.dataBasket.status == 'CONFIRMED' ? false : true}
          style={[
            styles.btnAddBasketModal,
            {
              backgroundColor:
                this.props.dataBasket.status == 'CONFIRMED'
                  ? colorConfig.store.defaultColor
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
    );
  };

  goToSettle = () => {
    try {
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
        // paymentType: 'QIJI APP',
        payment: this.props.dataBasket.totalNettAmount,
        storeName: this.props.dataBasket.outlet.name,
        dataPay: dataPay,
        storeId: this.props.dataBasket.outlet.id,
        referenceNo: 'scan.referenceNo',
      };

      Actions.settleOrder({pembayaran: pembayaran});
    } catch (e) {
      this.setState({
        showAlert: true,
        pesanAlert: 'Please try again',
        titleAlert: 'Opps...',
      });
    }
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
        <TouchableOpacity
          onPress={this.goToScanTable}
          style={styles.btnAddBasketModal}>
          <Icon
            size={23}
            name={
              Platform.OS === 'ios'
                ? 'ios-checkbox-outline'
                : 'md-checkbox-outline'
            }
            style={{color: 'white', marginRight: 5}}
          />
          <Text style={styles.textBtnBasketModal}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  removeBasket = async () => {
    clearInterval(this.interval);
    this.setState({loading: true});
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
    try {
      // get current quantity from product
      let existProduct = await this.checkIfItemExistInBasket(product);

      if (existProduct != false) {
        // FIND CATEGORY EXIST PRODUCT
        const categoryProduct = this.state.products.find(
          item => `category::${item.id}` == existProduct.product.categoryID,
        );
        // FIND PRODUCT BY CATEGORY ABOVE
        const originalProduct = categoryProduct.items.find(
          item => item.id == existProduct.product.id,
        );

        product.mode = 'update';
        product.remark = existProduct.remark;
        product.quantity = existProduct.quantity;
        product.name = existProduct.product.name;
        product.description = existProduct.product.description;
        product.product.productModifiers =
          originalProduct.product.productModifiers;

        // remove quantity temp from props
        product.product.productModifiers.map((group, i) => {
          group.modifier.details.map((detail, j) => {
            delete detail.quantity;
          });
        });

        // process modifier
        let find = await this.props.dataBasket.details.find(
          item => item.product.id == product.product.id,
        );
        if (find != undefined && !isEmptyArray(find.modifiers)) {
          existProduct.product.productModifiers.map((group, i) => {
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
                      existProduct.product.productModifiers[i].modifier.details[
                        j
                      ].quantity = item.quantity;
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
      Alert.alert('Opps..', 'Something went wrong, please try again');
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
      if (remark != undefined && remark != '') dataproduct.remark = remark;
      data.details.push(dataproduct);

      // send data to action
      let response = await this.props.dispatch(
        updateProductToBasket(data, previousData),
      );

      console.log('RESPONSE UPDATE ', response);

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
    await this.props.dispatch(setOrderType(type));
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

  renderItemModifier = item => {
    return (
      <FlatList
        data={item.modifiers}
        renderItem={({item}) =>
          item.modifier.details.map(mod => (
            <Text style={[styles.descModifier]}>
              •{' '}
              <Text
                style={{
                  color: colorConfig.store.defaultColor,
                }}>
                {mod.quantity}x
              </Text>{' '}
              {mod.name} ( {CurrencyFormatter(mod.productPrice)} )
            </Text>
          ))
        }
      />
    );
  };

  render() {
    // give message to user if order has been confirmed
    try {
      if (this.props.dataBasket != undefined) {
        if (
          this.props.dataBasket.status == 'CONFIRMED' &&
          this.interval != undefined
        ) {
          Alert.alert('Congratulation', 'Your order has been CONFIRMED');
          clearInterval(this.interval);
        }
      }
    } catch (e) {}

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
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                  style={{height: '35%'}}>
                  <FlatList
                    data={this.props.dataBasket.details}
                    renderItem={({item}) => (
                      <View style={styles.item}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 3,
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
                                {item.product.name} ({' '}
                                {CurrencyFormatter(item.unitPrice)} )
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
                              {this.props.dataBasket.status == 'PENDING' ? (
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
                              {CurrencyFormatter(item.grossAmount)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(product, index) => index.toString()}
                  />
                </ScrollView>
                <View style={{marginTop: 20}} />
                {this.props.dataBasket.tableNo != undefined ? (
                  <View style={styles.itemSummary}>
                    <Text style={styles.total}>Table No.</Text>
                    <Text style={styles.total}>
                      {this.props.dataBasket.tableNo}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.itemSummary}>
                  <Text style={styles.total}>Status Order</Text>
                  {this.renderStatusOrder()}
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.dataBasket.status == 'PENDING'
                      ? this.RBSheet.open()
                      : null
                  }
                  style={styles.itemSummary}>
                  <Text style={styles.total}>Order Mode</Text>
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
                              : colorConfig.store.title,
                          borderRadius: 5,
                          padding: 5,
                        },
                      ]}>
                      {this.props.orderType}
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
                      {this.props.orderType}
                    </Text>
                  )}
                </TouchableOpacity>
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
          ? this.props.dataBasket.status == 'PENDING'
            ? this.renderButtonConfirm()
            : this.renderSettleButton()
          : null}
      </View>
    );
  }
}

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
  orderType: state.orderReducer.orderType.orderType,
  tableType: state.orderReducer.tableType.tableType,
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
