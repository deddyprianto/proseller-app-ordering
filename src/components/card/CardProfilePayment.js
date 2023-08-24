import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import CreditCard from '../../assets/svg/CreditCardSvg';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      marginHorizontal: 16,
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginVertical: 16,
    },
    titleContainer: {
      flexDirection: 'row',
    },
    cardName: {
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 14,
    },
    ccContainer: {
      marginLeft: 'auto',
    },
    numberCOntainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    mv32: {
      marginVertical: 32,
    },
    mlAuto: {
      marginLeft: 'auto',
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return {styles};
};

const CardProfilePayment = ({item, onPress}) => {
  const {styles} = useStyles();
  const handleFormatYearCc = year => {
    return `${year[2]}${year[3]}`;
  };
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        <GlobalText style={styles.cardName}>
          {item?.details?.cardIssuer?.toUpperCase()}{' '}
        </GlobalText>
        <View style={styles.ccContainer}>
          <CreditCard color="black" />
        </View>
      </View>
      <View style={styles.numberCOntainer}>
        <GlobalText style={styles.mv32}>{item?.paymentName}</GlobalText>
      </View>
      <View>
        <GlobalText style={styles.mlAuto}>
          Valid Thru {item?.details?.cardExpiryMonth}/
          {handleFormatYearCc(String(item?.details?.cardExpiryYear))}
        </GlobalText>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CardProfilePayment);
