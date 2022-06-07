/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import colorConfig from '../../../config/colorConfig';
import currencyFormatter from '../../../helper/CurrencyFormatter';
import ProductAddModal from '../../productAddModal';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 370,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.fifthColor,
  },
  image: {
    height: 120,
    width: 125,
    borderRadius: 30,
  },
  textName: {
    textAlign: 'right',
  },
  textAddCart: {
    color: 'white',
    fontSize: 16,
  },
  viewBody: {
    marginLeft: 10,
    width: 180,
    marginRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  touchableAddCart: {
    width: 160,
    height: 35,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const EStoreItem = ({item}) => {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };
  const renderName = () => {
    return <Text style={styles.textName}>{item.name}</Text>;
  };

  const renderPrice = () => {
    return <Text>{currencyFormatter(item.retailPrice)}</Text>;
  };

  const renderAddCartButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableAddCart}
        onPress={() => {
          handleOpenAddModal();
        }}>
        <Text style={styles.textAddCart}>ADD TO CART</Text>
      </TouchableOpacity>
    );
  };

  const renderModal = () => {
    return (
      <ProductAddModal
        open={isOpenAddModal}
        product={item}
        handleClose={() => {
          handleCloseAddModal();
        }}
      />
    );
  };
  return (
    <View style={styles.root}>
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={{uri: item.defaultImageURL}}
      />
      <View style={styles.viewBody}>
        {renderName()}
        <View style={{marginBottom: 10}} />
        {renderPrice()}
        <View style={{marginBottom: 10}} />
        {renderAddCartButton()}
      </View>
      {renderModal()}
    </View>
  );
};

export default EStoreItem;
