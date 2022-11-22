import React from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';
import appConfig from '../../config/appConfig';

import Theme from '../../theme';
import ReferralBenefitItem from './components/ReferralBenefitItem';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      margin: 16,
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      borderStyle: 'dashed',
      borderColor: theme.colors.brandPrimary,
    },
    textBenefit: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textCriteria: {
      flex: 1,
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewCriteria: {
      display: 'flex',
      flexDirection: 'row',
    },
    iconInformation: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    divider: {
      marginVertical: 8,
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale4,
    },
  });
  return styles;
};

const ReferralBenefitList = ({senderBenefit, referredBenefit}) => {
  const styles = useStyles();

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderSenderBenefit = () => {
    const benefitList = senderBenefit?.map(benefit => {
      return <ReferralBenefitItem benefit={benefit} />;
    });

    return (
      <View>
        <Text style={styles.textBenefit}>As a sender you will get</Text>
        {benefitList}
      </View>
    );
  };

  const renderReferredBenefit = () => {
    const benefitList = referredBenefit?.map(benefit => {
      return <ReferralBenefitItem benefit={benefit} />;
    });

    return (
      <View>
        <Text style={styles.textBenefit}>Your referred friend will get</Text>
        {benefitList}
      </View>
    );
  };

  const renderCriteria = () => {
    return (
      <View style={styles.viewCriteria}>
        <Image
          style={styles.iconInformation}
          source={appConfig.iconInformation}
        />
        <Text style={styles.textCriteria}>
          After made 1 transaction or purchase minimal SGD 30
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderSenderBenefit()}
      {renderDivider()}
      {renderReferredBenefit()}
      {renderDivider()}
      {renderCriteria()}
    </View>
  );
};

export default ReferralBenefitList;
