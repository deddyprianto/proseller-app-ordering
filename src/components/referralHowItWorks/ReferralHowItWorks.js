import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import HTMLView from 'react-native-htmlview';
import Theme from '../../theme';

const webStyles = StyleSheet.create({
  li: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  strong: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  ol: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  ul: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  p: {
    fontFamily: 'Poppins-Medium',
  },
});

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
    viewHowItWorks: {
      paddingHorizontal: 16,
      marginTop: 16,
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

const ReferralHowItWorks = ({howItWorks}) => {
  const styles = useStyles();

  const renderHeader = () => {
    return <Text style={styles.textHeader}>How it works</Text>;
  };
  const renderMarkdown = () => {
    if (howItWorks) {
      return (
        <View style={styles.viewHowItWorks}>
          <HTMLView stylesheet={webStyles} value={howItWorks} />
        </View>
      );
    }
    return null;
  };

  return (
    <View>
      {renderHeader()}
      {renderMarkdown()}
    </View>
  );
};

export default ReferralHowItWorks;
