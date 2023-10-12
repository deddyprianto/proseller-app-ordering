import React from 'react';
import {Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import UUIDGenerator from 'react-native-uuid-generator';
import {useDispatch, useSelector} from 'react-redux';
import {registerCard} from '../../actions/payment.actions';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {getDeliveryProviderAndFee} from '../../actions/order.action';

const usePayment = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );
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

  const getDeliveryProviderFee = async orderActionDate => {
    setIsLoading(true);
    try {
      const userDecrypt = CryptoJS.AES.decrypt(
        userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      const user = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

      const deliveryAddressDefault = user?.deliveryAddress.find(
        address => address.isDefault,
      );

      const address = user?.selectedAddress || deliveryAddressDefault;
      const cartId = basket?.cartID;
      const outletId = basket?.outlet?.id;

      const payload = {
        deliveryAddress: address,
        outletId,
        cartID: cartId,
        orderActionDate,
      };

      const result = await dispatch(getDeliveryProviderAndFee(payload));
      console.log({result, payload}, 'result');
      setIsLoading(false);
      return result;
    } catch (e) {
      setIsLoading(false);
      console.log(e, 'eman');
      return null;
    }
  };

  return {
    registerCardHook,
    isLoading,
    mapVoucherPaymentCheck,
    getDeliveryProviderFee,
  };
};

export default usePayment;
