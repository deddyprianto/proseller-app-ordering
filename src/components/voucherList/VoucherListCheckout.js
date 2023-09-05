import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import VoucherCard from '../../assets/img/selected-voucher.png';
import GlobalText from '../globalText';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    imageContainer: type => ({
      width: normalizeLayoutSizeWidth(396),
      height: normalizeLayoutSizeWidth(92),
      justifyContent: 'center',
      paddingHorizontal: 22,
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
    }),
    voucherContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '100%',
    },
    voucherRoundLeft: type => ({
      position: 'absolute',
      top: '50%',
      width: 20,
      height: 20,
      borderRightWidth: type === 'used' ? 1 : 0,
      backgroundColor: 'white',
      borderRightColor: theme.colors.primary,
      borderRadius: 10,
      left: -13,
      zIndex: 100,
    }),
    voucherRoundRight: type => ({
      position: 'absolute',
      top: '50%',
      width: 20,
      height: 20,
      borderLeftWidth: type === 'used' ? 1 : 0,
      borderLeftColor: theme.colors.primary,

      backgroundColor: 'white',
      borderRadius: 10,
      right: -6,
      zIndex: 100,
    }),
    voucherName: {
      justifyContent: 'center',
    },
    nameWidth: {
      width: '65%',
    },
    actionWidth: {
      width: '34.5%',
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    leftDivider: {
      width: '0.5%',
      height: '100%',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderStyle: 'dotted',
      borderRadius: 1,
    },
    buttonAction: () => ({
      backgroundColor: theme.colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    }),
    buttonText: () => ({
      fontFamily: theme.fontFamily.poppinsMedium,
      color: 'white',
    }),
  });
  return {styles};
};

const VoucherListCheckout = ({onPress, item, type}) => {
  const {styles} = useStyles();
  const handleImage = () => {};

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.voucherRoundLeft(type)} />
      <View style={styles.voucherRoundRight(type)} />
      <View style={styles.imageContainer(type)}>
        <View style={styles.voucherContainer}>
          <View style={[styles.voucherName, styles.nameWidth]}>
            <GlobalText>{item?.name} </GlobalText>
          </View>
          <View style={styles.leftDivider} />
          <View style={[styles.voucherName, styles.actionWidth]}>
            <TouchableOpacity
              style={[styles.mlAuto, styles.buttonAction()]}
              onPress={onPress}>
              <GlobalText style={styles.buttonText()}>Use Now</GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(VoucherListCheckout);
