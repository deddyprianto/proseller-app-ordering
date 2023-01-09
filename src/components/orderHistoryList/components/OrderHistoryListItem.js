/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import moment from 'moment';
import React from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import {Actions} from 'react-native-router-flux';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
      marginHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dividerDashed: {
      width: 15,
      height: 17,
      alignItems: 'center',
    },
    flexRowCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textError: {
      color: theme.colors.textError,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewOrderingMode: {
      backgroundColor: '#FFEBEB',
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconLocationOutlet: {
      width: 15,
      height: 15,
      marginRight: 4,
      tintColor: theme.colors.accent,
    },
    iconLocationAddress: {
      width: 15,
      height: 15,
      marginRight: 4,
      tintColor: theme.colors.brandPrimary,
    },
  });
  return styles;
};

const OrderHistoryListItem = ({history, type}) => {
  const styles = useStyles();

  const renderDate = () => {
    const today = moment().format('DD-MM-YYYY');
    const date = moment(history?.transactionDate).format('DD-MM-YYYY');
    const time = moment(history?.transactionDate).format('hh:mm A');
    const dateFormatted = moment(history?.transactionDate).format(
      'DD-MM-YYYY, hh:mm A',
    );

    if (today === date) {
      return <Text style={styles.text}>Today, {time}</Text>;
    } else {
      return <Text style={styles.text}>{dateFormatted}</Text>;
    }
  };

  const renderOrderingMode = () => {
    const isCancel =
      history?.orderingMode === 'CANCELED' ||
      history?.orderingMode === 'REFUND';
    const styleText = isCancel ? styles.textError : styles.text;
    return (
      <View style={styles.viewOrderingMode}>
        <Text style={styleText}>{history?.orderingMode}</Text>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {renderDate()}
        {renderOrderingMode()}
      </View>
    );
  };

  const renderDividerVertical = () => {
    if (history?.deliveryAddress?.streetName) {
      return (
        <DashedLine
          style={styles.dividerDashed}
          dashLength={3}
          dashThickness={1}
          dashGap={2}
          dashColor="black"
          axis="vertical"
        />
      );
    }
  };

  const renderLocationOutlet = () => {
    if (history?.outlet?.name) {
      return (
        <View style={styles.flexRowCenter}>
          <Image
            style={styles.iconLocationOutlet}
            source={appConfig.iconLocation}
          />
          <Text style={styles.text}>{history?.outlet?.name}</Text>
        </View>
      );
    }
  };

  const renderLocationCustomer = () => {
    if (history?.deliveryAddress?.streetName) {
      return (
        <View style={styles.flexRowCenter}>
          <Image
            style={styles.iconLocationAddress}
            source={appConfig.iconLocation}
          />
          <Text style={styles.text}>
            {history?.deliveryAddress?.streetName}
          </Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        Actions.orderHistoryDetail({history});
      }}>
      {renderHeader()}
      {renderLocationOutlet()}
      {renderDividerVertical()}
      {renderLocationCustomer()}
    </TouchableOpacity>
  );
};

export default OrderHistoryListItem;
