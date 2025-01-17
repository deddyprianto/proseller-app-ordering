const PRIMARY_COLOR_RGB = '0, 191, 202';
const SECONDARY_COLOR_RGB = '53, 59, 72';
const THIRD_COLOR_RGB = '156, 206, 194';
const FORTH_COLOR_RGB = '231, 161, 161';
const FIFTH_COLOR_RGB = '247, 223, 213';
const SIXTH_COLOR_RGB = '245, 241, 242';

const theme = {
  PRIMARY_COLOR_RGB,
  SECONDARY_COLOR_RGB,
  THIRD_COLOR_RGB,
  FORTH_COLOR_RGB,
  FIFTH_COLOR_RGB,
  SIXTH_COLOR_RGB,
  statusBar: `rgb(${PRIMARY_COLOR_RGB})`,
  home: {
    container: `rgb(${PRIMARY_COLOR_RGB})`,
    textStyle: '#fff',
    button: '#1c313a',
    buttonText: '#ffffff',
  },
  signin: {
    container: '#ffffff',
    signupText: '#ffffff',
    signupButton: '#ffffff',
    button: '#068944',
    shadowColor: '#ffffff',
    buttonText: '#ffffff',
    buttonLoginWith: `rgb(${PRIMARY_COLOR_RGB})`,
    buttonTextLoginWith: '#1c313a',
    textLoginWith: '#1c313a',
    errorText: `rgb(${PRIMARY_COLOR_RGB})`,
  },
  signup: {
    container: `rgb(${PRIMARY_COLOR_RGB})`,
    signupText: `rgb(${PRIMARY_COLOR_RGB})`,
    signupButton: '#ffffff',
    button: '#068944',
    shadowColor: `rgb(${PRIMARY_COLOR_RGB})`,
    buttonText: '#ffffff',
    errorText: '#ffffff',
  },
  auth: {
    container: `rgb(${PRIMARY_COLOR_RGB})`,
    signupText: `rgb(${PRIMARY_COLOR_RGB})`,
    signupButton: '#ffffff',
    button: '#068944',
    shadowColor: `rgb(${PRIMARY_COLOR_RGB})`,
    buttonText: '#ffffff',
    errorText: '#ffffff',
  },
  splash: {
    container: '#FFF',
    ViewStyle: '#fff',
  },
  pageIndex: {
    activeTintColor: `rgb(${PRIMARY_COLOR_RGB})`,
    inactiveTintColor: '#CBCBCB',
    grayColor: '#A2A2A2',
    backgroundColor: '#FFFFFF',
    listBorder: `rgb(${SECONDARY_COLOR_RGB})`,
  },
  store: {
    defaultColor: `rgb(${PRIMARY_COLOR_RGB})`,
    TransBG: `rgba(255, 255, 255, 0.7)`,
    storesItem: '#FFFFFF',
    scrollView: '#FFFBF4',
    storesTitle: '#f39c12',
    border: '#31393d',
    colorSuccess: 'rgb(68, 199, 105)',
    colorSuccessDisabled: 'rgba(68, 199, 105, 0.3)',
    colorError: '#c7420e',
    textWhite: 'white',
    title: '#454545',
    titleSelected: '#616161',
    transparentColor: `rgba(${PRIMARY_COLOR_RGB}, 0.8)`,
    transparentBG: `#f7f7f7`,
    disableButton: `rgba(${PRIMARY_COLOR_RGB}, 0.4)`,
    disableButtonError: `rgba(199, 66, 14, 0.4)`,
    transparent: 'rgba(3, 157, 252, 0.1)',
    transparentItem: 'rgba(0, 0, 0, 0.5)',
    darkColor: '#2c3e50',
    containerColor: '#f2f2f2',
    secondaryColor: `rgb(${SECONDARY_COLOR_RGB})`,
    thirdColor: `rgb(${THIRD_COLOR_RGB})`,
    secondaryColorDisabled: `rgba(${SECONDARY_COLOR_RGB}, 0.3)`,
  },
  card: {
    cardColor: '#1e272e',
    otherCardColor: '#0fbcf9',
  },
};

export default theme;
