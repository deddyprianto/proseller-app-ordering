import {useSelector} from 'react-redux';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import moment from 'moment';
const useCalculation = () => {
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const calculateVoucher = (vouchers = []) => {
    const amountVoucherArr = vouchers
      ?.filter(voucher => !voucher?.isPoint)
      ?.map(voucher => voucher?.paymentAmount);
    if (amountVoucherArr?.length > 0) {
      const totalVoucher = amountVoucherArr?.reduce((a, b) => a + b);
      return totalVoucher;
    }
    return 0;
  };

  const calculatePoint = (points = []) => {
    const amountPointArr = points
      ?.filter(voucher => voucher?.isPoint)
      ?.map(voucher => voucher?.paymentAmount);
    if (amountPointArr?.length > 0) {
      const totalVoucher = amountPointArr?.reduce((a, b) => a + b);
      return totalVoucher;
    }
    return 0;
  };

  const calculateVoucherPoint = (vouchers = []) => {
    const amountVoucherArr = vouchers?.map(voucher => voucher?.paymentAmount);
    if (amountVoucherArr?.length > 0) {
      const totalVoucher = amountVoucherArr?.reduce((a, b) => a + b);
      return totalVoucher;
    }
    return 0;
  };

  const calculationAmountPaidByVisa = (
    grandTotal,
    voucherPoint = [],
    totalPointVoucher = 0,
  ) => {
    let total = grandTotal;
    if (voucherPoint?.length > 0) {
      total -= totalPointVoucher;
    }

    if (total < 0) {
      return 0;
    }
    return total?.toFixed(2);
  };

  const checkTaxHandle = basket => {
    if (basket?.inclusiveTax > 0 && basket?.exclusiveTax > 0) {
      return {
        text: 'Tax',
        value: CurrencyFormatter(basket?.totalTaxAmount),
      };
    }
    if (basket?.inclusiveTax > 0) {
      return {
        text: 'Incl. Tax',
        value: CurrencyFormatter(basket?.inclusiveTax),
      };
    }

    if (basket?.exclusiveTax > 0) {
      return {
        text: 'Excl. Tax',
        value: CurrencyFormatter(basket?.exclusiveTax),
      };
    }
    return {
      text: null,
      value: null,
    };
  };

  const checkTaxInclusive = data => {
    if (data?.inclusiveTax > 0) {
      return {
        text: 'Incl. Tax',
        value: CurrencyFormatter(data?.inclusiveTax),
      };
    }
    return {
      text: null,
      value: null,
    };
  };

  const checkTaxExclusive = data => {
    if (data?.exclusiveTax > 0) {
      return {
        text: 'Excl. Tax',
        value: CurrencyFormatter(data?.exclusiveTax),
      };
    }
    return {
      text: null,
      value: null,
    };
  };

  const calculatePriceAferDiscount = () => {
    return basket?.totalNettAmount || 0;
  };

  const removePointAmount = (payload = []) => {
    const mappingNewPayload = payload?.map(data => {
      if (data?.isPoint) {
        return {isPoint: true};
      }
      return {...data};
    });

    return mappingNewPayload;
  };

  const isDeliveryAvailable = (maxDate, date) => {
    const maxDateUnix = moment(maxDate).unix();
    const dateUnix = moment(date).unix();
    return dateUnix <= maxDateUnix;
  };

  const calculationModifierPrice = (modifiers = [], qty) => {
    const mappingPrice = modifiers.map(price => {
      return mappingChildren(price?.modifier?.details, qty);
    });
    if (mappingPrice.length > 0) {
      return mappingPrice?.reduce((a, b) => a + b);
    }
  };

  const mappingChildren = (modifier = [], qty) => {
    const mapModifier = modifier.map(data => data.price);
    const amountPrice = mapModifier?.reduce((a, b) => a + b);
    return amountPrice * qty;
  };

  return {
    calculateVoucher,
    calculateVoucherPoint,
    calculationAmountPaidByVisa,
    checkTaxHandle,
    calculatePriceAferDiscount,
    calculatePoint,
    removePointAmount,
    checkTaxInclusive,
    checkTaxExclusive,
    isDeliveryAvailable,
    calculationModifierPrice,
  };
};

export default useCalculation;
