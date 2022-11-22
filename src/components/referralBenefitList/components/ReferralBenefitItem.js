import React from 'react';

import {StyleSheet, View, Text} from 'react-native';

import Theme from '../../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconDot: {
      height: 4,
      width: 4,
      marginTop: 10,
      marginRight: 4,
      borderRadius: 100,
      backgroundColor: theme.colors.textQuaternary,
    },
    text: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return styles;
};

const ReferralBenefitItem = ({benefit}) => {
  const styles = useStyles();
  return (
    <View style={styles.root}>
      <View style={styles.iconDot} />
      <Text style={styles.text}>{benefit}</Text>
    </View>
  );
};

export default ReferralBenefitItem;
