import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';
import CryptoJS from 'react-native-crypto-js';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

import {Body, Header} from '../components/layout';

import {useSelector} from 'react-redux';
import {navigate} from '../utils/navigation.utils';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.01,
  },
  image: {
    height: HEIGHT * 0.22,
    width: WIDTH * 0.85,
    borderRadius: 10,
    marginBottom: 20,
  },
  viewHeader: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
  },
  viewTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    width: WIDTH * 0.35,
    height: HEIGHT * 0.04,
    backgroundColor: colorConfig.forthColor,
  },
  viewQRCode: {
    marginTop: 50,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colorConfig.sixthColor,
    height: 250,
    width: '100%',
    borderRadius: 10,
  },
  viewHowToUse: {
    marginTop: 50,
  },
  viewStep3: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  textHowToUse: {
    color: colorConfig.primaryColor,
  },
  textName: {
    fontSize: 20,
    color: colorConfig.primaryColor,
    marginTop: 10,
  },
  textTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  textDescription: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    width: WIDTH * 0.6,
    letterSpacing: 0.2,
    marginTop: 30,
    marginBottom: 20,
  },
  textSteps: {
    marginTop: 10,
  },
  textHere: {
    textDecorationLine: 'underline',
  },
});

const ECard = () => {
  const [qr, setQr] = useState('');
  const [user, setUser] = useState({});
  const qrCodeEncrypt = useSelector(state => state.authReducer.authData.qrcode);
  const userEncrypt = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  useEffect(() => {
    const loadData = async () => {
      const qrDecrypt = CryptoJS.AES.decrypt(
        qrCodeEncrypt,
        awsConfig.PRIVATE_KEY_RSA,
      );
      const userDecrypt = CryptoJS.AES.decrypt(
        userEncrypt,
        awsConfig.PRIVATE_KEY_RSA,
      );
      const qrResult = qrDecrypt.toString(CryptoJS.enc.Utf8);
      const userResult = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

      setQr(qrResult);
      setUser(userResult);
    };

    loadData();
  }, [qrCodeEncrypt, userEncrypt]);

  const renderQRCode = () => {
    return (
      <View style={styles.viewQRCode}>
        <Text style={styles.textName}>{user?.name}</Text>
        <Text>Current Tier : {user?.customerGroupName}</Text>
        <QRCode
          value={JSON.stringify({
            token: qr,
          })}
          // logo={appConfig.logoMerchant}
          logoSize={35}
          size={180}
        />
      </View>
    );
  };

  const renderHowToUse = () => {
    return (
      <View style={styles.viewHowToUse}>
        <Text style={styles.textHowToUse}>How To Use :</Text>
        <Text style={styles.textSteps}>
          1. Present the e-card above to the cashier when making an order at Fun
          Toast outlets.
        </Text>
        <Text style={styles.textSteps}>2. Earn points from your purchase!</Text>
        <View style={styles.viewStep3}>
          <Text>3. Points can be redeem </Text>
          <Text
            onPress={() => {
              Actions.pop();
              navigate('redeem');
            }}
            style={styles.textHere}>
            here
          </Text>
        </View>
      </View>
    );
  };

  const renderTextECard = () => {
    return (
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>My E - Card</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Header customTitle={renderTextECard()} />
      <Body>
        <ScrollView style={styles.container}>
          <View style={styles.viewHeader}>
            {renderQRCode()}
            {renderHowToUse()}
          </View>
        </ScrollView>
      </Body>
    </SafeAreaView>
  );
};

export default ECard;
