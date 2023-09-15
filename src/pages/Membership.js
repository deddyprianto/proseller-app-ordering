import React from 'react';

import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import {useSelector} from 'react-redux';

import {Body, Header} from '../components/layout';
import Theme from '../theme/Theme';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import moment from 'moment';
import useBackHandler from '../hooks/backHandler/useBackHandler';

const useStyles = () => {
  const {fontFamily, fontSize, colors} = Theme();
  const styles = StyleSheet.create({
    viewMembershipCard: {
      margin: 16,
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.brandTertiary,
    },
    viewSeeAllTier: {
      marginTop: 54,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewMembershipDetail: {
      margin: 16,
    },
    textMembershipDetail: {
      marginBottom: 16,
      color: colors.textPrimary,
      fontSize: fontSize[16],
      fontFamily: fontFamily.poppinsSemiBold,
    },
    textMembershipDetailDescription: {
      color: colors.textPrimary,
      fontSize: fontSize[14],
      fontFamily: fontFamily.poppinsMedium,
    },
    textCurrentMembership: {
      color: colors.textSecondary,
      fontSize: fontSize[14],
      fontFamily: fontFamily.poppinsMedium,
    },
    textCurrentMembershipValue: {
      color: colors.textSecondary,
      fontSize: fontSize[24],
      fontFamily: fontFamily.poppinsSemiBold,
    },
    textCurrentMembershipExpired: {
      color: colors.textSecondary,
      fontSize: fontSize[14],
      fontFamily: fontFamily.poppinsMedium,
    },
    textSeeAllTier: {
      color: colors.textSecondary,
      fontSize: fontSize[14],
      fontFamily: fontFamily.poppinsMedium,
    },
    iconRight: {
      width: 20,
      height: 20,
      marginLeft: 8,
      tintColor: colors.textSecondary,
    },
    divider: {
      height: 1,
      marginHorizontal: 16,
      backgroundColor: colors.greyScale3,
    },
  });
  return styles;
};

const Membership = () => {
  const styles = useStyles();
  useBackHandler();
  const myProgress = useSelector(
    state => state.accountsReducer?.myProgressBarCampaign.myProgress,
  );

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderMembershipTitle = () => {
    const dateExpiry = moment(myProgress?.membershipExpiry).format(
      'DD MMMM YYYY',
    );
    return (
      <View>
        <Text style={styles.textCurrentMembership}>Current Membership</Text>
        <Text style={styles.textCurrentMembershipValue}>
          {myProgress?.currentGroup}
        </Text>
        <Text style={styles.textCurrentMembershipExpired}>
          Expires on {dateExpiry}
        </Text>
      </View>
    );
  };

  const renderSeaAllTier = () => {
    return (
      <TouchableOpacity
        style={styles.viewSeeAllTier}
        onPress={() => {
          Actions.membershipAllTier();
        }}>
        <Text style={styles.textSeeAllTier}>See All Tier</Text>
        <Image source={appConfig.iconArrowRight} style={styles.iconRight} />
      </TouchableOpacity>
    );
  };

  const renderMembershipCard = () => {
    return (
      <View style={styles.viewMembershipCard}>
        {renderMembershipTitle()}
        {renderSeaAllTier()}
      </View>
    );
  };

  const renderMembershipDetail = () => {
    return (
      <View style={styles.viewMembershipDetail}>
        <Text style={styles.textMembershipDetail}>
          {myProgress?.currentGroup} Membership Detail
        </Text>
        <Text style={styles.textMembershipDetailDescription}>
          {myProgress?.description}
        </Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView>
        {renderMembershipCard()}
        {renderDivider()}
        {renderMembershipDetail()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView>
      <Body>
        <Header title="Membership" />
        {renderBody()}
      </Body>
    </SafeAreaView>
  );
};

export default Membership;
