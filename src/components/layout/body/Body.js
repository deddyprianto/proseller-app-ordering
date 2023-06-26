/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';
import FieldSearch from '../../fieldSearch';

import Scanner from '../../scanner';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      overflow: 'hidden',
      paddingBottom: 2,
    },
    container: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 3,
      height: 56,
      maxHeight: 56,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      backgroundColor: theme.colors.header,
    },
    containerLeft: {
      flex: 1,
      alignItems: 'flex-start',
    },
    containerCenter: {
      elevation: 1,
      flex: 2,
      alignItems: 'center',
    },
    containerRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    flexRowCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewCancelButton: {
      marginLeft: 16,
    },
    textHeader: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textCancel: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    logo: {
      width: '70%',
      height: '100%',
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: theme.colors.textQuaternary,
    },
    iconBack: {
      width: 30,
      height: 30,
      tintColor: theme.colors.textQuaternary,
    },
    iconRemove: {
      width: 18,
      height: 18,
      tintColor: theme.colors.textQuaternary,
    },
    iconCart: {
      width: 11,
      height: 18,
      tintColor: theme.colors.textQuaternary,
    },
  });
  return styles;
};

const Body = ({children, style}) => {
  //   const styles = useStyles();

  return (
    <ImageBackground
      style={{...style, width: '100%', height: '100%'}}
      source={appConfig.imageBackground}>
      {children}
    </ImageBackground>
  );
};

export default Body;
