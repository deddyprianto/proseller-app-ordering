import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';

import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    container: {
      paddingVertical: 16,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
    },
    header: {
      alignItems: 'center',
    },
    body: {
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: theme.colors.textTertiary,
    },
    footer: {
      paddingHorizontal: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textSubmit: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCancel: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInput: {
      flex: 1,
      height: '100%',
      textAlignVertical: 'top',
      margin: 0,
      padding: 0,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCountInput: {
      height: '100%',
      textAlignVertical: 'bottom',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewTextInput: {
      width: '100%',
      height: 100,
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    touchableSubmit: {
      flex: 1,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: theme.colors.buttonActive,
    },
    touchableCancel: {
      flex: 1,
      marginRight: 16,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonOutlined,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale2,
      marginVertical: 16,
    },
  });
  return styles;
};

const NoteCartModal = ({open, value, handleClose, handleSubmit}) => {
  const styles = useStyles();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setNotes(value);
  }, [value, open]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textHeader}>Add Notes</Text>
      </View>
    );
  };

  const renderTextInput = () => {
    const textInputLength = notes.length;
    return (
      <View style={styles.viewTextInput}>
        <TextInput
          style={styles.textInput}
          autoFocus
          value={notes}
          placeholder="Example: please use less plastic"
          multiline
          maxLength={140}
          numberOfLines={3}
          onChangeText={value => {
            setNotes(value);
          }}
        />
        <Text style={styles.textCountInput}>{textInputLength}/140</Text>
      </View>
    );
  };

  const renderBody = () => {
    return <View style={styles.body}>{renderTextInput()}</View>;
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.touchableCancel} onPress={handleClose}>
          <Text style={styles.textCancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableSubmit}
          onPress={() => {
            handleSubmit(notes);
            handleClose();
          }}>
          <Text style={styles.textSubmit}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal transparent visible={open} onDismiss={handleClose}>
      <View style={styles.root}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {renderHeader()}
              <View style={styles.divider} />
              {renderBody()}
              <View style={styles.divider} />
              {renderFooter()}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default NoteCartModal;
