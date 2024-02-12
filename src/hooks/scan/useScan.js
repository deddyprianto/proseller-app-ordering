import {useCallback, useState} from 'react';
import {Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getDistance} from 'geolib';

import {checkLocationPermission} from '../../utils/location.utils';
import {navigate} from '../../utils/navigation.utils';
import appConfig from '../../config/appConfig';

export const useScan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(null);

  const onClickScan = useCallback(async defaultOutlet => {
    const isFEF = appConfig.appName === 'fareastflora';
    if (isFEF) {
      const locationPermission = await checkLocationPermission();
      if (locationPermission !== 'granted') {
        setOpenLocationModal('requestPermission');
      } else {
        await handleGetUserPosition(defaultOutlet);
      }
    } else {
      navigate('scannerBarcode');
    }
  }, []);

  const handleGetUserPosition = async defaultOutlet => {
    setIsLoading(true);
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

          const distance = getDistance(userLocation, outletLocation);

          if (distance <= 50) {
            navigate('scannerBarcode');
          } else {
            setOpenLocationModal('outsideRange');
          }
        },
        error => {
          setIsLoading(false);
          console.log('cek geolocation error:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
      );
    } catch (error) {
      setIsLoading(false);
      console.log('cek error getting location', error);
    }
  };

  const onClickSubmitLocationModal = () => {
    const isRequestPermission = openLocationModal === 'requestPermission';
    if (isRequestPermission) {
      Linking.openSettings();
    }
    handleClose();
  };

  const handleClose = () => {
    setIsLoading(false);
    setOpenLocationModal(null);
  };

  return {
    onClickScan,
    isLoading,
    openLocationModal,
    handleClose,
    onClickSubmitLocationModal,
  };
};
