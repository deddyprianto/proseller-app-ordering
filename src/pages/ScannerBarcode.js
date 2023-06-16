import React, {useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {useDispatch} from 'react-redux';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import appConfig from '../config/appConfig';

import LoadingScreen from '../components/loadingScreen';
import ProductAddModal from '../components/productAddModal';
import {Header} from '../components/layout';
import {SearchProductByBarcodeModal} from '../components/modal';

import {getProductByBarcode} from '../actions/product.action';
import {showSnackbar} from '../actions/setting.action';

import Theme from '../theme';
import ButtonCartFloating from '../components/buttonCartFloating/ButtonCartFloating';

const HEIGHT = Dimensions.get('window').height;

const RESTRICTED_TYPES = ['QR_CODE', 'UNKNOWN', 'TEXT'];

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
      top: (HEIGHT * 16) / 100,
      left: 0,
      right: 0,
      alignItems: 'center',
      position: 'absolute',
      elevation: 1,
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
      bottom: (HEIGHT * 16) / 100,
      left: 0,
      right: 0,
      alignItems: 'center',
      position: 'absolute',
      elevation: 1,
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
  return styles;
};
const ScannerBarcode = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [searchCondition, setSearchCondition] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isShowInstruction, setIsShowInstruction] = useState(true);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenSearchBarcodeModal, setIsOpenSearchBarcodeModal] = useState(
    false,
  );

  const [product, setProduct] = useState({});

  const handleOpenProductAddModal = () => {
    setIsOpenAddModal(true);
  };
  const handleCloseProductAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenSearchProductByBarcodeModal = () => {
    setIsOpenSearchBarcodeModal(true);
  };
  const handleCloseSearchProductByBarcodeModal = () => {
    setIsOpenSearchBarcodeModal(false);
  };

  const onSuccess = async value => {
    setIsLoading(true);
    const response = await dispatch(getProductByBarcode(value?.data));

    if (response?.data) {
      setIsLoading(false);
      setProduct(response?.data);
      handleOpenProductAddModal();
    } else {
      setIsLoading(false);
      await dispatch(showSnackbar({message: 'Product Not Found'}));
    }
  };

  const onSearch = async value => {
    setIsLoading(true);
    const response = await dispatch(getProductByBarcode(value));

    if (response?.data) {
      setSearchCondition('success');
      setIsLoading(false);
      setProduct(response?.data);
      handleOpenProductAddModal();
    } else {
      setIsLoading(false);
      setSearchCondition('error');
    }
  };

  const renderProductAddModal = () => {
    if (isOpenAddModal) {
      return (
        <ProductAddModal
          product={product}
          open={isOpenAddModal}
          handleClose={() => {
            handleCloseProductAddModal();
          }}
        />
      );
    }
  };

  const renderTopContent = () => {
    if (isShowInstruction && !isOpenAddModal) {
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
    if (!isOpenAddModal) {
      return (
        <TouchableOpacity
          style={styles.viewBottomContent}
          onPress={() => {
            handleOpenSearchProductByBarcodeModal();
          }}>
          <View style={styles.viewBottomContentValue}>
            <Text style={styles.textBottomContent}>Enter barcode number</Text>
            <Image
              source={appConfig.iconKeyboard}
              style={styles.iconKeyboard}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Header isMiddleLogo />
      </View>
    );
  };

  const renderSearchModal = () => {
    if (isOpenSearchBarcodeModal && !isOpenAddModal) {
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
    if (!isOpenAddModal) {
      return (
        <RNCamera
          captureAudio={false}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            const barcode = barcodes[0];
            if (barcode && !RESTRICTED_TYPES.includes(barcode.type)) {
              setIsLoading(true);
              !isLoading ? setTimeout(() => onSuccess(barcode), 500) : null;
            }
          }}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message:
              'We need to use your camera access to scan product barcode',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      );
    }
  };

  const renderButtonCartFloating = () => {
    if (!isOpenAddModal) {
      return <ButtonCartFloating />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {renderHeader()}
      {renderScanner()}
      {renderSearchModal()}
      {renderTopContent()}
      {renderBottomContent()}
      {renderButtonCartFloating()}
      {renderProductAddModal()}
    </SafeAreaView>
  );
};

export default ScannerBarcode;
