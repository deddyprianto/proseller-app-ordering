import React from 'react';
import DeliveryPolicy from '../../src/assets/svg/DeliveryPolicySvg';
import RefundSvg from '../../src/assets/svg/RefundSvg';

const additionalSetting = () => {
  const additionalPolicy = [
    // {
    //   id: 1,
    //   name: 'Delivery and Pickup Policy',
    //   link:
    //     'https://appsmith.equipweb.biz/app/additional-policy/delivery-and-pickup-policy-64d9a3dfa3034153e03a23c7',
    //   icon: () => <DeliveryPolicy />,
    //   show: true,
    // },
    // {
    //   id: 2,
    //   name: 'Exchange and Refund Policy',
    //   link:
    //     'https://appsmith.equipweb.biz/app/exchangerefundpolicy-64a3854677e5e62a68d1d598?embed=true',
    //   icon: () => <RefundSvg />,
    //   show: true,
    // },
  ];
  const mapType = 'dropdown';
  const showPaymentMethodOnProfile = true;
  const storeLocationProfile = true;
  const enableSentry = true;
  const applicationName = 'Far East Flora';
  const cartVersion = 'advance';
  const registerVersion = 2;
  const enableScanAndGo = true;
  const enableAddItemToCart = true;
  const showExpiryMembership = false;
  const hideLabelForSingleOutlet = false;
  const textRedeemVoucher = 'Available Vouchers';
  const isUsingValidityDays = false;
  const enableUpcaScanner = false;
  const maxVoucherInOneTransaction = 1;
  const enableScannerButton = false;
  const isAutoSelectDeliveryProviderType = true;

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
  };
};

export default additionalSetting;
