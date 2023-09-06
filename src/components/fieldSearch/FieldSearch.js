import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Theme from '../../theme';
import SearchSvg from '../../assets/svg/SearchSvg';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../helper/Layout';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      height: normalizeLayoutSizeHeight(48),
      minHeight: normalizeLayoutSizeHeight(48),
      maxHeight: normalizeLayoutSizeHeight(48),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: normalizeLayoutSizeHeight(8),
      paddingHorizontal: normalizeLayoutSizeWidth(16),
      borderColor: theme.colors.greyScale2,
      backgroundColor: 'white',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    textLabel: {
      textAlign: 'left',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInput: {
      paddingVertical: 0,
      paddingHorizontal: 0,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
      flex: 1,
      justifyContent: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const FieldSearch = ({
  label,
  customLabel,
  placeholder,
  replacePlaceholder,
  onSubmit,
  onChange,
  value,
}) => {
  const styles = useStyles();

  const handleSubmit = () => {
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(value);
    }
  };

  const renderLabel = () => {
    if (!value) {
      return;
    }

    if (customLabel) {
      return customLabel(value);
    }

    if (label) {
      return <Text style={styles.textLabel}>{label}</Text>;
    }
  };

  const renderInput = () => {
    return (
      <TextInput
        value={value}
        style={styles.textInput}
        placeholder={replacePlaceholder || placeholder}
        onChangeText={onChange}
        onSubmitEditing={event => {
          if (onSubmit) {
            onSubmit(event.nativeEvent.text);
          }
        }}
        returnKeyType="search"
      />
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {renderLabel()}
        {renderInput()}
      </View>
      <TouchableOpacity
        onPress={() => {
          handleSubmit();
        }}>
        <SearchSvg />
      </TouchableOpacity>
    </View>
  );
};

export default FieldSearch;
