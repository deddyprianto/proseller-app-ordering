const useCalculation = () => {
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

  return {
    calculateVoucher,
    calculateVoucherPoint,
    calculationAmountPaidByVisa,
  };
};

export default useCalculation;
