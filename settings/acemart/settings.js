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
  };
};

export default additionalSetting;
