import React from 'react';
import {BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';

const useBackHandler = () => {
  const backPage = () => {
    Actions.pop();
    return true;
  };

  React.useEffect(() => {
    console.log('masuk');
    BackHandler.addEventListener('hardwareBackPress', backPage);
    return () => {
      console.log('keluar');
      BackHandler.removeEventListener('hardwareBackPress', backPage);
    };
  }, []);
};

export default useBackHandler;
