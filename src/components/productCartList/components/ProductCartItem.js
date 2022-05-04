/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colorConfig from '../../../config/colorConfig';

const styles = StyleSheet.create({
  root: {
    elevation: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 62,
    width: 62,
  },
  textAddOn: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#B7B7B7',
  },
  textProductHeaderQty: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  textProductHeaderName: {
    fontSize: 12,
    fontWeight: '500',
  },
  textProductHeaderPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: colorConfig.primaryColor,
  },
  textModifierItemQty: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colorConfig.primaryColor,
  },
  textModifierItemName: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#B7B7B7',
  },
  textModifierItemPrice: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colorConfig.primaryColor,
  },
  textPriceFooter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorConfig.primaryColor,
  },
  textEdit: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  textBullet: {
    fontSize: 6,
    color: '#D6D6D6',
  },
  viewProductHeaderQty: {
    paddingVertical: 3,
    paddingHorizontal: 4.5,
    borderRadius: 5,
    backgroundColor: colorConfig.primaryColor,
  },
  viewProductHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProductModifierItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  viewBullet: {
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  viewEdit: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 50,
  },
  iconEdit: {
    fontSize: 10,
    color: 'white',
    marginRight: 2,
  },
  dividerDashed: {
    textAlign: 'center',
    color: colorConfig.primaryColor,
  },
  width80: {width: '80%'},
});

const ProductCart = ({item}) => {
  const renderDividerDashed = () => {
    return (
      <Text style={styles.dividerDashed}>
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
      </Text>
    );
  };

  const renderProductHeader = () => {
    return (
      <View style={styles.viewProductHeader}>
        <View style={styles.viewProductHeaderQty}>
          <Text style={styles.textProductHeaderQty}>1x</Text>
        </View>
        <View style={{marginRight: 8}} />
        <Text style={styles.textProductHeaderName}>Laksa (Prawns)</Text>
        <View style={{marginRight: 8}} />
        <Text style={styles.textProductHeaderPrice}>+ 6.0</Text>
      </View>
    );
  };

  const renderProductModifierItem = ({qty, name, price}) => {
    return (
      <View style={styles.viewProductModifierItem}>
        <View style={styles.viewBullet}>
          <Text style={styles.textBullet}>{'\u2B24'}</Text>
        </View>

        <Text>
          <Text style={styles.textModifierItemQty}>{qty}x</Text>
          <Text style={styles.textModifierItemName}> {name} </Text>
          <Text style={styles.textModifierItemPrice}>+{price}</Text>
        </Text>
      </View>
    );
  };
  const renderProductModifier = () => {
    return (
      <View>
        <Text style={styles.textAddOn}>Add-On for laksa</Text>
        <View style={{marginTop: 4}} />
        {renderProductModifierItem({
          qty: 1,
          name: 'Choice of Noodles: Yellow Mee & Vemicelli',
          price: 1.8,
        })}
      </View>
    );
  };

  const renderValue = () => {
    return (
      <View style={styles.width80}>
        {renderProductHeader()}
        <View style={{marginTop: 8}} />
        {renderProductModifier()}
      </View>
    );
  };

  const renderImage = () => {
    return (
      <View>
        <Image
          style={styles.image}
          resizeMode="stretch"
          source={{uri: item.image}}
        />
      </View>
    );
  };
  return (
    <View style={styles.root}>
      <View style={styles.body}>
        {renderValue()}
        {renderImage()}
      </View>
      {renderDividerDashed()}
      <View style={{marginTop: 16}} />
      <View style={styles.footer}>
        <View style={styles.viewEdit}>
          <MaterialIcons style={styles.iconEdit} name="edit" />
          <Text style={styles.textEdit}>Edit</Text>
        </View>
        <Text style={styles.textPriceFooter}>9.10</Text>
      </View>
    </View>
  );
};

export default ProductCart;
