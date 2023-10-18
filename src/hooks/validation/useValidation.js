import {useSelector} from 'react-redux';

const useValidation = () => {
  const customField = useSelector(
    state => state.userReducer?.customFields?.fields,
  );
  const provider = useSelector(
    state => state.orderReducer.dataBasket?.product?.provider,
  );
  const selectedCustomField = useSelector(
    state => state.orderReducer?.deliveryCustomField,
  );

  const isValidEmail = email => {
    const regexp = /^[\w][\w-+\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regexp.test(email);
  };

  const findReferralCodeSetting = () => {
    const findField = customField?.find(
      field => field.fieldName === 'referralCode',
    );
    if (findField) {
      return findField;
    }
    return {};
  };

  const checkCustomField = () => {
    let disableButton = false;
    const filter = provider?.customFields?.filter(data => data?.isMandatory);
    if (filter?.length > 0) {
      filter?.forEach(data => {
        if (!selectedCustomField.deliveryCustomField?.[data?.value]) {
          disableButton = true;
        }
      });
    }
    return disableButton;
  };

  return {
    isValidEmail,
    findReferralCodeSetting,
    checkCustomField,
  };
};

export default useValidation;
