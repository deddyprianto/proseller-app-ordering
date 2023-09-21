import {useSelector} from 'react-redux';

const useValidation = () => {
  const customField = useSelector(
    state => state.userReducer?.customFields?.fields,
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

  return {
    isValidEmail,
    findReferralCodeSetting,
  };
};

export default useValidation;
