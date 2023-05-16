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
  BackHandler,
  Platform,
  SafeAreaView,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {isEmptyObject} from '../helper/CheckEmpty';
import MapView from 'react-native-maps';

class PickCoordinate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      latitude: 1.29027,
      longitude: 103.851959,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
      regionChangeProgress: false,
      isMapReady: false,
      userLocation: '',
      detailAddress: {},
      searchLocation: '',
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount = async () => {
    try {
      try {
        if (this.props.coordinated && !isEmptyObject(this.props.coordinated)) {
          this.setState({
            latitude: this.props.coordinated.latitude,
            longitude: this.props.coordinated.longitude,
          });
        }

        if (
          this.props.userPosition &&
          this.props.userPosition.coords &&
          !this.props.coordinated.latitude &&
          !this.props.coordinated.longitude
        ) {
          this.setState({
            latitude: this.props.userPosition.coords.latitude,
            longitude: this.props.userPosition.coords.longitude,
          });
        }
      } catch (e) {}

      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
    await this.setState({loading: false});
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    // this.goBack();
    return true;
  };

  fetchAddress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        this.state.latitude +
        ',' +
        this.state.longitude +
        '&key=' +
        'AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4',
    )
      .then(response => response.json())
      .then(responseJson => {
        const userLocation = responseJson.results[0].formatted_address;
        this.setState({
          userLocation: userLocation,
          detailAddress: responseJson.results[0],
          regionChangeProgress: false,
        });
      });
  };

  getGeolocation = async () => {
    const {searchLocation} = this.state;
    let url = `https://maps.google.com/maps/api/geocode/json?address=${searchLocation}&sensor=false&key=AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4`;
    let response = await fetch(url);
    response = await response.json();
    try {
      await this.setState({
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      });
    } catch (e) {}
  };

  submitCoordinate = () => {
    try {
      const coordinate = {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: this.state.latitudeDelta,
        longitudeDelta: this.state.longitudeDelta,
        userLocation: this.state.userLocation,
        detailAddress: this.state.detailAddress,
      };
      this.props.handleChoose(coordinate);
      Actions.pop();
      // if (this.props.from === 'address') {
      //   this.props.setCoordinate({
      //     latitude: this.state.latitude,
      //     longitude: this.state.longitude,
      //     latitudeDelta: this.state.latitudeDelta,
      //     longitudeDelta: this.state.longitudeDelta,
      //     userLocation: this.state.userLocation,
      //     detailAddress: this.state.detailAddress,
      //   });
      //   Actions.pop();
      // } else {
      //   Actions.push('addAddress', {
      //     coordinate: coordinate,
      //     from: this.props.from,
      //     getDeliveryFee: this.props.getDeliveryFee,
      //   });
      // }
    } catch (e) {}
  };

  render() {
    const {latitude, longitude, latitudeDelta, longitudeDelta} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.map}>
          <View style={styles.searchBar}>
            <TouchableOpacity
              // style={{position: 'absolute', zIndex: 22}}
              onPress={this.goBack}>
              <Icon
                size={30}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-back'
                    : 'md-arrow-round-back'
                }
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingLeft: 5,
                  paddingRight: 10,
                }}
              />
            </TouchableOpacity>
            <TextInput
              placeholder={'Location'}
              value={this.state.searchLocation}
              onChangeText={value => this.setState({searchLocation: value})}
              onSubmitEditing={this.getGeolocation}
              style={{
                paddingVertical: Platform.OS === 'ios' ? 9 : 5,
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                padding: 5,
                paddingHorizontal: 10,
                color: colorConfig.store.title,
                borderColor: colorConfig.pageIndex.inactiveTintColor,
                borderWidth: 1,
                width: '68%',
                borderRadius: 5,
              }}
            />
            <TouchableOpacity
              onPress={this.getGeolocation}
              style={{
                backgroundColor: colorConfig.store.defaultColor,
                padding: 10,
                borderRadius: 5,
                width: '18%',
              }}>
              <Text style={{color: 'white', textAlign: 'center'}}>Go</Text>
            </TouchableOpacity>
          </View>

          <MapView
            style={styles.map}
            region={{
              latitude,
              longitude,
              latitudeDelta,
              longitudeDelta,
            }}
            onRegionChangeComplete={region => {
              this.setState(
                {
                  latitude: region.latitude,
                  longitude: region.longitude,
                  latitudeDelta: region.latitudeDelta,
                  longitudeDelta: region.longitudeDelta,
                  regionChangeProgress: true,
                },
                () => this.fetchAddress(),
              );
            }}
          />
          <View style={styles.markerFixed}>
            <Image
              style={styles.marker}
              source={{
                uri:
                  'https://raw.githubusercontent.com/alizahid/location-picker-demo/master/assets/icons8-marker.png',
              }}
            />
          </View>
          <SafeAreaView style={styles.footer}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginBottom: 20,
                marginTop: 10,
                textAlign: 'center',
                color: colorConfig.store.defaultColor,
              }}>
              Move map to change location
            </Text>
            <Text style={{fontSize: 10, color: '#999', marginLeft: 10}}>
              LOCATION
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                paddingVertical: 15,
                borderBottomColor: 'silver',
                borderBottomWidth: 0.5,
                marginHorizontal: 10,
                fontFamily: 'Poppins-Italic',
              }}>
              {!this.state.regionChangeProgress
                ? this.state.userLocation
                : 'Identifying Location...'}
            </Text>
            <TouchableOpacity
              disabled={this.state.regionChangeProgress}
              onPress={this.submitCoordinate}
              style={{
                marginTop: 15,
                backgroundColor: this.state.regionChangeProgress
                  ? colorConfig.store.disableButton
                  : colorConfig.store.defaultColor,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 20,
                }}>
                Use This Location
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  userPosition: state.userReducer.userPosition.userPosition,
  userDetail: state.userReducer.getUser.userDetails,
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
)(PickCoordinate);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  footer: {
    backgroundColor: 'white',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopWidth: 0.4,
    borderTopColor: colorConfig.pageIndex.grayColor,
  },
  region: {
    color: '#fff',
    lineHeight: 20,
    margin: 20,
  },
  searchBar: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 2,
    backgroundColor: 'white',
    width: '95%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 6,
    top: 50,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});
