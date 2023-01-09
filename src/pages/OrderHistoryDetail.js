/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import colorConfig from '../config/colorConfig';

import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

import currencyFormatter from '../helper/CurrencyFormatter';
import Header from '../components/layout/header';
import OrderHistoryDetailList from '../components/orderHistoryDetailList';
import OrderHistoryDetailTimeline from '../components/orderHistoryDetailTimeline';
import Theme from '../theme';
import {Actions} from 'react-native-router-flux';
import {isEmptyArray} from '../helper/CheckEmpty';
import moment from 'moment';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#F9F9F9',
    },
    body: {
      flex: 1,
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
    textCheckoutButton: {
      fontSize: 12,
      fontWeight: '500',
      color: 'white',
    },
    textOrderInfoTitle: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOrderInfoValue: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textRefNumberValue: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    viewOrderInfo: {
      padding: 16,
      elevation: 5,
      backgroundColor: 'white',
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 16,
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
    viewRefNumber: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.thirdColor,
      margin: 16,
      padding: 16,
      borderRadius: 8,
      elevation: 5,
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
    viewFooter: {
      backgroundColor: 'white',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      marginTop: -8,
    },
    viewGrandTotal: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewDetailComponent: {
      marginHorizontal: 16,
      marginBottom: 16,
    },
    viewDetailValue: {
      paddingHorizontal: 16,
    },
    touchableCheckoutButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colorConfig.primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 26,
    },
    iconArrowUp: {
      fontSize: 20,
      color: '#B7B7B7',
    },
    flexRowSpaceBetween: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
  return styles;
};

