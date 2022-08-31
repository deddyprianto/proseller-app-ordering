import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {ProgressBar} from 'react-native-paper';

import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

import {logoutUser} from '../actions/auth.actions';
import LoadingScreen from '../components/loadingScreen';
import {myProgressBarCampaign} from '../actions/account.action';
import Theme from '../theme';
import ConfirmationDialog from '../components/confirmationDialog';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      backgroundColor: theme.colors.background,
    },
    textWelcome: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textYourPoint: {
      textAlign: 'right',
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPointValue: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCurrentTier: {
      textAlign: 'left',
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNextTier: {
      textAlign: 'right',
      color: theme.colors.text4,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfo: {
      marginTop: 32,
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLogout: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textIcon: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewOption: {
      padding: 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
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
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    viewPointHeader: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      borderRadius: 8,
      paddingHorizontal: 18,
      paddingVertical: 16,
      margin: 16,
      backgroundColor: theme.colors.primary,
    },
    viewWelcomeAndPoint: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    viewProgressBar: {
      flex: 1,
      justifyContent: 'center',
    },
    viewTier: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressBar: {
      flex: 1,
      maxWidth: '100%',
      width: WIDTH,
      height: 14,
      borderRadius: 8,
      borderWidth: 3,
      marginBottom: 4,
      borderColor: 'white',
      backgroundColor: 'white',
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
      tintColor: theme.colors.brandPrimary,
    },
    primaryColor: {
      color: theme.colors.primary,
    },
  });

  return styles;
};

const Profile = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);
  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] = useState(
    false,
  );
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

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
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

  const handleOpenDeleteAccountModal = () => {
    setIsOpenDeleteAccountModal(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setIsOpenDeleteAccountModal(false);
  };
  const handleOpenLogoutModal = () => {
    setIsOpenLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setIsOpenLogoutModal(false);
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

  const renderWelcomeAndPoint = () => {
    return (
      <View style={styles.viewWelcomeAndPoint}>
        {renderWelcome()}
        {renderPoint()}
      </View>
    );
  };

  const renderProgressBar = () => {
    const percentage = progressBarCampaign?.progressInPercentage || 0;
    const percentageIcon = percentage < 8 ? 0 : percentage - 8;
    const decimal = percentage / 100;
    return (
      <View style={styles.viewProgressBar}>
        <ProgressBar
          progress={decimal}
          color={styles.primaryColor.color}
          style={styles.progressBar}
        />
        <Image
          style={{
            height: 36,
            width: 40,
            position: 'absolute',
            left: `${percentageIcon}%`,
          }}
          source={appConfig.iconPointBar}
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

  const renderTier = () => {
    return (
      <View style={styles.viewTier}>
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
      <View style={styles.viewPointHeader}>
        {renderWelcomeAndPoint()}
        {renderProgressBar()}
        {renderTier()}
        {renderTextInfo()}
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
    if (defaultOutlet?.enableDelivery) {
      return (
        <TouchableOpacity
          style={styles.viewOption}
          onPress={() => {
            Actions.myDeliveryAddress({fromScene: 'profile'});
          }}>
          <Image
            style={styles.imageIcon}
            source={appConfig.iconLocation}
            resizeMode="stretch"
          />
          <Text style={styles.textIcon}>My Delivery address</Text>
        </TouchableOpacity>
      );
    }
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

  const renderLogout = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          handleOpenLogoutModal();
        }}>
        <Image style={styles.imageIcon} source={appConfig.iconLogout} />
        <Text style={styles.textLogout}>Logout</Text>
      </TouchableOpacity>
    );
  };

  const renderDeleteAccount = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          handleOpenDeleteAccountModal();
        }}>
        <Image style={styles.imageIcon} source={appConfig.iconDelete} />
        <Text style={styles.textLogout}>Delete My Account</Text>
      </TouchableOpacity>
    );
  };

  const renderSettings = () => {
    return (
      <View>
        {renderTextSetting()}
        {renderMyDeliveryAddress()}
        {renderEditProfile()}
        {renderNotifications()}
        {renderTermsAndConditions()}
        {renderDeleteAccount()}
        {renderLogout()}
      </View>
    );
  };

  const renderDeleteAccountConfirmationDialog = () => {
    if (isOpenDeleteAccountModal) {
      return (
        <ConfirmationDialog
          open={isOpenDeleteAccountModal}
          handleClose={() => {
            handleCloseDeleteAccountModal();
          }}
          handleSubmit={() => {
            handleLogout();
          }}
          isLoading={isLoading}
          textTitle="Delete account"
          textDescription="This will permanently delete your account. You will not able to access your order history and personal detail."
          textSubmit="Ok"
        />
      );
    }
  };

  const renderLogoutConfirmationDialog = () => {
    if (isOpenLogoutModal) {
      return (
        <ConfirmationDialog
          open={isOpenLogoutModal}
          handleClose={() => {
            handleCloseLogoutModal();
          }}
          handleSubmit={() => {
            handleLogout();
          }}
          isLoading={isLoading}
          textTitle="Logout"
          textDescription="Are you sure you want to logout your account?"
          textSubmit="Ok"
        />
      );
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.root}>
        <LoadingScreen loading={isLoading} />
        {renderPointHeader()}
        {renderSettings()}
        {renderDeleteAccountConfirmationDialog()}
        {renderLogoutConfirmationDialog()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
