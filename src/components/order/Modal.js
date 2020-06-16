import React, {Component} from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import ProgressiveImage from '../../components/helper/ProgressiveImage';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {Dialog} from 'react-native-paper';
//import CheckBox from '@react-native-community/checkbox';
import RadioButton from '../atom/RadioButton';
import CheckBox from '../atom/CheckBox';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';

export default class ModalOrder extends Component {
  constructor(props) {
    super(props);

    // check if product have modifiers
    let productModifiers = [];
    let product = this.props.product;
    if (!isEmptyObject(product.product)) {
      if (!isEmptyArray(product.product.productModifiers)) {
        productModifiers = product.product.productModifiers;
      }
    }

    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      modalQty: false,
      productsModifier: productModifiers,
      selectedModifier: {},
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
      if (
        image.product != undefined &&
        image.product.defaultImageURL != undefined
      ) {
        image = image.product.defaultImageURL;
        if (image != undefined && image != '-' && image != null) {
          return {uri: image};
        }
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  calculateSubTotalModal = () => {
    try {
      let productModifiers = this.props.product.product.productModifiers;
      let subTotal = 0;
      let totalModifier = 0;
      if (
        this.props.product.product.retailPrice != undefined &&
        this.props.product.product.retailPrice != '-'
      ) {
        subTotal = this.props.product.product.retailPrice;
      }

      subTotal = parseFloat(subTotal);

      // if product have modifier, calculate modifier price
      productModifiers.map(group => {
        if (group.postToServer == true) {
          group.modifier.details.map(detail => {
            if (detail.quantity != undefined && detail.quantity > 0) {
              let price = detail.productPrice;
              if (price == undefined) price = 0;
              totalModifier += parseFloat(detail.quantity * price);
            }
          });
        }
      });
      // add total item + total modifier price
      subTotal += totalModifier;
      // calculate subtotal with quantity item
      subTotal = subTotal * this.props.qtyItem;

      return `${appConfig.appMataUang} ${subTotal.toFixed(2)}`;
    } catch (e) {
      return 0;
    }
  };

  renderLoadingButtonHideModal = () => {
    return (
      <TouchableOpacity
        disabled={true}
        style={[
          styles.btnAddBasketModal,
          {backgroundColor: colorConfig.store.disableButton},
        ]}>
        <ActivityIndicator size={'small'} color={'white'} />
      </TouchableOpacity>
    );
  };

  ruleModifierNotPassed = () => {
    try {
      let data = this.props.product.product.productModifiers;
      for (let i = 0; i < data.length; i++) {
        let lengthDetail = data[i].modifier.details.filter(
          item => item.quantity > 0 && item.quantity != undefined,
        );
        // check rule min max
        if (data[i].modifier.min != 0 || data[i].modifier.max != 0) {
          // check min modifier
          if (
            lengthDetail.length < data[i].modifier.min &&
            lengthDetail != undefined &&
            data[i].modifier.min != 0 &&
            data[i].modifier.isYesNo != true &&
            data[i].modifier.min != undefined
          ) {
            return true;
          }

          // check max modifier
          if (
            lengthDetail.length > data[i].modifier.max &&
            lengthDetail != undefined &&
            data[i].modifier.max != 0 &&
            data[i].modifier.isYesNo != true &&
            data[i].modifier.max != undefined
          ) {
            return true;
          }
        } else {
          return false;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  renderButtonHideModal = () => {
    return (
      <TouchableOpacity
        // disabled={this.ruleModifierNotPassed() ? true : false}
        onPress={() => {
          if (this.ruleModifierNotPassed()) {
            // dummy variable created, so even the code below is error, then alert still showing
            let name = 'Item';
            let qty = 1;

            // check name and quantity modifier that hasnt been success passed min & max
            try {
              let productModifiers = this.props.product.product
                .productModifiers;
              for (let i = 0; i < productModifiers.length; i++) {
                let lengthDetail = productModifiers[i].modifier.details.filter(
                  item => item.quantity > 0 && item.quantity != undefined,
                );
                if (productModifiers[i].modifier.min > lengthDetail.length) {
                  name = productModifiers[i].modifierName;
                  qty = productModifiers[i].modifier.min;
                  break;
                }
              }
            } catch (e) {}

            Alert.alert('Opps', `Please pick minimum ${qty} ${name}`);
            return;
          }
          this.props.addItemToBasket(
            this.props.product,
            this.props.qtyItem,
            this.props.remark,
            this.props.product.mode,
          );
        }}
        style={[
          styles.btnAddBasketModal,
          this.ruleModifierNotPassed()
            ? {backgroundColor: colorConfig.store.disableButton}
            : null,
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
          <Text style={styles.textBtnBasketModal}>Remove from basket</Text>
        )}
      </TouchableOpacity>
    );
  };

  addQty = () => {
    let selectedModifier = this.state.selectedModifier;
    if (selectedModifier.quantity == undefined) selectedModifier.quantity = 1;
    selectedModifier.quantity += 1;
    this.setState({selectedModifier});
  };

  minQty = () => {
    let selectedModifier = this.state.selectedModifier;
    if (
      selectedModifier.quantity > 0 &&
      selectedModifier.quantity != undefined
    ) {
      selectedModifier.quantity -= 1;
      this.setState({selectedModifier});
    }
  };

  renderDialogQuantityModifier = () => {
    return (
      <Dialog
        dismissable={true}
        visible={this.state.modalQty}
        onDismiss={() => {
          let selectedModifier = this.state.selectedModifier;
          selectedModifier.quantity = selectedModifier.quantityTemp;
          this.setState({modalQty: false, selectedModifier});
        }}>
        <Dialog.Content>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              color: colorConfig.pageIndex.grayColor,
              marginBottom: 35,
              fontFamily: 'Lato-Bold',
            }}>
            {this.state.selectedModifier.name == undefined
              ? 1
              : this.state.selectedModifier.name}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={styles.panelQty}>
              <TouchableOpacity
                onPress={this.minQty}
                style={styles.buttonQtyModifier}>
                <Text style={styles.btnIncreaseDecrease}>-</Text>
              </TouchableOpacity>
              <Text style={styles.descQtyModifier}>
                {this.state.selectedModifier.quantity == undefined
                  ? 1
                  : this.state.selectedModifier.quantity}
              </Text>
              <TouchableOpacity
                onPress={this.addQty}
                style={styles.buttonQtyModifier}>
                <Text style={styles.btnIncreaseDecrease}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.addModifier(undefined)}
            style={[
              styles.btnAddModifier,
              this.state.selectedModifier.quantity == 0
                ? {backgroundColor: colorConfig.store.colorError}
                : null,
            ]}>
            <Text style={styles.textBtnAddModifier}>
              {this.state.selectedModifier.quantity != 0 ? 'Add' : 'Remove'}
            </Text>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
    );
  };

  updateSelectedCategory = (item, idx) => {
    this.props.updateSelectedCategory(idx);
  };

  renderCategoryModifier = (item, idx) => {
    return (
      <TouchableOpacity
        onPress={() => this.updateSelectedCategory(item, idx)}
        style={{padding: 10, flexDirection: 'row'}}>
        <View
          style={[
            this.props.selectedCategoryModifier == idx
              ? styles.categoryActive
              : styles.categoryNonActive,
          ]}>
          <Text style={{padding: 5, fontFamily: 'Lato-Medium', color: 'white'}}>
            {item.modifierName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  openModalModifierQty = (item, indexDetails) => {
    item.quantityTemp = item.quantity;
    this.setState({modalQty: true, selectedModifier: item});
  };

  addModifier = async itemIsYesNo => {
    try {
      let selectedModifier = '';
      if (!isEmptyObject(itemIsYesNo)) {
        selectedModifier = JSON.stringify(itemIsYesNo);
      } else {
        selectedModifier = JSON.stringify(this.state.selectedModifier);
      }
      selectedModifier = JSON.parse(selectedModifier);

      let productModifiers = this.props.product.product.productModifiers;
      // find index group modifier
      let indexModifier = productModifiers.findIndex(
        item => item.modifierID == selectedModifier.modifierID,
      );

      // find index modifier item
      let indexDetails = productModifiers[
        indexModifier
      ].modifier.details.findIndex(item => item.id == selectedModifier.id);

      // remove quantity ( IF OPTION IS RADIO BUTTON )
      if (
        productModifiers[indexModifier].modifier.max == 1 &&
        productModifiers[indexModifier].modifier.isYesNo != true
      ) {
        await this.props.product.product.productModifiers[
          indexModifier
        ].modifier.details.map(item => {
          delete item.quantity;
        });
      }

      // add quantity to details selected props
      if (selectedModifier.quantity == undefined) {
        this.props.product.product.productModifiers[
          indexModifier
        ].modifier.details[indexDetails].quantity = 1;

        // mark modifier group that has been selected
        this.props.product.product.productModifiers[
          indexModifier
        ].postToServer = true;
      } else if (selectedModifier.quantity > 0) {
        this.props.product.product.productModifiers[
          indexModifier
        ].modifier.details[indexDetails].quantity = selectedModifier.quantity;

        // mark modifier group that has been selected
        this.props.product.product.productModifiers[
          indexModifier
        ].postToServer = true;
      }

      // check max and min modifier
      // get length details modifier
      let lengthDetailsModifier = productModifiers[
        indexModifier
      ].modifier.details.filter(item => item.quantity > 0);

      // check max and min modifier
      if (
        lengthDetailsModifier.length >
          productModifiers[indexModifier].modifier.max &&
        productModifiers[indexModifier].modifier.max != 0 &&
        productModifiers[indexModifier].modifier.isYesNo != true &&
        productModifiers[indexModifier].modifier.max != undefined &&
        lengthDetailsModifier != undefined
      ) {
        // recover quantity
        let selectedModifier = this.state.selectedModifier;
        selectedModifier.quantity = selectedModifier.quantityTemp;
        // make quantity empty again
        this.props.product.product.productModifiers[
          indexModifier
        ].modifier.details[indexDetails].quantity = 0;
        // hide modal
        this.setState({modalQty: false, selectedModifier});
        Alert.alert(
          'Sorry',
          `Cannot add more modifier, max is ${
            productModifiers[indexModifier].modifier.max
          }`,
        );
        return;
      }

      this.setState({modalQty: false});
    } catch (e) {
      console.log(e);
      this.setState({modalQty: false});
      Alert.alert('Sorry', 'Cant add modifier, please try again');
    }
  };

  addModifierIsYesNo = async itemIsYesNo => {
    try {
      let selectedModifier = '';
      if (!isEmptyObject(itemIsYesNo)) {
        selectedModifier = JSON.stringify(itemIsYesNo);
      }

      selectedModifier = JSON.parse(selectedModifier);

      let productModifiers = this.props.product.product.productModifiers;
      // find index group modifier
      let indexModifier = productModifiers.findIndex(
        item => item.modifierID == selectedModifier.modifierID,
      );

      // find index modifier item
      let indexDetails = productModifiers[
        indexModifier
      ].modifier.details.findIndex(item => item.id == selectedModifier.id);

      // remove quantity ( IF OPTION IS RADIO BUTTON )
      if (
        productModifiers[indexModifier].modifier.max == 1 &&
        productModifiers[indexModifier].modifier.isYesNo != true
      ) {
        await this.props.product.product.productModifiers[
          indexModifier
        ].modifier.details.map(item => {
          delete item.quantity;
        });
      }

      // remove quantity to details selected props
      this.props.product.product.productModifiers[
        indexModifier
      ].modifier.details[indexDetails].quantity = 0;
      // remove is selected
      this.props.product.product.productModifiers[
        indexModifier
      ].modifier.details[indexDetails].isSelected = false;

      let toggleIndex = indexDetails;
      if (toggleIndex == 0) {
        toggleIndex = 1;
      } else {
        toggleIndex = 0;
      }

      // add quantity to details selected props
      this.props.product.product.productModifiers[
        indexModifier
      ].modifier.details[toggleIndex].quantity = 1;
      // add is selected
      this.props.product.product.productModifiers[
        indexModifier
      ].modifier.details[toggleIndex].isSelected = true;

      // mark modifier group that has been selected
      this.props.product.product.productModifiers[
        indexModifier
      ].postToServer = true;

      this.setState({modalQty: false});
    } catch (e) {
      console.log(e);
      Alert.alert('Sorry', 'Cant add modifier, please try again');
    }
  };

  findExistModifier = item => {
    try {
      // FIND PRODUCT ON LOCAL PROPS
      let indexModifier = this.props.selectedCategoryModifier;
      let data = this.props.product.product.productModifiers[indexModifier];
      let find = data.modifier.details.find(
        data => data.productID == item.productID && data.quantity > 0,
      );

      // if product exist
      if (find != undefined) return true;
      else return false;
    } catch (e) {
      return false;
    }
  };

  findToggleModifier = item => {
    try {
      if (item.yesNoValue == 'yes') return true;
      else return false;
    } catch (e) {
      return false;
    }
  };

  renderItemModifier = (item, idx, modifier) => {
    let available = true;
    item.orderingStatus != 'AVAILABLE' ? (available = false) : true;
    return (
      <TouchableOpacity
        onPress={() =>
          available ? this.openModalModifierQty(item, idx) : false
        }
        style={[
          styles.detailOptionsModal,
          !available ? {backgroundColor: 'rgba(52, 73, 94, 0.2)'} : null,
        ]}>
        {modifier.modifier.max == 1 && modifier.modifier.min == 1 ? (
          <RadioButton
            value={item}
            isSelected={this.findExistModifier(item) ? true : false}
            onPress={() => {
              this.openModalModifierQty(item, idx);
            }}
          />
        ) : (
          <CheckBox
            value={item}
            isSelected={this.findExistModifier(item) ? true : false}
            onPress={() => {
              this.openModalModifierQty(item, idx);
            }}
          />
        )}
        <Text style={{color: colorConfig.store.title}}>
          <Text
            style={{
              color: colorConfig.store.defaultColor,
              fontWeight: 'bold',
            }}>
            {item.quantity != undefined && item.quantity > 0
              ? `${item.quantity}x `
              : null}
          </Text>
          {item.name}
        </Text>
        <Text
          style={{
            marginTop: 5,
            position: 'absolute',
            right: 3,
            color: colorConfig.store.title,
          }}>
          {' + '}
          {this.formatNumber(CurrencyFormatter(item.productPrice))}{' '}
        </Text>
      </TouchableOpacity>
    );
  };

  toggleModifierIsYesNo = (item, idx) => {
    this.addModifierIsYesNo(item);
  };

  renderItemModifierIsYesNo = (item, idx, modifier) => {
    let available = true;
    let isYesNo = false;

    item.orderingStatus != 'AVAILABLE' ? (available = false) : true;
    modifier.modifier.isYesNo == true ? (isYesNo = true) : false;
    if (item.isSelected == true) {
      item.quantity = 1;
      item.quantityTemp = item.quantity;
      item.isSelected = true;
      // this.addModifierIsYesNo(item);
      // this.setState({modalQty: false});
      return (
        <TouchableOpacity
          onPress={() =>
            available ? this.toggleModifierIsYesNo(item, idx) : false
          }
          style={[
            styles.detailOptionsModal,
            !available ? {backgroundColor: 'rgba(52, 73, 94, 0.2)'} : null,
          ]}>
          <View style={{marginRight: 10}}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={true ? colorConfig.store.defaultColor : 'white'}
              ios_backgroundColor="white"
              onValueChange={() => {
                this.toggleModifierIsYesNo(item, idx);
              }}
              value={this.findToggleModifier(item) ? true : false}
            />
          </View>
          <Text style={{paddingVertical: 5, color: colorConfig.store.title}}>
            {item.name}
          </Text>
          <Text
            style={{
              marginTop: 5,
              position: 'absolute',
              right: 3,
              color: colorConfig.store.title,
            }}>
            {' + '}
            {this.formatNumber(CurrencyFormatter(item.productPrice))}{' '}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  renderTitleModifier = item => {
    try {
      if (
        item.modifier.max != 0 &&
        item.modifier.min != 0 &&
        item.modifier.isYesNo != true
      ) {
        return `${item.modifierName}, Pick ${item.modifier.min}, max ${
          item.modifier.max != undefined ? item.modifier.max : '-'
        }`;
      }
    } catch (e) {
      return `${item.modifierName}`;
    }
    return `${item.modifierName}`;
  };

  itemModifier = (productModifiers, selectedCategoryModifier) => {
    let data = (
      <FlatList
        data={productModifiers[selectedCategoryModifier].modifier.details}
        extraData={this.props}
        renderItem={({item, index}) => {
          if (
            productModifiers[selectedCategoryModifier].modifier.isYesNo != true
          ) {
            return this.renderItemModifier(
              item,
              index,
              productModifiers[selectedCategoryModifier],
            );
          } else {
            return this.renderItemModifierIsYesNo(
              item,
              index,
              productModifiers[selectedCategoryModifier],
            );
          }
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
    return data;
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

  render() {
    // loading indicator
    let {loadModifierTime} = this.props;
    // index category active
    let {selectedCategoryModifier} = this.props;
    let productModifiers = [];
    let product = this.props.product;
    if (!isEmptyObject(product.product)) {
      if (!isEmptyArray(product.product.productModifiers)) {
        productModifiers = product.product.productModifiers;
      }
    }

    return (
      <Modal
        animationType="slide"
        presentationStyle="fullScreen"
        visible={this.props.isModalVisible}
        transparent={false}
        hardwareAccelerated={true}
        onShow={this.props.modalShow}
        onRequestClose={this.props.backButtonClicked}>
        <SafeAreaView>
          <KeyboardAvoidingView
            style={{
              height: '100%',
              // paddingBottom: 100,
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

                {this.getImageUrl(this.props.product) != false ? (
                  <ProgressiveImage
                    resizeMode="cover"
                    style={styles.imageModal}
                    source={this.getImageUrl(this.props.product)}
                  />
                ) : (
                  <View style={{height: 50}} />
                )}

                <View style={styles.detailItemModal}>
                  <View style={{flexDirection: 'row'}}>
                    {this.props.product.product != undefined &&
                    this.props.product.product.name != undefined ? (
                      <Text style={[styles.productTitleModal]}>
                        {this.props.product.product.name}
                      </Text>
                    ) : null}

                    {this.props.product.product != undefined &&
                    this.props.product.product.retailPrice != undefined ? (
                      <Text style={[styles.productPriceAfterTitle]}>
                        ({' '}
                        {this.formatNumber(
                          CurrencyFormatter(
                            this.props.product.product.retailPrice,
                          ),
                        )}{' '}
                        )
                      </Text>
                    ) : null}
                  </View>

                  {this.props.product.product != undefined &&
                  this.props.product.product.description != undefined ? (
                    <Text style={[styles.productDescModal]}>
                      {this.props.product.product.description}
                    </Text>
                  ) : null}
                </View>
              </View>
              {/* tab category modifier */}
              <View style={styles.cardCategoryModifier}>
                <FlatList
                  horizontal={true}
                  data={productModifiers}
                  extraData={this.props}
                  renderItem={({item, index}) => {
                    return this.renderCategoryModifier(item, index);
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              {/* tab category modifier */}

              {!isEmptyObject(productModifiers) ? (
                <View style={styles.cardModal}>
                  <Text style={styles.titleModifierModal}>
                    {this.renderTitleModifier(
                      productModifiers[selectedCategoryModifier],
                    )}
                  </Text>
                  {!loadModifierTime ? (
                    <ActivityIndicator
                      size={'large'}
                      color={colorConfig.store.defaultColor}
                    />
                  ) : (
                    this.itemModifier(
                      productModifiers,
                      selectedCategoryModifier,
                    )
                  )}
                </View>
              ) : null}

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

              <KeyboardAvoidingView
                style={[styles.cardModal, {paddingBottom: 50}]}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                enabled
                keyboardVerticalOffset={Platform.select({
                  ios: 80,
                  android: 500,
                })}>
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

              {/*<View style={[styles.cardModal, {height: 60}]} />*/}
            </ScrollView>
            <View style={styles.panelAddBasketModal}>
              {/* conditional render to show loading button */}
              {this.props.loadingAddItem
                ? this.renderLoadingButtonHideModal()
                : this.renderButtonHideModal()}
              {/* conditional render to show loading button */}
            </View>
          </KeyboardAvoidingView>
          {this.renderDialogQuantityModifier()}
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  modal: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
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
  cardCategoryModifier: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    marginBottom: 5,
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
    alignItems: 'center',
    paddingVertical: 5,
  },
  image: {
    height: 180,
    resizeMode: 'cover',
  },
  imageModal: {
    height: Dimensions.get('window').height / 3,
    // flex: 1,
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
    paddingBottom: 10,
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
    fontSize: 21,
    fontWeight: 'bold',
    maxWidth: Dimensions.get('window').width - 150,
  },
  productPriceAfterTitle: {
    color: colorConfig.store.title,
    marginHorizontal: 6,
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    // flexDirection: 'end',
    // maxWidth: Dimensions.get('window').width,
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
  buttonQtyModifier: {
    justifyContent: 'center',
    backgroundColor: colorConfig.store.defaultColor,
    width: 37,
    height: 37,
    borderRadius: 10,
    borderColor: colorConfig.store.defaultColor,
  },
  descQty: {
    alignContent: 'center',
    // padding: 10,
    fontSize: 27,
    color: colorConfig.pageIndex.grayColor,
  },
  descQtyModifier: {
    alignContent: 'center',
    // padding: 10,
    fontSize: 22,
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
    // position: 'absolute',
    // bottom: -0,
    height: 70,
    // flex: 1,
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
  btnAddModifier: {
    fontFamily: 'Lato-Bold',
    borderRadius: 10,
    padding: 13,
    marginHorizontal: 55,
    marginTop: 20,
    backgroundColor: colorConfig.store.defaultColor,
  },
  textBtnAddModifier: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    textAlign: 'center',
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
    fontSize: 15,
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
});
