/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
// import DeviceBrightness from 'react-native-device-brightness';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

import {ProgressBar} from 'react-native-paper';

import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

import {logoutUser} from '../actions/auth.actions';
import LoadingScreen from '../components/loadingScreen';
import {
  getMandatoryFields,
  myProgressBarCampaign,
} from '../actions/account.action';
import Theme from '../theme';
import ConfirmationDialog from '../components/confirmationDialog';
import MyECardModal from '../components/modal/MyECardModal';
import moment from 'moment';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {normalizeLayoutSizeHeight} from '../helper/Layout';
import BackgroundProfileSvg from '../assets/svg/BackgroundProfileSvg';
import GlobalText from '../components/globalText';
import CreditCard from '../assets/svg/CreditCardSvg';
import Voucher from '../assets/svg/VoucherSvg';
import StoreSvg from '../assets/svg/StoreSvg';
import ContactSvg from '../assets/svg/ContactSvg';
import {Body, Header} from '../components/layout';
import additionalSetting from '../config/additionalSettings';
import InfoMessage from '../components/infoMessage/InfoMessage';
import {getUserProfile} from '../actions/user.action';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import {dataPoint, dataPointHistory} from '../actions/rewards.action';
import {dataPromotion} from '../actions/promotion.action';

const WIDTH = Dimensions.get('window').width;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    primaryColor: {
      color: theme.colors.brandPrimary,
    },
    progressBar: {
      flex: 1,
      maxWidth: '100%',
      width: WIDTH,
      height: 8,
      borderRadius: 8,
      marginBottom: 4,
      backgroundColor: theme.colors.greyScale4,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.greyScale3,
      marginHorizontal: 16,
      marginTop: 5,
    },
    dividerHeader: {
      marginVertical: 16,
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale3,
    },
    textWelcome: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textYourPoint: {
      textAlign: 'right',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPointValue: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textCurrentTierPaidMembership: {
      textAlign: 'left',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textCurrentTier: {
      textAlign: 'left',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNextTier: {
      textAlign: 'right',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfo: {
      textAlign: 'center',
      marginTop: 16,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
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
    textMembershipQRCode: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textShowQRCode: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textTapToSeePoint: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textExpiry: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInitialName: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[24],
    },
    viewHeader: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 16,
      padding: 16,
      margin: 16,
      backgroundColor: theme.colors.background,
    },
    viewOption: {
      marginHorizontal: 16,
      padding: 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewPointHeader: {
      alignItems: 'flex-end',
    },
    viewWelcomeAndPoint: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewProgressBar: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewTier: {
      marginTop: 8,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewMembershipQRCode: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 32,
      borderRadius: 50,
      margin: 16,
      backgroundColor: theme.colors.background,
    },
    viewSettings: {
      marginBottom: 16,
    },
    viewTapPointDetailAndHistory: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewInitialName: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      borderRadius: 100,
      backgroundColor: theme.colors.brandPrimary,
    },
    viewWelcome: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewIconArrowRight: {
      width: 18,
      height: 18,
      borderRadius: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -2,
      marginLeft: 8,
      backgroundColor: theme.colors.buttonActive,
    },
    viewPointValue: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    imagePointHeader: {
      borderRadius: 8,
    },
    imageBackgroundProfile: {
      height: 120,
      width: '100%',
      position: 'absolute',
      top: -5,
      tintColor: theme.colors.brandPrimary,
    },
    iconSetting: {
      height: 24,
      width: 24,
      marginRight: 14,
      tintColor: theme.colors.brandPrimary,
    },
    iconQR: {
      width: 36,
      height: 36,
      marginRight: 16,
      tintColor: theme.colors.brandPrimary,
    },
    iconArrowRight: {
      width: 16,
      height: 16,
      tintColor: 'white',
    },
    backgroundProfile: {
      height: normalizeLayoutSizeHeight(118),
      position: 'absolute',
      top: -5,
      width: '100%',
    },
    titleSettingContainer: {
      marginHorizontal: 16,
      marginTop: 16,
    },
    titleSettingText: {
      fontFamily: theme.fontFamily.poppinsBold,
      fontSize: 16,
    },
    containerStyle: {
      paddingBottom: 10,
    },
    appVersionContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    appVersionText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 16,
      color: theme.colors.greyScale5,
    },
    bold: {
      fontFamily: theme.fontFamily.poppinsBold,
    },
  });

  return styles;
};

