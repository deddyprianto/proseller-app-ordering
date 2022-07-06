import React from 'react';
import {Text, TouchableOpacity, Modal, StyleSheet, View} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      padding: 24,
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textTitle: {
      marginBottom: 24,
      textAlign: 'center',
      color: theme.colors.text1,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textContent: {
      marginBottom: 24,
      textAlign: 'center',
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textClose: {
      textAlign: 'center',
      color: theme.colors.text2,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textSubmit: {
      textAlign: 'center',
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    touchableClose: {
      flex: 1,
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderColor: theme.colors.border,
    },
    touchableSubmit: {
      flex: 1,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.primary,
    },
    space: {
      marginHorizontal: 4,
    },
  });
  return styles;
};

const ConfirmationDialog = ({
  open,
  handleSubmit,
  handleClose,
  isLoading,
  textSubmit,
  textCancel,
  textTitle,
  textDescription,
}) => {
  const styles = useStyles();

  const renderCloseButton = () => {
    const text = textCancel || 'Cancel';

    if (handleClose) {
      return (
        <TouchableOpacity
          style={styles.touchableClose}
          onPress={handleClose}
          disabled={isLoading}>
          <Text style={styles.textClose}>{text}</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderSpace = () => {
    if (handleClose && handleSubmit) {
      return <View style={styles.space} />;
    }
  };

  const renderSubmitButton = () => {
    const text = textSubmit || 'Submit';
    const textLoading = isLoading ? 'Loading....' : text;

    if (handleSubmit) {
      return (
        <TouchableOpacity
          style={styles.touchableSubmit}
          onPress={handleSubmit}
          disabled={isLoading}>
          <Text style={styles.textSubmit}>{textLoading}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <Modal animationType="none" transparent={true}>
      <Provider>
        <Portal>
          <Dialog
            visible={open}
            onDismiss={handleClose}
            style={styles.container}>
            <Text style={styles.textTitle}>{textTitle}</Text>
            <Text style={styles.textContent}>{textDescription}</Text>
            <View style={styles.footer}>
              {renderCloseButton()}
              {renderSpace()}
              {renderSubmitButton()}
            </View>
          </Dialog>
        </Portal>
      </Provider>
    </Modal>
  );
};

export default ConfirmationDialog;
