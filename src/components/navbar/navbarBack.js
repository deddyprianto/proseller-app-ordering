import React from 'react';
import {View, TouchableOpacity, StyleSheet, Platform, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
    marginRight: 'auto',
  },
  btnBackIcon: {
    color: colorConfig.store.defaultColor,
    marginRight: 'auto',
  },
  header: {
    // height: 65,
    paddingVertical: 6,
    marginBottom: 16,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});

const NavbarBack = ({title, centerTitle}) => {
  const onBack = () => {
    Actions.pop();
  };
  return (
    <View
      style={[
        styles.header,
        {backgroundColor: colorConfig.pageIndex.backgroundColor},
      ]}>
      <TouchableOpacity style={styles.btnBack} onPress={onBack}>
        <Icon
          size={28}
          name={
            Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
          }
          style={styles.btnBackIcon}
        />
        <Text style={styles.btnBackText}> {title} </Text>
      </TouchableOpacity>
      {/*<View style={styles.line} />*/}
    </View>
  );
};

export default NavbarBack;
