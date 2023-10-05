import React, {useState} from 'react';

import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeOrderingMode,
  getOrderingMode,
  removeBasket,
} from '../actions/order.action';
import {getBasket} from '../actions/product.action';
import {getOutletById} from '../actions/stores.action';
import {updateUser} from '../actions/user.action';

import FavoriteOutletDetail from '../components/favoriteOutletDetail';

import {Body, Header} from '../components/layout';
import LoadingScreen from '../components/loadingScreen';
import awsConfig from '../config/awsConfig';
import Theme from '../theme';
import CheckOutletStatus from '../helper/CheckOutletStatus';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    bottom: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      width: '100%',
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    viewButtonAvailable: {
      borderRadius: 8,
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    viewButtonUnavailable: {
      borderRadius: 8,
      padding: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },
    textButton: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const FavoriteOutlets = ({outlet}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

  const isUnavailable = CheckOutletStatus(outlet) === 'UNAVAILABLE';

  const handleGetStoreById = async item => {
    const orderingMode = await dispatch(getOrderingMode(item));
    await dispatch(getOutletById(item.id));
    if (awsConfig.COMPANY_TYPE === 'Retail') {
      Actions.popTo('pageIndex');
    } else if (orderingMode.length === 1) {
      await dispatch(changeOrderingMode({orderingMode: orderingMode[0].key}));
      Actions.push('orderHere');
    } else {
      Actions.push('orderingMode');
    }
  };

  const handleRemoveSelectedAddress = async () => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const user = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    await dispatch(
      updateUser({selectedAddress: null, phoneNumber: user.phoneNumber}),
    );
  };

  const handleRemoveCart = async () => {
    setIsLoading(true);
    await handleRemoveSelectedAddress();
    await dispatch(changeOrderingMode({orderingMode: ''}));
    await dispatch(removeBasket());
    await dispatch(getBasket());
    setIsLoading(false);
  };

  const showAlertBasketNotEmpty = async item => {
    Alert.alert(
      'Change outlet ?',
      `You will delete your cart in outlet ${basket.outlet.name}`,
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            await handleRemoveCart();
            await handleGetStoreById(item);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleClickOutlet = item => {
    if (basket && basket.outlet.id !== item?.id) {
      return showAlertBasketNotEmpty(item);
    } else {
      return handleGetStoreById(item);
    }
  };

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <Body>
          <FavoriteOutletDetail outlet={outlet} />
        </Body>
      </View>
    );
  };

  const renderBottom = () => {
    const styleButton = !isUnavailable
      ? styles.viewButtonAvailable
      : styles.viewButtonUnavailable;

    return (
      <View style={styles.bottom}>
        <TouchableOpacity
          disabled={isUnavailable}
          style={styleButton}
          onPress={() => {
            handleClickOutlet(outlet);
          }}>
          <Text style={styles.textButton}>Order from here</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen loading={isLoading} />
      <Header title="Outlets Detail" />
      {renderBody()}
      {renderBottom()}
    </SafeAreaView>
  );
};

export default FavoriteOutlets;
