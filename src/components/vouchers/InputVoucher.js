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
      width: '65%',
      borderWidth: 1,
      height: 48,
      justifyContent: 'center',
      borderRadius: 8,
    },
    buttonContainer: {
      width: '25%',
    },
    inputStyle: {
      width: '100%',
      paddingHorizontal: 16,
    },
    buttonStyle: {
      marginTop: 0,
      height: 48,
      width: '90%',
      marginLeft: 'auto',
    },
  });
  return {styles};
};

const InputVoucher = ({onPressVoucher}) => {
  const {styles} = useStyles();
  const [voucherNumber, setVoucherNumber] = React.useState('');

  const onChangeVoucherNumber = text => setVoucherNumber(text);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={onChangeVoucherNumber}
          placeholder="Enter Voucher Code"
          style={styles.inputStyle}
        />
      </View>
      <View style={styles.buttonContainer}>
        <GlobalButton
          onPress={() => onPressVoucher(voucherNumber)}
          buttonStyle={styles.buttonStyle}
          title="USE NOW"
        />
      </View>
    </View>
  );
};

export default React.memo(InputVoucher);
