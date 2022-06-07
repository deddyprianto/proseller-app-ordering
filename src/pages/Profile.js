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
  viewBody: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    width: WIDTH,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  progressBar: {
    backgroundColor: '#E5E5E5',
    height: 25,
    borderRadius: 10,
  },
  imageIcon: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    tintColor: colorConfig.primaryColor,
  },
  textName: {
    fontSize: 20,
    color: colorConfig.primaryColor,
    marginTop: 30,
  },
  textPoint: {
    fontSize: 20,
    marginTop: 20,
  },
  textLogout: {
    color: 'grey',
  },
  textRank: {
    fontSize: 10,
  },
  viewRank: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  textDescription: {
    fontSize: 10,
    marginVertical: 20,
  },
  viewOption: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewECard: {
    marginTop: 10,
    width: 125,
    height: 26,
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLogout: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  viewProgressBar: {
    width: '80%',
    justifyContent: 'center',
    marginTop: 15,
  },
  viewPointBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colorConfig.sixthColor,
    width: '100%',
  },
  viewTextSetting: {
    padding: 10,
  },
  imageIconLogout: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    tintColor: 'grey',
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
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    setUser(result);
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

  const renderName = () => {
    return <Text style={styles.textName}>Hi, {user?.name}!</Text>;
  };

  const renderECard = () => {
    return (
      <View style={styles.viewECard}>
        <Text>E-Card</Text>
      </View>
    );
  };

  const renderPoint = () => {
    return <Text style={styles.textPoint}>{totalPoint} PTS</Text>;
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

  const renderRank = () => {
    return (
      <View style={styles.viewRank}>
        <Text style={styles.textRank}>{progressBarCampaign?.currentGroup}</Text>
        <Text style={styles.textRank}>{progressBarCampaign?.nextGroup}</Text>
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <Text style={styles.textDescription}>
        {progressBarCampaign?.description}
      </Text>
    );
  };

  const renderPointBar = () => {
    return (
      <View style={styles.viewPointBar}>
        {renderName()}
        {renderECard()}
        {renderPoint}
        {renderProgressBar()}
        {renderRank()}
        {renderDescription()}
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
        <Image style={styles.imageIcon} source={appConfig.editProfile} />
        <Text>Edit Profile</Text>
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
        <Image style={styles.imageIcon} source={appConfig.editProfile} />
        <Text>My Delivery address</Text>
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
        <Image style={styles.imageIcon} source={appConfig.notifications} />
        <Text>Notifications</Text>
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
        <Image style={styles.imageIcon} source={appConfig.termsAndConditions} />
        <Text>Terms And Conditions</Text>
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
        <Image style={styles.imageIconLogout} source={appConfig.logout} />
        <Text style={styles.textLogout}>Logout</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <LoadingScreen loading={isLoading} />
      {renderPointBar()}
      {renderSettings()}
      {renderLogout()}
    </ScrollView>
  );
};

export default Profile;
