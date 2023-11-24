import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalButton from '../button/GlobalButton';
import Theme from '../../theme/Theme';
import GlobalInputText from '../globalInputText';

const useStyles = () => {
  const {colors} = Theme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    inputContainer: {
      width: '65%',
    },
    buttonContainer: {
      width: '25%',
      marginTop: 4,
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
    inputText: {
      width: '65%',
      height: 48,
      marginTop: 0,
      paddingTop: 0,
      color: 'black',
    },
    containerButton: {
      marginTop: 4,
    },
    inputStyleGlobal: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },
  });
  return {styles};
};

const InputVoucher = ({onPressVoucher, isError}) => {
  const {styles} = useStyles();
  const [voucherNumber, setVoucherNumber] = React.useState('');

  const onChangeVoucherNumber = text => {
    setVoucherNumber(text.toUpperCase());
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <GlobalInputText
          inputParentContainerCustom={styles.inputStyleGlobal}
          onChangeText={onChangeVoucherNumber}
          placeholder="Enter Voucher Code"
          isError={isError}
          errorMessage={isError}
          autoCapitalize="characters"
        />
      </View>
      <View style={[styles.buttonContainer]}>
        <GlobalButton
          onPress={() => onPressVoucher(voucherNumber)}
          buttonStyle={styles.buttonStyle}
          title="USE NOW"
          disabled={voucherNumber.length <= 0}
        />
      </View>
    </View>
  );
};

export default React.memo(InputVoucher);
