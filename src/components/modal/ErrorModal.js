import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    minHeight: 100,
    padding: 10,
    borderRadius: 10,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  titleText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    padding: 7,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
  },
});

const ModalError = ({isOpen, title, description, onClose, onOk}) => {
  const {colors} = Theme();
  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={isOpen}
      useNativeDriver={true}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title} </Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description} </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onOk}
            style={[styles.button, {backgroundColor: colors.primary}]}>
            <Text style={styles.errorText}>Ok</Text>
          </TouchableOpacity>
        </View>
        <View />
      </View>
    </Modal>
  );
};

export default React.memo(ModalError);
