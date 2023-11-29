import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalText from '../../components/globalText';
import GlobalInputText from '../../components/globalInputText';
import GlobalButton from '../../components/button/GlobalButton';
import RoundedCloseSvg from '../../assets/svg/RoundedCloseSvg';
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
    textMain: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
      fontSize: 16,
    },
    textContainer: {
      marginBottom: 16,
    },
  });
  return {styles};
};

const SearchVoucherCode = ({
  onRedeem,
  onSearchCode,
  codeValue,
  loading,
  onRemoveCode,
  isError,
}) => {
  const isAndroid = Platform.OS === 'android';
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
          autoCapitalize="characters"
          value={codeValue}
          isError={isError}
          errorMessage={isError}
          keyboardType={isAndroid ? 'visible-password' : 'default'}
          rightIcon={
            <>
              {codeValue?.length > 0 ? (
                <TouchableOpacity onPress={onRemoveCode}>
                  <RoundedCloseSvg />
                </TouchableOpacity>
              ) : null}
            </>
          }
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
      <View style={styles.textContainer}>
        <GlobalText style={styles.textMain}>Your Vouchers</GlobalText>
      </View>
    </>
  );
};

export default React.memo(SearchVoucherCode);
