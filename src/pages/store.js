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
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {notifikasi} from '../actions/auth.actions';
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
import {Actions} from 'react-native-router-flux';
import {myVoucers} from '../actions/account.action';
import {
  campaign,
  dataPoint,
  vouchers,
  getStamps,
} from '../actions/rewards.action';
import {dataInbox} from '../actions/inbox.action';
import {dataPromotion} from '../actions/promotion.action';
import Icon from 'react-native-vector-icons/Ionicons';

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
    await this.props.dispatch(campaign());
    await this.props.dispatch(dataPromotion());
    // await this.props.dispatch(dataPoint());
    // await this.props.dispatch(vouchers());
    // await this.props.dispatch(myVoucers());
    // await this.props.dispatch(dataInbox());
    // await this.props.dispatch(getStamps());

    if (this.state.dataStores.length === 0) {
      this.setState({isLoading: true});
    } else {
      this.setState({isLoading: false});
    }
    this.getDataStores();

    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    this.setState({
      currentClock: hours + ':' + this.getMenit(min),
    });
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
      await Geolocation.getCurrentPosition(
        async position => {
          await this.props.dispatch(dataStores());
          this.setDataStore(this.props.dataStores, true, position);
        },
        async error => {
          await this.props.dispatch(dataStores());
          this.setDataStore(this.props.dataStores, false, null);
        },
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 1000},
      );
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          'Get Data Stores Error!',
          error.responseBody.message,
          console.log('Cancel Pressed'),
        ),
      );
    }
  };

  setDataStore = (response, statusLocation, position) => {
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
            storeName: response.data[i].name,
            storeStatus: this._cekOpen(response.data[i].operationalHours),
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
            defaultImageURL: response.data[i].defaultImageURL,
            coordinate: response.data[i].location.coordinate,
          });
        }
      }
    } catch (error) {
      response.data = [];
      console.log(error);
    }

    var dataStoresNearTampung = [];
    console.log('dataStoresTampung ', dataStoresTampung);
    if (statusLocation) {
      for (let i = 0; i < 3; i++) {
        dataStoresNearTampung = [...dataStoresTampung];
        dataStoresNearTampung.sort(this._getSorting).slice(0, 3);
      }
    }

    console.log('dataAllStore ', dataStoresTampung);
    try {
      this.setState({
        isLoading: false,
        dataStores: dataStoresTampung,
        dataStoresNear: dataStoresNearTampung,
        dataAllStore: _.groupBy(dataStoresTampung, 'region'),
        dataStoreRegion: _.uniq(storeGrupTampung),
      });
    } catch (e) {
      this.setState({
        isLoading: false,
        dataStores: [],
        dataStoresNear: [],
        dataAllStore: [],
        dataStoreRegion: [],
      });
    }
    this.setState({isLoading: false});
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

  _cekOpen = operationalHours => {
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
  };

  _getStatusOpen = (statusStore, statusOpen, openHour, closeHour) => {
    if (statusStore) {
      if (statusOpen) {
        return 'Open • Closing at ' + closeHour[0] + ':' + closeHour[1];
      } else {
        return 'Closed • Opening at ' + openHour[0] + ':' + openHour[1];
      }
    } else {
      return 'Closed • Closed today';
    }
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataStores();
    this.setState({refreshing: false});
  };

  myVouchers = () => {
    var myVoucers = [];
    if (this.props.myVoucers != undefined) {
      _.forEach(
        _.groupBy(
          this.props.myVoucers.filter(voucher => voucher.deleted == false),
          'id',
        ),
        function(value, key) {
          value[0].totalRedeem = value.length;
          myVoucers.push(value[0]);
        },
      );
    }

    console.log(myVoucers);
    Actions.accountVouchers({data: myVoucers});
  };

  getHallo = () => {
    var date = new Date();
    // console.log(date.getHours());
    if (date.getHours() < 12) {
      return 'Good morning';
    } else if (date.getHours() < 18) {
      return 'Good afternoon';
    } else {
      return 'Good night';
    }
  };

  render() {
    console.log('this.props.dataPromotion ', this.props.dataPromotion);
    return (
      <View style={{marginBottom: 40}}>
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
                    ? this.props.userDetail.name.split(' ')[0]
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  backgroundColor: colorConfig.store.defaultColor,
                  borderColor: colorConfig.pageIndex.activeTintColor,
                  borderWidth: 1,
                  height: 50,
                  marginTop: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                {this.props.totalPoint == undefined ||
                this.props.totalPoint == 0 ? null : (
                  <View style={styles.point}>
                    {/*<Image*/}
                    {/*  style={{height: 18, width: 25, marginRight: 5}}*/}
                    {/*  source={require('../assets/img/ticket.png')}*/}
                    {/*/>*/}
                    <Icon
                      size={23}
                      name={Platform.OS === 'ios' ? 'ios-pricetags' : 'md-pricetags'}
                      style={{color: 'white', marginRight: 8}}
                    />
                    <Text
                      style={{
                        color: colorConfig.splash.container,
                        fontSize: 14,
                        fontWeight: 'bold',
                        fontFamily: 'Lato-Medium',
                      }}>
                      {'Point : '}
                    </Text>
                    <Text
                      style={{
                        color: colorConfig.splash.container,
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'Lato-Bold',
                      }}>
                      {this.props.totalPoint == undefined
                        ? 0
                        : this.props.totalPoint}
                    </Text>
                  </View>
                )}
                {this.props.totalPoint == undefined ||
                this.props.totalPoint == 0 ? null : (
                  <View
                    style={{
                      backgroundColor: colorConfig.splash.container,
                      width: 2,
                      height: 35,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={styles.point}
                  onPress={this.myVouchers}>
                  <Icon
                    size={23}
                    name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                    style={{color: 'white', marginRight: 8}}
                  />
                  <Text
                    style={{
                      color: colorConfig.splash.container,
                      fontSize: 14,
                      fontWeight: 'bold',
                      fontFamily: 'Lato-Bold',
                    }}>
                    My Vouchers
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View
                style={{
                  borderBottomColor: colorConfig.store.defaultColor,
                  borderBottomWidth: 2,
                  paddingTop: 10,
                }}
              /> */}
              {this.state.dataStoresNear.length != 0 ? (
                <View>
                  <StoreNearYou dataStoresNear={this.state.dataStoresNear} />
                  {/* <View
                    style={{
                      borderBottomColor: colorConfig.store.defaultColor,
                      borderBottomWidth: 2,
                      paddingTop: 10,
                    }}
                  /> */}
                </View>
              ) : null}
              {Object.keys(this.state.dataAllStore).length === 0 &&
              this.state.dataAllStore.constructor === Object ? (
                <View
                  style={{
                    alignItems: 'center',
                    margin: 20,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colorConfig.pageIndex.grayColor,
                      fontFamily: 'Lato-Medium',
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginTop: 100,
                    }}>
                    Sorry, no store is available.
                  </Text>
                </View>
              ) : (
                <View>
                  <StoreStores
                    dataStoreRegion={this.state.dataStoreRegion}
                    dataAllStore={this.state.dataAllStore}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
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
    alignItems: 'center',
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // width: Dimensions.get('window').width / 2 - 30,
  },
});

mapStateToProps = state => ({
  dataStores: state.storesReducer.dataStores.stores,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  userDetail: state.userReducer.getUser.userDetails,
  dataPromotion: state.promotionReducer.dataPromotion.promotion,
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
