import moment from 'moment';
import React from 'react';

import {StyleSheet, View, Text, Image} from 'react-native';
import appConfig from '../../../config/appConfig';
import TextBlurFormatter from '../../../helper/TextBlurFormatter';
import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.background,
    },
    viewNameAndDate: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    viewPrize: {
      marginBottom: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    textName: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDate: {
      fontSize: theme.fontSize[12],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPendingPrize: {
      fontSize: theme.fontSize[14],
      color: '#F8B200',
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textIssuedPrize: {
      fontSize: theme.fontSize[14],
      color: '#4EBE19',
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDescription: {
      fontSize: theme.fontSize[12],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    icon: {
      width: 20,
      height: 16,
      marginRight: 10,
    },
  });
  return styles;
};

const ReferralInvitedItem = ({item}) => {
  const styles = useStyles();

  const renderName = () => {
    const text = TextBlurFormatter(item?.name);

    return <Text style={styles.textName}>{text}</Text>;
  };

  const renderDate = () => {
    const dateFormatted = moment(item?.date).format('DD MMM YYYY hh:mm');

    return <Text style={styles.textDate}>{dateFormatted}</Text>;
  };

  const renderNameAndDate = () => {
    return (
      <View style={styles.viewNameAndDate}>
        {renderName()}
        {renderDate()}
      </View>
    );
  };

  const renderIssuedPrize = () => {
    return (
      <View style={styles.viewPrize}>
        <Image source={appConfig.iconIssuedPrize} style={styles.icon} />
        <Text style={styles.textIssuedPrize}>Issued Prize</Text>
      </View>
    );
  };
  const renderPendingPrize = () => {
    return (
      <View style={styles.viewPrize}>
        <Image source={appConfig.iconPendingPrize} style={styles.icon} />
        <Text style={styles.textPendingPrize}>Pending Prize</Text>
      </View>
    );
  };

  const renderStatus = () => {
    if (item?.status === 'PENDING_PRIZE') {
      return renderPendingPrize();
    } else {
      return renderIssuedPrize();
    }
  };

  const renderDescription = () => {
    if (item?.description) {
      return <Text style={styles.textDescription}>{item?.description}</Text>;
    }
  };

  return (
    <View style={styles.root}>
      {renderNameAndDate()}
      {renderStatus()}
      {renderDescription()}
    </View>
  );
};

export default ReferralInvitedItem;
