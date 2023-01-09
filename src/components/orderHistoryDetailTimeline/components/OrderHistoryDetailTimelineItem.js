/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';

import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';
import DashedLine from 'react-native-dashed-line';
import moment from 'moment';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      height: 'auto',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    textInfoTitle: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textInfoDescription: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textDate: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    viewProgress: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    viewInfo: {
      flex: 1,
      marginBottom: 16,
    },
    viewDashedLine: {
      width: 15,
      height: 15,
      tintColor: 'white',
    },
    viewIconCompleted: {
      width: 15,
      height: 15,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      backgroundColor: theme.colors.primary,
    },
    viewIconInProgress: {
      width: 15,
      height: 15,
      borderRadius: 100,
      backgroundColor: theme.colors.thirdColor,
      padding: 4,
      marginHorizontal: 16,
    },
    iconCheck: {
      width: 15,
      height: 15,
      tintColor: 'white',
    },
    iconInProgress: {
      width: 7,
      height: 7,
      borderRadius: 100,
      backgroundColor: theme.colors.primary,
    },
  });
  return styles;
};

const OrderHistoryDetailTimelineItem = ({item, index, lastIndex, isActive}) => {
  const styles = useStyles();

  const renderDate = () => {
    const time = moment(item?.date).format('hh:mm A');
    return <Text style={styles.textDate}>{time}</Text>;
  };

  const renderIconInProgress = () => {
    return (
      <View style={styles.viewIconInProgress}>
        <View style={styles.iconInProgress} />
      </View>
    );
  };
  const renderIconCompleted = () => {
    return (
      <View style={styles.viewIconCompleted}>
        <Image source={appConfig.iconCheck} style={styles.iconCheck} />
      </View>
    );
  };

  const renderIconProgress = () => {
    if (isActive) {
      return renderIconInProgress();
    } else {
      return renderIconCompleted();
    }
  };
  const renderDashedLineVertical = () => {
    if (index !== lastIndex || index === 0) {
      return (
        <DashedLine
          style={styles.viewDashedLine}
          dashLength={3}
          dashThickness={1}
          dashGap={2}
          dashColor="red"
          axis="vertical"
        />
      );
    }
  };

  const renderProgress = () => {
    return (
      <View style={styles.viewProgress}>
        {renderIconProgress()}
        {renderDashedLineVertical()}
      </View>
    );
  };

  const renderInfo = () => {
    return (
      <View style={styles.viewInfo}>
        <Text style={styles.textInfoTitle}>{item?.title}</Text>
        <Text style={styles.textInfoDescription}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderDate()}
      {renderProgress()}
      {renderInfo()}
    </View>
  );
};

export default OrderHistoryDetailTimelineItem;
