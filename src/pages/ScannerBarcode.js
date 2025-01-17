import React, {useState, useEffect, useCallback} from 'react';
import {RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {withNavigationFocus} from 'react-navigation';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  BackHandler,
} from 'react-native';

import appConfig from '../config/appConfig';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';

import LoadingScreen from '../components/loadingScreen';
import {Header} from '../components/layout';
import {LocationModal, SearchProductByBarcodeModal} from '../components/modal';

import {getProductByBarcode} from '../actions/product.action';
import {showSnackbar} from '../actions/setting.action';
import {removeBasket} from '../actions/order.action';

import Theme from '../theme';
import ButtonCartFloating from '../components/buttonCartFloating/ButtonCartFloating';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../helper/Layout';
import ModalAction from '../components/modal/ModalAction';
import {navigate} from '../utils/navigation.utils';
import {isEmptyObject} from '../helper/CheckEmpty';

import {useScan} from '../hooks/scan/useScan';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    header: {
      backgroundColor: 'white',
      alignItems: 'center',
    },
    textTopContent: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textBottomContent: {
      marginRight: 16,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewTopContent: {
      alignItems: 'center',
      elevation: 1,
      position: 'absolute',
      top: normalizeLayoutSizeHeight(53),
      zIndex: 1,
    },
    viewTopContentValue: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: theme.colors.buttonActive,
      borderColor: theme.colors.buttonStandBy,
    },
    viewBottomContent: {
      alignItems: 'center',
      elevation: 1,
      position: 'absolute',
      bottom: normalizeLayoutSizeHeight(220),
      zIndex: 1,
    },
    viewBottomContentValue: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    camera: {
      height: HEIGHT,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconClose: {
      marginLeft: 32,
      width: 24,
      height: 24,
      tintColor: theme.colors.textSecondary,
    },
    iconKeyboard: {
      width: 20,
      height: 20,
      tintColor: theme.colors.textSecondary,
    },
    marginTopIos: {
      marginTop: 25,
    },
    marginTopAndroid: {
      marginTop: 0,
    },
    marginTopIphone14Pro: {
      marginTop: 35,
    },
  });
  return {styles, theme};
};
const ScannerBarcode = ({isFocused}) => {
  const {styles, theme} = useStyles();
  const dispatch = useDispatch();
  const {
    handleUserLocation,
    isLoadingLocationModal,
    openLocationModal,
    handleClose,
    onClickSubmitLocationModal,
    distance,
  } = useScan();

  const [searchCondition, setSearchCondition] = useState('');
  const [isOpenDetailPage, setIsOpenDetailPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowInstruction, setIsShowInstruction] = useState(true);
  const [isOpenSearchBarcodeModal, setIsOpenSearchBarcodeModal] = useState(
    false,
  );
  const [isGoBack, setIsGoBack] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  useEffect(() => {
    const loadData = async () => {
      await handleUserLocation(defaultOutlet);
    };
    loadData();
  }, [defaultOutlet, handleUserLocation]);

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      const isScanGoProduct = basket?.isStoreCheckoutCart;
      const validateDistance = distance && distance <= 100;
      if (!isEmptyObject(basket) && !isScanGoProduct && validateDistance) {
        setTimeout(() => {
          setShowAlert(true);
        }, 1000);
      }
    };
    loadData();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackHandler);
    };
  }, [onBackHandler, basket, isFocused]);

  const handleOpenSearchProductByBarcodeModal = () => {
    setIsOpenSearchBarcodeModal(true);
  };
  const handleCloseSearchProductByBarcodeModal = () => {
    setIsOpenSearchBarcodeModal(false);
  };

  const resetScanCode = () => {
    setIsOpenDetailPage(false);
  };

  const onClearCart = async () => {
    setIsLoading(true);
    setShowAlert(false);
    await dispatch(removeBasket());
    setIsLoading(false);
    if (isGoBack) {
      Actions.pop();
    }
  };

  const onSuccess = async (value, showError) => {
    if (!isOpenDetailPage) {
        setIsLoading(true);
        const response = await dispatch(getProductByBarcode(value?.data));
        handleSuccess(response, value, showError);
    }
  };

  const goToProductDetail = response => {
    setShowAlert(false);
    setBarcodeData(null);
    setIsOpenDetailPage(true);
    navigate('productDetail', {
      productId: response?.data?.id,
      resetScanCode,
      isFromScanBarcode: true,
    });
  };

  const handleSuccess = (response, data, showError) => {
    if (response?.data) {
      setIsLoading(false);
      goToProductDetail(response);
    } else {
      setIsLoading(false);
      if (!showError) {
        onSuccess({data: data}, true);
      }
      if (showError) {
        setIsOpenDetailPage(false);
        dispatch(showSnackbar({message: 'Product Not Found'}));
      }
    }
  };

  const onSearch = async value => {
    setIsLoading(true);
    const response = await dispatch(getProductByBarcode(value));
    if (response?.data) {
      setSearchCondition('success');
      setIsLoading(false);
      handleCloseSearchProductByBarcodeModal();
      handleSuccess(response, value);
    } else {
      setIsLoading(false);
      setSearchCondition('error');
    }
  };

  const onBarcodeRead = async barcodes => {
    const code = barcodes?.data
    if (Platform.OS === 'ios' && code && !showAlert && !openLocationModal) {
      const barcodeType = barcodes?.type
      await barcodeHandler(code, barcodeType);
    }
  };

  const onGoogleBarcode = async barcodes => {
    const code = barcodes.barcodes[0]?.data;
    if (Platform.OS === 'android' && code && !showAlert && !openLocationModal) {
      const barcodeType = barcodes.barcodes[0]?.type
      await barcodeHandler(code, barcodeType);
    }
  };

  const isScannerActive = barcodeResult => {
    return (barcodeData !== barcodeResult) && !(isLoading || isLoadingLocationModal) && !isOpenDetailPage
  }

  const isEANUPC = data => {
    return data?.includes("EAN") || data?.includes("UPC");
  }

  const barcodeHandler = async (code, type) => {
    const barcodeResult = isEANUPC(type) ? code?.substring(0, code?.length - 1) : code;
    const isUPCA = type?.includes("EAN") && code?.length === 13 && code?.startsWith("0") // iOS only
    const result = Platform.OS === "ios" && isUPCA ? barcodeResult?.substring(1) : barcodeResult

    if (result && isScannerActive(result)) {
      const encodedData = encodeURIComponent(result);
      const payload = result?.includes("/") ? encodedData : result
      setBarcodeData(result);
      await onSuccess({data: payload}, true);
    }
  }

  const renderTopContent = () => {
    if (isShowInstruction) {
      return (
        <View style={styles.viewTopContent}>
          <View style={styles.viewTopContentValue}>
            <Text style={styles.textTopContent}>
              Scan the product barcode here
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsShowInstruction(false);
              }}>
              <Image source={appConfig.iconClose} style={styles.iconClose} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const renderBottomContent = () => {
    return (
      <TouchableOpacity
        style={styles.viewBottomContent}
        onPress={() => {
          handleOpenSearchProductByBarcodeModal();
        }}>
        <View style={styles.viewBottomContentValue}>
          <Text style={styles.textBottomContent}>Enter barcode number</Text>
          <Image source={appConfig.iconKeyboard} style={styles.iconKeyboard} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return <Header onBackBtn={onBackHandler} isMiddleLogo />;
  };

  const onBackHandler = useCallback(() => {
    const isScanGoProduct = basket?.isStoreCheckoutCart;
    const isFEF = appConfig.appName === 'fareastflora';
    setIsGoBack(true);
    if (isFEF && !isEmptyObject(basket) && isScanGoProduct && isFocused) {
      setShowAlert(true);
    } else {
      Actions.pop();
    }
    return true;
  }, [basket, setShowAlert, isFocused]);

  const renderSearchModal = () => {
    if (isOpenSearchBarcodeModal) {
      return (
        <SearchProductByBarcodeModal
          open={isOpenSearchBarcodeModal}
          handleClose={() => {
            handleCloseSearchProductByBarcodeModal();
          }}
          onSubmit={value => {
            onSearch(value);
          }}
          condition={searchCondition}
        />
      );
    }
  };

  const renderScanner = () => {
    return (
      <RNCamera
        captureAudio={false}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onGoogleVisionBarcodesDetected={onGoogleBarcode}
        onBarCodeRead={onBarcodeRead}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need to use your camera access to scan product barcode',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <>
          {renderTopContent()}

          <Svg height="100%" width="100%">
            <Defs>
              <Mask id="mask" x="0" y="0" height="100%" width="100%">
                <Rect height="100%" width="100%" fill="#fff" />
                <Rect
                  x={normalizeLayoutSizeWidth(16)}
                  y={normalizeLayoutSizeHeight(140)}
                  width={normalizeLayoutSizeWidth(396)}
                  height={normalizeLayoutSizeHeight(396)}
                  stroke={theme.colors.primary}
                  strokeWidth={1}
                  fill="black"
                  rx={16}
                  ry={16}
                />
              </Mask>
            </Defs>
            <Rect
              height="100%"
              width="100%"
              fill="rgba(0, 0, 0, 0.5)"
              mask="url(#mask)"
              fill-opacity="0"
            />
          </Svg>
          {renderBottomContent()}
        </>
      </RNCamera>
    );
  };

  const renderButtonCartFloating = () => {
    return <ButtonCartFloating />;
  };

  const alertDescription = () => {
    if (isGoBack) {
      return `Exiting ${defaultOutlet.storeCheckOutName ||
        'Store Checkout'} will clear your cart. Are you sure you want to proceed?`;
    }
    return 'Your current cart will be emptied. Do you still want to proceed?';
  };

  const alertTitle = () => {
    if (isGoBack) {
      return `Exit ${defaultOutlet.storeCheckOutName || 'Store Checkout'}`;
    }
    return `Proceed to ${defaultOutlet.storeCheckOutName || 'Store Checkout'}`;
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading || isLoadingLocationModal} />
      {renderHeader()}
      {!isLoadingLocationModal && isFocused && renderScanner()}
      {renderSearchModal()}
      {renderButtonCartFloating()}
      <ModalAction
        isVisible={showAlert}
        hideCloseButton
        onCancel={onClearCart}
        onApprove={() => {
          setShowAlert(false);
          !isGoBack && Actions.pop();
        }}
        title={alertTitle()}
        description={alertDescription()}
        approveTitle="No"
        outlineBtnTitle="Yes"
      />
      <LocationModal
        openLocationModal={openLocationModal}
        handleClose={() => {
          handleClose();
          Actions.pop();
        }}
        onClickSubmitLocationModal={onClickSubmitLocationModal}
        outlet={defaultOutlet}
      />
    </SafeAreaView>
  );
};

export default withNavigationFocus(ScannerBarcode);
