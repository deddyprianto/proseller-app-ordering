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
import {dataStores} from '../actions/stores.action';

import * as geolib from 'geolib';
import * as _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';

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
import {refreshToken} from '../actions/auth.actions';

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
    await this.props.dispatch(refreshToken());
    await this.props.dispatch(dataPromotion());
    await this.props.dispatch(myVoucers());

    this.getDataStores();

    this.getUserLocation();

    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    this.setState({
      currentClock: hours + ':' + this.getMenit(min),
    });
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
      await this.props.dispatch(refreshToken());
      await this.props.dispatch(dataStores());
      await this.props.dispatch(getBasket());
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
      Alert.alert('Oppss...', 'Something went wrong, please try again.');
    }
  };

  setDataStore = async (response, statusLocation, position) => {
    response.data = response;
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
            address: response.data[i].location,
            coordinate: {
              lat: response.data[i].latitude,
              lng: response.data[i].longitude,
            },
          };

          response.data[i].location = location;

          storeGrupTampung.push(response.data[i].location.region);
          dataStoresTampung.push({
            storeId: response.data[i].id,
            storeName: response.data[i].name,
            storeStatus: this._cekOpen(response.data[i]),
            storeJarak: statusLocation
              ? geolib.getDistance(position.coords, {
                  latitude: Number(response.data[i].latitude),
                  longitude: Number(response.data[i].longitude),
                }) / 1000
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
            enableDineIn:
              response.data[i].enableDineIn == false ||
              response.data[i].enableDineIn == '-'
                ? false
                : true,
            enableTakeAway:
              response.data[i].enableTakeAway == false ||
              response.data[i].enableTakeAway == '-'
                ? false
                : true,
            enableTableScan:
              response.data[i].enableTableScan == false ||
              response.data[i].enableTableScan == '-'
                ? false
                : true,
            enableDelivery:
              response.data[i].enableDelivery == false ||
              response.data[i].enableDelivery == '-'
                ? false
                : true,
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
            Date.parse(`${currentDate} ${time}`) >
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
      return `${intlData.messages.good} ${intlData.messages.night}`;
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
        Actions.waitingFood();
      } else {
        Actions.basket();
      }
    } else {
      Actions.basket();
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
      <SafeAreaView style={{marginBottom: 40}}>
        <View
          style={{
            backgroundColor: colorConfig.pageIndex.backgroundColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                paddingLeft: 10,
                paddingBottom: 5,
                paddingTop: 5,
              }}>
              <Image
                resizeMode="stretch"
                style={styles.imageLogo}
                source={appConfig.appLogo}
              />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: colorConfig.store.title,
                    fontFamily: 'Lato-Medium',
                  }}>
                  {this.getHallo() + ', '}
                </Text>
                <Text
                  style={{
                    color: colorConfig.pageIndex.activeTintColor,
                    fontFamily: 'Lato-Bold',
                  }}>
                  {this.props.userDetail != undefined
                    ? userDetail.name.split(' ')[0]
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: colorConfig.store.defaultColor,
              borderBottomWidth: 2,
            }}
          />
        </View>
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
              {this.props.dataPromotion == undefined ||
              this.props.dataPromotion.count == 0 ? null : (
                <StorePromotion />
              )}

              {this.state.dataStoresNear.length != 0 ? (
                <View>
                  <StoreNearYou
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
                      fontFamily: 'Lato-Medium',
                      fontSize: 24,
                      fontWeight: 'bold',
                      marginTop: 100,
                    }}>
                    {intlData.messages.noOutlet}
                  </Text>
                </View>
              ) : (
                <View>
                  <StoreStores
                    intlData={intlData}
                    dataStoreRegion={this.state.dataStoreRegion}
                    dataAllStore={this.state.dataAllStore}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {this.props.dataBasket == undefined ||
        this.props.dataBasket.status == 'PENDING' ? (
          <TouchableOpacity
            onPress={this.openBasket}
            style={{
              position: 'absolute',
              bottom: '6%',
              right: '5%',
              height: 60,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              backgroundColor: 'white',
              shadowColor: '#00000021',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.7,
              shadowRadius: 7.49,
              elevation: 12,
            }}>
            <View>
              <Icon
                size={40}
                name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
                style={{color: colorConfig.store.defaultColor}}
              />
            </View>
            {/* check data length basket, if not undefined, then show length */}
            {this.props.dataBasket != undefined &&
            this.props.dataBasket.details != undefined ? (
              <View
                style={{
                  position: 'absolute',
                  top: -7,
                  right: 1,
                  width: 25,
                  height: 25,
                  backgroundColor: colorConfig.store.colorError,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'white', padding: 3, fontSize: 11}}>
                  {this.getSumOfQuantityBasket()}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
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

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataBasket.product,
  dataStores: state.storesReducer.dataStores.stores,
  userDetail: state.userReducer.getUser.userDetails,
  dataPromotion: state.promotionReducer.dataPromotion.promotion,
  userPosition: state.userReducer.userPosition.userPosition,
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
)(Store);
