import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {Actions} from 'react-native-router-flux';
import appConfig from '../../config/appConfig';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {isEmptyArray} from '../../helper/CheckEmpty';
import Theme from '../../theme';
import useSettings from '../../hooks/settings/useSettings';
import useCalculation from '../../hooks/calculation/useCalculation';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      position: 'absolute',
      bottom: 32,
      width: '100%',
      paddingHorizontal: 16,
    },
    textButtonCart: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPriceButtonCart: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
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
    icon: {
      width: 24,
      height: 24,
      marginRight: 7,
    },
    iconDot: {
      width: 10,
      height: 10,
      position: 'absolute',
      borderRadius: 50,
      right: 5,
      backgroundColor: theme.colors.semanticError,
    },
  });
  return styles;
};

const ButtonCartFloating = () => {
  const styles = useStyles();

  const [basketLength, setBasketLength] = useState(0);
  const {calculatePriceAferDiscount} = useCalculation();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const {useCartVersion} = useSettings();
  useEffect(() => {
    let length = 0;
    if (basket && basket.details) {
      basket.details.forEach(cart => {
        length += cart.quantity;
      });
    }
    setBasketLength(length);
  }, [basket]);

  const renderCartIcon = () => {
    return (
      <View>
        <Image source={appConfig.iconCart} style={styles.icon} />
        <View style={styles.iconDot} />
      </View>
    );
  };

  const renderQty = () => {
    return (
      <View style={styles.viewIconAndTextCart}>
        {renderCartIcon()}
        <Text style={styles.textButtonCart}>{basketLength} Items in Cart</Text>
      </View>
    );
  };
  const renderPrice = () => {
    const amount = calculatePriceAferDiscount();
    return (
      <Text style={styles.textPriceButtonCart}>
        {CurrencyFormatter(amount)}
      </Text>
    );
  };

  const renderButtonCart = () => {
    if (!isEmptyArray(basket?.details)) {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.viewButtonCart}
          onPress={useCartVersion}>
          {renderQty()}
          {renderPrice()}
        </TouchableOpacity>
      );
    }
  };
  return <View style={styles.root}>{renderButtonCart()}</View>;
};

export default ButtonCartFloating;
