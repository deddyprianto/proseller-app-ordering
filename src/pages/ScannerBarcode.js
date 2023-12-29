import React, {useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';

import appConfig from '../config/appConfig';
import {Svg, Defs, Rect, Mask} from 'react-native-svg';

import LoadingScreen from '../components/loadingScreen';
import {Header} from '../components/layout';
import {SearchProductByBarcodeModal} from '../components/modal';

import {getProductByBarcode} from '../actions/product.action';
import {showSnackbar} from '../actions/setting.action';

import Theme from '../theme';
import ButtonCartFloating from '../components/buttonCartFloating/ButtonCartFloating';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../helper/Layout';
import ModalAction from '../components/modal/ModalAction';
import useScanGo from '../hooks/validation/usScanGo';
import additionalSetting from '../config/additionalSettings';
import {navigate} from '../utils/navigation.utils';
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
const ScannerBarcode = () => {
  const {styles, theme} = useStyles();
  const dispatch = useDispatch();
  const [searchCondition, setSearchCondition] = useState('');
  const [isOpenDetailPage, setIsOpenDetailPage] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowInstruction, setIsShowInstruction] = useState(true);
  const [isOpenSearchBarcodeModal, setIsOpenSearchBarcodeModal] = useState(
    false,
  );
  const [responseBarcode, setResponseBarcode] = React.useState(false);
  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const {
    showAlert,
    checkProductScanGo,
    closeAlert,
    onRemoveBasket,
    setShowAlert,
  } = useScanGo();
  const handleOpenSearchProductByBarcodeModal = () => {
    setIsOpenSearchBarcodeModal(true);
  };
  const handleCloseSearchProductByBarcodeModal = () => {
    setIsOpenSearchBarcodeModal(false);
  };

  const resetScanCode = () => {
    setIsOpenDetailPage(false);
  };

  const onClearCart = () => {
    onRemoveBasket();
    closeAlert();
  };

  const onSuccess = async (value, showError) => {
    if (!isOpenDetailPage) {
      setTimeout(async () => {
        setIsLoading(true);
        const response = await dispatch(getProductByBarcode(value?.data));
        setResponseBarcode(response);
        handleSuccess(response, value.oldBarcode, showError);
      }, 1000);
    }
  };

  const goToProductDetail = response => {
    setShowAlert(false);
    navigate('productDetail', {
      productId: response?.data?.id,
      resetScanCode,
      isFromScanBarcode: true,
    });
  };

  const handleSuccess = async (response, oldBarcode, showError) => {
    if (response?.data) {
      if (additionalSetting().enableScanAndGo) {
        setIsLoading(false);
        const showPopup = await checkProductScanGo(true, response.data);
        if (!showPopup) {
          return goToProductDetail(response);
        } else {
          setShowAlert(showPopup);
          return setIsOpenDetailPage(false);
        }
      }
      goToProductDetail(response);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      if (!showError) {
        onSuccess({data: oldBarcode}, true);
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
      setResponseBarcode(response);
      handleSuccess(response, value.oldBarcode);
    } else {
      setIsLoading(false);
      setSearchCondition('error');
    }
  };

  const onBarcodeRead = barcodes => {
    if (Platform.OS === 'ios') {
      let oldBarcode = barcodes?.data;
      let newBarCode = barcodes?.data;
      if (!additionalSetting().enableUpcaScanner) {
        if (!isOpenDetailPage) {
          setIsOpenDetailPage(true);
          onSuccess({data: newBarCode});
        }
        return;
      }
      newBarCode = newBarCode?.substring(1, newBarCode.length - 1);
      oldBarcode = oldBarcode?.substring(0, oldBarcode.length - 1);
      if (!isOpenDetailPage) {
        setIsOpenDetailPage(true);
        onSuccess({data: newBarCode, oldBarcode});
      }
    }
  };

  const onGoogleBarcode = barcodes => {
    if (Platform.OS === 'android' && !isOpenDetailPage) {
      const code = barcodes.barcodes[0]?.data;
      if (!additionalSetting().enableUpcaScanner) {
        const barcodeData = code;
        setIsOpenDetailPage(true);
        return onSuccess({data: barcodeData}, true);
      }

      if (code) {
        setIsOpenDetailPage(true);
        const barcodeData = code?.substring(0, code?.length - 1);
        onSuccess({data: barcodeData}, true);
      }
    }
  };

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
    return <Header isMiddleLogo />;
  };

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
        barCodeTypes={[
          RNCamera.Constants.BarCodeType.ean13,
          RNCamera.Constants.BarCodeType.upc_e,
          RNCamera.Constants.BarCodeType.code39,
        ]}
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

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {renderHeader()}
      {renderScanner()}
      {renderSearchModal()}
      {renderButtonCartFloating()}
      <ModalAction
        isVisible={showAlert}
        title={`Proceed to ${defaultOutlet.storeCheckOutName ||
          'Store Checkout'}`}
        description="Your current cart will be emptied.
Do you still want to proceed?"
        approveTitle="Proceed"
        onApprove={() => goToProductDetail(responseBarcode)}
        closeModal={closeAlert}
        onCancel={closeAlert}
      />
    </SafeAreaView>
  );
};

export default ScannerBarcode;
