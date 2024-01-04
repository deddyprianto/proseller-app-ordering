import React from 'react';

const additionalSetting = () => {
  const additionalPolicy = [];
  const mapType = 'map';
  const showPaymentMethodOnProfile = false;
  const storeLocationProfile = true;
  const enableSentry = false;
  const applicationName = 'Acemart';
  const cartVersion = 'basic';
  const registerVersion = 1;
  const enableScanAndGo = false;
  const enableAddItemToCart = true;
  const showExpiryMembership = true;
  const hideLabelForSingleOutlet = true;
  const textRedeemVoucher = 'Reedemable Vouchers';
  const isUsingValidityDays = true;
  const enableUpcaScanner = false;
  const maxVoucherInOneTransaction = null;
  const enableScannerButton = true;
  const isAutoSelectDeliveryProviderType = false;
  const popupNotificationTextAlign = 'left';
  const showForfeitedItemInTransaction = false;
  const showSKU = false;

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
    showSKU,
  };
};

export default additionalSetting;
