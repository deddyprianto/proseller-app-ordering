/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import {ImageBackground, View} from 'react-native';

import appConfig from '../../../config/appConfig';

const Body = ({children, style, enableBg = false}) => {
  if (!enableBg) {
    return (
      <View style={{...style, width: '100%', height: '100%'}}>{children}</View>
    );
  }
  return (
    <ImageBackground
      style={{...style, width: '100%', height: '100%'}}
      source={appConfig.imageBackground}>
      {children}
    </ImageBackground>
  );
};

export default Body;
