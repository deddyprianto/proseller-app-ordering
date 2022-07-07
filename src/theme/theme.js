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
    secondary: colorSettings?.secondaryColor || 'black',
    background: 'white',
    header: 'white',

    text1: 'black',
    text2: '#B7B7B7',
    text3: '#8A8D8E',

    border: '#D6D6D6',

    textButtonDisabled: 'white',
    textButtonOutlined: 'black',

    buttonDisabled: '#B7B7B7',
    buttonOutlined: 'white',

    navigationColor: colorSettings?.navigationColor || 'black',
    textButtonColor: colorSettings?.textButtonColor || 'black',
    textWarningColor: colorSettings?.textWarningColor || 'black',
  };

  const fontSize = {
    10: 10,
    12: 12,
    14: 14,
    16: 16,
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