const Profile = props => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);
  const [isOpenMyECardModal, setIsOpenMyECardModal] = useState(false);
  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] = useState(
    false,
  );
  const [currentBrightness, setCurrentBrightness] = React.useState(null);
  const [user, setUser] = useState({});
  const [refreshing, setRefreshing] = React.useState(false);
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

  const hideReferral = useSelector(
    state => state.settingReducer.hideReferralSettings.hideReferral,
  );

  const intlData = useSelector(state => state.intlData);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(myProgressBarCampaign());
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    const loadData = async () => {
      if (userDetail) {
        const userDecrypt = CryptoJS.AES.decrypt(
          userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

        setUser(result);
      }
    };
    loadData();
  }, [dispatch, userDetail]);

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      onRefresh(false);
    });
  }, []);

  const initDeviceBright = async () => {
    const currentBrightness = await DeviceBrightness.getBrightnessLevel();
    setCurrentBrightness(currentBrightness);
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

  const handleOpenMyECardModal = async () => {
    // DeviceBrightness.setBrightnessLevel(1);
    setIsOpenMyECardModal(true);
  };
  const handleCloseMyECardModal = async () => {
    // DeviceBrightness.setBrightnessLevel(-1);
    setIsOpenMyECardModal(false);
  };

  const handleEditProfile = () => {
    const value = {dataDiri: user};
    if (Actions.currentScene !== 'editProfile') {
      return Actions.editProfile(value);
    }
  };

  const openWebviewPage = url => {
    if (!url) return;
    return Actions.policy({url});
  };

  const renderBackgroundImage = () => {
    return (
      <View style={styles.backgroundProfile}>
        <BackgroundProfileSvg />
      </View>
    );
  };

  const renderWelcome = () => {
    if (user?.name) {
      const initialName = user?.name
        .match(/(\b\S)?/g)
        .join('')
        .match(/(^\S|\S$)?/g)
        .join('')
        .toUpperCase();

      return (
        <View style={styles.viewWelcome}>
          <View style={styles.viewInitialName}>
            <Text style={styles.textInitialName}>{initialName}</Text>
          </View>
          <View>
            <Text style={styles.textWelcome}>Welcome</Text>
            <Text style={styles.textName}>{user?.name}</Text>
          </View>
        </View>
      );
    }
  };

  const renderPoint = () => {
    return (
      <View style={styles.viewPointHeader}>
        <Text style={styles.textYourPoint}>My Points</Text>
        <TouchableOpacity
          onPress={() => {
            Actions.detailPoint({intlData});
          }}
          style={styles.viewPointValue}>
          <Text style={styles.textPointValue}>{totalPoint} PTS</Text>
          <View style={styles.viewIconArrowRight}>
            <Image
              source={appConfig.iconArrowRight}
              style={styles.iconArrowRight}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeaderProfileHeaderTop = () => {
    return (
      <View style={styles.viewWelcomeAndPoint}>
        {renderWelcome()}
        {renderPoint()}
      </View>
    );
  };

  const renderProgressBar = () => {
    const percentage = progressBarCampaign?.progressInPercentage || 0;
    const decimal = percentage / 100;
    return (
      <View style={styles.viewProgressBar}>
        <ProgressBar
          progress={decimal}
          color={styles.primaryColor.color}
          style={styles.progressBar}
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

  const textInfoHandle = () => {
    if (progressBarCampaign) {
      return `Spend ${CurrencyFormatter(
        progressBarCampaign?.nextCustomerGroupCriteria?.totalPurchase -
          progressBarCampaign?.totalPurchaseByAccumulation,
      )} more to upgrade to`;
    }
    return '';
  };

  const renderTextInfo = () => {
    return (
      <Text style={styles.textInfo}>
        {textInfoHandle()}{' '}
        <Text style={[styles.textInfo, styles.bold]}>
          {progressBarCampaign?.nextGroup}{' '}
        </Text>{' '}
      </Text>
    );
  };

  const renderExpiry = () => {
    const dateExpiry = moment(user.expiryCustomerGroup).format('DD MMMM YYYY');
    if (additionalSetting().showExpiryMembership) {
      return (
        <Text style={styles.textExpiry}>
          Membership expires on {dateExpiry}
        </Text>
      );
    }
    return null;
  };
  const renderTierPaidMembership = () => {
    return (
      <Text style={styles.textCurrentTierPaidMembership}>
        {progressBarCampaign?.currentGroup}
      </Text>
    );
  };

  const renderHeaderProfileHeaderPaidMembership = () => {
    return (
      <View>
        {renderTierPaidMembership()}
        {renderExpiry()}
      </View>
    );
  };

  const renderHeaderProfileHeaderApplyCriteria = () => {
    return (
      <View>
        {renderProgressBar()}
        {renderTier()}
        {renderTextInfo()}
      </View>
    );
  };

  const renderHeaderProfileHeaderBottom = () => {
    if (progressBarCampaign?.showProgressBar) {
      return renderHeaderProfileHeaderApplyCriteria();
    } else {
      return renderHeaderProfileHeaderPaidMembership();
    }
  };

  const renderProfileHeader = () => {
    return (
      <TouchableOpacity
        style={styles.viewHeader}
        onPress={() => {
          Actions.membership();
        }}>
        {renderHeaderProfileHeaderTop()}
        <View style={styles.dividerHeader} />
        {renderHeaderProfileHeaderBottom()}
      </TouchableOpacity>
    );
  };

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderEditProfile = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          handleEditProfile();
        }}>
        <Image style={styles.iconSetting} source={appConfig.iconEditProfile} />
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
            style={styles.iconSetting}
            source={appConfig.iconLocation}
            resizeMode="stretch"
          />
          <Text style={styles.textIcon}>My Delivery Address</Text>
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
        <Image style={styles.iconSetting} source={appConfig.iconNotification} />
        <Text style={styles.textIcon}>Notification Setting</Text>
      </TouchableOpacity>
    );
  };

  const renderTermsAndConditions = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.termsAndConditions();
        }}>
        <Image
          style={styles.iconSetting}
          source={appConfig.iconTermsAndConditions}
        />
        <Text style={styles.textIcon}>Terms And Conditions</Text>
      </TouchableOpacity>
    );
  };

  const renderFAQ = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.faq();
        }}>
        <Image style={styles.iconSetting} source={appConfig.iconFAQ} />
        <Text style={styles.textIcon}>FAQ</Text>
      </TouchableOpacity>
    );
  };

  const openContactUs = () => {
    if (appConfig.contactUsVersion === 'starter') {
      return Actions.contactUsStarter();
    } else {
      return Actions.contactUsBasic();
    }
  };

  const renderContactUs = () => {
    if (!appConfig.contactUsVersion) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.viewOption} onPress={openContactUs}>
        <View style={styles.iconSetting}>
          <ContactSvg />
        </View>
        <Text style={styles.textIcon}>Contact Us</Text>
      </TouchableOpacity>
    );
  };

  const renderMembershipQRCode = () => {
    return (
      <TouchableOpacity
        style={styles.viewMembershipQRCode}
        onPress={handleOpenMyECardModal}>
        <Image source={appConfig.iconQRCode} style={styles.iconQR} />
        <View>
          <Text style={styles.textMembershipQRCode}>Membership QR Code</Text>
          <Text style={styles.textShowQRCode}>
            Tap to show your QR to the cashier.
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderReferral = () => {
    if (!hideReferral) {
      return (
        <TouchableOpacity
          style={styles.viewOption}
          onPress={() => {
            Actions.referral();
          }}>
          <Image
            style={styles.iconSetting}
            source={appConfig.iconReferral}
            resizeMode="stretch"
          />
          <Text style={styles.textIcon}>Referral</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderPrivacyPolicy = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.privacyPolicy();
        }}>
        <Image
          style={styles.iconSetting}
          source={appConfig.iconPrivacyPolicy}
        />
        <Text style={styles.textIcon}>Privacy Policy</Text>
      </TouchableOpacity>
    );
  };

  const renderLogout = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          handleOpenLogoutModal();
        }}>
        <Image style={styles.iconSetting} source={appConfig.iconLogout} />
        <Text style={styles.textLogout}>Logout</Text>
      </TouchableOpacity>
    );
  };

  const renderListMenu = (title, Icon, onPress) => (
    <TouchableOpacity onPress={onPress} style={styles.viewOption}>
      <View style={styles.iconSetting}>{Icon}</View>
      <Text style={styles.textIcon}>{title} </Text>
    </TouchableOpacity>
  );

  const renderTitleSettingV2 = title => (
    <View style={styles.titleSettingContainer}>
      <GlobalText style={styles.titleSettingText}>{title}</GlobalText>
    </View>
  );

  const handleAdditionalSetting = () => {
    const component = additionalSetting().additionalPolicy.map(data => {
      if (data?.show) {
        return renderListMenu(data.name, data.icon(), () =>
          openWebviewPage(data.link),
        );
      }
    });
    return component;
  };
  const rennderInfoMessage = () => {
    let type = '';
    let message = '';
    let showActionButton = false;
    let mode = null;
    let address = '';
    if (user?.isEmailVerified && user?.isPhoneNumberVerified) {
      type = 'success';
      message = 'Your email and mobile phone has been verified!';
    } else if (!user.isEmailVerified) {
      type = 'error';
      message = 'Your email has not been verified.';
      showActionButton = true;
      mode = 'Email';
      address = user.email;
    } else {
      type = 'error';
      message = 'Your mobile phone has not been verified.';
      showActionButton = true;
      mode = 'Mobile Number';
      address = user.phoneNumber;
    }
    return (
      <View style={styles.titleSettingContainer}>
        <InfoMessage
          showActionButton={showActionButton}
          actionBtnText="Verify"
          message={message}
          type={type}
          onActionBtnPress={handleEditProfile}
        />
      </View>
    );
  };

  const verifyOtp = (address, mode) => {
    Actions.changeCredentialsOTP({
      address,
      mode,
      dataDiri: user,
      isVerification: true,
    });
  };

  const openVoucher = () => {
    Actions.voucherV2();
  };

  const openStoreLocation = () => {
    Actions.favoriteOutlets();
  };

  const openPaymentMethod = () => {
    Actions.profilePaymentMethod();
  };

  const renderSettingV2 = () => (
    <View style={styles.viewSettings}>
      {renderMembershipQRCode()}
      {renderDivider()}
      {rennderInfoMessage()}
      {renderTitleSettingV2('General')}
      {renderEditProfile()}
      {renderMyDeliveryAddress()}
      {renderNotifications()}

      {additionalSetting().showPaymentMethodOnProfile ? (
        <>
          {renderDivider()}
          {renderTitleSettingV2('Payment Method')}
          {renderListMenu('Credit Card', <CreditCard />, openPaymentMethod)}
        </>
      ) : null}

      {renderDivider()}
      {renderTitleSettingV2('Rewards')}
      {renderListMenu('My Vouchers', <Voucher />, openVoucher)}
      {renderReferral()}
      {renderDivider()}
      {renderTitleSettingV2('Others')}
      {additionalSetting().storeLocationProfile ? (
        <>{renderListMenu('Store Location', <StoreSvg />, openStoreLocation)}</>
      ) : null}
      {handleAdditionalSetting()}
      {renderTermsAndConditions()}
      {renderPrivacyPolicy()}

      {renderFAQ()}
      {renderContactUs()}
      {renderDivider()}
      {renderLogout()}
      {renderAppVersion()}
    </View>
  );

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
          textSubmit="OK"
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
          textSubmit="OK"
        />
      );
    }
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
  const renderAppVersion = () => (
    <View style={styles.appVersionContainer}>
      <GlobalText style={styles.appVersionText}>
        v{DeviceInfo.getVersion()}
      </GlobalText>
    </View>
  );

  const onRefresh = async showLoading => {
    if (showLoading) {
      setRefreshing(true);
    }
    await dispatch(dataPointHistory());
    await dispatch(getUserProfile());
    await dispatch(dataPoint());
    await dispatch(myProgressBarCampaign());
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
      <Body>
        <LoadingScreen loading={isLoading} />
        <Header title="Profile" isRemoveBackIcon />
        <ScrollView
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          contentContainerStyle={styles.containerStyle}>
          {renderBackgroundImage()}
          {renderProfileHeader()}
          {renderSettingV2()}
          {renderDeleteAccountConfirmationDialog()}
          {renderLogoutConfirmationDialog()}
          {renderMyECardModal()}
        </ScrollView>
      </Body>
    </SafeAreaView>
  );
};

export default Profile;
