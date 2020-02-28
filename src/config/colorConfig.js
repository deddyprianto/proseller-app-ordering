const PRIMARY_COLOR_RGB = '3, 157, 252';
const SECONDARY_COLOR_RGB = '250, 162, 28';

const colorConfig = {
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
    storesItem: '#FFFFFF',
    scrollView: '#FFFBF4',
    storesTitle: '#f39c12',
    border: '#31393d',
    colorSuccess: '#44c769',
    colorError: '#c7420e',
    textWhite: 'white',
    title: '#454545',
    transparentColor: `rgba(${PRIMARY_COLOR_RGB}, 0.8)`,
    disableButton: `rgba(${PRIMARY_COLOR_RGB}, 0.4)`,
    disableButtonError: `rgba(199, 66, 14, 0.4)`,
    transparent: 'rgba(3, 157, 252, 0.1)',
    containerColor: '#f2f2f2',
    secondaryColor: `rgb(${SECONDARY_COLOR_RGB})`,
  },
};

export default colorConfig;
