import React from 'react';
import DashedLine from 'react-native-dashed-line';

import {View, Text, Image, StyleSheet} from 'react-native';
import appConfig from '../../config/appConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    textHeader: {
      textAlign: 'center',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewStepIcons: {
      marginVertical: 16,
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewIcon: {
      width: 44,
      height: 44,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.accent,
    },
    icon: {
      width: 22,
      height: 22,
      tintColor: theme.colors.brandPrimary,
    },
    dividerDashed: {
      width: 54,
      color: theme.colors.textQuaternary,
    },
  });
  return styles;
};

const ReferralHowItWorks = () => {
  const styles = useStyles();

  const renderDashed = () => {
    return (
      <DashedLine
        style={styles.dividerDashed}
        dashLength={5}
        dashThickness={0.5}
        dashGap={5}
        dashColor={styles.dividerDashed.color}
      />
    );
  };

  const renderHeader = () => {
    return <Text style={styles.textHeader}>How it works</Text>;
  };

  const renderIcon = icon => {
    return (
      <View style={styles.viewIcon}>
        <Image source={icon} style={styles.icon} />
      </View>
    );
  };

  const renderStepIcons = () => {
    const iconStepGift = appConfig.iconStepGift;
    const iconStepLogin = appConfig.iconStepLogin;
    const iconStepSend = appConfig.iconStepSend;

    return (
      <View style={styles.viewStepIcons}>
        {renderIcon(iconStepGift)}
        {renderDashed()}
        {renderIcon(iconStepLogin)}
        {renderDashed()}
        {renderIcon(iconStepSend)}
      </View>
    );
  };

  const renderMarkdown = () => {
    return (
      <View>
        <Text>1. Invite your friends</Text>
        <Text>
          Copy your referral code or click share referral button and sent it to
          your friend.
        </Text>
        <Text>2. Your friend use the code</Text>
        <Text>
          They can use copied code on sign up page, or our system will
          automatically detect the referral if your friend clicked the shared
          link.
        </Text>
        <Text>3. You got the prize!</Text>
        <Text>Enjoy your bonus from inviting your friends! </Text>
      </View>
    );
  };

  return (
    <View>
      {renderHeader()}
      {renderStepIcons()}
      {renderMarkdown()}
    </View>
  );
};

export default ReferralHowItWorks;
