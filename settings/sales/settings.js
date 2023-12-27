const additionalSetting = () => {
  const additionalPolicy = [];
  const mapType = 'dropdown';
  const showPaymentMethodOnProfile = false;
  const storeLocationProfile = false;
  const enableSentry = false;
  const applicationName = 'Sales Demo';
  const cartVersion = 'advance';
  const registerVersion = 2;
  const enableScanAndGo = true;
  const enableAddItemToCart = true;
  const showExpiryMembership = false;
  const hideLabelForSingleOutlet = false;
  const textRedeemVoucher = 'Available Voucher';
  const isUsingValidityDays = false;
  const enableUpcaScanner = false;
  const maxVoucherInOneTransaction = 1;
  const enableScannerButton = true;
  const isAutoSelectDeliveryProviderType = true;
  const popupNotificationTextAlign = 'left';
  const showForfeitedItemInTransaction = false;

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
    enableUpcaScanner,
    maxVoucherInOneTransaction,
    enableScannerButton,
    isAutoSelectDeliveryProviderType,
    popupNotificationTextAlign,
    showForfeitedItemInTransaction,
  };
};

export default additionalSetting;
