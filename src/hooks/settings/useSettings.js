import {useSelector} from 'react-redux';
import additionalSetting from '../../config/additionalSettings';
import {Actions} from 'react-native-router-flux';

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

  const useCartVersion = params => {
    if (additionalSetting().cartVersion === 'basic') {
      Actions.cart(params);
    } else if (additionalSetting().cartVersion === 'advance') {
      Actions.cartStep1({step: 1, ...params});
    } else {
      Actions.cart(params);
    }
  };

  const checkMinimumAge = () => {
    if (orderSetting && Array.isArray(orderSetting)) {
      const minimumAge = orderSetting.find(
        setting => setting.settingKey === 'MinimumAge',
      );
      console.log({minimumAge}, 'hebat');
      return minimumAge;
    }
    return {minimumAge: {}};
  };

  return {
    checkTncPolicyData,
    useCartVersion,
    checkMinimumAge,
  };
};

export default useSettings;
