import React from 'react';
import {Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import UUIDGenerator from 'react-native-uuid-generator';
import {useDispatch} from 'react-redux';
import {registerCard} from '../../actions/payment.actions';
const usePayment = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const registerCardHook = async (page, item) => {
    if (item) {
      setIsLoading(true);
      try {
        const paymentID = item.paymentID;
        const referenceNo = await UUIDGenerator.getRandomUUID();
        const payload = {
          referenceNo,
          paymentID,
        };
        const response = await dispatch(registerCard(payload));
        if (response.success === true) {
          Actions.hostedPayment({
            url: response.response.data.url,
            data: response.response.data,
            page,
            from: item?.from,
          });
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } else {
          Alert.alert('Sorry', 'Cant add credit card, please try again');
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
        Alert.alert('Oppss..', 'Something went wrong, please try again.');
      }
    }
  };

  const mapVoucherPaymentCheck = (usedVoucher = []) => {
    const voucherMap = usedVoucher?.map(voucher => {
      if (voucher?.paymentType === 'point') {
        return {...voucher};
      }
      return {
        isVoucher: true,
        serialNumber: voucher?.serialNumber,
        voucherId: voucher?.id,
      };
    });
    return voucherMap;
  };

  return {
    registerCardHook,
    isLoading,
    mapVoucherPaymentCheck,
  };
};

export default usePayment;
