import {useSelector, useDispatch} from 'react-redux';
import additionalSetting from '../../config/additionalSettings';
import {navigate} from '../../utils/navigation.utils';
import orderingModes from '../../helper/orderingModes';
import {changeOrderingMode} from '../../actions/order.action';
import appConfig from '../../config/appConfig';

const useSettings = () => {
  const priority_key_mandatory = 'SetLowerPriorityAsMandatory';
  const dispatch = useDispatch();

  const orderSetting = useSelector(
    state => state.orderReducer?.orderingSetting?.orderingSetting?.settings,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const outlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
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

  const useCartVersion = async params => {
    const isFEF = appConfig.appName === 'fareastflora';
    if (basket?.isStoreCheckoutCart && isFEF) {
      const findStoreCheckout = orderingModes(outlet)?.find(
        data => data.key === 'STORECHECKOUT',
      );

      if (findStoreCheckout) {
        dispatch(
          changeOrderingMode({
            orderingMode: findStoreCheckout.key,
          }),
        );
      }
    }

    if (additionalSetting().cartVersion === 'basic') {
      navigate('cart', params);
    } else if (additionalSetting().cartVersion === 'advance') {
      navigate('cartStep1', {step: 1, ...params});
    } else {
      navigate('cart', params);
    }
  };

  const checkMinimumAge = () => {
    if (orderSetting && Array.isArray(orderSetting)) {
      const minimumAge = orderSetting?.find(
        setting => setting.settingKey === 'MinimumAge',
      );

      return minimumAge;
    }
    return {minimumAge: {}};
  };

  const checkLowerPriorityMandatory = () => {
    const findPriority = orderSetting.find(
      data => data.settingKey === priority_key_mandatory,
    );
    return findPriority?.settingValue === true;
  };

  return {
    checkTncPolicyData,
    useCartVersion,
    checkMinimumAge,
    checkLowerPriorityMandatory,
  };
};

export default useSettings;