const OrderHistoryDetail = ({history}) => {
  const styles = useStyles();
  const [isDetail, setIsDetail] = useState(false);

  const handleCloseDetail = () => {
    setIsDetail(false);
  };

  const handleOpenDetail = () => {
    setIsDetail(true);
  };

  const renderRefNumber = () => {
    return (
      <View style={styles.viewRefNumber}>
        <Text style={styles.textOrderInfoTitle}>Ref. No</Text>
        <Text style={styles.textOrderInfoValue}>{history?.referenceNo}</Text>
      </View>
    );
  };

  const renderOrderingMode = () => {
    return (
      <View style={styles.flexRowSpaceBetween}>
        <Text style={styles.textOrderInfoTitle}>Ordering Mode</Text>
        <Text style={styles.textOrderInfoValue}>{history?.orderingMode}</Text>
      </View>
    );
  };

  const renderDateTime = () => {
    const date = moment(history?.transactionDate).format('DD-MM-YYYY');
    const time = moment(history?.transactionDate).format('hh:mm A');

    return (
      <View style={styles.flexRowSpaceBetween}>
        <Text style={styles.textOrderInfoTitle}>Date & Time</Text>
        <Text style={styles.textOrderInfoValue}>
          {date} at {time}
        </Text>
      </View>
    );
  };

  const renderOrderStatus = () => {
    return (
      <View style={styles.flexRowSpaceBetween}>
        <Text style={styles.textOrderInfoTitle}>Order Status</Text>
        <Text style={styles.textOrderInfoValue}>{history?.status}</Text>
      </View>
    );
  };

  const renderOrderInfo = () => {
    return (
      <View style={styles.viewOrderInfo}>
        {renderOrderingMode()}
        {renderDateTime()}
        {renderOrderStatus()}
      </View>
    );
  };

  const renderDetailTotal = () => {
    const {totalGrossAmount, totalDiscountAmount} = history;
    const subTotalAfterDiscount = totalGrossAmount - totalDiscountAmount;
    const subTotal = totalDiscountAmount
      ? subTotalAfterDiscount
      : totalGrossAmount;

    return (
      <View style={styles.viewDetailValueItem}>
        <Text style={styles.textDetail}>Total</Text>
        <Text style={styles.textDetailValue}>
          {currencyFormatter(subTotal)}
        </Text>
      </View>
    );
  };

  const renderDetailServiceCharge = () => {
    const {totalSurchargeAmount} = history;
    if (totalSurchargeAmount) {
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Service Charge</Text>
          <Text style={styles.textDetailValue}>
            {currencyFormatter(totalSurchargeAmount)}
          </Text>
        </View>
      );
    }
  };

  const renderDetailTax = () => {
    const {exclusiveTax} = history;
    if (exclusiveTax) {
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Tax</Text>
          <Text style={styles.textDetailValue}>
            {currencyFormatter(exclusiveTax)}
          </Text>
        </View>
      );
    }
  };

  const renderDetailDeliveryCost = () => {
    const {provider} = history;
    if (provider) {
      const cost = provider.deliveryFee || 'Free';
      return (
        <View style={styles.viewDetailValueItem}>
          <Text style={styles.textDetail}>Delivery Cost</Text>
          <Text style={styles.textDetailValue}>{currencyFormatter(cost)}</Text>
        </View>
      );
    }
  };

  const renderDetailGrandTotal = () => {
    const {totalNettAmount} = history;

    if (totalNettAmount) {
      return (
        <TouchableOpacity
          style={styles.viewDetailGrandTotal}
          onPress={() => {
            handleCloseDetail();
          }}>
          <Text style={styles.textDetailGrandTotal}>Grand Total</Text>
          <Text style={styles.textDetailGrandTotalValue}>
            {currencyFormatter(totalNettAmount)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderDetailHeader = () => {
    return (
      <View style={styles.viewDetailHeader}>
        <Text style={{fontSize: 12}}>Total Details</Text>
        <IconMaterialIcons
          onPress={() => {
            handleCloseDetail();
          }}
          name="close"
          style={{position: 'absolute', right: 20, fontSize: 16}}
        />
      </View>
    );
  };

  const renderDetail = () => {
    return (
      <View>
        {renderDetailHeader()}
        <View style={styles.viewDetailValue}>
          {renderDetailTotal()}
          {renderDetailDeliveryCost()}
          {renderDetailServiceCharge()}
          {renderDetailTax()}
          {renderDetailGrandTotal()}
        </View>
      </View>
    );
  };

  const renderGrandTotal = () => {
    const {totalNettAmount} = history;
    if (totalNettAmount) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleOpenDetail();
          }}>
          <Text style={styles.textGrandTotal}>Grand Total</Text>
          <View style={styles.viewGrandTotal}>
            <Text style={styles.textGrandTotalValue}>
              {currencyFormatter(totalNettAmount)}
            </Text>
            <IconMaterialIcons
              name="keyboard-arrow-up"
              style={styles.iconArrowUp}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderBuyAgainButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableCheckoutButton}
        onPress={() => {
          Actions.popTo('pageIndex');
        }}>
        <Text style={styles.textCheckoutButton}>Buy Again</Text>
      </TouchableOpacity>
    );
  };

  const renderBuyAgain = () => {
    return (
      <View style={styles.viewCheckoutButton}>
        {renderGrandTotal()}
        {renderBuyAgainButton()}
      </View>
    );
  };

  const renderFooter = () => {
    const result = isDetail ? renderDetail() : renderBuyAgain();

    return <View style={styles.viewFooter}>{result}</View>;
  };

  const renderTimeline = () => {
    if (!isEmptyArray(history?.orderTrackingHistory)) {
      return (
        <View style={styles.viewDetailComponent}>
          <OrderHistoryDetailTimeline
            trackingHistory={history?.orderTrackingHistory}
            orderHistoryStatus={history?.status}
          />
        </View>
      );
    }
  };

  const renderProductList = () => {
    return (
      <View style={styles.viewDetailComponent}>
        <OrderHistoryDetailList products={history?.details} />
      </View>
    );
  };
  const renderBody = () => {
    return (
      <ScrollView style={styles.body}>
        {renderRefNumber()}
        {renderOrderInfo()}
        {renderTimeline()}
        {renderProductList()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Order Detail" />
      {renderBody()}
      {renderFooter()}
    </SafeAreaView>
  );
};

export default OrderHistoryDetail;
