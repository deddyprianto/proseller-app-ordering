import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import {ProgressBar} from 'react-native-paper';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import awsConfig from '../config/awsConfig';

import {Actions} from 'react-native-router-flux';

import VoucherList from '../components/voucherList';
import Header from '../components/layout/header';
import {dataPointHistory} from '../actions/rewards.action';
import {myProgressBarCampaign} from '../actions/account.action';
import Theme from '../theme';

const useStyles = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    divider: {
      width: '100%',
      borderTopWidth: 0.5,
    },
    textWelcome: {
      fontSize: theme.fontSize[12],
      color: 'white',
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textName: {
      fontSize: 16,
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textYourPoint: {
      fontSize: theme.fontSize[12],
      color: 'white',
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textPointValue: {
      fontSize: 16,
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCurrentTier: {
      color: 'white',
      textAlign: 'left',
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNextTier: {
      color: 'white',
      textAlign: 'right',
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfo: {
      fontSize: theme.fontSize[12],
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPointAndHistory: {
      width: '100%',
      textAlign: 'center',
      textDecorationLine: 'underline',
      fontSize: theme.fontSize[12],
      color: theme.colors.primaryColor,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textAvailableVoucher: {
      width: '100%',
      textAlign: 'left',
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewHeader: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    viewPoint: {
      alignItems: 'flex-end',
    },
    viewFlexRowSpaceBetweenCenter: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewPointHeader: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryColor,
      width: '100%',
      borderRadius: 8,
      padding: 16,
    },

    viewProgressBar: {
      width: '70%',
      justifyContent: 'center',
    },

    progressBar: {
      backgroundColor: 'white',
      height: 14,
      borderRadius: 8,
      borderColor: 'white',
      borderWidth: 3,
    },
  });
  return result;
};

const Redeem = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const progressBarCampaign = useSelector(
    state => state.accountsReducer?.myProgressBarCampaign.myProgress,
  );
  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );
  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

  useEffect(() => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    setUser(result);
  }, [userDetail]);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(dataPointHistory());
      await dispatch(myProgressBarCampaign());
    };
    loadData();
  }, [dispatch, totalPoint]);

  const renderWelcome = () => {
    return (
      <View>
        <Text style={styles.textWelcome}>Welcome</Text>
        <Text style={styles.textName}>{user?.name},</Text>
      </View>
    );
  };

  const renderPoint = () => {
    return (
      <View style={styles.viewPoint}>
        <Text style={styles.textYourPoint}>Your Points</Text>
        <Text style={styles.textPointValue}>{totalPoint} PTS</Text>
      </View>
    );
  };

  const renderProgressBar = () => {
    const percentage = progressBarCampaign?.progressInPercentage || 0;
    const percentageIcon = percentage < 12 ? 0 : percentage - 12;
    const decimal = percentage / 100;
    return (
      <View style={styles.viewProgressBar}>
        <ProgressBar
          progress={decimal}
          color={colorConfig.primaryColor}
          style={styles.progressBar}
        />
        <Image
          style={{
            height: 29,
            width: 33,
            position: 'absolute',
            left: `${percentageIcon}%`,
          }}
          source={appConfig.funtoastCoffeeIcon}
        />
      </View>
    );
  };

  const renderCurrentTier = () => {
    return (
      <Text style={styles.textCurrentTier}>
        {progressBarCampaign?.currentGroup}
      </Text>
    );
  };

  const renderNextTier = () => {
    return (
      <Text style={styles.textNextTier}>{progressBarCampaign?.nextGroup}</Text>
    );
  };

  const renderWelcomeAndPoint = () => {
    return (
      <View style={styles.viewFlexRowSpaceBetweenCenter}>
        {renderWelcome()}
        {renderPoint()}
      </View>
    );
  };

  const renderProgress = () => {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {renderCurrentTier()}
        {renderProgressBar()}
        {renderNextTier()}
      </View>
    );
  };

  const renderTextInfo = () => {
    return (
      <Text style={styles.textInfo}>{progressBarCampaign?.description}</Text>
    );
  };

  const renderPointHeader = () => {
    return (
      <View style={styles.viewPointHeader}>
        {renderWelcomeAndPoint()}
        <View style={{marginTop: 32}} />
        {renderProgress()}

        <View style={{marginTop: 32}} />
        {renderTextInfo()}
      </View>
    );
  };

  const renderTextPointAndHistory = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.pointDetailAndHistory();
        }}>
        <Text style={styles.textPointAndHistory}>Point detail and history</Text>
      </TouchableOpacity>
    );
  };

  const renderTextAvailableVoucher = () => {
    return <Text style={styles.textAvailableVoucher}>Available Voucher</Text>;
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Points and Voucher" />
      <ScrollView style={styles.container}>
        <View style={styles.viewHeader}>
          <View style={{marginTop: 16}} />
          {renderPointHeader()}
          <View style={{marginTop: 16}} />
          {renderTextPointAndHistory()}
          <View style={{marginTop: 16}} />
          <View style={styles.divider} />
          <View style={{marginTop: 16}} />
          {renderTextAvailableVoucher()}
          <View style={{marginTop: 16}} />
          <VoucherList />
        </View>
      </ScrollView>
    </View>
  );
};

export default Redeem;
