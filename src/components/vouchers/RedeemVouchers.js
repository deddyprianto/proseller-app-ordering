import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Platform,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {dataPoint, vouchers} from '../../actions/rewards.action';
import {myVoucers} from '../../actions/account.action';
import Loader from '../loader';
import {clearAccount} from '../../actions/payment.actions';
import * as _ from 'lodash';
import {isEmptyArray, isEmptyObject} from '../../helper/CheckEmpty';
import {navigate} from '../../utils/navigation.utils';

class RedeemVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: this.props.dataVoucher,
      currentDay: new Date(),
      refreshing: false,
      isLoading: true,
    };
  }

  componentDidMount = async () => {
    try {
      await this.setState({isLoading: true});
      await this.props.dispatch(vouchers());
      await this.props.dispatch(myVoucers());
      await this.setState({isLoading: false});
    } catch (e) {
      await this.setState({isLoading: false});
    }
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    let myVoucers = [];
    const {dataVoucer} = this.props;
    try {
      if (
        this.props.myVoucers != undefined &&
        !isEmptyArray(this.props.myVoucers)
      ) {
        _.forEach(
          _.groupBy(
            this.props.myVoucers.filter(voucher => voucher.deleted == false),
            'uniqueID',
          ),
          function(value, key) {
            value[0].totalRedeem = value.length;
            myVoucers.push(value[0]);
          },
        );

        // REMOVE VOUCHER SELECTED FROM LIST
        if (!isEmptyArray(dataVoucer)) {
          for (let x = 0; x < dataVoucer.length; x++) {
            for (let y = 0; y < myVoucers.length; y++) {
              if (dataVoucer[x].isVoucher == true) {
                if (dataVoucer[x].uniqueID == myVoucers[y].uniqueID) {
                  myVoucers[y].totalRedeem -= 1;
                }
              }
            }
          }
        }

        this.props.setVouchers(myVoucers);
      }
    } catch (e) {}
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

  pageDetailVoucher = item => {
    const {intlData} = this.props;
    navigate('voucher', {
      dataVoucher: item,
      intlData,
      fromPage: 'paymentAddVoucers',
      setVouchers: this.props.setVouchers,
    });
  };

  getDataVoucher = async () => {
    this.setState({refreshing: true});
    await this.props.dispatch(dataPoint());
    await this.props.dispatch(vouchers());
    await this.props.dispatch(myVoucers());
    this.setState({refreshing: false});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataVoucher();
    this.setState({refreshing: false});
  };

  render() {
    const {intlData, totalPoint, vouchers, detailPoint} = this.props;
    return (
      <SafeAreaView>
        {this.state.isLoading && <Loader />}
        <View
          style={{
            backgroundColor: colorConfig.store.defaultColor,
            paddingVertical: 5,
          }}>
          <View style={{backgroundColor: colorConfig.store.defaultColor}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
                <Icon
                  size={25}
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-arrow-back'
                      : 'md-arrow-round-back'
                  }
                  style={{color: 'white'}}
                />
                <Text style={styles.btnBackText}>Redeem Vouchers</Text>
              </TouchableOpacity>
              {this.props.totalPoint != undefined &&
              detailPoint != undefined &&
              !isEmptyObject(detailPoint.trigger) &&
              (detailPoint.trigger.status === true ||
                detailPoint.trigger.campaignTrigger === 'USER_SIGNUP') ? (
                <View style={styles.point}>
                  <Icon
                    size={23}
                    name={
                      Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'
                    }
                    style={{
                      color: colorConfig.pageIndex.backgroundColor,
                      marginRight: 8,
                    }}
                  />
                  <Text
                    style={{
                      color: colorConfig.pageIndex.backgroundColor,
                      fontWeight: 'bold',
                    }}>
                    {this.props.totalPoint == undefined
                      ? 0 + ' Point'
                      : this.props.totalPoint + ' Point'}
                  </Text>
                </View>
              ) : null}
            </View>
            {/*<View style={styles.line} />*/}
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.container}>
            <View>
              {this.props.vouchers == undefined ||
              this.props.vouchers.length == 0 ? (
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
                this.props.vouchers.map((item, keys) => (
                  <View key={keys}>
                    {
                      <TouchableOpacity
                        style={styles.voucherItem}
                        onPress={() => this.pageDetailVoucher(item)}>
                        <View style={{alignItems: 'center'}}>
                          <Image
                            style={
                              item['image'] != '' && item['image'] != undefined
                                ? styles.voucherImage1
                                : styles.voucherImage2
                            }
                            source={
                              item['image'] != '' && item['image'] != undefined
                                ? {uri: item['image']}
                                : appConfig.appImageNull
                            }
                          />
                        </View>
                        <View style={styles.voucherDetail}>
                          <Text style={styles.nameVoucher}>{item['name']}</Text>

                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.descPrice}>
                              - Redeem Value {item['redeemValue']} Points
                            </Text>
                          </View>

                          {item.price && (
                            <View style={{flexDirection: 'row'}}>
                              <Text style={styles.descPrice}>
                                - Purchase Value ${item['price']}
                              </Text>
                            </View>
                          )}

                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.descVoucher}>
                              {item['voucherDesc'] != null
                                ? item['voucherDesc']
                                : 'No description for this voucher'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    }
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
    paddingBottom: 200,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  btnBackText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    paddingVertical: 15,
  },
  descPrice: {
    fontSize: 11,
    maxWidth: '95%',
    fontFamily: 'Poppins-Medium',
    color: colorConfig.store.defaultColor,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  vourcherPoint: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colorConfig.store.transparentColor,
    height: 30,
    // width: this.state.screenWidth / 2 - 11,
    borderTopRightRadius: 9,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
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
    fontSize: 16,
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
    fontSize: 15,
    color: colorConfig.store.secondaryColor,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  descVoucher: {
    fontSize: 11,
    maxWidth: '95%',
    marginLeft: 5,
    color: colorConfig.store.titleSelected,
    fontFamily: 'Poppins-Italic',
  },
  pointVoucher: {
    fontSize: 12,
    color: colorConfig.pageIndex.activeTintColor,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
  point: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.backgroundColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
});

mapStateToProps = state => ({
  detailPoint: state.rewardsReducer.dataPoint.detailPoint,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  vouchers: state.rewardsReducer.vouchers.dataVoucher,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
)(RedeemVoucher);
