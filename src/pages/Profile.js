import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {ProgressBar} from 'react-native-paper';

import {connect} from 'react-redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

import {logoutUser} from '../actions/auth.actions';
import LoadingScreen from '../components/loadingScreen';
import {myProgressBarCampaign} from '../actions/account.action';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  divider: {
    width: WIDTH,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  textWelcome: {
    fontSize: 14,
    color: 'white',
  },
  textName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textYourPoint: {
    fontSize: 10,
    color: 'white',
  },
  textPointValue: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  textCurrentTier: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },
  textNextTier: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
  },
  textInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  textLogout: {
    color: 'grey',
  },
  viewRank: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  viewOption: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLogout: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  viewTextSetting: {
    padding: 10,
  },
  viewPointHeader: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  viewFlexRowSpaceBetweenCenter: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewProgressBar: {
    width: '80%',
    justifyContent: 'center',
  },
  progressBar: {
    backgroundColor: 'white',
    height: 14,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 3,
  },
  imageIconLogout: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    tintColor: 'grey',
  },
  imageIcon: {
    height: 30,
    width: 30,
    marginHorizontal: 14,
  },
  textIcon: {
    fontSize: 14,
  },
});

const Profile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});

  const progressBarCampaign = useSelector(
    state => state.accountsReducer?.myProgressBarCampaign.myProgress,
  );

  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );
  const totalPoint = useSelector(
    state => state.rewardsReducer.dataPoint.totalPoint,
  );
  useEffect(() => {
    const loadData = async () => {
      await dispatch(myProgressBarCampaign());
    };

    loadData();
  }, [dispatch]);

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

  const handleLogout = async () => {
    setIsLoading(true);
    await dispatch(logoutUser());
    setIsLoading(false);
  };

  const handleEditProfile = () => {
    const value = {dataDiri: user};
    return Actions.editProfile(value);
  };

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
      <View style={{width: '100%', alignItems: 'center'}}>
        {renderProgressBar()}
      </View>
    );
  };

  const renderTier = () => {
    return (
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {renderCurrentTier()}
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
      <View style={{padding: 16}}>
        <View style={styles.viewPointHeader}>
          {renderWelcomeAndPoint()}
          <View style={{marginTop: '15%'}} />
          {renderProgress()}
          <View style={{marginTop: 10}} />
          {renderTier()}
          <View style={{marginTop: '15%'}} />
          {renderTextInfo()}
        </View>
      </View>
    );
  };

  const renderEditProfile = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          handleEditProfile();
        }}>
        <Image style={styles.imageIcon} source={appConfig.iconEditProfile} />
        <Text style={styles.textIcon}>Edit Profile</Text>
      </TouchableOpacity>
    );
  };

  const renderMyDeliveryAddress = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.myDeliveryAddress();
        }}>
        <Image
          style={styles.imageIcon}
          source={appConfig.iconLocation}
          resizeMode="stretch"
        />
        <Text style={styles.textIcon}>My Delivery address</Text>
      </TouchableOpacity>
    );
  };

  const renderNotifications = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.notifications();
        }}>
        <Image style={styles.imageIcon} source={appConfig.iconNotification} />
        <Text style={styles.textIcon}>Notifications</Text>
      </TouchableOpacity>
    );
  };

  const renderTermsAndConditions = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.termsCondition();
        }}>
        <Image
          style={styles.imageIcon}
          source={appConfig.iconTermsAndConditions}
        />
        <Text style={styles.textIcon}>Terms And Conditions</Text>
      </TouchableOpacity>
    );
  };

  const renderTextSetting = () => {
    return (
      <View style={styles.viewTextSetting}>
        <Text>Settings</Text>
      </View>
    );
  };

  const renderSettings = () => {
    return (
      <View>
        {renderTextSetting()}
        <View style={styles.divider} />
        {renderMyDeliveryAddress()}
        <View style={styles.divider} />
        {renderEditProfile()}
        <View style={styles.divider} />
        {renderNotifications()}
        <View style={styles.divider} />
        {renderTermsAndConditions()}
        <View style={styles.divider} />
      </View>
    );
  };

  const renderLogout = () => {
    return (
      <TouchableOpacity
        style={styles.viewLogout}
        onPress={() => {
          handleLogout();
        }}>
        <Image style={styles.imageIcon} source={appConfig.iconLogout} />
        <Text style={styles.textLogout}>Logout</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <LoadingScreen loading={isLoading} />
      {renderPointHeader()}
      {renderSettings()}
      {renderLogout()}
    </ScrollView>
  );
};

export default Profile;
