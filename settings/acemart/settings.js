import React from 'react';

const additionalSetting = () => {
  const additionalPolicy = [];
  const mapType = 'map';
  const showPaymentMethodOnProfile = false;
  const storeLocationProfile = true;
  const applicationName = 'Acemart';

  return {
    additionalPolicy,
    mapType,
    showPaymentMethodOnProfile,
    storeLocationProfile,
    applicationName,
  };
};

export default additionalSetting;
