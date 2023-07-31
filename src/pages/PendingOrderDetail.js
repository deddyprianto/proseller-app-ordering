/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {Actions} from 'react-native-router-flux';
import {StyleSheet, SafeAreaView} from 'react-native';

import colorConfig from '../config/colorConfig';

import {isEmptyArray} from '../helper/CheckEmpty';
import Header from '../components/layout/header';
import Theme from '../theme';
import OrderDetail from './OrderDetail';
const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'space-between',
    },
    container: {
      flex: 1,
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    textDetail: {
      fontSize: 12,
    },
    textDetailValue: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    textGrandTotal: {
      fontSize: 12,
    },
    textGrandTotalValue: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    textDetailGrandTotal: {
      fontSize: 14,
    },
    textDetailGrandTotalValue: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    textSeeDetails: {
      color: colorConfig.primaryColor,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    textCheckoutButton: {
      fontSize: 12,
      fontWeight: '500',
      color: 'white',
    },
    textMethod: {
      fontSize: 12,
      fontWeight: '500',
    },
    textMethodValue: {
      fontSize: 12,
      fontWeight: '500',
      color: colorConfig.primaryColor,
      textAlign: 'center',
    },
    textAddButton: {
      color: colorConfig.primaryColor,
      fontSize: 12,
    },
    textTotalDetails: {
      fontSize: 12,
    },
    viewDetailValueItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: '#D6D6D6',
    },
    viewDetailGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    viewCheckoutButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 0.2,
      borderTopColor: 'grey',
      padding: 16,
    },
    viewFooter: {
      backgroundColor: 'white',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      marginTop: -8,
    },
    viewMethod: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      marginTop: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewAddButton: {
      borderColor: colorConfig.primaryColor,
      borderWidth: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    viewGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewDetailHeader: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderColor: '#D6D6D6',
    },
    viewDetailValue: {
      paddingHorizontal: 16,
      marginTop: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      elevation: 1,
    },
    touchableMethod: {
      width: 120,
      borderRadius: 8,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colorConfig.primaryColor,
    },
    touchableCheckoutButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorConfig.primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 26,
    },
    touchableCheckoutButtonDisabled: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B7B7B7',
      paddingVertical: 10,
      paddingHorizontal: 26,
    },
    dividerDashed: {
      textAlign: 'center',
      color: colorConfig.primaryColor,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#D6D6D6',
    },
    iconArrowUp: {
      fontSize: 20,
      color: '#B7B7B7',
    },
    iconClose: {
      position: 'absolute',
      right: 20,
      fontSize: 16,
    },
  });
  return styles;
};

const PendingOrderDetail = ({order}) => {
  const styles = useStyles();

  if (isEmptyArray(order?.details)) {
    Actions.pop();
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Order Detail" />
      <OrderDetail data={order} />
    </SafeAreaView>
  );
};

export default PendingOrderDetail;
