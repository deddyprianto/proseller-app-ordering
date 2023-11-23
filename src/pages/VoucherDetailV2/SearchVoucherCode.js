import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
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
    redeemText: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: 'white',
    },
  });
  return {styles};
};

const SearchVoucherCode = ({onRedeem, onSearchCode, codeValue, loading}) => {
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
          onChangeText={onSearchCode}
        />
        <GlobalButton disabled={loading || codeValue === ''} onPress={onRedeem}>
          {!loading ? (
            <GlobalText style={styles.redeemText}>Redeem</GlobalText>
          ) : (
            <ActivityIndicator color="white" />
          )}
        </GlobalButton>
      </View>
      <View style={styles.gap} />
    </>
  );
};

export default React.memo(SearchVoucherCode);
