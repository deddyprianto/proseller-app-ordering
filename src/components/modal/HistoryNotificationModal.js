import React from 'react';
import {Text, TouchableOpacity, View, Modal, StyleSheet} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';

import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      borderRadius: 8,
    },
    header: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      paddingHorizontal: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footer: {
      paddingTop: 24,
      padding: 16,
    },
    textHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textBody: {
      textAlign: 'center',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textClose: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    touchableClose: {
      paddingVertical: 10,
      backgroundColor: theme.colors.textQuaternary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
  });
  return styles;
};

const HistoryNotificationModal = ({open, handleClose, value}) => {
  const styles = useStyles();

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textHeader}>{value.title}</Text>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Text style={styles.textBody}>{value.body}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.touchableClose}
          onPress={async () => {
            handleClose();
          }}>
          <Text style={styles.textClose}>OK</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal transparent visible={open} onDismiss={handleClose}>
      <Provider>
        <Portal>
          <Dialog visible={open} onDismiss={handleClose} style={styles.root}>
            {renderHeader()}
            {renderBody()}
            {renderFooter()}
          </Dialog>
        </Portal>
      </Provider>
    </Modal>
  );
};

export default HistoryNotificationModal;
