import theme from '../../config/theme';

const PRIMARY_COLOR_RGB = theme.PRIMARY_COLOR_RGB;
const SECONDARY_COLOR_RGB = theme.SECONDARY_COLOR_RGB;
const THIRD_COLOR_RGB = theme.THIRD_COLOR_RGB;

const colorConfig = {
  PRIMARY_COLOR_RGB,
  SECONDARY_COLOR_RGB,
  THIRD_COLOR_RGB,
  statusBar: `rgb(${PRIMARY_COLOR_RGB})`,
  home: {
    container: `rgb(${PRIMARY_COLOR_RGB})`,
    textStyle: theme.home.textStyle,
    button: theme.home.button,
    buttonText: theme.home.buttonText,
  },
  signin: {
    container: theme.signin.container,
    signupText: theme.signin.signupText,
    signupButton: theme.signin.signupButton,
    button: theme.signin.button,
    shadowColor: theme.signin.shadowColor,
    buttonText: theme.signin.buttonText,
    buttonLoginWith: `rgb(${PRIMARY_COLOR_RGB})`,
    buttonTextLoginWith: theme.signin.buttonTextLoginWith,
    textLoginWith: theme.signin.textLoginWith,
    errorText: `rgb(${PRIMARY_COLOR_RGB})`,
  },
  signup: {
    container: `rgb(${PRIMARY_COLOR_RGB})`,
    signupText: `rgb(${PRIMARY_COLOR_RGB})`,
    signupButton: theme.signup.signupButton,
    button: theme.signup.button,
    shadowColor: `rgb(${PRIMARY_COLOR_RGB})`,
    buttonText: theme.signup.buttonText,
    errorText: theme.signup.errorText,
  },
  auth: {
    container: `rgb(${PRIMARY_COLOR_RGB})`,
    signupText: `rgb(${PRIMARY_COLOR_RGB})`,
    signupButton: theme.auth.signupButton,
    button: theme.auth.button,
    shadowColor: `rgb(${PRIMARY_COLOR_RGB})`,
    buttonText: theme.auth.buttonText,
    errorText: '#ffffff',
  },
  splash: {
    container: '#FFF',
    ViewStyle: '#fff',
  },
  pageIndex: {
    activeTintColor: `rgb(${PRIMARY_COLOR_RGB})`,
    inactiveTintColor: theme.pageIndex.inactiveTintColor,
    grayColor: theme.pageIndex.grayColor,
    backgroundColor: theme.pageIndex.backgroundColor,
    listBorder: `rgb(${SECONDARY_COLOR_RGB})`,
  },
  store: {
    defaultColor: `rgb(${PRIMARY_COLOR_RGB})`,
    TransBG: theme.store.TransBG,
    storesItem: theme.store.storesItem,
    scrollView: theme.store.scrollView,
    storesTitle: theme.store.storesTitle,
    border: theme.store.border,
    colorSuccess: theme.store.colorSuccess,
    colorSuccessDisabled: theme.store.colorSuccessDisabled,
    colorError: theme.store.colorError,
    textWhite: 'white',
    title: theme.store.title,
    titleSelected: theme.store.titleSelected,
    transparentColor: `rgba(${PRIMARY_COLOR_RGB}, 0.8)`,
    transparentBG: theme.store.transparentBG,
    disableButton: `rgba(${PRIMARY_COLOR_RGB}, 0.2)`,
    disableButtonError: theme.store.disableButtonError,
    transparent: theme.store.transparent,
    transparentItem: theme.store.transparentItem,
    darkColor: theme.store.darkColor,
    containerColor: theme.store.containerColor,
    secondaryColor: `rgb(${SECONDARY_COLOR_RGB})`,
    thirdColor: `rgb(${THIRD_COLOR_RGB})`,
    secondaryColorDisabled: `rgba(${SECONDARY_COLOR_RGB}, 0.3)`,
  },
  card: {
    cardColor: theme.card.cardColor,
    otherCardColor: theme.card.otherCardColor,
  },
};

export default colorConfig;
