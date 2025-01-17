import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {dataStores, getCompanyInfo} from '../actions/stores.action';

import * as geolib from 'geolib';
import * as _ from 'lodash';
import Geolocation from '@react-native-community/geolocation';

import Loader from '../components/loader';
import colorConfig from '../config/colorConfig';
import StorePromotion from '../components/storePromotion';
import StoreNearYou from '../components/storeNearYou';
import StoreStores from '../components/storeStores';
import appConfig from '../config/appConfig';
import {dataPromotion} from '../actions/promotion.action';
import {getBasket} from '../actions/order.action';
import {myVoucers} from '../actions/account.action';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {isEmptyArray} from '../helper/CheckEmpty';
import {getUserProfile} from '../actions/user.action';
import {referral} from '../actions/referral.action';
import {getAccountPayment} from '../actions/payment.actions';
import {Body} from '../components/layout';
import {navigate} from '../utils/navigation.utils';

class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStores: [],
      dataAllStore: [],
      dataStoresNear: [],
      dataStoreRegion: [],
      dataPromotion: [],
      isLoading: true,
      refreshing: false,
      currentDay: new Date(),
      currentClock: '',
      screenWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(myVoucers());

    this.getDataStores();

    this.getUserLocation();

    // var hours = new Date().getHours();
    // var min = new Date().getMinutes();
    // this.setState({
    //   currentClock: hours + ':' + this.getMenit(min),
    // });

    this.checkOpen();

    try {
      this.checkFocused = this.props.navigation.addListener('willFocus', () => {
        clearInterval(this.interval);
        this.checkOpen();
      });
    } catch (e) {}

    try {
      this.checkBlur = this.props.navigation.addListener('willBlur', () => {
        clearInterval(this.interval);
      });
    } catch (e) {}
  };

  getUserLocation = async () => {
    if (Platform.OS !== 'android') Geolocation.requestAuthorization();
    else {
      try {
        let granted = await this.askToAccessLocation();
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
          this.getUserLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  askToAccessLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'we need GPS location service',
        message: 'we need location service to provide your location',
        // buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted;
  };

  checkOpen = async () => {
    try {
      clearInterval(this.interval);
    } catch (e) {}
    try {
      this.interval = setInterval(async () => {
        await this.refreshOpeningHours();
      }, 10000);
    } catch (e) {}
  };

  refreshOpeningHours = async () => {
    const {dataStores} = this.props;
    const {dataAllStore, dataStoresNear, dataStoreRegion} = this.state;

    try {
      for (let i = 0; i < dataStoreRegion.length; i++) {
        for (let j = 0; j < dataAllStore[dataStoreRegion[i]].length; j++) {
          dataAllStore[dataStoreRegion[i]][j].storeStatus = this._cekOpen(
            dataAllStore[dataStoreRegion[i]][j],
          );
        }
      }
      await this.setState({dataAllStore});
    } catch (e) {}

    try {
      for (let i = 0; i < 3; i++) {
        dataStoresNear[i].storeStatus = this._cekOpen(dataStoresNear[i]);
      }
      await this.setState({dataStoresNear});
    } catch (e) {}
  };

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
    clearInterval(this.interval);
  };

  getMenit(menit) {
    var len = menit.toString().length;
    if (len == 1) {
      return '0' + menit;
    } else {
      return menit;
    }
  }

  getDataStores = async () => {
    try {
      // await this.props.dispatch(dataStores());
      // await this.props.dispatch(getBasket());
      // await this.props.dispatch(dataPromotion());
      await Promise.all([
        this.props.dispatch(dataStores()),
        this.props.dispatch(getBasket()),
        this.props.dispatch(dataPromotion()),
      ]);
      // check if user enabled their position permission
      let statusLocaiton;
      if (
        this.props.userPosition == undefined ||
        this.props.userPosition == false
      ) {
        statusLocaiton = false;
      } else {
        statusLocaiton = true;
      }
      await this.setDataStore(
        this.props.dataStores,
        statusLocaiton,
        this.props.userPosition,
      );
    } catch (e) {
      console.log(e, 'xxxxxxx');
      Alert.alert('Oppss...', 'Something went wrong, please try again.');
    }
  };

  setDataStore = async (outletList, statusLocation, position) => {
    let response = {};
    response.data = outletList;
    var dataStoresTampung = [];
    var storeGrupTampung = [];
    var coordinate = {};
    var location = {};
    try {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].deleted == false) {
          location = {};
          coordinate = {};
          location = {
            region: response.data[i].region,
            address: response.data[i].address,
            coordinate: {
              lat: response.data[i].latitude,
              lng: response.data[i].longitude,
            },
          };

          response.data[i].location = location;

          storeGrupTampung.push(response.data[i].location.region);
          dataStoresTampung.push({
            storeId: response.data[i].id,
            orderValidation:
              response.data[i].orderValidation != undefined &&
              response.data[i].orderValidation != null
                ? response.data[i].orderValidation
                : undefined,
            storeName: response.data[i].name,
            storeStatus: this._cekOpen(response.data[i]),
            storeJarak: statusLocation
              ? this.getDistance(
                  geolib.getDistance(position.coords, {
                    latitude: Number(response.data[i].latitude),
                    longitude: Number(response.data[i].longitude),
                  }) / 1000,
                )
              : '-',
            image:
              response.data[i].defaultImageURL != undefined
                ? response.data[i].defaultImageURL
                : '',
            region: response.data[i].region,
            address: response.data[i].location.address,
            city: response.data[i].city,
            operationalHours: response.data[i].operationalHours,
            openAllDays: response.data[i].openAllDays,
            defaultImageURL: response.data[i].defaultImageURL,
            coordinate: response.data[i].location.coordinate,
            orderingStatus: response.data[i].orderingStatus,
            outletType: response.data[i].outletType,
            offlineMessage: response.data[i].offlineMessage,
            maxOrderQtyPerItem: response.data[i].maxOrderQtyPerItem,
            maxOrderAmount: response.data[i].maxOrderAmount,
            lastOrderOn: response.data[i].lastOrderOn,
            enableRedeemPoint: response.data[i].enableRedeemPoint,
            storePickUpName: response.data[i].storePickUpName,
            storeCheckOutName: response.data[i].storeCheckOutName,
            dineInName: response.data[i].dineInName,
            takeAwayName: response.data[i].takeAwayName,
            deliveryName: response.data[i].deliveryName,
            enableItemSpecialInstructions:
              response.data[i].enableItemSpecialInstructions,
            enableStoreCheckOut:
              response.data[i].enableStoreCheckOut == true ? true : false,
            enableStorePickUp:
              response.data[i].enableStorePickUp == true ? true : false,
            enableTableScan:
              response.data[i].enableTableScan == true ? true : false,
            enableDelivery:
              response.data[i].enableDelivery == true ? true : false,
            enableTakeAway:
              response.data[i].enableTakeAway == true ? true : false,
            enableDineIn: response.data[i].enableDineIn == true ? true : false,
          });
        }
      }
    } catch (error) {
      response.data = [];
      console.log(error);
    }

    var dataStoresNearTampung = [];
    // console.log('dataStoresTampung ', dataStoresTampung);
    if (statusLocation) {
      for (let i = 0; i < 3; i++) {
        dataStoresNearTampung = [...dataStoresTampung];
        dataStoresNearTampung.sort(this._getSorting).slice(0, 3);
      }
    }

    // console.log('dataAllStore ', dataStoresTampung);
    try {
      await this.setState({
        isLoading: false,
        dataStores: dataStoresTampung,
        dataStoresNear: dataStoresNearTampung,
        dataAllStore: _.groupBy(dataStoresTampung, 'region'),
        dataStoreRegion: _.uniq(storeGrupTampung),
      });
    } catch (e) {
      await this.setState({
        isLoading: false,
        dataStores: [],
        dataStoresNear: [],
        dataAllStore: [],
        dataStoreRegion: [],
      });
    }
    await this.setState({isLoading: false});
  };

  _getSorting(a, b) {
    const jarakA = a.storeJarak;
    const jarakB = b.storeJarak;

    let comparison = 0;
    if (jarakA > jarakB) {
      comparison = 1;
    } else if (jarakA < jarakB) {
      comparison = -1;
    }
    return comparison;
  }

  getDistance = distance => {
    try {
      if (isNaN(distance)) return 0;
      else return distance;
    } catch (e) {
      return 0;
    }
  };

  getOperationalHours = data => {
    try {
      let operationalHours = data.operationalHours;

      let date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1;
      var yyyy = date.getFullYear();
      let currentDate = mm + '/' + dd + '/' + yyyy;
      let day = date.getDay();
      let time = date.getHours() + ':' + date.getMinutes();

      let open;
      operationalHours
        .filter(item => item.day == day && item.active == true)
        .map(day => {
          if (
            Date.parse(`${currentDate} ${time}`) >=
              Date.parse(`${currentDate} ${day.open}`) &&
            Date.parse(`${currentDate} ${time}`) <
              Date.parse(`${currentDate} ${day.close}`)
          )
            open = true;
        });

      if (open) return true;
      else {
        if (operationalHours.leading == 0) return true;
        else return false;
      }
    } catch (e) {
      return false;
    }
  };

  _cekOpen = data => {
    if (!isEmptyArray(data.operationalHours)) {
      if (this.getOperationalHours(data)) {
        return true;
      } else {
        if (data.openAllDays == true) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      if (data.openAllDays == true) {
        return true;
      } else {
        return false;
      }
    }
  };

  _onRefresh = async () => {
    await this.setState({refreshing: true});
    await this.getDataStores();
    await this.setState({refreshing: false});
  };

  getHallo = () => {
    const {intlData} = this.props;

    var date = new Date();
    // console.log(date.getHours());
    if (date.getHours() < 12) {
      return `${intlData.messages.good} ${intlData.messages.morning}`;
    } else if (date.getHours() < 18) {
      return `${intlData.messages.good} ${intlData.messages.afternoon}`;
    } else {
      // return `${intlData.messages.good} ${intlData.messages.night}`;
      return `Good Evening`;
    }
  };

  getSumOfQuantityBasket = () => {
    try {
      let sum = _.sumBy(this.props.dataBasket.details, function(qty) {
        return qty.quantity;
      });
      return sum;
    } catch (e) {
      return null;
    }
  };

  openBasket = () => {
    const {dataBasket} = this.props;

    if (dataBasket != undefined) {
      if (
        dataBasket.status == 'PROCESSING' ||
        dataBasket.status == 'READY_FOR_COLLECTION'
      ) {
        navigate('waitingFood');
      } else {
        navigate('basket');
      }
    } else {
      navigate('basket');
    }
  };

  render() {
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = {};
      userDetail.name = 'User User';
    }

    const {intlData} = this.props;
    return (
      <SafeAreaView style={{flex: 1, marginBottom: 50}}>
        {Actions.currentScene !== 'pageIndex' && (
          <View
            style={{
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              paddingVertical: 3,
              shadowColor: '#00000021',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.7,
              shadowRadius: 7.49,
              elevation: 12,
            }}>
            <TouchableOpacity
              style={styles.btnBack}
              onPress={() => Actions.pop()}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={styles.btnBackIcon}
              />
              <Text style={styles.btnBackText}> Outlet List </Text>
            </TouchableOpacity>
          </View>
        )}
        <Body>
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            {this.state.isLoading === true ? (
              <View style={styles.loading}>
                {this.state.isLoading && <Loader />}
              </View>
            ) : (
              <View style={styles.container}>
                {this.state.dataStoresNear.length != 0 ? (
                  <View>
                    <StoreNearYou
                      refreshProducts={this.props.refreshProducts}
                      intlData={intlData}
                      dataStoresNear={this.state.dataStoresNear}
                    />
                  </View>
                ) : null}
                {Object.keys(this.state.dataAllStore).length === 0 &&
                this.state.dataAllStore != undefined ? (
                  <View
                    style={{
                      margin: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      // height: '70%',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colorConfig.pageIndex.grayColor,
                        fontFamily: 'Poppins-Regular',
                        fontSize: 24,
                        fontWeight: 'bold',
                        marginTop: 100,
                      }}>
                      {intlData.messages.noOutlet}
                    </Text>
                  </View>
                ) : (
                  <View style={{flex: 1}}>
                    <StoreStores
                      intlData={intlData}
                      refreshProducts={this.props.refreshProducts}
                      dataStoreRegion={this.state.dataStoreRegion}
                      dataAllStore={this.state.dataAllStore}
                    />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </Body>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 50,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  scrollView: {
    // backgroundColor: colorConfig.pageIndex.backgroundColor,
    height: '100%',
  },
  loading: {
    height: Dimensions.get('window').height,
  },
  imageLogo: {
    width: 40,
    height: 32,
    paddingTop: 5,
    marginBottom: 5,
  },
  point: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // width: Dimensions.get('window').width / 2 - 30,
  },
});

const mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
  dataStores: state.storesReducer.dataStores.stores,
  userDetail: state.userReducer.getUser.userDetails,
  dataPromotion: state.promotionReducer.dataPromotion.promotion,
  userPosition: state.userReducer.userPosition.userPosition,
  intlData: state.intlData,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Store);
