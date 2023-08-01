import React from 'react';
import useGetProtectionData from '../../hooks/protection/useGetProtectioData';
import {View} from 'react-native';

const CheckVerifiedEmail = () => {
  const {getUserDetail} = useGetProtectionData();

  console.log(getUserDetail(), 'getuser');

  return <View />;
};

export default CheckVerifiedEmail;
