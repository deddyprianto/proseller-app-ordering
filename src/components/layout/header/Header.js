import React from 'react';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {Actions} from 'react-native-router-flux';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  root: {
    height: 54,
    borderColor: '#D6D6D6',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  touchableIcon: {
    position: 'absolute',
    left: 16,
  },
  icon: {
    fontSize: 21,
  },
});

const Header = ({title}) => {
  const renderBackIcon = () => {
    return (
      <TouchableOpacity
        style={styles.touchableIcon}
        onPress={() => {
          Actions.pop();
        }}>
        <IconAntDesign name="left" style={styles.icon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {renderBackIcon()}
      <Text>{title}</Text>
    </View>
  );
};

export default Header;
