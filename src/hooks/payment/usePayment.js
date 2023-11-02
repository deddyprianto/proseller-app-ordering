import React from 'react';
import {Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import UUIDGenerator from 'react-native-uuid-generator';
import {useDispatch, useSelector} from 'react-redux';
import {registerCard} from '../../actions/payment.actions';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {
  changeOrderingMode,
  getDeliveryProviderAndFee,
  saveDeliveryCustomField,
  updateProvider,
} from '../../actions/order.action';

const usePayment = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const orderingDate = useSelector(
    state =>
      state.orderReducer?.orderingDateTime?.orderingDateTimeSelected?.date,
  );
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

  const payloadDelivery = (orderActionDate, adjustedPayload) => {
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

    let payload = {
      deliveryAddress: address,
      outletId,
      cartID: cartId,
      orderActionDate,
    };

    if (adjustedPayload && typeof adjustedPayload === 'object') {
      Object.assign(payload, adjustedPayload);
    }
    return payload;
  };

  const getDeliveryProviderFee = async (orderActionDate, adjustedPayload) => {
    setIsLoading(true);
    try {
      const payload = payloadDelivery(orderActionDate, adjustedPayload);
      const result = await dispatch(getDeliveryProviderAndFee(payload));
      handleAutoUpdateDeliveryType(result, orderActionDate);

      return result;
    } catch (e) {
      setIsLoading(false);
      return null;
    }
  };
  const handleAutoUpdateDeliveryType = async (result, orderActionDate) => {
    if (
      result?.data?.dataProvider?.length === 1 &&
      basket?.orderingMode === 'DELIVERY'
    ) {
      const provider = result?.data?.dataProvider[0];
      if (
        !provider?.actionRequired &&
        provider?.deliveryProviderError?.status
      ) {
        return setIsLoading(false);
      }
      await dispatch(updateProvider(provider));
      updateCustomField(provider, orderActionDate);
    } else {
      setIsLoading(false);
    }
  };

  const updateCustomField = async (provider, orderActionDate) => {
    if (provider?.customFields?.[0]?.options?.length === 1) {
      const key = provider?.customFields?.[0]?.value;
      const value = provider?.customFields?.[0]?.options?.[0];
      const payload = {
        [key]: value,
      };
      const newPayload = payloadDelivery(orderActionDate, payload);

      // console.log(payload, 'papan');
      const response = await dispatch(getDeliveryProviderAndFee(newPayload));
      await dispatch(saveDeliveryCustomField(payload));
      await dispatch(updateProvider(provider));
      await dispatch(
        changeOrderingMode({
          orderingMode: basket?.orderingMode,
          provider: response?.data?.dataProvider[0],
        }),
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const mySelectedProvider = (providers = [], name) => {
    const myProvider = providers?.find(provider => provider?.name === name);
    return myProvider;
  };

  const autoSelectDeliveryType = async (provider, orderActionDate) => {
    if (provider?.customFields?.[0]?.options?.length === 1) {
      setIsLoading(true);
      const key = provider?.customFields?.[0]?.value;
      const value = provider?.customFields?.[0]?.options?.[0];
      const payload = {
        [key]: value,
      };
      const newPayload = payloadDelivery(orderActionDate, payload);

      // console.log(payload, 'papan');
      const response = await dispatch(getDeliveryProviderAndFee(newPayload));
      const selectedProvider = await mySelectedProvider(
        response?.data?.dataProvider,
        provider?.name,
      );

      await dispatch(saveDeliveryCustomField(payload));
      await dispatch(updateProvider(selectedProvider));
      await dispatch(
        changeOrderingMode({
          orderingMode: basket?.orderingMode,
          provider: selectedProvider,
        }),
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return {
    registerCardHook,
    isLoading,
    mapVoucherPaymentCheck,
    getDeliveryProviderFee,
    autoSelectDeliveryType,
  };
};

export default usePayment;
