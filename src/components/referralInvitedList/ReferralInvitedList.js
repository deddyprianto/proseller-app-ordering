import React from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';
import appConfig from '../../config/appConfig';
import Theme from '../../theme';
import ReferralInvitedItem from './components/ReferralInvitedItem';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    viewEmpty: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    viewInvitedList: {
      padding: 16,
    },
    textHeader: {
      marginLeft: 16,
      fontSize: theme.fontSize[16],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textEmpty1: {
      textAlign: 'center',
      fontSize: theme.fontSize[16],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textEmpty2: {
      width: '60%',
      marginBottom: 8,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    imageEmpty: {
      width: 180,
      height: 180,
      marginVertical: 25,
    },
  });
  return styles;
};

const ReferralInvitedList = ({referralInvitedList}) => {
  const styles = useStyles();

  const textHeader = () => {
    const dataAmount = referralInvitedList?.amount || '0';
    const dataCapacity = referralInvitedList?.capacity || '0';
    return (
      <Text style={styles.textHeader}>
        {dataAmount}/{dataCapacity} people invited
      </Text>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.viewEmpty}>
        <Image
          source={appConfig.imageEmptyReferral}
          style={styles.imageEmpty}
        />
        <Text style={styles.textEmpty1}>No Referred Friend</Text>
        <Text style={styles.textEmpty2}>
          Start share your referral link or code to your friend to get bonus
        </Text>
      </View>
    );
  };

  const renderInvitedList = () => {
    const result = referralInvitedList?.list?.map(value => {
      return <ReferralInvitedItem item={value} />;
    });

    return <View style={styles.viewInvitedList}>{result}</View>;
  };

  const renderBody = () => {
    const isEmpty = referralInvitedList?.amount === 0;
    if (isEmpty) {
      return renderEmpty();
    } else {
      return renderInvitedList();
    }
  };

  return (
    <View>
      {textHeader()}
      {renderBody()}
    </View>
  );
};

export default ReferralInvitedList;
