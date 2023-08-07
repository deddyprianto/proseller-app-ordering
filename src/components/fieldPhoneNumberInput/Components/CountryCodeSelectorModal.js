import React, {useEffect, useState} from 'react';

import {StyleSheet, View, Text, FlatList} from 'react-native';

import awsConfig from '../../../config/awsConfig';
import Theme from '../../../theme';
import CountryList from './CountryList';
import FieldSearch from '../../fieldSearch/FieldSearch';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      height: 262,
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
    viewSearch: {
      padding: 10,
      width: '100%',
      height: 'auto',
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const CountryCodeSelectorModal = ({valueCountryCode}) => {
  const styles = useStyles();
  const [countryCode, setCountryCode] = useState('+65');

  const countries = CountryList();

  useEffect(() => {
    setCountryCode(valueCountryCode || awsConfig.phoneNumberCode);
  }, [valueCountryCode]);

  const renderCountryCodeItem = item => {
    return (
      <View style={styles.viewCountryCodeItem}>
        <Text>
          {item?.name} ({item?.dialCode})
        </Text>
      </View>
    );
  };

  const renderCountryCodeList = () => {
    return (
      <FlatList
        style={styles.viewCountryCodeList}
        data={countries}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => renderCountryCodeItem(item)}
      />
    );
  };

  const renderFieldSearch = () => {
    return (
      <View style={styles.viewSearch}>
        <FieldSearch placeholder="Search for Country Code" />
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
