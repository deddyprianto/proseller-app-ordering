import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      minHeight: 100,
      borderRadius: 10,
    },
    titleContainer: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    descriptionContainer: {
      padding: 16,
    },
    titleText: {
      textAlign: 'center',
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    descriptionText: {
      textAlign: 'center',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    closeText: {
      textAlign: 'center',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    okText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    buttonContainer: {
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonOk: {
      height: 36,
      flex: 1,
      padding: 7,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.buttonActive,
    },
    buttonClose: {
      height: 36,
      flex: 1,
      padding: 7,
      borderRadius: 8,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: theme.colors.greyScale3,
    },
  });
  return styles;
};

const ModalError = ({
  isOpen,
  title,
  description,
  onClose,
  onOk,
  titleButtonOk,
  titleButtonClose,
}) => {
  const styles = useStyles();
  const {colors} = Theme();

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title} </Text>
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description} </Text>
      </View>
    );
  };

  const renderButtonOk = () => {
    const text = titleButtonOk || 'OK';
    return (
      <TouchableOpacity
        onPress={onOk}
        style={[styles.buttonOk, {backgroundColor: colors.buttonActive}]}>
        <Text style={styles.okText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonClose = () => {
    const text = titleButtonClose || 'Close';
    if (onClose) {
      return (
        <TouchableOpacity
          onPress={onClose}
          style={[styles.buttonClose, {backgroundColor: colors.buttonStandBy}]}>
          <Text style={styles.closeText}>{text}</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderButton = () => {
    return (
      <View style={styles.buttonContainer}>
        {renderButtonClose()}
        {renderButtonOk()}
      </View>
    );
  };

  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={isOpen}
      useNativeDriver={true}>
      <View style={styles.container}>
        {renderTitle()}
        {renderDivider()}
        {renderDescription()}
        {renderDivider()}
        {renderButton()}
        <View />
      </View>
    </Modal>
  );
};

export default React.memo(ModalError);
