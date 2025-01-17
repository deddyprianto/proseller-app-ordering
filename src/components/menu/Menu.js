/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DeviceBrightness from '@adrianso/react-native-device-brightness';

import CryptoJS from 'react-native-crypto-js';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';
import TextWarningModal from '../modal/TextWarningModal';
import {dataStores, getOutletById} from '../../actions/stores.action';
import {
  changeOrderingMode,
  getOrderingMode,
  getTimeslot,
} from '../../actions/order.action';
import LoadingScreen from '../loadingScreen/LoadingScreen';
import MyECardModal from '../modal/MyECardModal';
import {navigate} from '../../utils/navigation.utils';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    top: {
      marginVertical: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    middle: {
      marginTop: 8,
      marginBottom: 24,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textWelcome: {
      width: '100%',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[24],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textPoint1: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPoint2: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textMenu: {
      textAlign: 'center',
      marginTop: 10,
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textMenuDisabled: {
      textAlign: 'center',
      marginTop: 10,
      color: theme.colors.buttonDisabled,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textMenuDescription: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[8],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textRedeem: {
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOrderHere1: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textOrderHere2: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewRedeem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    touchableOrderHere: {
      shadowOffset: {
        width: 0.5,
        height: 0.5,
      },
      shadowOpacity: 0.5,
      shadowColor: theme.colors.greyScale2,
      elevation: 5,
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      borderRadius: 36,
      marginLeft: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.primary,
    },
    touchablePoint: {
      shadowOffset: {
        width: 0.5,
        height: 0.5,
      },
      shadowOpacity: 0.5,
      shadowColor: theme.colors.greyScale2,
      elevation: 5,
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 36,
      marginRight: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: '#F3F6FB',
    },
    viewMenu: {
      marginHorizontal: 4,
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    iconArrow: {
      width: 4,
      height: 8,
      marginLeft: 6,
    },
    iconMenu: {
      tintColor: theme.colors.buttonActive,
      width: 22,
      height: 22,
    },
    iconMenuDisabled: {
      tintColor: theme.colors.buttonDisabled,
      width: 22,
      height: 22,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: theme.colors.greyScale3,
      marginBottom: 16,
    },
  });
  return styles;
};

const Menu = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const [user, setUser] = useState({});

  const [currentBrightness, setCurrentBrightness] = useState(null);
  const [isOpenMyECardModal, setIsOpenMyECardModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );
  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );
  const isLoggedIn = useSelector(state => state.authReducer.authData.token);

  useEffect(() => {
    if (userDetail) {
      const userDecrypt = CryptoJS.AES.decrypt(
        userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

      setUser(result);
    }
  }, [userDetail]);

  const initDeviceBright = async () => {
    const result = await DeviceBrightness.getBrightnessLevel();
    setCurrentBrightness(result);
  };

  const handleDeviceBright = async () => {
    initDeviceBright();
    if (isOpenMyECardModal) {
      return DeviceBrightness.setBrightnessLevel(1);
    }
    if (currentBrightness) {
      DeviceBrightness.setBrightnessLevel(currentBrightness);
    }
  };

  useEffect(() => {
    handleDeviceBright();
  }, [isOpenMyECardModal]);

  useEffect(() => {
    initDeviceBright();
  }, []);

  const handleOpenMyECardModal = async () => {
    setIsOpenMyECardModal(true);
  };
  const handleCloseMyECardModal = async () => {
    setIsOpenMyECardModal(false);
  };

  const handleClick = async () => {
    setIsLoading(true);
    const allOutlet = isLoggedIn ? await dispatch(dataStores()) : [];
    const activeOutlets = isLoggedIn ? allOutlet.filter(
      row => row.orderingStatus === 'AVAILABLE',
    ) : [];
    const orderingMode = isLoggedIn ? await dispatch(getOrderingMode(activeOutlets[0])) : [];

    if (activeOutlets.length === 1 && orderingMode.length === 1) {
      await dispatch({
        type: 'DATA_PRODUCTS_OUTLET',
        products: [],
      });
      navigate('orderHere');
      await dispatch(getOutletById(activeOutlets[0].id));
      await dispatch(changeOrderingMode({orderingMode: orderingMode[0].key}));

      const date = moment().format('YYYY-MM-DD');
      const clientTimezone = Math.abs(new Date().getTimezoneOffset());
      dispatch(
        getTimeslot(
          activeOutlets[0].id,
          date,
          clientTimezone,
          orderingMode[0].key,
        ),
      );
    } else if (activeOutlets.length === 1) {
      navigate('orderingMode');
      await dispatch(getOutletById(activeOutlets[0].id));
    } else {
      navigate('outlets');
    }
    setIsLoading(false);
  };

  const renderPoint = () => {
    return (
      <TouchableOpacity
        style={styles.touchablePoint}
        onPress={() => {
          isLoggedIn ? navigate('redeem') : navigate('login');
        }}>
        <View>
          <Text style={styles.textPoint1}>Current Point</Text>
          <Text style={styles.textPoint2}>{totalPoint || 0} PTS</Text>
        </View>
        <View style={styles.viewRedeem}>
          <Text style={styles.textRedeem}>Redeem</Text>
          <Image source={appConfig.iconArrowRight} style={styles.iconArrow} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrderHere = () => {
    return (
      <TouchableOpacity
        style={styles.touchableOrderHere}
        onPress={async () => {
          await handleClick();
        }}>
        <Text style={styles.textOrderHere1}>Order now?</Text>
        <Text style={styles.textOrderHere2}>CLICK HERE</Text>
      </TouchableOpacity>
    );
  };

  const renderOutlet = () => {
    return (
      <TouchableOpacity
        style={styles.viewMenu}
        onPress={() => {
          !isLoggedIn ? navigate('login') : navigate('myFavoriteOutlets');
        }}>
        <Image source={appConfig.iconHomeOutlet} style={styles.iconMenu} />
        <Text style={styles.textMenu}>Favorite Outlet</Text>
      </TouchableOpacity>
    );
  };

  const renderEStore = () => {
    return (
      <TouchableOpacity
        disabled
        style={styles.viewMenu}
        onPress={() => {
          // navigate('eStore');
          !isLoggedIn ? navigate('login') : setIsOpenModal(true);
        }}>
        <Image
          source={appConfig.iconHomeEStore}
          style={styles.iconMenuDisabled}
        />
        <Text style={styles.textMenuDisabled}>E-Store</Text>
      </TouchableOpacity>
    );
  };

  const renderMyECard = () => {
    return (
      <TouchableOpacity
        style={styles.viewMenu}
        onPress={() => {
          !isLoggedIn ? navigate('login') : handleOpenMyECardModal();
        }}>
        <Image source={appConfig.iconHomeECard} style={styles.iconMenu} />
        <Text style={styles.textMenu}>My E-Card</Text>
      </TouchableOpacity>
    );
  };

  const renderSendGift = () => {
    return (
      <TouchableOpacity
        disabled
        style={styles.viewMenu}
        onPress={() => {
          !isLoggedIn ? navigate('login') : navigate('eGift');
        }}>
        <Image
          source={appConfig.iconHomeSendAGift}
          style={styles.iconMenuDisabled}
        />
        <Text style={styles.textMenuDisabled}>Send A Gift</Text>
      </TouchableOpacity>
    );
  };

  const renderMyECardModal = () => {
    if (isOpenMyECardModal) {
      return (
        <MyECardModal
          open={isOpenMyECardModal}
          handleClose={() => {
            handleCloseMyECardModal();
          }}
        />
      );
    }
  };

  return (
    <View style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Text style={styles.textWelcome} numberOfLines={1}>
        {isLoggedIn && `Welcome ${user?.name},`}
      </Text>
      <View style={styles.top}>
        {renderPoint()}
        {renderOrderHere()}
      </View>
      <View style={styles.middle}>
        {renderOutlet()}
        {renderEStore()}
        {renderMyECard()}
        {renderSendGift()}
      </View>
      <View style={styles.divider} />
      {renderMyECardModal()}
      <TextWarningModal
        open={isOpenModal}
        handleClose={() => {
          setIsOpenModal(false);
        }}
        title="E-Store Currently Not Available"
        description="We're making a few changes to our e-store system, so mobile orders for e-store are currently unavailable. But don't worry - we'll be back up and running soon! We thank you for your patience while we improve our e-store process."
        image={appConfig.imageOrderNotAvailable}
      />
    </View>
  );
};

export default Menu;
