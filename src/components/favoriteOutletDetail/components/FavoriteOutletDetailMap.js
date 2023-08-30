import React from 'react';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

const FavoriteOutletDetailMap = ({lat, long, style}) => {
  const latitude = Number(lat);
  const longitude = Number(long);
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
      <Marker coordinate={{latitude: latitude, longitude: longitude}} />
    </MapView>
  );
};

export default FavoriteOutletDetailMap;
