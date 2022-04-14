import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({});

const Header = ({title}) => {
  const renderBackIcon = () => {
    return (
      <TouchableOpacity
        style={{position: 'absolute', left: 16}}
        onPress={() => {
          Actions.pop();
        }}>
        <IconAntDesign name="left" style={{fontSize: 21}} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        height: HEIGHT * 0.08,
        borderColor: '#D6D6D6',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: WIDTH,
      }}>
      {renderBackIcon()}
      <Text>{title}</Text>
    </View>
  );
};

export default Header;
