import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  StyleSheet,
} from 'react-native';

import appConfig from '../../config/appConfig';
import Theme from '../../theme';

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
    container2: {
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text1: {
      marginBottom: 8,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    text2: {
      lineHeight: 21,
      textAlign: 'center',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    text3: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewButton: {
      marginTop: 24,
      width: '100%',
      backgroundColor: theme.colors.buttonActive,
      borderRadius: 8,
      padding: 8,
    },
    viewButtonDisabled: {
      marginTop: 24,
      width: '100%',
      backgroundColor: theme.colors.buttonDisabled,
      borderRadius: 8,
      padding: 8,
    },
    image: {
      margin: 16,
      width: 128,
      height: 128,
    },
  });
  return styles;
};

const TextWarningModal = ({
  open,
  handleClose,
  title,
  description,
  image,
  disabled,
}) => {
  const styles = useStyles();

  const renderHeader = () => {
    if (image) {
      return <Image source={image} style={styles.image} />;
    }
  };
  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Text style={styles.text1}>{title}</Text>
        <Text style={styles.text2}>{description}</Text>
      </View>
    );
  };
  const renderFooter = () => {
    const styleView = disabled ? styles.viewButtonDisabled : styles.viewButton;
    return (
      <TouchableOpacity
        style={styleView}
        onPress={handleClose}
        disabled={disabled}>
        <Text style={styles.text3}>OK</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="none" transparent={true} visible={open}>
      <View style={styles.root} onPress={handleClose}>
        <View style={styles.container}>
          <View style={styles.container2}>
            {renderHeader()}
            {renderBody()}
            {renderFooter()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TextWarningModal;
