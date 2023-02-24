import React, {useEffect, useRef, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BarcodeScanner from 'react-native-scan-barcode';
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

import LoadingScreen from '../components/loadingScreen';
import ProductAddModal from '../components/productAddModal';
import {Header} from '../components/layout';
import {SearchProductByBarcodeModal} from '../components/modal';

import {getProductByBarcode} from '../actions/product.action';
import {showSnackbar} from '../actions/setting.action';

import Theme from '../theme';
import ButtonCartFloating from '../components/buttonCartFloating/ButtonCartFloating';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const statusBarHeight = Platform.OS === 'ios' ? 28 : 0;
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    header: {
      backgroundColor: 'white',
      paddingTop: statusBarHeight,
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      position: 'absolute',
      elevation: 1,
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
  });
  return styles;
};
const ScannerBarcode = () => {
  let scanner = useRef(null);
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

  const snackbar = useSelector(state => state.settingReducer.snackbar.message);

  // useEffect(() => {
  //   if (!snackbar && !isOpenAddModal) {
  //     scanner.reactivate();
  //   }
  // }, [snackbar, isOpenAddModal]);

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
    return (
      <View style={styles.header}>
        <Header isMiddleLogo />
      </View>
    );
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
  const handleScan = e => {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
  };
  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <QRCodeScanner
        ref={node => {
          scanner = node;
        }}
        cameraStyle={styles.camera}
        showMarker={true}
        onRead={onSuccess}
      />

      {renderSearchModal()}
      {renderHeader()}
      {renderTopContent()}
      {renderBottomContent()}
      {renderProductAddModal()}
      <ButtonCartFloating />
    </SafeAreaView>
    // <BarcodeScanner
    //   onBarCodeRead={handleScan}
    //   style={{flex: 1}}
    //   torchMode="off"
    //   cameraType="back"
    // />
  );
};

export default ScannerBarcode;
