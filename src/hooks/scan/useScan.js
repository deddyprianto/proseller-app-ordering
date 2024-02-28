import {useCallback, useState} from 'react';
import {Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';

import {checkLocationPermission} from '../../utils/location.utils';
import appConfig from '../../config/appConfig';
import {Actions} from 'react-native-router-flux';

export const useScan = () => {
  const [isLoadingLocationModal, setIsLoadingLocationModal] = useState(false);
  const [distance, setDistance] = useState(null);
  const [openLocationModal, setOpenLocationModal] = useState(null);

  const handleUserLocation = useCallback(async defaultOutlet => {
    const isFEF = appConfig.appName === 'fareastflora';
    if (isFEF) {
      const locationPermission = await checkLocationPermission();
      if (locationPermission !== 'granted') {
        setOpenLocationModal('requestPermission');
      } else {
        await handleGetUserPosition(defaultOutlet);
      }
    }
  }, []);

  const handleGetUserPosition = async defaultOutlet => {
    setIsLoadingLocationModal(true);
    try {
      await Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const userLocation = {
            latitude,
            longitude,
          };
          const outletLocation = {
            latitude: defaultOutlet.latitude,
            longitude: defaultOutlet.longitude,
          };

          const _distance = getDistance(userLocation, outletLocation);
          setDistance(_distance);
          if (_distance > 50) {
            setOpenLocationModal('outsideRange');
          }
          setIsLoadingLocationModal(false);
        },
        error => {
          setIsLoadingLocationModal(false);
          if (error.code === 5) {
            setOpenLocationModal('requestPermission');
          }
          console.log('cek geolocation error:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
      );
    } catch (error) {
      setIsLoadingLocationModal(false);
      console.log('cek error getting location', error);
    }
  };

  const onClickSubmitLocationModal = () => {
    const isRequestPermission = openLocationModal === 'requestPermission';
    if (isRequestPermission) {
      Linking.openSettings();
    }
    Actions.pop();
    handleClose();
  };

  const handleClose = () => {
    setIsLoadingLocationModal(false);
    setOpenLocationModal(null);
  };

  return {
    handleUserLocation,
    isLoadingLocationModal,
    openLocationModal,
    handleClose,
    onClickSubmitLocationModal,
    distance,
  };
};
