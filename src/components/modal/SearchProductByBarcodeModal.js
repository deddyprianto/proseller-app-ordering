import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';

import appConfig from '../../config/appConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    container: {
      padding: 16,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: theme.colors.background,
    },
    header: {
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      marginBottom: 16,
    },
    textHeader: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textBody: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textError: {
      marginTop: 4,
      color: theme.colors.semanticError,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textSearch: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInput: {
      lineHeight: 22,
      padding: 0,
      flex: 1,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    viewFieldSearch: {
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: theme.colors.textTertiary,
    },
    viewFieldSearchError: {
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderWidth: 2,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: theme.colors.semanticError,
    },
    touchableSearch: {
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: theme.colors.buttonActive,
    },
    iconClose: {
      width: 22,
      height: 22,
    },
    iconSuccess: {
      width: 24,
      height: 24,
      tintColor: theme.colors.semanticSuccess,
    },
    iconFailed: {
      width: 24,
      height: 24,
      tintColor: theme.colors.semanticError,
    },
  });
  return styles;
};

const SearchProductByBarcodeModal = ({
  open,
  handleClose,
  onSubmit,
  condition,
}) => {
  const styles = useStyles();
  const [searchTextInput, setSearchTextInput] = useState('');
  const isError = condition === 'error';

  const handleButtonSearchClick = () => {
    onSubmit(searchTextInput);
  };

  const renderTextHeader = () => {
    return <Text style={styles.textHeader}>Enter Barcode Number</Text>;
  };
  const renderIconHeader = () => {
    return (
      <TouchableOpacity onPress={handleClose}>
        <Image style={styles.iconClose} source={appConfig.iconClose} />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {renderTextHeader()}
        {renderIconHeader()}
      </View>
    );
  };

  const renderTextInput = () => {
    return (
      <TextInput
        autoFocus
        style={styles.textInput}
        value={searchTextInput}
        placeholder="Input Product Barcode"
        onChangeText={value => {
          setSearchTextInput(value);
        }}
        onSubmitEditing={value => {
          onSubmit(value);
        }}
      />
    );
  };

  const renderIconSearch = () => {
    switch (condition) {
      case 'success':
        return (
          <Image source={appConfig.iconCheck} style={styles.iconSuccess} />
        );
      case 'error':
        return (
          <Image source={appConfig.iconWarning} style={styles.iconFailed} />
        );
      default:
        return;
    }
  };

  const renderFieldSearch = () => {
    const styleView = isError
      ? styles.viewFieldSearchError
      : styles.viewFieldSearch;

    return (
      <View style={styleView}>
        {renderTextInput()}
        {renderIconSearch()}
      </View>
    );
  };

  const renderTextBody = () => {
    return <Text style={styles.textBody}>Product Barcode</Text>;
  };

  const renderTextError = () => {
    if (isError) {
      return (
        <Text style={styles.textError}>
          Product Barcode is invalid, please re-type
        </Text>
      );
    }
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        {renderTextBody()}
        {renderFieldSearch()}
        {renderTextError()}
      </View>
    );
  };

  const renderButtonSearch = () => {
    return (
      <TouchableOpacity
        style={styles.touchableSearch}
        onPress={() => {
          handleButtonSearchClick();
        }}>
        <Text style={styles.textSearch}>Search Product</Text>
      </TouchableOpacity>
    );
  };

  if (!open) {
    return null;
  }

  return (
    <Modal transparent visible={open} onDismiss={handleClose}>
      <View style={styles.root}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {renderHeader()}
              {renderBody()}
              {renderButtonSearch()}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default SearchProductByBarcodeModal;
