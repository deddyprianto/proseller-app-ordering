import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import GlobalButton from '../button/GlobalButton';

const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputContainer: {
      width: '70%',
    },
    buttonContainer: {
      width: '20%',
    },
    inputStyle: {
      width: '100%',
      backgroundColor: 'red',
    },
  });
  return {styles};
};

const InputVoucher = () => {
  const {styles} = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.inputStyle} />
      </View>
      <View style={styles.buttonContainer}>
        <GlobalButton buttonStyle={{marginTop: 0}} title="USE NOW" />
      </View>
    </View>
  );
};

export default React.memo(InputVoucher);
