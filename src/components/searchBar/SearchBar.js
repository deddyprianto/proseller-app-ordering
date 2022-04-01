/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState} from 'react';

import {StyleSheet, View, Dimensions, TextInput} from 'react-native';

import IconAntDesign from 'react-native-vector-icons/AntDesign';

import colorConfig from '../../config/colorConfig';

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  searchSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: 0.2,
    paddingHorizontal: 10,
    height: 30,
  },
});

const SearchBar = () => {
  const [search, setSearch] = useState('');

  const handleSearch = value => {
    setSearch(value);
  };

  return (
    <View style={styles.searchSection}>
      <IconAntDesign
        name="search1"
        style={{fontSize: 20, color: colorConfig.primaryColor}}
      />

      <TextInput
        style={{
          width: WIDTH * 0.75,
          paddingVertical: 0,
        }}
        value={search}
        onChangeText={handleSearch}
        placeholder="Search food and drinks"
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

export default SearchBar;
