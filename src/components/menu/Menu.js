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
  SafeAreaView,
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

import colorConfig from '../../config/colorConfig';
import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  touchableOrderHere: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colorConfig.primaryColor,
    marginLeft: 8,
  },
  touchableSendGift: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: WIDTH * 0.28,
    height: WIDTH * 0.28,
    backgroundColor: colorConfig.forthColor,
  },
  touchableMyECard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: WIDTH * 0.28,
    height: WIDTH * 0.28,
    backgroundColor: colorConfig.forthColor,
  },
  touchableEStore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: WIDTH * 0.28,
    height: WIDTH * 0.28,
    backgroundColor: colorConfig.forthColor,
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
});

const Menu = () => {
  const theme = Theme();
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
        <Text
          style={{
            color: theme.colors.primary,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}
          numberOfLines={1}>
          Welcome {user?.name},
        </Text>
        <Text
          style={{
            color: theme.colors.text1,
            fontSize: theme.fontSize[12],
            fontFamily: theme.fontFamily.poppinsRegular,
          }}>
          {totalPoint} PTS
        </Text>
        <View
          style={{
            position: 'absolute',
            right: 6,
            bottom: 4,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: theme.colors.text1,
              fontSize: theme.fontSize[8],
              fontFamily: theme.fontFamily.poppinsRegular,
            }}>
            Redeem
          </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            style={{
              color: theme.colors.text1,
              fontSize: theme.fontSize[10],
            }}
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
        <EvilIcons
          name="star"
          style={{
            fontSize: 18,
          }}
        />
        <Text
          style={{
            color: theme.colors.text1,
            fontSize: theme.fontSize[12],
            fontFamily: theme.fontFamily.poppinsRegular,
          }}>
          My Favorite Outlet
        </Text>
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
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          ORDER
        </Text>

        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          HERE
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 6,
            right: 10,
          }}>
          <FontAwesome
            name="star"
            style={{
              color: 'white',
              fontSize: 3,
              paddingTop: 3,
              paddingRight: 2,
            }}
          />
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 8,
            }}>
            For Dine-in and Takeaway Only
          </Text>
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
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 13,
            }}>
            E-Store
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 8,
            }}>
            merchandise and more
          </Text>
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
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 13,
            }}>
            My E-Card
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 8,
            }}>
            scan for points
          </Text>
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
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 13,
            }}>
            Send A Gift
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 8,
            }}>
            gift a friend a voucher
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWelcomeAndFavoriteOutlet = () => {
    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        {renderWelcome()}
        {renderMyFavoriteOutlet()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: HEIGHT * 0.02,
        }}>
        {renderWelcomeAndFavoriteOutlet()}
        {renderOrderHere()}
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: HEIGHT * 0.02,
        }}>
        {renderEStore()}
        {renderMyECard()}
        {renderSendGift()}
      </View>
      <Image
        style={{
          height: HEIGHT * 0.3,
          width: '100%',
        }}
        source={appConfig.funtoastButtomBanner}
        resizeMode="contain"
      />
      <View style={{marginTop: 10}} />
    </View>
  );
};

export default Menu;
