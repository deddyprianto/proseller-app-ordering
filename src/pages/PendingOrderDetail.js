/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {Actions} from 'react-native-router-flux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import colorConfig from '../config/colorConfig';

import ProductCartList from '../components/productCartList/ProductCartList';
import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';
import currencyFormatter from '../helper/CurrencyFormatter';
import Header from '../components/layout/header';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
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

const PendingOrderDetail = ({order}) => {
  const renderDetailTotal = () => {
    const {totalGrossAmount, totalDiscountAmount} = order;
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
    const {totalSurchargeAmount} = order;
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
    const {exclusiveTax} = order;
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
    const {provider} = order;
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
    const {totalNettAmount} = order;

    if (totalNettAmount) {
      return (
        <View style={styles.viewDetailGrandTotal}>
          <Text style={styles.textDetailGrandTotal}>Grand Total</Text>
          <Text style={styles.textDetailGrandTotalValue}>
            {currencyFormatter(totalNettAmount)}
          </Text>
        </View>
      );
    }
  };

  const renderOrderingType = () => {
    const orderingType =
      typeof order?.orderingMode === 'string' && order?.orderingMode;

    const orderingTypeValue = orderingType || 'Choose Type';

    return (
      <View style={styles.viewMethod}>
        <Text style={styles.textMethod}>Ordering Type</Text>
        <TouchableOpacity disabled style={styles.touchableMethod}>
          <Text style={styles.textMethodValue}>{orderingTypeValue}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryAddress = () => {
    if (order?.orderingMode === 'DELIVERY') {
      const deliveryAddressValue =
        order?.deliveryAddress?.streetName || 'Choose Type';

      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Delivery Address</Text>
          <TouchableOpacity style={styles.touchableMethod} disabled>
            <Text style={styles.textMethodValue}>{deliveryAddressValue}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderDeliveryProvider = () => {
    if (order?.orderingMode === 'DELIVERY') {
      const deliveryProviderValue = order?.provider?.name || 'Choose Provider';

      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Delivery Provider</Text>
          <TouchableOpacity style={styles.touchableMethod} disabled>
            <Text style={styles.textMethodValue}>{deliveryProviderValue}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderDeliveryDateText = () => {
    if (order?.orderActionDate) {
      return (
        <View>
          <Text style={styles.textMethodValue}>{order?.orderActionDate}</Text>
        </View>
      );
    } else {
      return <Text style={styles.textMethodValue}>Choose Date</Text>;
    }
  };
  const renderDeliveryDate = () => {
    if (
      order?.orderingMode === 'DELIVERY' ||
      order?.orderingMode === 'STOREPICKUP'
    ) {
      return (
        <View style={styles.viewMethod}>
          <Text style={styles.textMethod}>Delivery Date</Text>
          <TouchableOpacity style={styles.touchableMethod} disabled>
            {renderDeliveryDateText()}
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderOrderInfo = () => {
    return (
      <View style={styles.viewDetailValue}>
        {renderDetailTotal()}
        {renderDetailDeliveryCost()}
        {renderDetailServiceCharge()}
        {renderDetailTax()}
        {renderDetailGrandTotal()}
      </View>
    );
  };

  const renderBody = () => {
    if (!isEmptyObject(order)) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={{marginTop: 16}} />
            <ProductCartList orderDetail={order} disabled />
            <View style={styles.divider} />
            {renderOrderingType()}
            {renderDeliveryAddress()}
            {renderDeliveryProvider()}
            {renderDeliveryDate()}
            {renderOrderInfo()}
            <View style={{marginTop: 16}} />
          </ScrollView>
        </View>
      );
    }
  };

  if (isEmptyArray(order?.details)) {
    Actions.pop();
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Pending Order Detail" />
      {renderBody()}
    </SafeAreaView>
  );
};

export default PendingOrderDetail;
