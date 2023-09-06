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
  return {
    calculateVoucher,
    calculateVoucherPoint,
  };
};

export default useCalculation;
