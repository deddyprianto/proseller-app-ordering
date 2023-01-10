/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {Actions} from 'react-native-router-flux';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Theme from '../../theme';
import {isEmptyArray} from '../../helper/CheckEmpty';
import appConfig from '../../config/appConfig';
import CurrencyFormatter from '../../helper/CurrencyFormatter';

const useStyles = value => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      position: 'absolute',
      bottom: 32,
      width: '100%',
      paddingHorizontal: 16,
    },
    viewButtonCart: {
      elevation: 2,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      padding: 14,
      justifyContent: 'space-between',
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.buttonActive,
    },
    viewIconAndTextCart: {
      display: 'flex',
      flexDirection: 'row',
    },
    textPriceButtonCart: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textButtonCart: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 7,
      color: theme.colors.textSecondary,
    },
    iconRedDot: {
      borderRadius: 8,
      height: 10,
      width: 10,
      position: 'absolute',
      top: 0,
      right: 4,
      backgroundColor: theme.colors.semanticError,
    },
  });
  return styles;
};

const FloatingButtonCart = ({basket}) => {
  const styles = useStyles();

  const renderIconCart = () => {
    return (
      <View>
        <Image source={appConfig.iconCart} style={styles.icon} />
        <View style={styles.iconRedDot} />
      </View>
    );
  };

  const renderTextCart = () => {
    return (
      <Text style={styles.textButtonCart}>
        {basket?.details?.length} Items in Cart
      </Text>
    );
  };

  const renderIconAndTextCart = () => {
    return (
      <View style={styles.viewIconAndTextCart}>
        {renderIconCart()}
        {renderTextCart()}
      </View>
    );
  };

  const renderTextTotal = () => {
    return (
      <Text style={styles.textPriceButtonCart}>
        {CurrencyFormatter(basket?.totalNettAmount)}
      </Text>
    );
  };

  if (isEmptyArray(basket?.details)) {
    return null;
  }

  return (
    <View style={styles.root}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.viewButtonCart}
        onPress={() => {
          Actions.cart();
        }}>
        {renderIconAndTextCart()}
        {renderTextTotal()}
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButtonCart;
