import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  FlatList,
  Clipboard,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {
  completeOrder,
  getCart,
  getPendingCart,
  setCart,
} from '../../actions/order.action';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
import Snackbar from 'react-native-snackbar';
import awsConfig from '../../config/awsConfig';
import {refreshToken} from '../../actions/auth.actions';
import {format} from 'date-fns';
import {Header} from '../layout';

class WaitingFood extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    try {
      // get data basket
      await this.getBasket();
      await this.setState({loading: false});

      // get data continously
      // if (this.props.dataBasket != undefined) {
      //   clearInterval(this.intervalWaitingFood);
      //   this.intervalWaitingFood = setInterval(async () => {
      //     await this.props.dispatch(getCart(this.props.myCart.id));
      //   }, 3000);
      // }
    } catch (e) {
      Alert.alert('Opss..', "Can't get data basket, please try again.");
    }

    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
  };

  getStatusText = item => {
    try {
      if (item === 'SUBMITTED') {
        return 'Submitted';
      } else if (item === 'CONFIRMED') {
        return 'Confirmed';
      } else if (item === 'PROCESSING') {
        return 'Processing';
      } else if (item === 'READY_FOR_COLLECTION') {
        return 'Ready for Collection';
      } else if (item === 'READY_FOR_DELIVERY') {
        return 'Ready for Delivery';
      } else if (item === 'ON_THE_WAY') {
        return 'On The Way';
      } else {
        return item;
      }
    } catch (e) {}
  };

  renderPayments = item => {
    try {
      return item.map(data => (
        <View style={styles.itemSummary}>
          {data.isVoucher != true &&
          data.isPoint != true &&
          data.isVoucherPromoCode !== true ? (
            <Text style={styles.total}>
              {data.isAppPayment ? data.paymentName : data.paymentType}
            </Text>
          ) : (
            <Text style={styles.total} />
          )}

          {data.isVoucher && (
            <Text style={styles.total}>
              {data.paymentName} {'  '} {appConfig.appMataUang}{' '}
              {this.formatCurrency(data.paymentAmount)}
            </Text>
          )}
          {data.isPoint && (
            <Text style={styles.total}>
              {data.redeemValue} {data.paymentName} {'  '}
              {appConfig.appMataUang} {this.formatCurrency(data.paymentAmount)}
            </Text>
          )}
          {data.isVoucherPromoCode && (
            <Text style={styles.total}>
              {data.redeemValue} {data.paymentName} {'  '}
              {appConfig.appMataUang} {this.formatCurrency(data.paymentAmount)}
            </Text>
          )}
          {data.isVoucher !== true &&
            data.isPoint !== true &&
            data.isVoucherPromoCode !== true && (
              <Text style={styles.total}>
                {appConfig.appMataUang}{' '}
                {this.formatCurrency(data.paymentAmount)}
              </Text>
            )}
        </View>
      ));
    } catch (e) {}
  };

  getGrandTotal = data => {
    try {
      let item = data;
      if (item.payments != undefined && !isEmptyArray(item.payments)) {
        let total = data.totalNettAmount;

        if (data.deliveryFee != undefined) {
          total += data.deliveryFee;
        }

        for (let i = 0; i < item.payments.length; i++) {
          if (
            item.payments[i].isVoucher === true ||
            item.payments[i].isPoint === true ||
            item.payments[i].isSVC === true ||
            item.payments[i].isVoucherPromoCode === true
          ) {
            total -= item.payments[i].paymentAmount;
          }
        }
        if (total < 0) total = 0;
        return this.formatCurrency(total);
      } else {
        let total = data.totalNettAmount;

        if (data.deliveryFee != undefined) {
          total += data.deliveryFee;
        }
        return this.formatCurrency(total);
      }
    } catch (e) {}
  };

  formatCurrency = value => {
    try {
      return this.format(CurrencyFormatter(value));
    } catch (e) {
      return value;
    }
  };

  format2 = item => {
    try {
      const curr = appConfig.appMataUang;
      item = item.replace(`${curr} `, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  format3 = item => {
    try {
      const curr = appConfig.appMataUang;
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  getImageUrl = image => {
    try {
      if (image != undefined && image != '-' && image != null) {
        return {uri: image};
      }
    } catch (e) {
      return appConfig.foodPlaceholder;
    }
    return appConfig.foodPlaceholder;
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    this.props.dispatch(getCart(this.props.myCart.id));
    await this.setState({refreshing: false});
  };

  getBasket = async () => {
    this.setState({loading: true});
    await this.props.dispatch(refreshToken());
    await this.props.dispatch(getCart(this.props.myCart.id));
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
      // clearInterval(this.intervalWaitingFood);
    } catch (e) {}
    try {
      // clearInterval(this.intervalWaitingFood);
      // this.intervalWaitingFood = undefined;
      // this.props.dispatch(setCart(undefined));
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  goBack = async () => {
    Actions.pop();
    try {
      // clearInterval(this.intervalWaitingFood);
      // this.intervalWaitingFood = undefined;
      // this.props.dispatch(setCart(undefined));
    } catch (e) {}
  };

  renderBottomButton = () => {
    let {intlData, dataBasket} = this.props;
    // if basket is canceled by admin, then give template status
    if (dataBasket == undefined) {
      dataBasket = {};
    }
    return (
      <View
        style={{
          width: '100%',
          paddingBottom: 20,
          backgroundColor: 'white',
          shadowColor: '#00000021',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.9,
          shadowRadius: 16,
          elevation: 10,
          // padding: 10,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 20,
          }}>
          <TouchableOpacity
            // onPress={() => Actions.cart({myCart: dataBasket})}
            onPress={() => this.RBorder.open()}
            style={styles.btnCancelBasketModal}>
            <Icon
              size={18}
              name={'th-list'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>View Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              try {
                // clearInterval(this.intervalWaitingFood);
                // this.intervalWaitingFood = undefined;
              } catch (e) {}
              Actions.replace('QRCodeCart', {myCart: dataBasket});
            }}
            disabled={
              dataBasket.status == 'READY_FOR_COLLECTION' ? false : true
            }
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor:
                  dataBasket.status == 'READY_FOR_COLLECTION'
                    ? colorConfig.store.defaultColor
                    : colorConfig.store.disableButton,
              },
            ]}>
            <Icon
              size={21}
              name={'qrcode'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>Order QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  completeOrder = async () => {
    try {
      let {dataBasket} = this.props;
      const payload = {
        id: dataBasket.id,
        status: 'COMPLETED',
      };

      const response = await this.props.dispatch(completeOrder(payload));
      this.props.dispatch(getPendingCart());

      if (response != false) {
        try {
          Actions.pop();
        } catch (e) {}
        Alert.alert('Congratulations', 'Your order has been completed');
      } else {
        Alert.alert('Oppss...', 'Please try again.');
      }
    } catch (e) {}
  };

  askUserToCompleteOrder = () => {
    Alert.alert(
      'Complete Order ?',
      'Are you sure want to complete this order ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Complete', onPress: () => this.completeOrder()},
      ],
      {cancelable: false},
    );
  };

  renderBottomButtonDelivery = () => {
    let {intlData, dataBasket} = this.props;
    // if basket is canceled by admin, then give template status
    if (dataBasket == undefined) {
      dataBasket = {};
    }
    return (
      <View
        style={{
          width: '100%',
          paddingBottom: 20,
          backgroundColor: 'white',
          shadowColor: '#00000021',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.9,
          shadowRadius: 16,
          elevation: 10,
          // padding: 10,
          position: 'absolute',
          bottom: 0,
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => this.RBorder.open()}
            style={styles.btnCancelBasketModal}>
            <Icon
              size={18}
              name={'th-list'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>View Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={dataBasket.status == 'ON_THE_WAY' ? false : true}
            onPress={() => {
              try {
                // clearInterval(this.intervalWaitingFood);
                // this.intervalWaitingFood = undefined;
              } catch (e) {}
              this.askUserToCompleteOrder();
            }}
            style={[
              styles.btnAddBasketModal,
              {
                backgroundColor:
                  dataBasket.status == 'ON_THE_WAY'
                    ? colorConfig.store.defaultColor
                    : colorConfig.store.disableButton,
              },
            ]}>
            <Icon
              size={21}
              name={'check-square'}
              style={{color: 'white', marginRight: 5}}
            />
            <Text style={styles.textBtnBasketModal}>Received</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  getInfoCart = () => {
    let {intlData, dataBasket} = this.props;
    if (dataBasket == undefined) {
      dataBasket = {};
      dataBasket.outlet = {};
    }

    if (dataBasket.orderingMode == 'DELIVERY') {
      let trackingNo = '';
      if (dataBasket.trackingNo != undefined) {
        trackingNo = `\n\nTracking No: ${dataBasket.trackingNo}`;
      }
      return `Queue No: ${dataBasket.queueNo} ${trackingNo}`;
    } else {
      if (dataBasket.queueNo != undefined) {
        return `Queue No: ${dataBasket.queueNo}`;
      } else {
        return `Table No: ${dataBasket.tableNo}`;
      }
    }
  };

  renderTextWaiting = () => {
    let {intlData, dataBasket} = this.props;
    if (dataBasket == undefined) {
      dataBasket = {};
    }
    // if basket is canceled by admin, then give template status
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          marginVertical: 30,
        }}>
        {dataBasket.status == 'READY_FOR_COLLECTION' ? (
          <View>
            <Text
              style={{
                fontSize: 23,
                color: colorConfig.store.defaultColor,
                fontWeight: 'bold',
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
              }}>
              Yeay, your order is ready. {'\n'} {'\n'}
              <Text style={{color: colorConfig.pageIndex.grayColor}}>
                Please come to the cashier and tap the QR Code button below.
              </Text>
            </Text>
            <Text
              style={{
                fontSize: 25,
                marginTop: 22,
                color: colorConfig.store.colorSuccess,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              {this.getInfoCart()}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 25,
                color: colorConfig.pageIndex.inactiveTintColor,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              Please wait, We are preparing your order.
            </Text>
            <Text
              style={{
                fontSize: 24,
                marginTop: 22,
                color: colorConfig.store.colorSuccess,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              {this.getInfoCart()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  getInfoProvider = id => {
    const {providers} = this.props;
    try {
      const data = providers.find(item => item.id == id);
      return data.name;
    } catch (e) {
      return false;
    }
  };

  copyTrackingNo = () => {
    const {dataBasket} = this.props;
    try {
      if (dataBasket != undefined) {
        if (dataBasket.trackingNo != undefined) {
          Clipboard.setString(dataBasket.trackingNo);
        }
      }
      Snackbar.show({
        text: 'Tracking No copied.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (e) {}
  };

  renderTextWaitingDelivery = () => {
    let {intlData, dataBasket} = this.props;
    // if basket is canceled by admin, then give template status
    if (dataBasket == undefined) {
      dataBasket = {};
    }
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 15,
          marginVertical: 30,
        }}>
        {dataBasket.status == 'READY_FOR_DELIVERY' ||
        dataBasket.status == 'ON_THE_WAY' ? (
          <View>
            <Text
              style={{
                fontSize: 23,
                color: colorConfig.store.defaultColor,
                fontWeight: 'bold',
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
              }}>
              {dataBasket.status == 'READY_FOR_DELIVERY'
                ? 'Yeay, your order is ready. \n \n '
                : 'Your order is on the way. \n \n '}
            </Text>
            <Text
              style={{
                fontSize: 17,
                marginTop: -30,
                color: colorConfig.pageIndex.grayColor,
                fontWeight: 'bold',
                fontFamily: 'Poppins-Medium',
                textAlign: 'center',
              }}>
              {dataBasket.status == 'READY_FOR_DELIVERY'
                ? 'We are getting ready to deliver your order ... \n \n '
                : `Go to ${dataBasket.deliveryAddress.streetName}, Unit No ${
                    dataBasket.deliveryAddress.unitNo
                  }, Postal Code ${dataBasket.deliveryAddress.postalCode} \n `}
            </Text>
            <Text
              style={{
                fontSize: 19,
                // marginTop: -20,
                color: colorConfig.store.colorSuccess,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              {this.getInfoCart()}{' '}
              {dataBasket != undefined && dataBasket.trackingNo != undefined ? (
                <Icon
                  onPress={this.copyTrackingNo}
                  size={16}
                  name={'files-o'}
                  style={{color: colorConfig.pageIndex.grayColor}}
                />
              ) : null}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontSize: 25,
                color: colorConfig.pageIndex.inactiveTintColor,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              Please wait, We are preparing your food in the kitchen.
            </Text>
            <Text
              style={{
                fontSize: 24,
                marginTop: 22,
                color: colorConfig.store.colorSuccess,
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Poppins-Medium',
              }}>
              {this.getInfoCart()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  renderItemModifier = item => {
    return (
      <FlatList
        data={item.modifiers}
        renderItem={({item}) =>
          item.modifier.details.map((mod, idx) => (
            <Text key={idx} style={[styles.descModifier]}>
              •{' '}
              {item.modifier.isYesNo != true ? (
                <Text
                  style={{
                    color: colorConfig.store.defaultColor,
                  }}>
                  {mod.quantity}x
                </Text>
              ) : null}{' '}
              {mod.name} ( {this.format(CurrencyFormatter(mod.price))} )
            </Text>
          ))
        }
      />
    );
  };

  getDetailPayment = () => {
    const {dataBasket, myCardAccount} = this.props;
    try {
      if (dataBasket.confirmationInfo.paymentResponse != undefined) {
        const accountID = dataBasket.confirmationInfo.paymentResponse.accountId;
        const data = myCardAccount.find(
          item => `account::${item.id}` == accountID,
        );

        const number = data.details.maskedAccountNumber.substr(
          data.details.maskedAccountNumber.length - 4,
          data.details.maskedAccountNumber.length,
        );
        const card = data.details.cardIssuer.toUpperCase();
        return `${card} - ${number}`;
      } else {
        return dataBasket.confirmationInfo.paymentType;
      }
    } catch (e) {
      return '-';
    }
  };

  getTotal = item => {
    try {
      if (item.confirmationInfo == undefined) {
        return item.totalNettAmount;
      } else if (
        item.confirmationInfo != undefined &&
        item.confirmationInfo.afterPrice != undefined
      ) {
        return item.confirmationInfo.afterPrice;
      }
    } catch (e) {
      return 0;
    }
  };
  getLabelTimeslot = () => {
    try {
      const orderType = this.props.dataBasket.orderingMode;
      if (this.props.dataBasket.orderActionTimeSlot != null) {
        if (orderType === 'DELIVERY') return 'Delivery Date & Time';
        if (orderType === 'STOREPICKUP' || orderType === 'TAKEAWAY')
          return 'Pickup Date & Time';
      } else {
        if (orderType === 'DELIVERY') return 'Delivery Date';
        if (orderType === 'STOREPICKUP' || orderType === 'TAKEAWAY')
          return 'Pickup Date';
      }
    } catch (e) {
      return null;
    }
  };

  renderOrderActionDate = () => {
    const {dataBasket} = this.props;
    try {
      if (dataBasket?.orderActionDate) {
        <View style={styles.itemSummary}>
          <Text style={styles.total}>{this.getLabelTimeslot()}</Text>
          <Text style={styles.total}>
            {format(new Date(dataBasket?.orderActionDate), 'dd MMM yyyy')}{' '}
            {dataBasket?.orderActionTimeSlot != null &&
              ` at ${dataBasket?.orderActionTimeSlot}`}
          </Text>
        </View>;
      }
    } catch (e) {
      return null;
    }
  };

  detailOrder = () => {
    const {intlData, dataBasket} = this.props;
    return (
      <RBSheet
        ref={ref => {
          this.RBorder = ref;
        }}
        animationType={'slide'}
        height={650}
        duration={0}
        closeOnDragDown={false}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          container: {
            backgroundColor: colorConfig.store.textWhite,
            paddingHorizontal: 5,
            paddingTop: 20,
          },
        }}>
        {dataBasket != undefined ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            <Text
              style={{
                color: colorConfig.store.darkColor,
                fontSize: 18,
                fontFamily: 'Poppins-Medium',
                marginLeft: 10,
              }}>
              Order Details :
            </Text>
            <FlatList
              data={this.props.dataBasket.details}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '100%', flexDirection: 'row'}}>
                      <Image
                        source={this.getImageUrl(item.product.defaultImageURL)}
                        style={{
                          marginRight: 7,
                          borderRadius: 3,
                          width: 75,
                          height: 75,
                          resizeMode: 'contain',
                        }}
                      />
                      <View>
                        <Text style={[styles.desc]}>
                          <Text
                            style={{
                              color: colorConfig.store.defaultColor,
                            }}>
                            {item.quantity}x
                          </Text>{' '}
                          {item.product != undefined ? item.product.name : '-'}{' '}
                          {`  +${this.format2(
                            CurrencyFormatter(
                              item.product != undefined
                                ? item.product.retailPrice
                                : 0,
                            ),
                          )}`}{' '}
                        </Text>
                        {!isEmptyArray(item.promotions)
                          ? item.promotions.map(promo =>
                              item.nettAmount &&
                              item.nettAmount < item.grossAmount ? (
                                <Text style={styles.promotionActive}>
                                  <Icon size={13} name={'tags'} /> {promo.name}
                                </Text>
                              ) : (
                                <Text style={styles.promotionInactive}>
                                  <Icon size={13} name={'tags'} /> {promo.name}
                                </Text>
                              ),
                            )
                          : null}
                        {/* loop item modifier */}
                        {!isEmptyArray(item.modifiers) ? (
                          <Text
                            style={{
                              color: colorConfig.pageIndex.inactiveTintColor,
                              fontSize: 10,
                              marginLeft: 17,
                              fontStyle: 'italic',
                            }}>
                            Add On:
                          </Text>
                        ) : null}
                        {this.renderItemModifier(item)}
                        {item.remark != undefined && item.remark != '' ? (
                          <Text
                            style={{
                              marginTop: 3,
                              color: colorConfig.pageIndex.inactiveTintColor,
                              fontSize: 12,
                              marginLeft: 17,
                              fontStyle: 'italic',
                            }}>
                            Note: {item.remark}
                          </Text>
                        ) : null}

                        {item.nettAmount &&
                        item.nettAmount < item.grossAmount ? (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.descPrice}>
                              {this.format3(CurrencyFormatter(item.nettAmount))}
                            </Text>
                            <Text
                              style={[
                                styles.descPrice,
                                {
                                  textDecorationLine: 'line-through',
                                  marginLeft: 20,
                                  color: colorConfig.pageIndex.grayColor,
                                },
                              ]}>
                              {this.format3(
                                CurrencyFormatter(item.grossAmount),
                              )}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <Text style={styles.descPrice}>
                              {this.format3(
                                CurrencyFormatter(item.grossAmount),
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(product, index) => index.toString()}
            />

            <View style={{marginBottom: 30}} />

            <Text
              style={{
                color: colorConfig.store.darkColor,
                fontSize: 18,
                fontFamily: 'Poppins-Medium',
                marginLeft: 10,
              }}>
              Order Summary :
            </Text>

            {dataBasket.transactionRefNo && (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Ref No : </Text>
                <Text style={styles.total}>{dataBasket.transactionRefNo}</Text>
              </View>
            )}
            <View style={styles.itemSummary}>
              <Text style={styles.total}>Queue No : </Text>
              <Text style={styles.total}>{dataBasket.queueNo}</Text>
            </View>
            <View style={styles.itemSummary}>
              <Text style={styles.total}>Status : </Text>
              <Text style={styles.total}>
                {this.getStatusText(dataBasket.status)}
              </Text>
            </View>
            <View style={styles.itemSummary}>
              <Text style={styles.total}>Ordering Mode : </Text>
              <Text style={styles.total}>{dataBasket.orderingMode}</Text>
            </View>
            {this.renderOrderActionDate()}
            {dataBasket.orderingMode == 'DELIVERY' ? (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Delivery Address : </Text>
                <Text
                  style={[styles.total, {textAlign: 'right', fontSize: 12}]}>
                  {/*{dataBasket.deliveryAddress.address}{' '}*/}
                  {dataBasket.deliveryAddress.streetName}
                  {' \n'}
                  Unit No, {dataBasket.deliveryAddress.unitNo}
                  {' \n'}
                  {/*{awsConfig.COUNTRY != 'Singapore'*/}
                  {/*  ? dataBasket.deliveryAddress.city*/}
                  {/*  : awsConfig.COUNTRY}*/}
                  {/*{' \n'}*/}
                  {dataBasket.deliveryAddress.province != undefined
                    ? dataBasket.deliveryAddress.province
                    : null}
                  {dataBasket.deliveryAddress.province != undefined
                    ? ' \n'
                    : null}
                  Postal Code, {dataBasket.deliveryAddress.postalCode}
                </Text>
              </View>
            ) : null}
            {dataBasket.deliveryProvider != undefined ? (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Delivery Provider : </Text>
                <Text style={[styles.total, {textAlign: 'right'}]}>
                  {dataBasket.deliveryProvider}
                </Text>
              </View>
            ) : null}

            {dataBasket.totalDiscountAmount > 0 && (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Subtotal b/f Disc : </Text>
                <Text style={styles.total}>
                  {appConfig.appMataUang}{' '}
                  {this.format(CurrencyFormatter(dataBasket.totalGrossAmount))}
                </Text>
              </View>
            )}
            {dataBasket.totalDiscountAmount > 0 && (
              <View style={styles.itemSummary}>
                <Text
                  style={[styles.total, {color: colorConfig.store.colorError}]}>
                  Discount :{' '}
                </Text>
                <Text
                  style={[styles.total, {color: colorConfig.store.colorError}]}>
                  - {appConfig.appMataUang}{' '}
                  {this.format(
                    CurrencyFormatter(dataBasket.totalDiscountAmount),
                  )}
                </Text>
              </View>
            )}
            <View style={styles.itemSummary}>
              <Text style={styles.total}>Subtotal : </Text>
              <Text style={styles.total}>
                {appConfig.appMataUang}{' '}
                {this.format(
                  CurrencyFormatter(
                    dataBasket.totalGrossAmount -
                      dataBasket.totalDiscountAmount,
                  ),
                )}
              </Text>
            </View>

            {dataBasket.totalSurchargeAmount > 0 && (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Surcharge : </Text>
                <Text style={styles.total}>
                  {appConfig.appMataUang}{' '}
                  {this.format(
                    CurrencyFormatter(dataBasket.totalSurchargeAmount),
                  )}
                </Text>
              </View>
            )}

            {dataBasket.deliveryFee !== undefined &&
            dataBasket.provider &&
            dataBasket.provider.taxRuleID === 'EXC-TAX' ? (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Delivery Fee : </Text>
                <Text style={[styles.total, {textAlign: 'right'}]}>
                  {appConfig.appMataUang}{' '}
                  {this.format(CurrencyFormatter(dataBasket.deliveryFee))}
                </Text>
              </View>
            ) : null}

            {dataBasket.exclusiveTax > 0 && (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>
                  Tax {dataBasket.outlet.taxPercentage}%
                </Text>
                <Text style={[styles.total, {textAlign: 'right'}]}>
                  {appConfig.appMataUang}{' '}
                  {this.format(CurrencyFormatter(dataBasket.exclusiveTax))}
                </Text>
              </View>
            )}

            {dataBasket.deliveryFee !== undefined &&
            dataBasket.provider &&
            dataBasket.provider.taxRuleID !== 'EXC-TAX' ? (
              <View style={styles.itemSummary}>
                <Text style={styles.total}>Delivery Fee : </Text>
                <Text style={[styles.total, {textAlign: 'right'}]}>
                  {appConfig.appMataUang}{' '}
                  {this.format(CurrencyFormatter(dataBasket.deliveryFee))}
                </Text>
              </View>
            ) : null}

            <View style={[styles.itemSummary, {borderBottomWidth: 0}]}>
              <Text style={[styles.total, {color: colorConfig.store.title}]}>
                GRAND TOTAL :{' '}
              </Text>
              <Text style={[styles.total, {color: colorConfig.store.title}]}>
                {appConfig.appMataUang}{' '}
                {this.format(CurrencyFormatter(dataBasket.totalNettAmount))}
              </Text>
            </View>

            {dataBasket.inclusiveTax > 0 && (
              <View
                style={[
                  styles.itemSummary,
                  {borderBottomWidth: 0, marginTop: -17},
                ]}>
                <Text
                  style={[
                    styles.total,
                    {
                      color: colorConfig.pageIndex.inactiveTintColor,
                      fontSize: 11,
                    },
                  ]}>
                  Inclusive Tax
                </Text>
                <Text
                  style={[
                    styles.total,
                    {
                      color: colorConfig.pageIndex.inactiveTintColor,
                      fontSize: 11,
                    },
                  ]}>
                  {appConfig.appMataUang}{' '}
                  {this.format(CurrencyFormatter(dataBasket.inclusiveTax))}
                </Text>
              </View>
            )}

            <View style={[styles.itemSummary, {borderBottomWidth: 0}]}>
              <Text
                style={[
                  styles.total,
                  {color: colorConfig.store.titleSelected},
                ]}>
                Payment Method:
              </Text>
            </View>

            {!isEmptyArray(dataBasket.payments)
              ? this.renderPayments(dataBasket.payments)
              : null}
          </ScrollView>
        ) : null}

        <TouchableOpacity
          onPress={() => this.RBorder.close()}
          style={styles.makeAnotherProduct}>
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              textAlign: 'center',
            }}>
            Hide
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  format = item => {
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
    const {intlData, dataBasket, orderType} = this.props;
    // try {
    //   if (
    //     dataBasket.status == 'READY_FOR_COLLECTION' &&
    //     this.interval != undefined &&
    //     (dataBasket.outlet.outletType == 'QUICKSERVICE' ||
    //       orderType == 'TAKEAWAY')
    //   ) {
    //     clearInterval(this.interval);
    //     this.interval = undefined;
    //   }
    // } catch (e) {
    //   clearInterval(this.interval);
    //   this.interval = undefined;
    // }

    // if basket is canceled by admin, then push back to basket page
    if (dataBasket == undefined) {
      try {
        // clearInterval(this.intervalWaitingFood);
        // this.intervalWaitingFood = undefined;
        Actions.reset('app', {fromPayment: true});
      } catch (e) {}
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.detailOrder()}
        <Header onBackBtn={this.goBack} title="Order Detail" />
        {this.renderImage()}
        {dataBasket != undefined && dataBasket?.orderingMode === 'DELIVERY'
          ? this.renderTextWaitingDelivery()
          : this.renderTextWaiting()}
        {dataBasket != undefined && dataBasket?.orderingMode !== 'DELIVERY'
          ? this.renderBottomButton()
          : this.renderBottomButtonDelivery()}
      </SafeAreaView>
    );
  }

  renderImage = () => {
    const {dataBasket} = this.props;
    const isImagePng =
      dataBasket?.status === 'PROCESSING' ||
      dataBasket?.status === 'READY_FOR_DELIVERY' ||
      dataBasket?.status === 'READY_FOR_COLLECTION';

    if (dataBasket !== undefined && isImagePng) {
      return (
        <View style={styles.viewImagePng}>
          <Image
            source={this.getImage(dataBasket)}
            style={styles.imagePng}
            resizeMode="contain"
          />
        </View>
      );
    } else {
      return (
        <View style={styles.viewImageGif}>
          {dataBasket != undefined ? (
            <LottieView
              speed={1}
              source={this.getAnimation(dataBasket)}
              autoPlay
              loop={true}
            />
          ) : null}
        </View>
      );
    }
  };

  getImage = dataBasket => {
    try {
      if (dataBasket?.status === 'PROCESSING') {
        return appConfig.imageOrderPreparing;
      } else if (dataBasket?.status === 'READY_FOR_DELIVERY') {
        return appConfig.imageOrderReady;
      } else if (dataBasket?.status === 'READY_FOR_COLLECTION') {
        return appConfig.imageOrderReady;
      } else {
        return appConfig.imageOrderReady;
      }
    } catch (e) {
      return appConfig.imageOrderReady;
    }
  };

  getAnimation = dataBasket => {
    try {
      if (dataBasket?.status === 'ON_THE_WAY') {
        return require('../../../assets/animate/delivery');
      } else {
        return require('../../../assets/animate/cooking');
      }
    } catch (e) {
      return require('../../../assets/animate/cooking');
    }
  };
}

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataCartSingle.cartSingle,
  myCardAccount: state.cardReducer.myCardAccount.card,
  providers: state.orderReducer.dataProvider.providers,
  orderType: state.userReducer.orderType.orderType,
  tableType: state.orderReducer.tableType.tableType,
  products: state.orderReducer.productsOutlet.products,
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
)(WaitingFood);

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
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  makeAnotherProduct: {
    padding: 11,
    marginBottom: 15,
    marginTop: 20,
    backgroundColor: colorConfig.store.secondaryColor,
    borderRadius: 15,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subTitle: {
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.title,
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  total: {
    marginVertical: 10,
    fontFamily: 'Poppins-Medium',
    color: colorConfig.pageIndex.grayColor,
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
    fontFamily: 'Poppins-Regular',
  },
  descModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    fontSize: 11,
    fontStyle: 'italic',
    marginLeft: 17,
    fontFamily: 'Poppins-Regular',
  },
  descPrice: {
    color: colorConfig.store.title,
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Poppins-Medium',
  },
  descPriceModifier: {
    color: colorConfig.pageIndex.grayColor,
    maxWidth: Dimensions.get('window').width,
    textAlign: 'right',
    alignItems: 'flex-end',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Medium',
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
    fontFamily: 'Poppins-Medium',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    marginRight: 20,
    width: '40%',
    backgroundColor: colorConfig.store.colorSuccess,
  },
  textBtnBasketModal: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    textAlign: 'center',
  },
  promotionActive: {
    fontFamily: 'Poppins-Italic',
    fontSize: 12,
    paddingVertical: 3,
    color: colorConfig.store.defaultColor,
  },
  promotionInactive: {
    fontFamily: 'Poppins-Italic',
    fontSize: 12,
    paddingVertical: 3,
    color: colorConfig.pageIndex.grayColor,
  },
  viewImagePng: {
    width: '100%',
    height: '35%',
    alignItems: 'center',
  },
  viewImageGif: {
    height: '35%',
  },
  imagePng: {
    width: '100%',
    height: '100%',
  },
});
