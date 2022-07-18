import React, {useState} from 'react';

import {StyleSheet, Text, TouchableOpacity, Modal} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useDispatch} from 'react-redux';
import {getProductByBarcode} from '../../actions/product.action';
import {showSnackbar} from '../../actions/setting.action';
import colorConfig from '../../config/colorConfig';
import LoadingScreen from '../loadingScreen';
import ProductAddModal from '../productAddModal';

const styles = StyleSheet.create({
  textScan: {
    marginBottom: 20,
    fontSize: 18,
    color: colorConfig.primaryColor,
  },
  touchableExit: {
    width: '80%',
    backgroundColor: colorConfig.primaryColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 50,
  },
  textExit: {
    color: 'white',
  },
});

const Scanner = ({open, handleClose}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [product, setProduct] = useState({});

  const handleOpenProductAddModal = () => {
    setIsOpenAddModal(true);
  };
  const handleCloseProductAddModal = () => {
    setIsOpenAddModal(false);
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
      handleClose();
      await dispatch(showSnackbar({message: 'Product Not Found'}));
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

  if (!open) {
    return null;
  }

  return (
    <Modal
      visible={open}
      onRequestClose={() => {
        handleClose();
      }}>
      <LoadingScreen loading={isLoading} />
      <QRCodeScanner
        reactivate={true}
        showMarker={true}
        // ref={node => {
        //   this.scanner = node;
        // }}
        onRead={onSuccess}
        topContent={<Text style={styles.textScan}>Scan your QRCode!</Text>}
        bottomContent={
          <TouchableOpacity style={styles.touchableExit} onPress={handleClose}>
            <Text style={styles.textExit}>Exit Scanner</Text>
          </TouchableOpacity>
        }
      />
      {renderProductAddModal()}
    </Modal>
  );
};

export default Scanner;