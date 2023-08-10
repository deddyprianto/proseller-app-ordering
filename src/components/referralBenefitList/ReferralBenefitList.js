import React from 'react';

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import appConfig from '../../config/appConfig';

import Theme from '../../theme';
import ReferralBenefitItem from './components/ReferralBenefitItem';
import ArrowBottom from '../../assets/svg/ArrowBottomSvg';
import ArrowUpSvg from '../../assets/svg/ArrowUpSvg';

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
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
  return styles;
};

const ReferralBenefitList = ({senderBenefit, referredBenefit, criteria}) => {
  const styles = useStyles();
  const [showAllItem, setShowAllItem] = React.useState(false);
  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const showHideBtn = () => {
    const sender = senderBenefit?.length || 0;
    const referred = referredBenefit?.length || 0;
    const calculation = referred + sender;
    return calculation > 4;
  };

  const handleArrowDropdown = () => {
    if (showHideBtn()) {
      if (showAllItem) {
        return <ArrowUpSvg />;
      }
      return <ArrowBottom />;
    }
    return null;
  };

  const renderSenderBenefit = () => {
    const benefitList = senderBenefit?.map((benefit, index) => {
      if (index > 1 && !showAllItem) return null;
      return <ReferralBenefitItem benefit={benefit} />;
    });

    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.textBenefit}>As a sender you will get</Text>
          {handleArrowDropdown()}
        </View>
        {benefitList}
      </View>
    );
  };

  const renderReferredBenefit = () => {
    const benefitList = referredBenefit?.map((benefit, index) => {
      if (index > 1 && !showAllItem) return null;
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
    if (criteria) {
      return (
        <>
          {renderDivider()}
          <View style={styles.viewCriteria}>
            <Image
              style={styles.iconInformation}
              source={appConfig.iconInformation}
            />
            <Text style={styles.textCriteria}>{criteria}</Text>
          </View>
        </>
      );
    }
  };

  const showAllItemHandle = () => {
    setShowAllItem(prevState => !prevState);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={showAllItemHandle}
      style={styles.root}>
      {renderSenderBenefit()}
      {renderDivider()}
      {renderReferredBenefit()}
      {renderCriteria()}
    </TouchableOpacity>
  );
};

export default ReferralBenefitList;
