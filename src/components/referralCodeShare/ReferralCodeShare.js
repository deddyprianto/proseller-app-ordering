import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Clipboard,
  Share,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {getReferralDynamicLink} from '../../actions/referral.action';
import {showSnackbar} from '../../actions/setting.action';
import appConfig from '../../config/appConfig';
import awsConfig from '../../config/awsConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    footer: {
      paddingHorizontal: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewShareReferral: {
      flex: 1,
      height: 36,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    viewCopyCode: {
      flex: 1,
      marginRight: 16,
      height: 36,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
    },
    textHeader: {
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textReferralCode: {
      textAlign: 'center',
      fontSize: theme.fontSize[36],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textShareReferral: {
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCopyCode: {
      textAlign: 'center',
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    iconShareReferral: {
      marginRight: 8,
      width: 20,
      height: 20,
      tintColor: theme.colors.textSecondary,
    },
    iconCopyCode: {
      marginRight: 8,
      width: 20,
      height: 20,
      tintColor: theme.colors.textQuaternary,
    },
  });
  return styles;
};

const ReferralCodeShare = ({referralCode}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const handleShare = async () => {
    const link = await dispatch(getReferralDynamicLink());
    const url = link?.url;
    try {
      await Share.share({
        message: `Hellooo! I enjoy ordering from ${
          awsConfig.COMPANY_NAME
        } and I think you will too! Use the referral code ${referralCode} or order now at ${url} and receive a gift!`,
      });
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Share Referral Failed!',
        }),
      );
    }
  };

  const handleCopyToClipboard = () => {
    dispatch(showSnackbar({message: 'Copied Text', type: 'success'}));
    Clipboard.setString(referralCode);
  };

  const renderHeader = () => {
    return <Text style={styles.textHeader}>Your referral code</Text>;
  };
  const renderReferralCode = () => {
    return <Text style={styles.textReferralCode}>{referralCode}</Text>;
  };

  const renderCopyCode = () => {
    return (
      <TouchableOpacity
        style={styles.viewCopyCode}
        onPress={() => {
          handleCopyToClipboard();
        }}>
        <Image source={appConfig.iconCopy} style={styles.iconCopyCode} />
        <Text style={styles.textCopyCode}>Copy Code</Text>
      </TouchableOpacity>
    );
  };

  const renderShareReferral = () => {
    return (
      <TouchableOpacity
        disabled={!referralCode}
        style={styles.viewShareReferral}
        onPress={() => {
          handleShare();
        }}>
        <Image source={appConfig.iconShare} style={styles.iconShareReferral} />
        <Text style={styles.textShareReferral}>Share Referral</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderCopyCode()}
        {renderShareReferral()}
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}
      {renderReferralCode()}
      {renderFooter()}
    </View>
  );
};
export default ReferralCodeShare;
