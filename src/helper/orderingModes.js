const orderingModes = (outlet) => {
  if (!outlet) {
    return [];
  }

  const modes = [
    {
      key: 'STOREPICKUP',
      isEnabledFieldName: 'enableStorePickUp',
      displayName: outlet.storePickUpName || 'Store Pick Up',
    },
    {
      key: 'DELIVERY',
      isEnabledFieldName: 'enableDelivery',
      displayName: outlet.deliveryName || 'Delivery',
    },
    {
      key: 'TAKEAWAY',
      isEnabledFieldName: 'enableTakeAway',
      displayName: outlet.takeAwayName || 'Take Away',
    },
    {
      key: 'DINEIN',
      isEnabledFieldName: 'enableDineIn',
      displayName: outlet.dineInName || 'Dine In',
    },
    {
      key: 'STORECHECKOUT',
      isEnabledFieldName: 'enableStoreCheckOut',
      displayName: outlet.storeCheckOutName || 'Store Checkout',
    },
  ];

  return modes;
};

export default orderingModes;
