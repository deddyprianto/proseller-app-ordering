import React from 'react';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const FavoriteOutletDetailMap = ({lat, long, title, description, style}) => {
  const latitude = 1.29027;
  const longitude = 103.851959;
  const latitudeDelta = 0.001;
  const longitudeDelta = 0.001;

  return (
    <MapView
      style={style}
      region={{
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      }}>
      <Marker
        coordinate={{latitude: latitude, longitude: longitude}}
        title={'MARTIN'}
        description={'MARTIN'}
      />
    </MapView>
  );
};

export default FavoriteOutletDetailMap;
