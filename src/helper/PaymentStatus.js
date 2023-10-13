export const handlePaymentStatus = status => {
  const processing = 'PROCESSING';
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'AWAITING PAYMENT';
    case 'PENDING_PICK':
      return processing;
    case 'PICKING':
      return processing;
    case 'PENDING_PACK':
      return processing;
    case 'PACKING':
      return processing;
    default:
      return status?.replace(/_/g, ' ');
  }
};
