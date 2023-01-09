/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {View, Text, Image, TouchableOpacity} from 'react-native';

import Theme from '../../theme';

import OrderHistoryDetailListItem from './components/OrderHistoryDetailListItem';

import appConfig from '../../config/appConfig';

const useStyles = () => {
  const theme = Theme();
  const style = {
    root: {
      backgroundColor: 'white',
      elevation: 5,
      padding: 16,
      borderRadius: 8,
    },
    divider: {
      width: '100%',
      height: 0.5,
      backgroundColor: theme.colors.divider,
      marginVertical: 16,
    },
    touchableHide: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    textItem: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textHide: {
      marginRight: 8,
      color: theme.colors.text1,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    viewIcon: {
      width: 12,
      height: 12,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    viewHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    icon: {
      width: 9,
      height: 9,
      tintColor: 'white',
    },
  };
  return style;
};

const OrderHistoryDetailList = ({products}) => {
  const styles = useStyles();
  const [isHide, setIsHide] = useState(true);

  const handleProductMore = () => {
    let results = [];
    if (isHide) {
      results.push(products[0]);
    } else {
      results = products;
    }

    return results;
  };

  const renderDivider = ({items, index}) => {
    if (index !== items.length - 1) {
      return <View style={styles.divider} />;
    }
  };

  const renderProducts = () => {
    const items = handleProductMore();
    const result = items.map((item, index) => {
      return (
        <View>
          <OrderHistoryDetailListItem item={item} />
          {renderDivider({items, index})}
        </View>
      );
    });

    return result;
  };

  const handleButtonClick = value => {
    setIsHide(!value);
  };

  const renderHideButton = () => {
    const moreItemLength = products.length - 1;
    if (moreItemLength) {
      const text = isHide ? `${moreItemLength} More Item` : 'hide';
      const image = isHide ? appConfig.iconArrowDown : appConfig.iconArrowUp;

      return (
        <TouchableOpacity
          onPress={() => {
            handleButtonClick(isHide);
          }}
          style={styles.touchableHide}>
          <Text style={styles.textHide}>{text}</Text>
          <View style={styles.viewIcon}>
            <Image source={image} style={styles.icon} />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        <Text style={styles.textItem}>Items</Text>
        {renderHideButton()}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderHeader()}
      {renderProducts()}
    </View>
  );
};

export default OrderHistoryDetailList;
