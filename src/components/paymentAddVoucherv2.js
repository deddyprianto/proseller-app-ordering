/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  BackHandler,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {isEmptyArray} from '../helper/CheckEmpty';
import {Header} from './layout';
import GlobalText from './globalText';
import InputVoucher from './vouchers/InputVoucher';
import {checkPromo} from '../actions/rewards.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import LoadingScreen from './loadingScreen/LoadingScreen';
import {showSnackbar} from '../actions/setting.action';
import VoucherListCheckout from './voucherList/VoucherListCheckout';
import GlobalButton from './button/GlobalButton';
import {normalizeLayoutSizeWidth} from '../helper/Layout';

class PaymentAddVoucersV2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      currentDay: new Date(),
      data: this.props.data,
      loadingCheckVoucher: false,
      usedVoucher: props?.dataVoucer || [],
      availableVoucher: props?.myVoucher || [],
      newAvailableVoucher: [],
      unAvailableVoucher: [],
      onlyTypeVoucher: [],
    };
  }

  filterOnlyVoucher = () => {
    if (!isEmptyArray(this.state.usedVoucher)) {
      const onlyVoucher = this.state.usedVoucher.filter(
        voucher => voucher?.paymentType !== 'point',
      );
      return onlyVoucher;
    }
    return [];
  };

  componentDidMount() {
    this.setupAvailableVoucher();
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

  handleSearchSpecificProduct = async item => {
    let result;
    for (let i = 0; i < this.props.pembayaran.details.length; i++) {
      if (item.appliedTo === 'PRODUCT') {
        result = await item.appliedItems.find(
          item => item.value === this.props.pembayaran.details[i].product.id,
        );
      }
      if (item.appliedTo === 'CATEGORY') {
        result = await item.appliedItems.find(
          item =>
            item.value === this.props.pembayaran.details[i].product.categoryID,
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
    return result;
  };

  hanldeCheckSpecificProduct = (result, item) => {
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
      Alert.alert(
        'Sorry',
        `${item.name} cannot be applied to ${result.product.name}`,
      );
      return false;
    }
    return true;
  };

  setupAvailableVoucher = async () => {
    const {totalPrice} = this.props;
    let myNewVoucher = [];
    let myUnavailableVoucher = [];
    this.state.availableVoucher?.forEach(async data => {
      const includeOutlet = data.selectedOutlets?.includes(
        `outlet::${this.props.pembayaran.storeId}`,
      );
      const findDuplicateVocher = this.state.usedVoucher?.find(
        duplicate => data.id === duplicate.id,
      );
      const duplicateVoucher =
        findDuplicateVocher && data?.validity?.canOnlyUseOneTime;
      const isValidDay = this.isValidDay(data).status;
      const passMinimumPurchase = totalPrice > data.minPurchaseAmount;
      if (
        includeOutlet &&
        passMinimumPurchase &&
        !duplicateVoucher &&
        isValidDay
      ) {
        myNewVoucher.push(data);
      } else {
        myUnavailableVoucher.push(data);
      }
    });
    this.setState({
      newAvailableVoucher: myNewVoucher,
      unAvailableVoucher: myUnavailableVoucher,
    });
    console.log({myNewVoucher, myUnavailableVoucher}, 'kurapika');
  };

  pageDetailVoucher = async (item, type, index) => {
    const {totalPrice} = this.props;
    const {usedVoucher} = this.state;
    // check if voucher is applied on specific products only
    /* Check if voucher can be mixed */
    if (
      !isEmptyArray(usedVoucher) &&
      item.validity &&
      item.validity.canOnlyUseOneTime === true
    ) {
      const findVoucher = usedVoucher.find(data => data.id === item.id);
      if (findVoucher) {
        Alert.alert(
          'Sorry',
          `Voucher ${item.name} can only be used once for an order.`,
        );
        return;
      }
    }

    if (!isEmptyArray(usedVoucher)) {
      let cannotBeMixed = false;
      let voucherName = '';
      let postfix = 'this voucher.';
      for (let i = 0; i < usedVoucher.length; i++) {
        if (
          usedVoucher[i].validity &&
          usedVoucher[i].validity.cannotBeMixed === true &&
          usedVoucher[i].id !== item.id
        ) {
          cannotBeMixed = true;
          voucherName = usedVoucher[i].name;

          if (usedVoucher[i].isVoucherPromoCode) {
            postfix = 'this promo code.';
          }
          break;
        }

        if (
          usedVoucher[i].validity &&
          item.validity.cannotBeMixed &&
          usedVoucher[i].id !== item.id
        ) {
          cannotBeMixed = true;
          voucherName = item.name;

          if (usedVoucher[0].isVoucherPromoCode) {
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
    if (item.appliedTo !== undefined && item.appliedTo !== 'ALL') {
      //  search specific product
      const result = this.handleSearchSpecificProduct(item);
      // check if apply to specific product is found
      this.hanldeCheckSpecificProduct(result, item);
    }

    // check minimal price for use voucher
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
    // add new voucher

    if (type === 'available') {
      this.handleAddVoucher(item, index);
    }
    // remove voucher
    if (type === 'used') {
      this.handleRemoveVoucher(item, index);
    }
  };

  checkAmountVoucher

  onSubmit = () => {
    this.props.setDataVoucher(this.state.usedVoucher);
    Actions.pop();
  };

  handleRemoveVoucher = (item, index) => {
    if (item) {
      let oldVoucher = this.state.usedVoucher;
      let oldAvailVoucher = this.state.newAvailableVoucher;
      oldVoucher = oldVoucher?.filter(
        voucher => item.serialNumber !== voucher.serialNumber,
      );
      oldAvailVoucher = [...oldAvailVoucher, item];
      this.setState({usedVoucher: oldVoucher}, () => {
        this.setState({newAvailableVoucher: oldAvailVoucher});
      });
    }
  };

  handleAddVoucher = async (item, index) => {
    if (item) {
      let oldVoucher = this.state.usedVoucher;
      oldVoucher = [...oldVoucher, item];
      let availVoucher = this.state.newAvailableVoucher;
      const removeVoucher = availVoucher.filter(
        voucher => voucher.serialNumber !== item.serialNumber,
      );
      this.setState({
        usedVoucher: oldVoucher,
        newAvailableVoucher: removeVoucher,
      });
    }
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
      return {
        status: false,
        message: 'This voucher cannot be used today.',
      };
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

  renderTitle = title => (
    <View style={[styles.dividerTitle]}>
      <View style={styles.divider} />
      <GlobalText style={styles.titleText}>{title}</GlobalText>
    </View>
  );

  checkVoucher = async voucherCode => {
    this.setState({loadingCheckVoucher: true});
    const checkPromoResponse = await this.props.dispatch(
      checkPromo(voucherCode),
    );
    if (!checkPromoResponse.status) {
      let errorMessage = 'Invalid promo code.';
      this.props.dispatch(
        showSnackbar({message: checkPromoResponse?.message || errorMessage}),
      );
    } else {
      this.pageDetailVoucher(checkPromoResponse, 'available');
    }
    this.setState({loadingCheckVoucher: false});
  };

  filterUnAvailableVouher = () => {
    const {allVouchers, point} = this.props;
    if (allVouchers?.length > 0) {
      const unavailabelVouchet = allVouchers?.filter(
        voucher => voucher?.redeemValue > point,
      );
      return unavailabelVouchet;
    }
    return [];
  };

  renderUsedVoucherList = ({item, index}) => (
    <VoucherListCheckout
      onPress={() => this.pageDetailVoucher(item, 'used', index)}
      type={'used'}
      item={item}
    />
  );
  renderAvaulableVoucherList = ({item, index}) => (
    <VoucherListCheckout
      onPress={() => this.pageDetailVoucher(item, 'available', index)}
      type={'available'}
      item={item}
    />
  );
  renderNotAvailableVoucher = ({item}) => (
    <VoucherListCheckout type={'unavailable'} item={item} />
  );

  render() {
    const {usedVoucher, newAvailableVoucher, unAvailableVoucher} = this.state;
    console.log(this.props, this.state, 'nanak');
    return (
      <SafeAreaView style={styles.container}>
        <LoadingScreen loading={this.state.loadingCheckVoucher} />
        <Header title={'My Vouchers'} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {this.renderTitle('USE VOUCHER CODE')}
          <InputVoucher onPressVoucher={this.checkVoucher} />
          {this.filterOnlyVoucher()?.length > 0 ? (
            <View>
              {this.renderTitle('VOUCHER USED')}
              {this.filterOnlyVoucher()?.map(voucher => {
                return this.renderUsedVoucherList({item: voucher});
              })}
            </View>
          ) : null}
          {newAvailableVoucher?.length > 0 ? (
            <View>
              {this.renderTitle('AVAILABLE VOUCHER')}
              {newAvailableVoucher.map(voucher => {
                return this.renderAvaulableVoucherList({item: voucher});
              })}
            </View>
          ) : null}
          {unAvailableVoucher.length > 0 ? (
            <View>
              {this.renderTitle('NOT AVAILABLE')}
              {unAvailableVoucher.map(voucher => {
                return this.renderNotAvailableVoucher({item: voucher});
              })}
            </View>
          ) : null}
        </ScrollView>
        <View onPress={this.onSubmit} style={styles.buttonBottomFixed}>
          <View style={styles.centerAlign}>
            <GlobalText>
              {this.filterOnlyVoucher()?.length} Voucher Applied
            </GlobalText>
          </View>
          <View style={styles.centerAlign}>
            <GlobalButton
              onPress={this.onSubmit}
              buttonStyle={styles.buttonStyle}
              title="Apply"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  allVouchers: state.rewardsReducer?.vouchers?.dataVoucher,
  point: state.rewardsReducer?.dataPoint?.totalPoint,
  myVoucher: state.accountsReducer.myVouchers?.vouchers,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentAddVoucersV2);

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
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    justifyContent: 'space-between',
  },
  dividerTitle: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 16,
    paddingRight: 16,
    marginBottom: 16,
    // paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    width: '100%',
    position: 'absolute',
    top: '50%',
  },
  titleText: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  flatlistCOntainer: {
    paddingHorizontal: 12,
  },
  buttonStyle: {
    marginTop: 0,
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
    width: normalizeLayoutSizeWidth(192),
  },
  scrollContainer: {
    paddingBottom: 30,
  },
});
