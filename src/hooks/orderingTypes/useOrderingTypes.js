import React from 'react';
import {useSelector} from 'react-redux';
import appConfig from '../../config/appConfig';

const useOrderingTypes = () => {
  const [orderingTypes, setOrderingTypes] = React.useState([]);
  const [displayName, setDisplayName] = React.useState('');

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const orderSetting = useSelector(
    state => state.settingReducer?.allowedOrder?.settingValue,
  );
  const handleOrderingType = () => {
    const orderingModesField = [
      {
        key: 'STOREPICKUP',
        isEnabledFieldName: 'enableStorePickUp',
        displayName: defaultOutlet.storePickUpName || 'Store Pick Up',
        image: appConfig.iconOrderingModeStorePickUp,
      },
      {
        key: 'DELIVERY',
        isEnabledFieldName: 'enableDelivery',
        displayName: defaultOutlet.deliveryName || 'Delivery',
        image: appConfig.iconOrderingModeDelivery,
      },
      {
        key: 'TAKEAWAY',
        isEnabledFieldName: 'enableTakeAway',
        displayName: defaultOutlet.takeAwayName || 'Take Away',
        image: appConfig.iconOrderingModeTakeAway,
      },
      {
        key: 'DINEIN',
        isEnabledFieldName: 'enableDineIn',
        displayName: defaultOutlet.dineInName || 'Dine In',
        image: appConfig.iconOrderingModeStorePickUp,
      },
      {
        key: 'STORECHECKOUT',
        isEnabledFieldName: 'enableStoreCheckOut',
        displayName: defaultOutlet.storeCheckOutName || 'Store Checkout',
        image: appConfig.iconOrderingModeStorePickUp,
      },
    ];
    const orderingModesFieldFiltered = orderingModesField.filter(mode => {
      if (
        defaultOutlet[mode.isEnabledFieldName] &&
        orderSetting?.includes(mode.key)
      ) {
        return mode;
      }
    });

    setOrderingTypes(orderingModesFieldFiltered);
  };

  const handleDisplayName = (status = '') => {
    const findOrderingType = orderingTypes?.find(
      order => order?.key === status,
    );
    if (findOrderingType) {
      return findOrderingType?.displayName;
    }
    return '';
  };
  return {
    orderingTypes,
    handleOrderingType,
    handleDisplayName,
  };
};

export default useOrderingTypes;
