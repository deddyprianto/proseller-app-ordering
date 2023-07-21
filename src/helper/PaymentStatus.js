export const handlePaymentStatus = status => {
  if (status === 'PENDING_PAYMENT') {
    return 'AWAITING PAYMENT';
  }
  return status.replace(/_/g, ' ');
};
