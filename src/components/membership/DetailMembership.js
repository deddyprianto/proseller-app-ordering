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
  ScrollView,
  BackHandler,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../loader';
import {List} from 'react-native-paper';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import calculateTAX from '../../helper/TaxCalculation';
import {getBackupOutlet} from '../../actions/stores.action';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import appConfig from '../../config/appConfig';
import AwesomeAlert from 'react-native-awesome-alerts';
import {getPaidMembership, redeemMembership} from '../../actions/membership.action';
import {getUserProfile} from '../../actions/user.action';

class DetailMembership extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      selectedPlan: {},
      detailPurchase: {},
      backupOutlet: {},
      showAlert: false,
      message: '',
      titleAlert: '',
      loading: false,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
    this.getBackupOutlet();
  }

  getBackupOutlet = async () => {
    const response = await this.props.dispatch(getBackupOutlet());
    if (response !== false) {
      await this.setState({backupOutlet: response});
    }
  };

  findTax = async dataDetail => {
    const {backupOutlet} = this.state;
    let {defaultOutlet} = this.props;

    if (isEmptyObject(defaultOutlet)) defaultOutlet = backupOutlet;

    let returnData = {
      outlet: defaultOutlet,
      details: [],
    };
    let product = {};
    product.unitPrice = dataDetail.newPrice || dataDetail.price;
    product.quantity = 1;
    product.product = dataDetail;
    returnData.details.push(product);

    const detailPurchase = await calculateTAX(
      returnData.details,
      returnData,
      {},
    );
    await this.setState({selectedPlan: dataDetail, detailPurchase});
  };

  selectPlan = async mem => {
    try {
      if (mem.price !== undefined) {
        await this.findTax(mem);
        return;
      }
      await this.setState({selectedPlan: mem});
    } catch (e) {}
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  getDesc = desc => {
    try {
      if (desc !== undefined) {
        return desc.substr(0, 30);
      }
    } catch (e) {
      return null;
    }
  };

  getColor = mem => {
    const {selectedPlan} = this.state;
    try {
      if (
        selectedPlan.period === mem.period &&
        (selectedPlan.price === mem.price ||
          selectedPlan.point === mem.point) &&
        selectedPlan.periodUnit === mem.periodUnit
      ) {
        return colorConfig.store.colorSuccess;
      } else {
        return 'white';
      }
    } catch (e) {
      return 'white';
    }
  };

  getDetailItem = selectedPlan => {
    const {membership, userDetail} = this.props;
    let label = 'Upgrade to';
    if (userDetail.customerGroupLevel === membership.ranking) label = 'Renew ';
    if (userDetail.customerGroupLevel > membership.ranking)
      label = 'Downgrade to ';
    try {
      let periodUnit = selectedPlan.periodUnit.toLowerCase();
      return `${label} ${membership.name} / ${
        selectedPlan.period
      } ${periodUnit}`;
    } catch (e) {
      return null;
    }
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

  payMembership = async () => {
    const {membership} = this.props;
    const {selectedPlan, detailPurchase} = this.state;
    try {
      if (selectedPlan.price !== undefined) {
        this.purchaseMembership();
      } else {
        this.redeemMembership();
      }
    } catch (e) {}
  };

  purchaseMembership = async () => {
    const {membership} = this.props;
    const {selectedPlan, detailPurchase} = this.state;

    const {backupOutlet} = this.state;
    let {defaultOutlet} = this.props;

    if (isEmptyObject(defaultOutlet)) defaultOutlet = backupOutlet;

    let details = [];
    // create dataPay item
    let data = {};

    this.state.detailPurchase.details.map((item, index) => {
      let periodUnit = selectedPlan.periodUnit.toLowerCase();
      data.quantity = item.quantity;
      data.unitPrice = item.unitPrice;
      data.product = {
        name: `Paid Membership ${membership.name} / ${
          selectedPlan.period
        } ${periodUnit}`,
        retailPrice: selectedPlan.newPrice || selectedPlan.price,
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

    Actions.settleOrder({
      pembayaran: pembayaran,
      url: url,
      outlet: defaultOutlet,
      payMembership: true,
      selectedPlan: selectedPlan,
      membership: membership,
    });
  };

  redeemMembership = async () => {
    const {membership, userDetail, totalPoint, pendingPoints} = this.props;
    const {selectedPlan} = this.state;
    let pointPurchase = selectedPlan.point;
    if (selectedPlan.newPoint !== undefined)
      pointPurchase = selectedPlan.newPoint;
    await this.setState({loading: true});

    let actualPoints = totalPoint;
    if (pendingPoints !== undefined && pendingPoints > 0) {
      actualPoints -= pendingPoints;
    }

    if (actualPoints < pointPurchase) {
      await this.setState({
        showAlert: true,
        titleAlert: 'Oppss..',
        message: 'Your points are not enough.',
        loading: false,
      });
      return;
    }

    const response = await this.props.dispatch(
      redeemMembership(membership, selectedPlan, userDetail),
    );
    await this.props.dispatch(getUserProfile());
    if (response.success) {
      this.props.dispatch(getPaidMembership());
      await this.setState({
        showAlert: true,
        titleAlert: 'Success!',
        message: response.responseBody.message,
      });
    } else {
      await this.setState({
        showAlert: true,
        titleAlert: 'Oppss..',
        message: response.responseBody.message,
      });
    }
    await this.setState({loading: false});
  };

  goBackAndRefresh = () => {
    try {
      //  REFRESH USER DETAIL HER
      Actions.popTo('pageIndex');
    } catch (e) {}
  };

  render() {
    const {membership} = this.props;
    const {selectedPlan, detailPurchase} = this.state;
    let taxLabel = 'Tax Amount';
    if (detailPurchase !== undefined) {
      if (detailPurchase.inclusiveTax > 0) {
        taxLabel = 'Inclusive Tax Amount';
      }
    }
    console.log(membership, 'membership');
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> {membership.name} </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.card}>
            <Text style={styles.membershipDesc}>{membership.description}</Text>
          </View>
          <List.Section>
            <List.Subheader>
              <Text style={styles.membershipTitle}>Pricing : </Text>
            </List.Subheader>
            {!isEmptyArray(membership.paidMembershipPlan) &&
              membership.paidMembershipPlan.map(mem => (
                <List.Item
                  onPress={() => this.selectPlan(mem)}
                  title={`$${mem.newPrice || mem.price} / ${
                    mem.period
                  } ${mem.periodUnit.toLowerCase()}`}
                  style={{
                    marginHorizontal: 15,
                    borderRadius: 20,
                    borderColor: this.getColor(mem),
                    borderWidth: 1.5,
                    marginVertical: 7,
                  }}
                  titleStyle={{
                    color: colorConfig.store.title,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                  }}
                  description={this.getDesc(mem.description)}
                  left={props =>
                    selectedPlan.period === mem.period &&
                    (selectedPlan.price === mem.price ||
                      selectedPlan.point === mem.point) &&
                    selectedPlan.periodUnit === mem.periodUnit ? (
                      <View style={styles.selectedItem}>
                        <Icon
                          size={20}
                          name={
                            Platform.OS === 'ios'
                              ? 'ios-checkmark'
                              : 'md-checkmark'
                          }
                          style={{color: 'white'}}
                        />
                      </View>
                    ) : (
                      <View style={styles.unSelectedItem} />
                    )
                  }
                />
              ))}
            {!isEmptyArray(membership.paidMembershipPlanWithPoint) &&
              membership.paidMembershipPlanWithPoint.map(mem => (
                <List.Item
                  onPress={() => this.selectPlan(mem)}
                  title={`${mem.newPoint || mem.point} points / ${
                    mem.period
                  } ${mem.periodUnit.toLowerCase()}`}
                  style={{
                    marginHorizontal: 15,
                    borderRadius: 20,
                    borderColor: this.getColor(mem),
                    borderWidth: 1.5,
                    marginVertical: 7,
                  }}
                  titleStyle={{
                    color: colorConfig.store.title,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                  }}
                  description={this.getDesc(mem.description)}
                  left={props =>
                    selectedPlan.period === mem.period &&
                    (selectedPlan.price === mem.price ||
                      selectedPlan.point === mem.point) &&
                    selectedPlan.periodUnit === mem.periodUnit ? (
                      <View style={styles.selectedItem}>
                        <Icon
                          size={20}
                          name={
                            Platform.OS === 'ios'
                              ? 'ios-checkmark'
                              : 'md-checkmark'
                          }
                          style={{color: 'white'}}
                        />
                      </View>
                    ) : (
                      <View style={styles.unSelectedItem} />
                    )
                  }
                />
              ))}
          </List.Section>
        </ScrollView>
        {!isEmptyObject(selectedPlan) && (
          <View style={styles.buttonBottomFixed}>
            {!isEmptyObject(detailPurchase) &&
              selectedPlan.price !== undefined &&
              detailPurchase.totalTaxAmount !== 0 &&
              taxLabel !== 'Inclusive Tax Amount' && (
                <View style={styles.detailPriceInfo}>
                  <Text>{taxLabel}</Text>
                  <Text>
                    {this.format(
                      CurrencyFormatter(detailPurchase.totalTaxAmount),
                    )}
                  </Text>
                </View>
              )}

            <View style={styles.detailPriceInfo}>
              <Text>Total</Text>
              {selectedPlan.price !== undefined ? (
                <Text>
                  {this.format(
                    CurrencyFormatter(detailPurchase.totalNettAmount),
                  )}
                </Text>
              ) : (
                <Text>
                  {selectedPlan.newPoint || selectedPlan.point} points
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={this.payMembership}
              style={{paddingVertical: 17}}>
              <Text style={styles.textAddCard}>
                {this.getDetailItem(selectedPlan)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={this.state.cancelButton}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={'Close'}
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.setState({showAlert: false});
          }}
          onConfirmPressed={() => {
            if (this.state.titleAlert == 'Success!') {
              this.goBackAndRefresh();
            } else {
              this.setState({showAlert: false});
            }
          }}
        />
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  pendingPoints: state.rewardsReducer.dataPoint.pendingPoints,
  defaultOutlet: state.storesReducer.defaultOutlet.defaultOutlet,
  updateUser: state.userReducer.updateUser,
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
)(DetailMembership);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    fontFamily: 'Poppins-Medium',
    borderTopColor: colorConfig.pageIndex.inactiveTintColor,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  header: {
    height: 65,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 80,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  primaryButton: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    padding: 12,
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    marginHorizontal: 15,
  },
  membershipDesc: {
    fontFamily: 'Poppins-Regular',
    lineHeight: 23,
    fontSize: 13.5,
    color: colorConfig.store.titleSelected,
    textAlign: 'justify',
  },
  selectedItem: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: colorConfig.store.colorSuccess,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  unSelectedItem: {
    width: 27,
    height: 27,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colorConfig.store.titleSelected,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  membershipTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 17,
    color: colorConfig.store.defaultColor,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
  },
  detailItem: {
    padding: 10,
    justifyContent: 'space-between',
    // borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    // borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
  },
  textChange: {
    color: colorConfig.pageIndex.inactiveTintColor,
    // color: 'gray',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnChange: {
    padding: 5,
    marginLeft: 'auto',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
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
});
