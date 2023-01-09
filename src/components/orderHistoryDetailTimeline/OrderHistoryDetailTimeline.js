/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {View, Text, Image, TouchableOpacity} from 'react-native';

import Theme from '../../theme';

import appConfig from '../../config/appConfig';
import OrderHistoryDetailTimelineItem from './components/OrderHistoryDetailTimelineItem';

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

const OrderHistoryDetailTimeline = ({trackingHistory, orderHistoryStatus}) => {
  const styles = useStyles();
  const [isHide, setIsHide] = useState(true);

  const handleTrackingHistoryMore = () => {
    let results = [];
    const historyReversed = [];

    for (var i = trackingHistory.length - 1; i >= 0; i--) {
      historyReversed.push(trackingHistory[i]);
    }

    if (isHide) {
      results.push(historyReversed[0]);
    } else {
      results = historyReversed;
    }

    return results;
  };

  const handleButtonClick = value => {
    setIsHide(!value);
  };

  const renderTrackingHistories = () => {
    const items = handleTrackingHistoryMore();
    const result = items.map((item, index) => {
      const isActive = orderHistoryStatus === item.status;
      return (
        <OrderHistoryDetailTimelineItem
          item={item}
          index={index}
          lastIndex={items.length - 1}
          isActive={isActive}
        />
      );
    });

    return result;
  };

  const renderHideButton = () => {
    const text = isHide ? 'More' : 'Hide';
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
      {renderTrackingHistories()}
    </View>
  );
};

export default OrderHistoryDetailTimeline;
