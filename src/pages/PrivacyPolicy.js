import React from 'react';

import {StyleSheet, Text, SafeAreaView, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';

import {Header} from '../components/layout';
import Theme from '../theme';
import useBackHandler from '../hooks/backHandler/useBackHandler';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },

    textPrivacyPolicy: {
      margin: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const PrivacyPolicy = () => {
  const styles = useStyles();
  useBackHandler();
  const privacyPolicy = useSelector(
    state => state.settingReducer?.privacyPolicySettings?.privacyPolicy,
  );

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Privacy Policy" />
      <ScrollView>
        <Text style={styles.textPrivacyPolicy}>{privacyPolicy}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
