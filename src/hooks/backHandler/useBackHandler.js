import React from 'react';
import {BackHandler} from 'react-native';
import {Actions} from 'react-native-router-flux';

const useBackHandler = () => {
  const backPage = () => {
    Actions.pop();
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backPage);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backPage);
    };
  }, []);
};

export default useBackHandler;
