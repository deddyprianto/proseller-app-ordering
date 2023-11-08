import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import {Actions} from 'react-native-router-flux';
import {ProgressBar} from 'react-native-paper';

import moment from 'moment';

import Theme from '../../theme/Theme';

import useSettings from '../../hooks/settings/useSettings';

import awsConfig from '../../config/awsConfig';
import appConfig from '../../config/appConfig';
import additionalSetting from '../../config/additionalSettings';

import CurrencyFormatter from '../../helper/CurrencyFormatter';

import CheckListGreenSvg from '../../assets/svg/ChecklistGreenSvg';

const useStyles = () => {
  const theme = Theme();
  const WIDTH = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    root: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 16,
      margin: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
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
    textWelcome: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textName: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsBold,
      marginRight: 8,
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
      flex: 1,
      textAlign: 'center',
      marginTop: 16,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfoBold: {
      flex: 1,
      textAlign: 'center',
      marginTop: 16,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
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
    viewPoint: {
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
    viewUsernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconArrowRight: {
      width: 16,
      height: 16,
      tintColor: 'white',
    },
    divider: {
      marginVertical: 16,
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale3,
    },
  });

  return styles;
};

const MembershipInfo = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const {checkLowerPriorityMandatory} = useSettings();

  const [user, setUser] = useState({});

  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  const totalPoint = useSelector(
    state => state.rewardsReducer.dataPoint.totalPoint,
  );

  const progressBarCampaign = useSelector(
    state => state.accountsReducer?.myProgressBarCampaign.myProgress,
  );

  const intlData = useSelector(state => state.intlData);

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

  const renderVerifiedUser = () => {
    if (!checkLowerPriorityMandatory()) {
      if (user?.isEmailVerified || user?.isPhoneNumberVerified) {
        return <CheckListGreenSvg width={18} height={18} />;
      }
      return null;
    }
    if (checkLowerPriorityMandatory()) {
      if (user?.isEmailVerified && user?.isPhoneNumberVerified) {
        return <CheckListGreenSvg width={18} height={18} />;
      }
      return null;
    }
    return null;
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
            <View style={styles.viewUsernameContainer}>
              <Text style={styles.textName}>{user?.name}</Text>
              {renderVerifiedUser()}
            </View>
          </View>
        </View>
      );
    }
  };

  const renderPoint = () => {
    return (
      <View style={styles.viewPoint}>
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

  const renderTextInfo = () => {
    const leftSpend =
      progressBarCampaign?.nextCustomerGroupCriteria?.totalPurchase -
      progressBarCampaign?.totalPurchaseByAccumulation;

    const textCampaign =
      progressBarCampaign &&
      `Spend ${CurrencyFormatter(leftSpend)} more to upgrade to `;

    return (
      <Text style={styles.textInfo}>
        {textCampaign}
        <Text style={styles.textInfoBold}>
          {progressBarCampaign?.nextGroup}
        </Text>
      </Text>
    );
  };

  const renderPaidMembership = () => {
    return (
      <View>
        {renderTierPaidMembership()}
        {renderExpiry()}
      </View>
    );
  };

  const renderApplyCriteria = () => {
    return (
      <View>
        {renderProgressBar()}
        {renderTier()}
        {renderTextInfo()}
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

  const renderType = () => {
    if (progressBarCampaign?.showProgressBar) {
      return renderApplyCriteria();
    } else {
      return renderPaidMembership();
    }
  };
  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => {
        Actions.membership();
      }}>
      {renderWelcomeAndPoint()}
      {renderDivider()}
      {renderType()}
    </TouchableOpacity>
  );
};

export default MembershipInfo;
