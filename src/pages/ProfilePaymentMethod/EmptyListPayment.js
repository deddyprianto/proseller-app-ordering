import React from 'react';
import {View, StyleSheet} from 'react-native';
import EmtyCreditCardSvg from '../../assets/svg/EmptyCreditCardSvg';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';
import GlobalText from '../../components/globalText';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const {fontFamily, colors} = Theme();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      marginTop: normalizeLayoutSizeWidth(130),
    },
    titleContainer: {
      marginVertical: 16,
      fontFamily: fontFamily.poppinsBold,
      fontSize: 16,
      textAlign: 'center',
    },
    descContainer: {
      color: colors.greyScale5,
      fontFamily: fontFamily.poppinsMedium,
      textAlign: 'center',
    },
  });
  return {styles};
};

const EmptyListPayment = () => {
  const {styles} = useStyles();
  return (
    <View style={styles.container}>
      <EmtyCreditCardSvg />
      <GlobalText style={styles.titleContainer}>
        No Credit Card Added
      </GlobalText>
      <GlobalText style={styles.descContainer}>
        You haven't added any credit cards yet. Click "Add Card" to add a new
        credit card.
      </GlobalText>
    </View>
  );
};

export default React.memo(EmptyListPayment);
