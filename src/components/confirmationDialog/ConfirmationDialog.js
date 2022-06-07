import React from 'react';
import {Text, TouchableOpacity, Modal} from 'react-native';
import {Dialog, Portal, Provider} from 'react-native-paper';
import colorConfig from '../../config/colorConfig';

const styles = {
  container: {padding: 24},
  title: {textAlign: 'center', fontSize: 16, fontWeight: 'bold'},
  textContent: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#B7B7B7',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  touchableClose: {
    borderColor: '#D6D6D6',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '49%',
  },
  textClose: {
    color: '#B7B7B7',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  touchableSubmit: {
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '49%',
  },
  textSubmit: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
};

const ConfirmationDialog = ({
  open,
  handleSubmit,
  handleClose,
  isLoading,
  textSubmit,
  textTitle,
  textDescription,
}) => {
  const renderCloseButton = () => {
    return (
      <TouchableOpacity
        style={styles.touchableClose}
        onPress={handleClose}
        disabled={isLoading}>
        <Text style={styles.textClose}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  const renderSubmitButton = () => {
    const text = isLoading ? 'Loading....' : textSubmit;

    return (
      <TouchableOpacity
        style={styles.touchableSubmit}
        onPress={handleSubmit}
        disabled={isLoading}>
        <Text style={styles.textSubmit}>{text}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal animationType="none" transparent={true}>
      <Provider>
        <Portal>
          <Dialog
            visible={open}
            onDismiss={handleClose}
            style={styles.container}>
            <Dialog.Title style={styles.title}>{textTitle}</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.textContent}>{textDescription}</Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.actions}>
              {renderCloseButton()}
              {renderSubmitButton()}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Provider>
    </Modal>
  );
};

export default ConfirmationDialog;
