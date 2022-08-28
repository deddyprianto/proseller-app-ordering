/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import appConfig from '../../../config/appConfig';

import Theme from '../../../theme';

const useStyle = () => {
  const theme = Theme();
  const result = StyleSheet.create({});
  return result;
};

const ProductPromotions = ({productPromotions}) => {
  const theme = Theme();

  const WIDTH = Dimensions.get('window').width;
  const renderProductPromotionItem = promotion => {
    return (
      <ImageBackground
        source={appConfig.imagePromotionBackground}
        style={{
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
        imageStyle={{
          borderRadius: 8,
        }}
        resizeMode="stretch">
        <View>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize[12],
              fontFamily: theme.fontFamily.poppinsSemiBold,
            }}>
            On Promotion
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.fontSize[16],
              fontFamily: theme.fontFamily.poppinsSemiBold,
            }}>
            {promotion?.name}
          </Text>
        </View>
      </ImageBackground>
    );
  };

  const renderProductPromotions = () => {
    const results = productPromotions.map(promotion => {
      return renderProductPromotionItem(promotion);
    });

    return results;
  };

  return (
    <View
      style={{
        width: WIDTH,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
      }}>
      {renderProductPromotions()}
    </View>
  );
};

export default ProductPromotions;
