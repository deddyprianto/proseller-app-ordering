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
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Alert,
  Platform,
  SafeAreaView,
  ColorPropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {format} from 'date-fns';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {isEmptyArray} from '../helper/CheckEmpty';
import {navigate} from '../utils/navigation.utils';

export default class PaymentAddVoucers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      currentDay: new Date(),
      data: this.props.data,
    };
  }

  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
  }

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  setVouchers = data => {
    try {
      this.setState({
        data,
      });
    } catch (e) {}
  };

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear()
    );
  }

  getMonth(value) {
    var mount = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return mount[value];
  }

  pageDetailVoucher = async item => {
    const {totalPrice, dataVoucer} = this.props;
    // check if voucher is applied on specific products only

    /* Check if voucher can be mixed */
    try {
      if (
        !isEmptyArray(dataVoucer) &&
        item.validity &&
        item.validity.canOnlyUseOneTime === true
      ) {
        const findVoucher = dataVoucer.find(data => data.id === item.id);
        if (findVoucher) {
          Alert.alert(
            'Sorry',
            `Voucher ${item.name} can only be used once for an order.`,
          );
          return;
        }
      }

      if (!isEmptyArray(dataVoucer)) {
        let cannotBeMixed = false;
        let voucherName = '';
        let postfix = 'this voucher.';
        for (let i = 0; i < dataVoucer.length; i++) {
          if (
            dataVoucer[i].validity &&
            dataVoucer[i].validity.cannotBeMixed === true &&
            dataVoucer[i].id !== item.id
          ) {
            cannotBeMixed = true;
            voucherName = dataVoucer[i].name;

            if (dataVoucer[i].isVoucherPromoCode) {
              postfix = 'this promo code.';
            }
            break;
          }

          if (
            dataVoucer[i].validity &&
            item.validity.cannotBeMixed &&
            dataVoucer[i].id !== item.id
          ) {
            cannotBeMixed = true;
            voucherName = item.name;

            if (dataVoucer[0].isVoucherPromoCode) {
              postfix = 'this promo code.';
            }
            break;
          }
        }

        if (cannotBeMixed === true) {
          Alert.alert('Sorry', `Cannot mix ${voucherName} with ${postfix}`);
          return;
        }
      }
    } catch (e) {}

    try {
      if (item.appliedTo !== undefined && item.appliedTo !== 'ALL') {
        //  search specific product
        let result;
        for (let i = 0; i < this.props.pembayaran.details.length; i++) {
          if (item.appliedTo === 'PRODUCT') {
            result = await item.appliedItems.find(
              item =>
                item.value === this.props.pembayaran.details[i].product.id,
            );
          }
          if (item.appliedTo === 'CATEGORY') {
            result = await item.appliedItems.find(
              item =>
                item.value ===
                this.props.pembayaran.details[i].product.categoryID,
            );
          }
          if (result != undefined) {
            if (
              this.props.pembayaran.details[i].appliedVoucher <
                this.props.pembayaran.details[i].quantity ||
              this.props.pembayaran.details[i].appliedVoucher == undefined
            ) {
              result = this.props.pembayaran.details[i];
              break;
            } else {
              result = undefined;
            }
          }
        }
        // CHECK IF MODIFIER CONTAIN SPECIFIC PRODUCT
        if (result === undefined) {
          //  Search specific products in modifier
          result = undefined;
          for (let z = 0; z < this.props.pembayaran.details.length; z++) {
            let dataProduct = this.props.pembayaran.details[z];

            if (isEmptyArray(dataProduct.modifiers)) {
              continue;
            } else {
              try {
                for (let modifier of dataProduct.modifiers) {
                  if (!isEmptyArray(modifier.modifier.details)) {
                    for (let detailModifier of modifier.modifier.details) {
                      result = await item.appliedItems.find(
                        item => item.value === detailModifier.product.id,
                      );

                      if (result != undefined) {
                        let quantityModifier =
                          dataProduct.quantity * detailModifier.quantity;
                        if (
                          detailModifier.appliedVoucher < quantityModifier ||
                          detailModifier.appliedVoucher == undefined
                        ) {
                          result = detailModifier;
                          break;
                        } else {
                          result = undefined;
                        }
                      }
                    }
                  }
                  if (result !== undefined) {
                    break;
                  }
                }
              } catch (e) {}
            }
            if (result !== undefined) {
              break;
            }
          }
        }

        // check if apply to specific product is found
        if (
          result === undefined &&
          (item.excludeSelectedItem === false ||
            item.excludeSelectedItem === undefined)
        ) {
          Alert.alert(
            'Sorry',
            `${item.name} is only available on specific product`,
          );
          return false;
        } else if (result !== undefined && item.excludeSelectedItem === true) {
          console.log(result, 'result');
          Alert.alert(
            'Sorry',
            `${item.name} cannot be applied to ${result.product.name}`,
          );
        }
      }
    } catch (e) {}

    // check minimal price for use voucher
    try {
      if (item.minPurchaseAmount != undefined) {
        if (totalPrice < item.minPurchaseAmount) {
          Alert.alert(
            'Sorry',
            'Minimum purchase amount to use this voucher is ' +
              this.format(CurrencyFormatter(item.minPurchaseAmount)),
          );
          return;
        }
      }
    } catch (e) {}

    // check valid for this outlet
    if (!(await this.checkOutletAvailable(item))) {
      Alert.alert('Sorry', 'This voucher cannot be used to this outlet.');
      return;
    }
    // check valid on this day and time
    if (!this.isValidDay(item).status) {
      Alert.alert('Sorry', this.isValidDay(item).message);
      return;
    }

    this.props.setDataVoucher(item);
    Actions.pop();
  };

  isValidDay = item => {
    if (item.validity.allDays == true) {
      return {status: true, message: ''};
    }
    let date = new Date();

    let find = item.validity.activeWeekDays.find(
      (item, idx) => item.active == true && idx == date.getDay(),
    );

    // TODO buat filter time
    if (find != undefined) {
      return {status: true, message: ''};
    } else {
      return {status: false, message: 'This voucher cannot be used today.'};
    }
  };

  checkOutletAvailable = async item => {
    if (item.selectedOutlets == undefined || item.selectedOutlets.length == 0) {
      return true;
    } else if (item.selectedOutlets.length >= 0) {
      let data = item.selectedOutlets.find(
        outlet => outlet == `outlet::${this.props.pembayaran.storeId}`,
      );
      if (data != undefined) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  render() {
    const {intlData} = this.props;
    const myVoucers = this.state.data;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Select Vouchers </Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
        <ScrollView>
          {myVoucers == undefined || myVoucers.length == 0 ? (
            <View
              style={{
                alignItems: 'center',
                margin: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colorConfig.pageIndex.grayColor,
                }}>
                {intlData.messages.emptyVoucher}
              </Text>
            </View>
          ) : (
            myVoucers
              .filter(
                voucher =>
                  voucher.totalRedeem > 0 &&
                  voucher.validity.canOnlyRedeemedByMerchant != true,
              )
              .map((item, keys) => (
                <View key={keys}>
                  {
                    <TouchableOpacity
                      style={styles.voucherItem}
                      onPress={() => this.pageDetailVoucher(item)}>
                      <View style={{alignItems: 'center'}}>
                        <Image
                          style={
                            item.image != '' && item.image != undefined
                              ? styles.voucherImage1
                              : styles.voucherImage2
                          }
                          source={
                            item.image != '' && item.image != undefined
                              ? {uri: item.image}
                              : appConfig.appImageNull
                          }
                        />
                        <View
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            backgroundColor: colorConfig.store.transparentColor,
                            height: 30,
                            // width: this.state.screenWidth / 2 - 11,
                            borderTopLeftRadius: 9,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.backgroundColor,
                              fontSize: 16,
                              fontWeight: 'bold',
                              textAlign: 'left',
                            }}>
                            {item.totalRedeem + 'x'}
                          </Text>
                        </View>
                        {/* <View
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            backgroundColor: 'rgba(2, 168, 80, 0.8)',
                            height: 30,
                            // width: this.state.screenWidth / 2 - 11,
                            borderTopRightRadius: 9,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            paddingLeft: 10,
                            paddingRight: 10,
                          }}>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.backgroundColor,
                              fontSize: 16,
                              fontWeight: 'bold',
                              textAlign: 'right',
                            }}>
                            {item['redeemValue'] + ' Points'}
                          </Text>
                        </View> */}
                      </View>
                      <View style={styles.voucherDetail}>
                        {/*<View style={styles.status}>*/}
                        {/*  <Text style={styles.statusTitle}>Awarded</Text>*/}
                        {/*</View>*/}
                        <Text style={styles.nameVoucher}>{item.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            size={15}
                            name={
                              Platform.OS === 'ios' ? 'ios-list' : 'md-list'
                            }
                            style={{
                              color: colorConfig.store.secondaryColor,
                              marginRight: 8,
                            }}
                          />
                          <Text style={styles.descVoucher}>
                            {item.voucherDesc}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            size={15}
                            name={
                              Platform.OS === 'ios' ? 'ios-time' : 'md-time'
                            }
                            style={{
                              color: colorConfig.store.secondaryColor,
                              marginRight: 8,
                            }}
                          />
                          {item.validity.allDays ? (
                            <Text style={styles.descVoucher}>
                              {intlData.messages.voucherValid}
                            </Text>
                          ) : (
                            <Text style={styles.descVoucherTime}>
                              {intlData.messages.voucherValidOn}
                              {item.validity.activeWeekDays
                                .filter(items => items.active == true)
                                .map(data => (
                                  <Text>
                                    {', '}{' '}
                                    <Text style={{fontWeight: 'bold'}}>
                                      {data.day.toLowerCase()}
                                    </Text>{' '}
                                  </Text>
                                ))}
                            </Text>
                          )}
                        </View>
                        {item.expiryDate && (
                          <View style={{flexDirection: 'row'}}>
                            <Icon
                              size={15}
                              name={
                                Platform.OS === 'ios' ? 'ios-alert' : 'md-alert'
                              }
                              style={{
                                color: colorConfig.store.secondaryColor,
                                marginRight: 5,
                              }}
                            />
                            <Text
                              style={[
                                styles.descVoucher,
                                {color: colorConfig.store.colorError},
                              ]}>
                              This voucher will expire on{' '}
                              {format(new Date(item.expiryDate), 'dd MMM yyyy')}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              ))
          )}
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            navigate('redeemVoucher', {
              setVouchers: this.setVouchers,
              dataVoucer: this.props.dataVoucer,
            });
          }}
          style={styles.buttonBottomFixed}>
          <Icon
            size={25}
            name={Platform.OS === 'ios' ? 'ios-bookmark' : 'md-bookmark'}
            style={{color: 'white', marginRight: 10}}
          />
          <Text style={styles.textAddCard}>Redeem Voucher</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 2.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 5,
    borderTopColor: colorConfig.store.defaultColor,
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  status: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    height: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    width: 70,
  },
  statusTitle: {
    fontSize: 12,
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
  },
  nameVoucher: {
    fontSize: 17,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    maxWidth: '95%',
    color: colorConfig.store.titleSelected,
  },
  descVoucherTime: {
    fontSize: 11,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  pointVoucher: {
    fontSize: 13,
    color: colorConfig.pageIndex.activeTintColor,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});
