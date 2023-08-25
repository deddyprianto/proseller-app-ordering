import React from 'react';

import {StyleSheet, Text, SafeAreaView, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';

import {Header} from '../components/layout';
import Theme from '../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    textTermsAndConditions: {
      margin: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return styles;
};

const TermsAndConditions = () => {
  const styles = useStyles();

  const termsAndConditions = useSelector(
    state => state.settingReducer.termsAndConditionsSettings.termsAndConditions,
  );

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Terms & Conditions" />
      <ScrollView>
        <Text style={styles.textTermsAndConditions}>{termsAndConditions}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
