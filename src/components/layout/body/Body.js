/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import {ImageBackground} from 'react-native';

import appConfig from '../../../config/appConfig';

const Body = ({children, style}) => {
  return (
    <ImageBackground
      style={{...style, width: '100%', height: '100%'}}
      source={appConfig.imageBackground}>
      {children}
    </ImageBackground>
  );
};

export default Body;
