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
    //old version
    primary: '#CF3030',
    secondary: '#F9F9F9',
    thirdColor: '#FFEBEB',
    forthColor: '#F9F9F9',

    // background: 'white',
    background2: '#F9F9F9',

    // header: 'white',

    text1: 'black',
    text2: '#B7B7B7',
    text3: '#8A8D8E',
    text4: 'white',

    border: '#D6D6D6',
    border1: '#B7B7B7',
    border2: 'white',

    textButtonDisabled: 'white',
    textButtonOutlined: 'black',

    // buttonDisabled: '#B7B7B7',
    buttonOutlined: 'white',

    navigationColor: colorSettings?.navigationColor || 'black',
    textButtonColor: colorSettings?.textButtonColor || 'black',
    textWarningColor: colorSettings?.textWarningColor || 'black',

    snackbarSuccess: '#5CD423',
    snackbarFailed: '#CF3030',

    //new version

    header: 'white',

    footer: '',

    badge: '#CE1111',

    accent: '#FAEAEA',

    background: 'white',

    textPrimary: '#000000',
    textSecondary: '#FFFFFF',
    textTertiary: '#B7B7B7',
    textQuaternary: '#CF3030',
    textError: '#CE1111',

    semanticError: '#CE1111',
    semanticSuccess: '#5CD523',

    brandPrimary: '#CF3030',
    brandSecondary: '#FFFFFF',
    brandTertiary: '#0E8A94',

    greyScale1: '#000000',
    greyScale2: '#B7B7B7',
    greyScale3: '#D6D6D6',
    greyScale4: '#F9F9F9',

    buttonActive: '#CF3030',
    buttonStandBy: '#FFFFFF',
    buttonDisabled: '#B7B7B7',

    backgroundTransparent1: '#00000033',
    backgroundTransparent2: '#B7B7B7CC',
    backgroundTransparent3: '#00000099',
    inactiveDot: '#D6D6D6',
    errorColor: '#CE1111',
  };

  const fontSize = {
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    20: 20,
    24: 24,
    36: 36,
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
