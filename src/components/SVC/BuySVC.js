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
import Loader from '../loader';
import {getSVCCard} from '../../actions/SVC.action';

class BuySVC extends Component {
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
      await this.props.dispatch(getSVCCard());
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
    Actions.pop();
  };

  pageDetail = item => {
    const {intlData} = this.props;
    item.quantity = 1;
    Actions.SVCDetail({
      svc: item,
      intlData,
      getCustomerActivity: this.props.getCustomerActivity,
    });
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.dispatch(getSVCCard());
    this.setState({refreshing: false});
  };

  render() {
    const {intlData} = this.props;
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
                <Text style={styles.btnBackText}>Buy SVC</Text>
              </TouchableOpacity>
            </View>
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
              {this.props.svc == undefined || this.props.svc.length === 0 ? (
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
                    Data is empty
                  </Text>
                </View>
              ) : (
                this.props.svc.map((item, keys) => (
                  <View key={keys}>
                    {
                      <TouchableOpacity
                        style={styles.voucherItem}
                        onPress={() => this.pageDetail(item)}>
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
                          <View style={styles.vourcherPoint}>
                            <Text
                              style={{
                                color: colorConfig.pageIndex.backgroundColor,
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'right',
                              }}>
                              ${item['retailPrice']}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.voucherDetail}>
                          <Text style={styles.nameVoucher}>{item['name']}</Text>
                          <View style={{flexDirection: 'row'}}>
                            <Icon
                              size={15}
                              name={
                                Platform.OS === 'ios' ? 'ios-list' : 'md-list'
                              }
                              style={{
                                color: colorConfig.store.secondaryColor,
                                marginRight: 3,
                              }}
                            />
                            <Text style={styles.descVoucher}>
                              {item['description'] !== null &&
                              item['description'] !== undefined
                                ? item['description'].substr(0, 100)
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
    fontSize: 18,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    maxWidth: '95%',
    marginLeft: 5,
    color: colorConfig.store.titleSelected,
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
  svc: state.SVCReducer.SVCCard.svc,
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
)(BuySVC);
