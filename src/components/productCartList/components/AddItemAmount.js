import React from 'react';
import {View, StyleSheet} from 'react-native';
import Theme from '../../../theme/Theme';
import MinusSvg from '../../../assets/svg/MinusSvg';
import PlusSvg from '../../../assets/svg/PlusSvg';
import {normalizeLayoutSizeWidth} from '../../../helper/Layout';
import GlobalText from '../../globalText';
import {TouchableOpacity} from 'react-native-gesture-handler';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      padding: 10,
      backgroundColor: theme.colors.greyScale4,
      marginHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    buttonContainer: {
      width: normalizeLayoutSizeWidth(32),
      height: normalizeLayoutSizeWidth(32),
      backgroundColor: theme.colors.brandTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: normalizeLayoutSizeWidth(16),
    },
    qty: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
  });
  return {styles};
};

const AddItemAmount = ({qty, setQty}) => {
  const {styles} = useStyles();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer}>
        <MinusSvg />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <GlobalText style={styles.qty}>{qty || 0}</GlobalText>
      </View>
      <TouchableOpacity style={styles.buttonContainer}>
        <PlusSvg />
      </TouchableOpacity>
    </View>
  );
};

export default AddItemAmount;
