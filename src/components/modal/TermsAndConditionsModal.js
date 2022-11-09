import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';

import appConfig from '../../config/appConfig';
import Theme from '../../theme';
import {useSelector} from 'react-redux';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    container: {
      margin: 16,
      width: '100%',
      maxHeight: '100%',
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
    },
    body: {
      paddingHorizontal: 16,
    },
    footer: {
      padding: 16,
      backgroundColor: 'white',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
    },
    textHeader: {
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[18],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textBody: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textButton: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewIconClose: {
      position: 'absolute',
      right: 16,
      top: 12,
    },
    viewButtonActive: {
      padding: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    viewButtonDisabled: {
      padding: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonDisabled,
    },
    iconClose: {
      width: 30,
      height: 30,
    },
  });
  return styles;
};

const TermsAndConditionsModal = ({open, handleClose, onPress}) => {
  const styles = useStyles();
  const [isDisabled, setIsDisabled] = useState(true);

  const termsAndConditions = useSelector(
    state => state.settingReducer.termsAndConditionsSettings.termsAndConditions,
  );

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textHeader}>Terms & Conditions</Text>
        <TouchableOpacity style={styles.viewIconClose} onPress={handleClose}>
          <Image source={appConfig.iconClose} style={styles.iconClose} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.body}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            setIsDisabled(false);
          }
        }}
        scrollEventThrottle={400}>
        <Text style={styles.textBody}>{termsAndConditions}</Text>
      </ScrollView>
    );
  };

  const renderFooter = () => {
    const stylesButton = isDisabled
      ? styles.viewButtonDisabled
      : styles.viewButtonActive;

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={isDisabled}
          onPress={onPress}
          style={stylesButton}>
          <Text style={styles.textButton}>Understand</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal animationType="none" transparent={true} visible={open}>
      <View style={styles.root} onPress={handleClose}>
        <View style={styles.container}>
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </View>
      </View>
    </Modal>
  );
};

export default TermsAndConditionsModal;
