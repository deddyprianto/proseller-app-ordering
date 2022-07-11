/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import {useSelector} from 'react-redux';

import CryptoJS from 'react-native-crypto-js';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: HEIGHT * 0.02,
    },
    body: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: HEIGHT * 0.02,
    },
    footer: {
      height: HEIGHT * 0.3,
      width: '100%',
    },
    textWelcome: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPoint: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textMenu: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textMenuDescription: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[8],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textRedeem: {
      textAlign: 'center',
      color: theme.colors.text1,
      fontSize: theme.fontSize[8],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textFavoriteOutlet: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textOrderHere: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDineIn: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[8],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewWelcomeAndFavorite: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    viewRedeem: {
      position: 'absolute',
      right: 6,
      bottom: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewDineIn: {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 6,
      right: 10,
    },
    touchableOrderHere: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginLeft: 8,
      elevation: 5,
      backgroundColor: theme.colors.primary,
    },
    touchableSendGift: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      width: WIDTH * 0.28,
      height: WIDTH * 0.28,
      elevation: 5,
      backgroundColor: '#F7DFD5',
    },
    touchableMyECard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      width: WIDTH * 0.28,
      height: WIDTH * 0.28,
      elevation: 5,
      backgroundColor: '#E7A1A1',
    },
    touchableEStore: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      width: WIDTH * 0.28,
      height: WIDTH * 0.28,
      elevation: 5,
      backgroundColor: '#9CCEC2',
    },
    touchableWelcome: {
      flex: 1,
      height: 60,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: 16,
      marginRight: 8,
      paddingVertical: 11,
      elevation: 5,
      backgroundColor: '#F3F6FB',
    },
    touchableFavoriteOutlet: {
      flex: 1,
      height: 60,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginRight: 8,
      paddingVertical: 11,
      elevation: 5,
      backgroundColor: '#F3F6FB',
    },
    iconRedeem: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[10],
    },
    iconStar: {
      fontSize: 18,
    },
    iconDineIn: {
      fontSize: 3,
      paddingTop: 3,
      paddingRight: 2,
      color: 'white',
    },
  });
  return styles;
};

const Menu = () => {
  const styles = useStyles();
  const [user, setUser] = useState({});
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

  const renderWelcome = () => {
    return (
      <TouchableOpacity
        style={styles.touchableWelcome}
        onPress={() => {
          Actions.redeem();
        }}>
        <Text style={styles.textWelcome} numberOfLines={1}>
          Welcome {user?.name},
        </Text>
        <Text style={styles.textPoint}>{totalPoint} PTS</Text>
        <View style={styles.viewRedeem}>
          <Text style={styles.textRedeem}>Redeem</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            style={styles.iconRedeem}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMyFavoriteOutlet = () => {
    return (
      <TouchableOpacity
        style={styles.touchableFavoriteOutlet}
        onPress={() => {
          Actions.myFavoriteOutlets();
        }}>
        <EvilIcons name="star" style={styles.iconStar} />
        <Text style={styles.textFavoriteOutlet}>My Favorite Outlet</Text>
      </TouchableOpacity>
    );
  };

  const renderOrderHere = () => {
    return (
      <TouchableOpacity
        style={styles.touchableOrderHere}
        onPress={() => {
          Actions.push('orderHere');
        }}>
        <Text style={styles.textOrderHere}>ORDER</Text>
        <Text style={styles.textOrderHere}>HERE</Text>
        <View style={styles.viewDineIn}>
          <FontAwesome name="star" style={styles.iconDineIn} />
          <Text style={styles.textDineIn}>For Dine-in and Takeaway Only</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEStore = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.push('eStore');
        }}>
        <View style={styles.touchableEStore}>
          <Text style={styles.textMenu}>E-Store</Text>

          <Text style={styles.textMenuDescription}>merchandise and more</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMyECard = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.push('eCard');
        }}>
        <View style={styles.touchableMyECard}>
          <Text style={styles.textMenu}>My E-Card</Text>

          <Text style={styles.textMenuDescription}>scan for points</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSendGift = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.push('eGift');
        }}>
        <View style={styles.touchableSendGift}>
          <Text style={styles.textMenu}>Send A Gift</Text>

          <Text style={styles.textMenuDescription}>
            gift a friend a voucher
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWelcomeAndFavoriteOutlet = () => {
    return (
      <View style={styles.viewWelcomeAndFavorite}>
        {renderWelcome()}
        {renderMyFavoriteOutlet()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderWelcomeAndFavoriteOutlet()}
        {renderOrderHere()}
      </View>

      <View style={styles.body}>
        {renderEStore()}
        {renderMyECard()}
        {renderSendGift()}
      </View>
      <Image
        style={styles.footer}
        source={appConfig.funtoastButtomBanner}
        resizeMode="contain"
      />
      <View style={{marginTop: 10}} />
    </View>
  );
};

export default Menu;
