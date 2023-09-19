/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';

import CryptoJS from 'react-native-crypto-js';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';
import TextWarningModal from '../modal/TextWarningModal';
import {dataStores, getOutletById} from '../../actions/stores.action';
import {changeOrderingMode, getOrderingMode} from '../../actions/order.action';
import LoadingScreen from '../loadingScreen/LoadingScreen';

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
    image: {},
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

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

  const handleClick = async () => {
    setIsLoading(true);
    const allOutlet = await dispatch(dataStores());
    const activeOutlets = allOutlet.filter(
      row => row.orderingStatus === 'AVAILABLE',
    );
    const orderingMode = await dispatch(getOrderingMode(activeOutlets[0]));

    if (activeOutlets.length === 1 && orderingMode.length === 1) {
      Actions.push('orderHere');
      await dispatch(getOutletById(activeOutlets[0].id));
      await dispatch(changeOrderingMode({orderingMode: orderingMode[0].key}));
    } else if (activeOutlets.length === 1) {
      Actions.push('orderingMode');
      await dispatch(getOutletById(activeOutlets[0].id));
    } else {
      Actions.push('outlets');
    }
    setIsLoading(false);
  };

  const renderPoint = () => {
    return (
      <TouchableOpacity
        style={styles.touchablePoint}
        onPress={() => {
          Actions.redeem();
        }}>
        <View>
          <Text style={styles.textPoint1}>Current Point</Text>
          <Text style={styles.textPoint2}>{totalPoint} PTS</Text>
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
          Actions.myFavoriteOutlets();
        }}>
        <Image source={appConfig.iconHomeOutlet} style={styles.iconMenu} />
        <Text style={styles.textMenu}>Favorite Outlet</Text>
      </TouchableOpacity>
    );
  };

  const renderEStore = () => {
    return (
      <TouchableOpacity
        style={styles.viewMenu}
        onPress={() => {
          // Actions.push('eStore');
          setIsOpenModal(true);
        }}>
        <Image source={appConfig.iconHomeEStore} style={styles.iconMenu} />
        <Text style={styles.textMenu}>E-Store</Text>
      </TouchableOpacity>
    );
  };

  const renderMyECard = () => {
    return (
      <TouchableOpacity
        style={styles.viewMenu}
        onPress={() => {
          Actions.push('eCard');
        }}>
        <Image source={appConfig.iconHomeECard} style={styles.iconMenu} />
        <Text style={styles.textMenu}>My E-Card</Text>
      </TouchableOpacity>
    );
  };

  const renderSendGift = () => {
    return (
      <TouchableOpacity
        style={styles.viewMenu}
        onPress={() => {
          Actions.push('eGift');
        }}>
        <Image source={appConfig.iconHomeSendAGift} style={styles.iconMenu} />
        <Text style={styles.textMenu}>Send A Gift</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Text style={styles.textWelcome} numberOfLines={1}>
        Welcome {user?.name},
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
