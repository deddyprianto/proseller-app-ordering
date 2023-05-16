import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {Actions} from 'react-native-router-flux';
import CryptoJS from 'react-native-crypto-js';
import QRCode from 'react-native-qrcode-svg';
import {useSelector} from 'react-redux';

import awsConfig from '../../config/awsConfig';
import appConfig from '../../config/appConfig';

import Theme from '../../theme';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.backgroundTransparent,
    },
    container: {
      height: '90%',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: theme.colors.background,
    },
    header: {
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.greyScale3,
    },
    body: {
      paddingHorizontal: 16,
      width: WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale3,
    },
    divider: {
      marginTop: 32,
      height: 1,
      backgroundColor: theme.colors.brandPrimary,
      width: '100%',
    },
    textHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textRedeem: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textHowToUse: {
      marginVertical: 16,
      textAlign: 'center',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textTermAndConditionNumber: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textTermAndConditionValue: {
      marginLeft: 4,
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfoName: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfoTier: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewRedeem: {
      backgroundColor: theme.colors.brandPrimary,
      paddingVertical: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewIconClose: {
      width: 24,
      height: 24,
      position: 'absolute',
      right: 16,
      top: 16,
    },
    viewInfo: {
      width: WIDTH - 32,
      marginTop: 8,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 32,
    },
    viewHowToUse: {
      width: WIDTH - 32,
      marginBottom: 16,
    },
    viewTermAndCondition: {
      display: 'flex',
      flexDirection: 'row',
    },
    iconClose: {
      width: 24,
      height: 24,
    },
    imageBackgroundInfo: {
      borderRadius: 8,
    },
    modalContainer: {
      justifyContent: 'flex-end',
      margin: 0,
    },
  });
  return styles;
};

const MyECardModal = ({open, handleClose}) => {
  const styles = useStyles();
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

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textHeader}>My E - Card</Text>
        <TouchableOpacity
          style={styles.viewIconClose}
          onPress={() => {
            handleClose();
          }}>
          <Image source={appConfig.iconClose} style={styles.iconClose} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderInfo = () => {
    return (
      <ImageBackground
        style={styles.viewInfo}
        imageStyle={styles.imageBackgroundInfo}
        source={appConfig.imagePointSmallBackground}>
        <Text style={styles.textInfoName}>{user?.name}</Text>
        <Text style={styles.textInfoTier}>
          Current Tier : {user?.customerGroupName}
        </Text>
      </ImageBackground>
    );
  };

  const renderQRCode = () => {
    return (
      <QRCode
        value={JSON.stringify({
          token: qr,
        })}
        size={WIDTH - 64}
      />
    );
  };

  const renderTermAndCondition = ({value, number}) => {
    return (
      <View style={styles.viewTermAndCondition}>
        <Text style={styles.textTermAndConditionNumber}>{number}.</Text>
        <Text style={styles.textTermAndConditionValue}>{value}</Text>
      </View>
    );
  };

  const renderHowToUse = () => {
    const termsAndConditions = [
      'Present the e-card above to the cashier when making an order at ACE Mart outlets.',
      'Earn point from your purchase.',
      'You can use the earned point to redeem voucher by click redeem button below.',
    ];

    const result = termsAndConditions.map((value, index) => {
      return renderTermAndCondition({value, number: index + 1});
    });

    return (
      <View style={styles.viewHowToUse}>
        <Text style={styles.textHowToUse}>How To Use :</Text>
        {result}
      </View>
    );
  };
  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderBody = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}>
        {renderInfo()}
        {renderQRCode()}
        {renderDivider()}
        {renderHowToUse()}
      </ScrollView>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            handleClose();
            Actions.rewards();
          }}
          style={styles.viewRedeem}>
          <Text style={styles.textRedeem}>REDEEM</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={open}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      useNativeDriver={true}
      style={styles.modalContainer}
      onDismiss={handleClose}>
      <View style={styles.root}>
        <View style={styles.container}>
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </View>
      </View>
    </Modal>
  );
};

export default MyECardModal;
