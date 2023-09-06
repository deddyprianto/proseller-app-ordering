import React, {useState} from 'react';

import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';

import Theme from '../../../theme';
import FieldSearch from '../../fieldSearch/FieldSearch';
import {useSelector} from 'react-redux';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      maxHeight: 270,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: theme.colors.border1,
      backgroundColor: theme.colors.background,
    },
    viewCountryCodeList: {
      width: '100%',
    },
    viewCountryCodeItem: {
      padding: 16,
      borderTopColor: theme.colors.greyScale3,
      borderTopWidth: 1,
    },
    viewCountryCodeItemSelected: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.greyScale3,
      backgroundColor: theme.colors.accent,
    },
    viewSearch: {
      padding: 10,
      width: '100%',
      height: 57,
    },
    textCountryCodeItem: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCountryCodeItemSelected: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const CountryCodeSelectorModal = ({value, onChange}) => {
  const styles = useStyles();
  const [searchTextInput, setSearchTextInput] = useState('');

  const countryCodeList = useSelector(
    state => state.settingReducer.dialCodeSettings,
  );

  const handleCountryCodeSort = data => {
    const result = data.sort(x => {
      if (x.dialCode === '+65') {
        return -1;
      } else {
        return 0;
      }
    });

    return result;
  };

  const handleCountryCodeSearch = () => {
    const data = handleCountryCodeSort(countryCodeList);

    if (searchTextInput) {
      const searchText = searchTextInput.toUpperCase();

      return data.filter(
        x =>
          x.name.toUpperCase().includes(searchText) ||
          x.dialCode.toUpperCase().includes(searchText),
      );
    }

    return data;
  };

  const handleCountryCodeSelect = item => {
    onChange(item?.dialCode);
  };

  const renderCountryCodeItem = item => {
    const isSelected = item.dialCode === value;
    const styleButton = isSelected
      ? styles.viewCountryCodeItemSelected
      : styles.viewCountryCodeItem;
    const styleText = isSelected
      ? styles.textCountryCodeItemSelected
      : styles.textCountryCodeItem;

    return (
      <TouchableOpacity
        style={styleButton}
        onPress={() => {
          handleCountryCodeSelect(item);
        }}>
        <Text style={styleText}>
          {item?.name} ({item?.dialCode})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCountryCodeList = () => {
    const data = handleCountryCodeSearch();
    return (
      <FlatList
        style={styles.viewCountryCodeList}
        data={data}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => renderCountryCodeItem(item)}
      />
    );
  };

  const renderFieldSearch = () => {
    return (
      <View style={styles.viewSearch}>
        <FieldSearch
          placeholder="Search for Country Code"
          onChange={value => {
            setSearchTextInput(value);
          }}
          onClear={() => {
            setSearchTextInput('');
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderFieldSearch()}
      <View style={styles.divider} />
      {renderCountryCodeList()}
    </View>
  );
};

export default CountryCodeSelectorModal;
