import React from 'react';

const additionalSetting = () => {
  const additionalPolicy = [];
  const mapType = 'map';
  const showPaymentMethodOnProfile = false;
  const storeLocationProfile = true;
  const enableSentry = false;
  const applicationName = 'Funtoast';
  const cartVersion = 'basic';
  const registerVersion = 1;
  const enableScanAndGo = false;
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
  };
};

export default additionalSetting;
