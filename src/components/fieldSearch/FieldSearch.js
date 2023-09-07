import React, {useRef, useState} from 'react';

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

import RoundedCloseSvg from '../../assets/svg/RoundedCloseSvg';
import awsConfig from '../../config/awsConfig';

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
  onRemove,
  onChange,
  value,
  onFocus,
  onBlur,
}) => {
  const styles = useStyles();
  const [isFocus, setIsFocus] = useState(false);
  const ref = useRef();

  const handleSubmit = () => {
    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(value);
      setIsFocus(true);
    }
  };

  const handleRemove = () => {
    if (onRemove && typeof onRemove === 'function') {
      onRemove();
      ref.current.focus();
    }
  };

  const handleOnFocus = () => {
    if (onFocus && typeof onFocus === 'function') {
      onFocus();
      setIsFocus(true);
    }
  };

  const handleOnBlur = () => {
    if (onBlur && typeof onBlur === 'function') {
      onBlur();
      setIsFocus(false);
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
        ref={ref}
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
        onFocus={() => {
          handleOnFocus();
        }}
        onBlur={() => {
          handleOnBlur();
        }}
      />
    );
  };

  const renderIconRemove = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleRemove();
        }}>
        <RoundedCloseSvg />
      </TouchableOpacity>
    );
  };

  const renderIconSubmit = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleSubmit();
        }}>
        <SearchSvg />
      </TouchableOpacity>
    );
  };

  const renderIcon = () => {
    if (value && awsConfig.COMPANY_TYPE !== 'Retail') {
      return renderIconRemove();
    } else if (isFocus && awsConfig.COMPANY_TYPE !== 'Retail') {
      return;
    } else {
      return renderIconSubmit();
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {renderLabel()}
        {renderInput()}
      </View>
      {renderIcon()}
    </View>
  );
};

export default FieldSearch;
