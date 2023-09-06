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
  TouchableOpacity,
} from 'react-native';

import Theme from '../../../theme';

import PromotionSvg from '../../../assets/svg/PromotionSvg';

import {Actions} from 'react-native-router-flux';

const WIDTH = Dimensions.get('window').width;

const useStyle = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    root: {
      width: WIDTH,
      paddingHorizontal: 16,
      paddingTop: 8,
      backgroundColor: theme.colors.background,
      borderTopColor: theme.colors.greyScale3,
      borderTopWidth: 1,
    },
    viewProductPromotionItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginBottom: 10,
      backgroundColor: theme.colors.brandPrimary,
    },
    viewProductPromotionItemName: {
      flex: 1,
      marginLeft: 8,
    },
    viewProductPromotionItemDetailButton: {
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.buttonActive,
      borderWidth: 1,
      borderColor: theme.colors.buttonStandBy,
    },
    textProductPromotionItemNameTitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textProductPromotionItemNameValue: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textProductPromotionItemDetailButton: {
      marginBottom: -1,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return result;
};

const ProductPromotions = ({productPromotions, disabled}) => {
  const styles = useStyle();

  const renderProductPromotionItemIcon = () => {
    return <PromotionSvg height={23} width={23} />;
  };

  const renderProductPromotionItemName = value => {
    return (
      <View style={styles.viewProductPromotionItemName}>
        <Text style={styles.textProductPromotionItemNameTitle}>
          On Promotion
        </Text>
        <Text style={styles.textProductPromotionItemNameValue}>
          {value?.name}
        </Text>
      </View>
    );
  };

  const renderProductPromotionItemDetailButton = () => {
    if (!disabled) {
      return (
        <View style={styles.viewProductPromotionItemDetailButton}>
          <Text style={styles.textProductPromotionItemDetailButton}>
            Details
          </Text>
        </View>
      );
    }
  };

  const renderProductPromotionItem = value => {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          Actions.promotionDetail({promotion: value});
        }}
        style={styles.viewProductPromotionItem}>
        {renderProductPromotionItemIcon()}
        {renderProductPromotionItemName(value)}
        {renderProductPromotionItemDetailButton(value)}
      </TouchableOpacity>
    );
  };

  const renderProductPromotions = () => {
    const results = productPromotions.map(value => {
      return renderProductPromotionItem(value);
    });

    return results;
  };

  return <View style={styles.root}>{renderProductPromotions()}</View>;
};

export default ProductPromotions;
