import React from 'react';
import DeliveryPolicy from '../../src/assets/svg/DeliveryPolicySvg';
import RefundSvg from '../../src/assets/svg/RefundSvg';
import PolicySvg from '../../src/assets/svg/PolicySvg';

const additionalSetting = () => {
  const additionalPolicy = [
    {
      id: 1,
      name: 'Delivery and Pickup Policy',
      link:
        'https://appsmith.equipweb.biz/app/privacy-policy/delivery-policy-64ae72ebf6a34d0fa121472a?embed=true',
      icon: () => <DeliveryPolicy />,
      show: true,
    },
    {
      id: 2,
      name: 'Exchange and Refund Policy',
      link: null,
      icon: () => <RefundSvg />,
      show: true,
    },
    {
      id: 4,
      name: 'Privacy Policy',
      link:
        'https://appsmith.equipweb.biz/app/privacy-policy/page1-64a3854677e5e62a68d1d598?embed=true',
      icon: () => <PolicySvg />,
      show: true,
    },
  ];
  const mapType = 'dropdown';
  const showPaymentMethodOnProfile = true;
  const storeLocationProfile = true;

  return {
    additionalPolicy,
    mapType,
    showPaymentMethodOnProfile,
    storeLocationProfile,
  };
};

export default additionalSetting;
