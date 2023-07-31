import React from 'react';

import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';

import {Header} from '../components/layout';
import appConfig from '../config/appConfig';
import Theme from '../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    body: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    textContactUs: {
      textAlign: 'center',
      margin: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    imageMail: {
      height: 246,
      width: 246,
      marginTop: 54,
    },
    viewReachOut: {
      minWidth: '100%',
      borderRadius: 8,
      backgroundColor: theme.colors.brandPrimary,
      padding: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    viewFeedback: {
      display: 'flex',
      alignItems: 'center',
      marginVertical: 16,
    },
    viewEmail: {
      marginBottom: 54,
      display: 'flex',
      alignItems: 'center',
    },
    textEmail1: {
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textEmail2: {
      textDecorationLine: 'underline',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textFeedback1: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textFeedback2: {
      textDecorationLine: 'underline',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textReachOut: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale3,
    },
  });
  return styles;
};

const ContactUsFuntoast = () => {
  const styles = useStyles();

  const renderImage = () => {
    return <Image source={appConfig.imageMail} style={styles.imageMail} />;
  };

  const renderTextContactUs = () => {
    return (
      <Text style={styles.textContactUs}>
        We're always looking for ways to improve our products and services. If
        you have any feedback or suggestions, we'd love to hear from you! Please
        click the button below to share your thoughts with us.
      </Text>
    );
  };

  const renderButtonReachOut = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL('https://www.funtoast.com.sg/contact/feedback/');
        }}
        style={styles.viewReachOut}>
        <Text style={styles.textReachOut}>Reach Out</Text>
      </TouchableOpacity>
    );
  };

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderFeedback = () => {
    return (
      <View style={styles.viewFeedback}>
        <Text style={styles.textFeedback1}>For feedback, email us at</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('mailto:feedback@funtoast.com.sg');
          }}>
          <Text style={styles.textFeedback2}>feedback@funtoast.com.sg</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmail = () => {
    return (
      <View style={styles.viewEmail}>
        <Text style={styles.textEmail1}>
          For bulk orders/marketing and enquiries, email us at
        </Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('mailto:design@funtoast.com.sg');
          }}>
          <Text style={styles.textEmail2}>design@funtoast.com.sg</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Contact Us" />
      <ScrollView contentContainerStyle={styles.body}>
        {renderImage()}
        {renderTextContactUs()}
        {renderButtonReachOut()}
        {renderDivider()}
        {renderFeedback()}
        {renderEmail()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsFuntoast;
