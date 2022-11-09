import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import Theme from '../../theme';

const useStyle = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    checkbox: {
      width: 20,
      height: 20,
      backgroundColor: 'white',
      borderRadius: 3,
      borderWidth: 1,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#667080',
    },
    checkboxActive: {
      width: 20,
      height: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
      borderWidth: 1,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.primary,
    },
    iconCheck: {
      color: 'white',
      fontSize: 13,
    },
  });

  return result;
};

const ButtonCheckbox = ({active, disabled, onPress}) => {
  const styles = useStyle();
  const style = active ? styles.checkboxActive : styles.checkbox;

  return (
    <TouchableOpacity style={style} disabled={disabled} onPress={onPress}>
      <IconIonicons style={styles.iconCheck} name="md-checkmark" />
    </TouchableOpacity>
  );
};

export default ButtonCheckbox;
