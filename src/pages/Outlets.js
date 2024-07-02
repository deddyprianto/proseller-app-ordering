import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {StyleSheet, SafeAreaView, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  dataStores,
  getDefaultOutlet,
  getNearestOutlet,
  getOutletById,
} from '../actions/stores.action';

import CryptoJS from 'react-native-crypto-js';

import OutletList from '../components/OutletList';

import {Body, Header} from '../components/layout';
import useBackHandler from '../hooks/backHandler/useBackHandler';
import {updateUser} from '../actions/user.action';
import {
  changeOrderingMode,
  removeBasket,
  getTimeslot,
  getBasket
} from '../actions/order.action';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';
import {navigate} from '../utils/navigation.utils';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const Outlets = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const userPosition = useSelector(
    state => state.userReducer?.userPosition.userPosition,
  );

  const outlets = useSelector(state => state.storesReducer.dataStores.stores);
  const nearestOutlet = useSelector(
    state => state.storesReducer.nearestOutlet.outlet,
  );
  const basket = useSelector(state => state.orderReducer.dataBasket.product);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const orderSetting = useSelector(
    state => state.settingReducer?.allowedOrder?.settingValue,
  );

  const user = useSelector(state => state.userReducer.getUser.userDetails);
  const isLoggedIn = useSelector(state => state.authReducer.authData.token);

  useBackHandler();

  const orderingModesField = [
    {
      key: 'STOREPICKUP',
      isEnabledFieldName: 'enableStorePickUp',
    },
    {
      key: 'DELIVERY',
      isEnabledFieldName: 'enableDelivery',
    },
    {
      key: 'TAKEAWAY',
      isEnabledFieldName: 'enableTakeAway',
    },
    {
      key: 'DINEIN',
      isEnabledFieldName: 'enableDineIn',
    },
    {
      key: 'STORECHECKOUT',
      isEnabledFieldName: 'enableStoreCheckOut',
    },
  ];

  useEffect(() => {
    const loadData = async coordinate => {
      const userPositionLat = coordinate?.latitude;
      const userPositionLong = coordinate?.longitude;

      await dispatch(
        getNearestOutlet({
          latitude: userPositionLat,
          longitude: userPositionLong,
        }),
      );
    };

    const userCoordinate = userPosition?.coords;

    if (userCoordinate) {
      loadData(userCoordinate);
    }
  }, [userPosition, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataStores());
      await dispatch(getDefaultOutlet());
    };
    loadData();
  }, [dispatch]);

  const showAlertBasketNotEmpty = async item => {
    Alert.alert(
      'Change outlet ?',
      `You will delete your cart in outlet ${basket.outlet.name}`,
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            await removeCart();
            await handleSetOutlet(item);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleRemoveSelectedAddress = async () => {
    const userDecrypt = CryptoJS.AES.decrypt(user, awsConfig.PRIVATE_KEY_RSA);

    const userData = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    await dispatch(
      updateUser({selectedAddress: null, phoneNumber: userData.phoneNumber}),
    );
  };

  const removeCart = async () => {
    setIsLoading(true);
    await handleRemoveSelectedAddress();
    await dispatch(changeOrderingMode({orderingMode: ''}));
    await dispatch(removeBasket());
    await dispatch(getBasket());
  };

  const handleSelectStoreFnB = async item => {
    const orderingModesFieldFiltered = orderingModesField.filter(mode => {
      if (item[mode.isEnabledFieldName] && orderSetting?.includes(mode.key)) {
        return mode;
      }
    });

    if (orderingModesFieldFiltered.length === 1) {
      const date = moment().format('YYYY-MM-DD');
      const clientTimezone = Math.abs(new Date().getTimezoneOffset());
      dispatch(
        getTimeslot(
          item?.id,
          date,
          clientTimezone,
          orderingModesFieldFiltered[0].key,
        ),
      );
      await dispatch(
        changeOrderingMode({
          orderingMode: orderingModesFieldFiltered[0].key,
        }),
      );
      await dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: [],
      });
      navigate('orderHere');
      setIsLoading(false);
    } else {
      navigate('orderingMode');
      setIsLoading(false);
    }
  };

  const handleSetOutlet = async item => {
    setIsLoading(true);
    await dispatch(getOutletById(item?.id));

    if (awsConfig.COMPANY_TYPE !== 'Retail') {
      await handleSelectStoreFnB(item);
    } else if (Actions.currentScene !== 'pageIndex') {
      Actions.pop();
    }
    setIsLoading(false);
  };

  const handleChangeOutlet = async item => {
    if (!isLoggedIn) {
      await dispatch(getOutletById(item?.id));
      navigate('orderHere');
    } else {
      try {
        if (defaultOutlet?.id === item?.id) {
          await handleSetOutlet(item);
          return;
        }
        if (!basket) {
          await removeCart();
          await handleSetOutlet(item);
          return;
        }
        if (basket && basket.outlet.id !== item.id) {
          showAlertBasketNotEmpty(item);
          return;
        }
        await handleSetOutlet(item);
        setIsLoading(false);
      } catch (e) {
        await removeCart();
        await handleSetOutlet(item);
      }
    }
  };

  const renderBody = () => {
    return (
      <View style={styles.root}>
        <Body>
          <OutletList
            outlets={outlets}
            nearestOutlet={nearestOutlet}
            handleChange={item => {
              handleChangeOutlet(item);
            }}
          />
        </Body>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header title="Outlet List" />
      {renderBody()}
    </SafeAreaView>
  );
};

export default Outlets;
