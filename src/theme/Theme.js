/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import {useSelector} from 'react-redux';

const Theme = () => {
  const colorSettings = useSelector(
    state => state.settingReducer.colorSettings,
  );

  const colors = {
    primary: '#CF3030',
    secondary: '#F9F9F9',
    thirdColor: '#FFEBEB',
    forthColor: '#F9F9F9',

    background: 'white',
    background2: '#F9F9F9',

    backgroundTransparent: 'rgba(0, 0, 0, 0.5)',

    header: 'white',

    text1: 'black',
    text2: '#B7B7B7',
    text3: '#8A8D8E',
    text4: 'white',

    border: '#D6D6D6',
    border1: '#B7B7B7',
    border2: 'white',

    textButtonDisabled: 'white',
    textButtonOutlined: 'black',

    buttonDisabled: '#B7B7B7',
    buttonOutlined: 'white',

    navigationColor: colorSettings?.navigationColor || 'black',
    textButtonColor: colorSettings?.textButtonColor || 'black',
    textWarningColor: colorSettings?.textWarningColor || 'black',

    snackbarSuccess: '#5CD423',
    snackbarFailed: '#CF3030',
  };

  const fontSize = {
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    20: 20,
  };

  const fontFamily = {
    poppinsThin: 'Poppins-Thin', //100
    poppinsExtraLight: 'Poppins-ExtraLight', //200
    poppinsLight: 'Poppins-Light', //300
    poppinsRegular: 'Poppins-Regular', //400
    poppinsMedium: 'Poppins-Medium', //500
    poppinsSemiBold: 'Poppins-SemiBold', //600
    poppinsBold: 'Poppins-Bold', //700
  };

  return {
    colors,
    fontSize,
    fontFamily,
  };
};

export default Theme;
