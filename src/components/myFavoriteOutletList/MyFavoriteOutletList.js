import React, {useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MyFavoriteOutletListItem from './components/MyFavoriteOutletListItem';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({});

const MyFavoriteOutletList = () => {
  const [selectedOutlet, setSelectedOutlet] = useState({});
  const items = [{id: 1}, {id: 2}, {id: 3}, {id: 4}];

  const handleSelectOutled = item => {
    if (selectedOutlet.id === item.id) {
      setSelectedOutlet({});
    } else {
      setSelectedOutlet(item);
    }
  };

  const renderOutletList = () => {
    const result = items.map(item => {
      return (
        <TouchableOpacity
          onPress={() => {
            handleSelectOutled(item);
          }}>
          <MyFavoriteOutletListItem
            item={item}
            selectedOutlet={selectedOutlet.id === item.id}
          />
        </TouchableOpacity>
      );
    });
    return result;
  };

  return renderOutletList();
};

export default MyFavoriteOutletList;
