import React from 'react';
import {View, StyleSheet} from 'react-native';
import NoVoucher from '../../../assets/svg/NoVoucher';
import GlobalText from '../../../components/globalText';
import Theme from '../../../theme/Theme';
import {normalizeLayoutSizeHeight} from '../../../helper/Layout';

const useStyles = () => {
  const {fontFamily} = Theme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: normalizeLayoutSizeHeight(130),
    },
    mv: {
      marginVertical: 16,
      fontFamily: fontFamily.poppinsBold,
    },
    centerText: {
      textAlign: 'center',
      fontFamily: fontFamily.poppinsMedium,
    },
  });
  return {styles};
};

const EmptyVoucher = ({text}) => {
  const {styles} = useStyles();
  return (
    <View style={styles.container}>
      <NoVoucher />
      <GlobalText style={styles.mv}>No Vouchers Yet</GlobalText>
      <GlobalText style={styles.centerText}>{text} </GlobalText>
    </View>
  );
};

export default EmptyVoucher;
