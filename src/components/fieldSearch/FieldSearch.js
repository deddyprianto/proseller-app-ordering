import React from 'react';
import debounce from 'lodash/debounce';

import {StyleSheet, View, Text, TextInput, Image} from 'react-native';
import appConfig from '../../config/appConfig';
import Theme from '../../theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      height: 48,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      borderColor: theme.colors.greyScale2,
      backgroundColor: theme.colors.background,
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
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const FieldSearch = ({label, customLabel, placeholder, onChange, value}) => {
  const styles = useStyles();

  const handleUpdateSearchQuery = e => {
    onChange(e);
  };

  const debounceSearchQuery = debounce(handleUpdateSearchQuery, 3000);

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
        style={styles.textInput}
        placeholder={placeholder}
        onChangeText={e => {
          debounceSearchQuery(e);
        }}
      />
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {renderLabel()}
        {renderInput()}
      </View>
      <Image source={appConfig.iconSearch} style={styles.icon} />
    </View>
  );
};

export default FieldSearch;
