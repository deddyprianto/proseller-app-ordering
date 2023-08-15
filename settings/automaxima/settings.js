import React from 'react';

const additionalSetting = () => {
  const additionalPolicy = [];
  const mapType = 'map';
  const showPaymentMethodOnProfile = false;
  const storeLocationProfile = true;
  const applicationName = 'Automaxima';

  return {
    additionalPolicy,
    mapType,
    showPaymentMethodOnProfile,
    storeLocationProfile,
    applicationName,
  };
};

export default additionalSetting;
