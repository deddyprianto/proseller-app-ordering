export const handlePaymentStatus = status => {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'AWAITING PAYMENT';
    default:
      return status.replace(/_/g, ' ');
  }
};
