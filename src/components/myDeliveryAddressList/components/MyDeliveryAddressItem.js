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
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  textEdit: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
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
});

const ProductCart = ({item}) => {
  const renderDividerDashed = () => {
    return (
      <Text style={styles.dividerDashed}>
        _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
      </Text>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={{fontSize: 12, fontWeight: 'bold'}}>
          Jon Doe - 0812345678
        </Text>
        <Text style={{fontSize: 12, color: colorConfig.primaryColor}}>
          Default
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Text style={{fontSize: 12}}>137 Market St Singapore 048943</Text>
      </View>
    );
  };

  const renderLocationPinned = () => {
    return (
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <MaterialIcons
          style={{color: colorConfig.primaryColor}}
          name="location-on"
        />
        <Text style={{fontSize: 10, color: colorConfig.primaryColor}}>
          Location Already Pinned
        </Text>
      </View>
    );
  };

  const renderEditButton = () => {
    return (
      <View style={styles.viewEdit}>
        <MaterialIcons style={styles.iconEdit} name="edit" />
        <Text style={styles.textEdit}>Edit</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderLocationPinned()}
        {renderEditButton()}
      </View>
    );
  };
  return (
    <View style={styles.root}>
      {renderHeader()}
      <View style={{marginTop: 8}} />
      {renderBody()}
      <View style={{marginTop: 8}} />
      {renderDividerDashed()}
      <View style={{marginTop: 16}} />
      {renderFooter()}
    </View>
  );
};

export default ProductCart;
