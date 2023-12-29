import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import LoaderDarker from '../LoaderDarker';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {isEmptyObject} from '../../helper/CheckEmpty';
import calculateTAX from '../../helper/TaxCalculation';
import {getBackupOutlet} from '../../actions/stores.action';
import {navigate} from '../../utils/navigation.utils';

class SVCDetail extends Component {
  constructor(props) {
    super(props);
    this.intlData = this.props.intlData;
    this.state = {
      screenWidth: Dimensions.get('window').width,
      backupOutlet: {},
      svcData: this.props.svc,
      detailPurchase: {},
    };
  }

  goBack() {
    Actions.pop();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  componentDidMount = async () => {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
    await this.getBackupOutlet();
    await this.findTax(this.props.svc);
  };

  /* Default Outlet */
  getBackupOutlet = async () => {
    const response = await this.props.dispatch(getBackupOutlet());
    if (response !== false) {
      await this.setState({backupOutlet: response});
    }
  };

  findTax = async dataDetail => {
    const {backupOutlet} = this.state;
    let {defaultOutlet} = this.props;

    if (!isEmptyObject(backupOutlet)) {
      defaultOutlet = backupOutlet;
    }

    let returnData = {
      outlet: defaultOutlet,
      details: [],
    };
    let product = {};
    product.unitPrice = dataDetail.price;
    product.quantity = dataDetail.quantity;
    product.product = dataDetail;
    returnData.details.push(product);

    const detailPurchase = await calculateTAX(
      returnData.details,
      returnData,
      {},
    );
    await this.setState({svcData: dataDetail, detailPurchase});
  };

  purchaseSVC = async () => {
    const {svcData, detailPurchase} = this.state;

    const {backupOutlet} = this.state;
    let {defaultOutlet} = this.props;

    if (!isEmptyObject(backupOutlet)) {
      defaultOutlet = backupOutlet;
    }

    let details = [];
    // create dataPay item
    let data = {};

    this.state.detailPurchase.details.map((item, index) => {
      data.quantity = item.quantity;
      data.unitPrice = item.unitPrice;
      data.product = {
        name: svcData.name,
        retailPrice: svcData.retailPrice,
      };
      details.push(data);
      data = {};
    });

    const pembayaran = {
      payment: this.state.detailPurchase.totalNettAmount,
      totalNettAmount: this.state.detailPurchase.totalNettAmount,
      totalGrossAmount: this.state.detailPurchase.totalGrossAmount,
      storeName: this.state.detailPurchase.outlet.name,
      details: details,
      storeId: defaultOutlet.id,
    };

    // set url to pay
    let url = '/cart/customer/settle';

    try {
      pembayaran.cartDetails = detailPurchase;
    } catch (e) {}
    navigate('settleOrder', {
      pembayaran: pembayaran,
      url: url,
      outlet: defaultOutlet,
      paySVC: true,
      svc: svcData,
      getCustomerActivity: this.props.getCustomerActivity,
    });
  };

  format = item => {
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

  render() {
    const {intlData} = this.props;
    const {detailPurchase} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loadRedeem && <LoaderDarker />}
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={styles.btnBackIcon}
              />
              <Text style={styles.btnBackText}> {intlData.messages.back} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line} />
        </View>
        <ScrollView>
          <View style={styles.voucherItem}>
            <View style={{alignItems: 'center'}}>
              <Image
                resizeMode="cover"
                style={
                  this.props.svc.image != '' &&
                  this.props.svc.image != undefined
                    ? styles.voucherImage1
                    : styles.voucherImage2
                }
                source={
                  this.props.svc.image != '' &&
                  this.props.svc.image != undefined
                    ? {uri: this.props.svc.image}
                    : appConfig.appImageNull
                }
              />
            </View>
            <View style={styles.voucherDetail}>
              <View
                style={{
                  paddingLeft: 10,
                  paddingTop: 5,
                  paddingRight: 5,
                  paddingBottom: 10,
                }}>
                <Text style={styles.nameVoucher}>{this.props.svc.name}</Text>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <Icon
                    size={15}
                    name={
                      Platform.OS === 'ios'
                        ? 'ios-help-circle-outline'
                        : 'md-help-circle-outline'
                    }
                    style={{
                      color: colorConfig.store.secondaryColor,
                      marginRight: 10,
                    }}
                  />
                  <Text style={styles.descVoucher}>
                    {this.props.svc.description != null
                      ? this.props.svc.description
                      : 'No description for this store value card'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonBottomFixed}>
          {!isEmptyObject(detailPurchase) &&
            detailPurchase.totalTaxAmount !== 0 && (
              <View style={styles.detailPriceInfo}>
                <Text>Tax Amount</Text>
                <Text>
                  {this.format(
                    CurrencyFormatter(detailPurchase.totalTaxAmount),
                  )}
                </Text>
              </View>
            )}

          <View style={styles.detailPriceInfo}>
            <Text>Total</Text>
            <Text>
              {this.format(CurrencyFormatter(detailPurchase.totalNettAmount))}
            </Text>
          </View>
          <TouchableOpacity
            onPress={this.purchaseSVC}
            style={{paddingVertical: 17}}>
            <Text style={styles.textAddCard}>Purchase</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    flexDirection: 'column',
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
  textAddCard: {
    fontSize: 15,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  detailPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colorConfig.pageIndex.inactiveTintColor,
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
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    borderBottomWidth: 2,
  },
  point: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  voucherItem: {
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    // margin: 10,
    // marginTop: 10,
    // borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 2.5,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 2,
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'contain',
  },
  voucherDetail: {
    borderTopColor: colorConfig.pageIndex.activeTintColor,
    borderTopWidth: 1,
    flexDirection: 'column',
    // padding: 10,
  },
  nameVoucher: {
    fontSize: 20,
    textAlign: 'center',
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 15,
    maxWidth: '90%',
    color: colorConfig.store.titleSelected,
  },
  descVoucherTime: {
    fontSize: 13,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  pointVoucher: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colorConfig.pageIndex.activeTintColor,
    paddingBottom: 0,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
  buttonQty: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 10,
    borderRadius: 5,
    width: 40,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingPointsInfo: {
    padding: 10,
    backgroundColor: colorConfig.store.transparent,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 20,
  },
});

mapStateToProps = state => ({
  defaultOutlet: state.storesReducer.defaultOutlet.defaultOutlet,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SVCDetail);
