import React from 'react';
import {View, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalText from '../../components/globalText';
import GlobalInputText from '../../components/globalInputText';
import GlobalButton from '../../components/button/GlobalButton';
const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.greyScale3,
      marginTop: 16,
      borderRadius: 16,
    },
    titleText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    gap: {
      width: '100%',
      backgroundColor: theme.colors.greyScale3,
      height: 1,
      marginVertical: 16,
    },
    parentStyle: {
      marginTop: 0,
      padding: 0,
    },
  });
  return {styles};
};

const SearchVoucherCode = () => {
  const {styles} = useStyles();
  return (
    <>
      <View style={styles.container}>
        <GlobalText style={styles.titleText}>
          Got a voucher code? Unlock your voucher benefits here by redeeming
          below!
        </GlobalText>
        <GlobalInputText
          placeholder="Enter Voucher Code"
          inputParentContainerCustom={styles.parentStyle}
        />
        <GlobalButton title="Redeem" />
      </View>
      <View style={styles.gap} />
    </>
  );
};

export default React.memo(SearchVoucherCode);
