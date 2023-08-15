import {useSelector} from 'react-redux';

const useSettings = () => {
  const orderSetting = useSelector(
    state => state.orderReducer?.orderingSetting?.orderingSetting?.settings,
  );
  const checkTncPolicyData = () => {
    if (orderSetting && Array.isArray(orderSetting)) {
      const tnc = orderSetting.find(
        setting => setting.settingKey === 'TermCondition',
      );

      const privacy = orderSetting.find(
        setting => setting.settingKey === 'PrivacyPolicy',
      );
      return {tnc, privacy};
    }
    return {tnc: null, privacy: null};
  };

  return {
    checkTncPolicyData,
  };
};

export default useSettings;
