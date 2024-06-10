const additionalSetting = () => {
  const additionalPolicy = [];
  const mapType = 'dropdown';
  const showPaymentMethodOnProfile = false;
  const storeLocationProfile = false;
  const enableSentry = false;
  const applicationName = 'Maison 66';
  const cartVersion = 'advance';
  const registerVersion = 2;
  const enableScanAndGo = true;
  const enableAddItemToCart = true;
  const showExpiryMembership = false;
  const hideLabelForSingleOutlet = false;
  const textRedeemVoucher = 'Available Voucher';
  const isUsingValidityDays = false;
  const maxVoucherInOneTransaction = 1;
  const enableScannerButton = true;
  const isAutoSelectDeliveryProviderType = true;
  const popupNotificationTextAlign = 'left';
  const showForfeitedItemInTransaction = false;
  const showBarcode = true;

  return {
    additionalPolicy,
    mapType,
    showPaymentMethodOnProfile,
    storeLocationProfile,
    enableSentry,
    applicationName,
    cartVersion,
    registerVersion,
    enableScanAndGo,
    enableAddItemToCart,
    showExpiryMembership,
    hideLabelForSingleOutlet,
    textRedeemVoucher,
    isUsingValidityDays,
    maxVoucherInOneTransaction,
    enableScannerButton,
    isAutoSelectDeliveryProviderType,
    popupNotificationTextAlign,
    showForfeitedItemInTransaction,
    showBarcode,
  };
};

export default additionalSetting;
