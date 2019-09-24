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

import awsConfig from '../config/awsConfig';
import Loader from '../components/loader';
import colorConfig from '../config/colorConfig';
import StorePromotion from '../components/storePromotion';
import StoreNearYou from '../components/storeNearYou';
import StoreStores from '../components/storeStores';
import appConfig from '../config/appConfig';

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
    if (this.state.dataStores.length === 0) {
      this.setState({isLoading: true});
    } else {
      this.setState({isLoading: false});
    }
    this.getDataStores();
    // this.interval = setInterval(() => this.getDataStores(), 1000);

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
      Geolocation.getCurrentPosition(
        async position => {
          await this.props.dispatch(dataStores());
          this.setDataStore(this.props.dataStores, true, position);
        },
        async error => {
          alert(error.message);
          await this.props.dispatch(dataStores());
          this.setDataStore(this.props.dataStores, false, null);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
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
    var dataStoresTampung = [];
    var storeGrupTampung = [];
    console.log(response);
    try {
      for (var i = 0; i < response.count; i++) {
        if (response.data[i].deleted == false) {
          storeGrupTampung.push(response.data[i].location.region);
          dataStoresTampung.push({
            storeName: response.data[i].storeName,
            storeStatus: this._cekOpen(
              this.state.currentDay.getDay(),
              this.state.currentClock,
              response.data[i].operationalHours[1].monday,
              response.data[i].operationalHours[2].tuesday,
              response.data[i].operationalHours[3].wednesday,
              response.data[i].operationalHours[4].thursday,
              response.data[i].operationalHours[5].friday,
              response.data[i].operationalHours[6].saturday,
              response.data[i].operationalHours[0].sunday,
              true,
            ),
            storeJarak: statusLocation
              ? geolib.getDistance(position.coords, {
                  latitude: Number(response.data[i].location.coordinate.lat),
                  longitude: Number(response.data[i].location.coordinate.lng),
                }) / 1000
              : '-',
            image:
              response.data[i].image != undefined ? response.data[i].image : '',
            region: response.data[i].location.region,
            address: response.data[i].location.address,
            district: response.data[i].location.district,
            operationalHours: response.data[i].operationalHours,
            coordinate: response.data[i].location.coordinate,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    var dataStoresNearTampung = [];
    if (statusLocation) {
      for (let i = 0; i < 3; i++) {
        dataStoresNearTampung = [...dataStoresTampung];
        dataStoresNearTampung.sort(this._getSorting).slice(0, 3);
      }
    }

    this.setState({
      isLoading: false,
      dataStores: dataStoresTampung,
      dataStoresNear: dataStoresNearTampung,
      dataAllStore: _.groupBy(dataStoresTampung, 'region'),
      dataStoreRegion: _.uniq(storeGrupTampung),
    });
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

  _cekOpen = (
    hariIni,
    jamSekarang,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    statusStore,
  ) => {
    var jamSekarang = jamSekarang.split(':');

    if (hariIni == 1) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        monday.open.split(':'),
        monday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        monday.open.split(':'),
        monday.close.split(':'),
      );
    } else if (hariIni == 2) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        tuesday.open.split(':'),
        tuesday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        tuesday.open.split(':'),
        tuesday.close.split(':'),
      );
    } else if (hariIni == 3) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        wednesday.open.split(':'),
        wednesday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        wednesday.open.split(':'),
        wednesday.close.split(':'),
      );
    } else if (hariIni == 4) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        thursday.open.split(':'),
        thursday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        thursday.open.split(':'),
        thursday.close.split(':'),
      );
    } else if (hariIni == 5) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        friday.open.split(':'),
        friday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        friday.open.split(':'),
        friday.close.split(':'),
      );
    } else if (hariIni == 6) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        saturday.open.split(':'),
        saturday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        saturday.open.split(':'),
        saturday.close.split(':'),
      );
    } else if (hariIni == 0) {
      var statusOpen = this._getStatusStore(
        jamSekarang,
        sunday.open.split(':'),
        sunday.close.split(':'),
      );
      return this._getStatusOpen(
        statusStore,
        statusOpen,
        sunday.open.split(':'),
        sunday.close.split(':'),
      );
    }
  };

  _getStatusStore = (jamSekarang, openHour, closeHour) => {
    var jamOpen = jamSekarang[0] - openHour[0];
    var menitOpen = jamSekarang[1] - openHour[1];
    var jamClose = jamSekarang[0] - closeHour[0];
    var menitClose = jamSekarang[1] - closeHour[1];

    // console.log(jamOpen+' '+openHour[0]+' | '+menitOpen+' '+openHour[1]+' | '+jamClose+' '+closeHour[0]+' | '+menitClose+' '+closeHour[1])

    if (jamOpen >= 0 && menitOpen >= 0 && jamClose <= 0) {
      if (jamClose == 0 && menitClose <= 0) {
        return true;
      } else if (jamClose < 0 && menitClose >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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

  render() {
    return (
      <View style={{marginBottom: 40}}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
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
              <StorePromotion />
              <View
                style={{
                  borderBottomColor: colorConfig.store.defaultColor,
                  borderBottomWidth: 2,
                  paddingTop: 10,
                }}
              />
              {this.state.dataStoresNear.length != 0 ? (
                <View>
                  <StoreNearYou dataStoresNear={this.state.dataStoresNear} />
                  <View
                    style={{
                      borderBottomColor: colorConfig.store.defaultColor,
                      borderBottomWidth: 2,
                      paddingTop: 10,
                    }}
                  />
                </View>
              ) : (
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
                    Store is empty
                  </Text>
                </View>
              )}
              {this.state.dataAllStore.length != 0 ? (
                <View>
                  <StoreStores
                    dataStoreRegion={this.state.dataStoreRegion}
                    dataAllStore={this.state.dataAllStore}
                  />
                </View>
              ) : null}
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
    // backgroundColor: colorConfig.pageIndex.backgroundColor,
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
});

mapStateToProps = state => ({
  dataStores: state.storesReducer.dataStores.stores,
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
