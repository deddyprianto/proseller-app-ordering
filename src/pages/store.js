import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl 
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";
import {getToken} from "../actions/auth.actions";

import * as geolib from 'geolib';
import * as _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';

import awsConfig from "../config/awsConfig";
import Loader from "../components/loader";
import colorConfig from "../config/colorConfig";
import StorePromotion from "../components/storePromotion";
import StoreNearYou from "../components/storeNearYou";
import StoreStores from "../components/storeStores";

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

  componentDidMount = async() =>{
    const token =  await this.props.dispatch(getToken());

    if (this.state.dataStores.length === 0){
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false });
    }

    this.getDataStores(token);

    var hours = new Date().getHours(); 
    var min = new Date().getMinutes(); 
    this.setState({
      currentClock: hours + ':' + this.getMenit(min)
    });
  }

  componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
    clearInterval(this.state.interval);
  }

  getMenit(menit){
    var len = menit.toString().length;
    if(len == 1) { return '0'+menit }
    else { return menit }
  }

  getDataStores = (token) => {
    fetch(awsConfig.getStores, {
      method: 'get',
      headers: {
        'Authorization': token
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataStores: responseJson.data
      });
      
      Geolocation.getCurrentPosition(
        (position) => {
          var dataStoresTampung = [];
          var storeGrupTampung = [];
          for(var i=0; i<responseJson.count; i++){
            storeGrupTampung.push(this.state.dataStores[i].location.region);
            dataStoresTampung.push({
              'storeName': this.state.dataStores[i].storeName,
              'storeStatus': this._cekOpen(
                this.state.currentDay.getDay(), 
                this.state.currentClock, 
                this.state.dataStores[i].operationalHours[1].monday,
                this.state.dataStores[i].operationalHours[2].tuesday,
                this.state.dataStores[i].operationalHours[3].wednesday,
                this.state.dataStores[i].operationalHours[4].thursday,
                this.state.dataStores[i].operationalHours[5].friday,
                this.state.dataStores[i].operationalHours[6].saturday,
                this.state.dataStores[i].operationalHours[0].sunday,
                true
              ),
              'storeJarak': 
                (geolib.getDistance(position.coords, {
                  latitude: this.state.dataStores[i].location.coordinate.lat,
                  longitude: this.state.dataStores[i].location.coordinate.lng,
                }) / 1000),
              'image': this.state.dataStores[i].image,
              'region' : this.state.dataStores[i].location.region
            });
          }

          var tampung = [];
          tampung = [...dataStoresTampung];
          tampung.sort(this._getSorting)

          var dataStoresNearTampung = [];
          if(tampung.length > 0){
            for (let i = 0; i < 3; i++) {
              dataStoresNearTampung.push(tampung[i]);
            }

            var dataAllStore = [];
            dataAllStore.push(_.groupBy(dataStoresTampung, 'region'));
            this.setState({
              isLoading: false,
              dataStores: dataStoresTampung,
              dataStoresNear: dataStoresNearTampung,
              dataAllStore: _.groupBy(dataStoresTampung, 'region'),
              dataStoreRegion: _.uniq(storeGrupTampung)
            });
          }
          this.setState({ isLoading: false });
        },
        (error) => {
          alert(error.message)
          var dataStoresTampung = [];
          var storeGrupTampung = [];
          for(var i=0; i<responseJson.count; i++){
            storeGrupTampung.push(this.state.dataStores[i].location.region);
            dataStoresTampung.push({
              'storeName': this.state.dataStores[i].storeName,
              'storeStatus': this._cekOpen(
                this.state.currentDay.getDay(), 
                this.state.currentClock, 
                this.state.dataStores[i].operationalHours[1].monday,
                this.state.dataStores[i].operationalHours[2].tuesday,
                this.state.dataStores[i].operationalHours[3].wednesday,
                this.state.dataStores[i].operationalHours[4].thursday,
                this.state.dataStores[i].operationalHours[5].friday,
                this.state.dataStores[i].operationalHours[6].saturday,
                this.state.dataStores[i].operationalHours[0].sunday,
                true
              ),
              'storeJarak': '-',
              'image': this.state.dataStores[i].image,
              'region' : this.state.dataStores[i].location.region
            });
          }

          var tampung = [];
          tampung = [...dataStoresTampung];
          tampung.sort(this._getSorting)

          var dataStoresNearTampung = [];
          if(tampung.length > 0){

            var dataAllStore = [];
            dataAllStore.push(_.groupBy(dataStoresTampung, 'region'));
            this.setState({
              isLoading: false,
              dataStores: dataStoresTampung,
              dataStoresNear: dataStoresNearTampung,
              dataAllStore: _.groupBy(dataStoresTampung, 'region'),
              dataStoreRegion: _.uniq(storeGrupTampung)
            });
          }
          this.setState({ isLoading: false });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    })
    .catch((error) =>{
      console.error(error);
    });
  }
  
  _getSorting(a, b){
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

  _cekOpen = (hariIni, jamSekarang, monday, tuesday, wednesday, thursday, friday, saturday, sunday, statusStore) => {
    var jamSekarang = jamSekarang.split(":"); 

    if(hariIni == 1) {
      var statusOpen = this._getStatusStore(jamSekarang, monday.open.split(":"), monday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, monday.open.split(":"), monday.close.split(":"));
    } else if(hariIni == 2) {
      var statusOpen = this._getStatusStore(jamSekarang, tuesday.open.split(":"), tuesday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, tuesday.open.split(":"), tuesday.close.split(":"));
    } else if(hariIni == 3) {
      var statusOpen = this._getStatusStore(jamSekarang, wednesday.open.split(":"), wednesday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, wednesday.open.split(":"), wednesday.close.split(":"));
    } else if(hariIni == 4) {
      var statusOpen = this._getStatusStore(jamSekarang, thursday.open.split(":"), thursday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, thursday.open.split(":"), thursday.close.split(":"));
    } else if(hariIni == 5) {
      var statusOpen = this._getStatusStore(jamSekarang, friday.open.split(":"), friday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, friday.open.split(":"), friday.close.split(":"));
    } else if(hariIni == 6) {
      var statusOpen = this._getStatusStore(jamSekarang, saturday.open.split(":"), saturday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, saturday.open.split(":"), saturday.close.split(":"));
    } else if(hariIni == 7) {
      var statusOpen = this._getStatusStore(jamSekarang, sunday.open.split(":"), sunday.close.split(":"));
      return this._getStatusOpen(statusStore, statusOpen, sunday.open.split(":"), sunday.close.split(":"));
    }

  }

  _getStatusStore = (jamSekarang, openHour, closeHour) => {
    var jamOpen = jamSekarang[0]-openHour[0];
    var menitOpen = jamSekarang[1]-openHour[1];
    var jamClose = jamSekarang[0]-closeHour[0];
    var menitClose = jamSekarang[1]-closeHour[1];

    // console.log(jamOpen+' '+openHour[0]+' | '+menitOpen+' '+openHour[1]+' | '+jamClose+' '+closeHour[0]+' | '+menitClose+' '+closeHour[1])

    if((jamOpen >= 0 && menitOpen >= 0) && (jamClose <= 0)) {
      if(jamClose == 0 && menitClose <= 0){
        return true;
      } else if(jamClose < 0 && menitClose >= 0){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  _getStatusOpen = (statusStore, statusOpen, openHour, closeHour) => {
    if(statusStore) {
      if(statusOpen){
        return 'Open • Closing at '+closeHour[0]+':'+closeHour[1];
      } else {
        return 'Closed • Opening at '+openHour[0]+':'+openHour[1];
      }
    } else {
      return 'Closed • Closed today';
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataStores();
    this.setState({refreshing: false});
  }

  render() {
    return (
      <ScrollView style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
      }>
        {
          (this.state.isLoading === true) ? 
          <View style={styles.loading}> 
            {(this.state.isLoading) && <Loader />}
          </View> :
          <View style={styles.container}>
            <StorePromotion/>
            <View style={{borderBottomColor: colorConfig.store.defaultColor, borderBottomWidth:2, paddingTop:10}}/>
            {
              (this.state.dataStoresNear.length != 0) ?
              <View>
                <StoreNearYou dataStoresNear={this.state.dataStoresNear}/>
                <View style={{borderBottomColor: colorConfig.store.defaultColor, borderBottomWidth:2, paddingTop:10}}/>
              </View> : null
            }
            {
              (this.state.dataAllStore.length != 0) ?
              <View>
                <StoreStores dataStoreRegion={this.state.dataStoreRegion} dataAllStore={this.state.dataAllStore}/>
              </View> : null
            }
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    padding:10,
  },
  scrollView: {
    backgroundColor: colorConfig.store.scrollView,
  },
  loading: {
    height: Dimensions.get('window').height
  },
});

mapStateToProps = (state) => ({
  getToken: state.authReducer.getToken
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Store);
