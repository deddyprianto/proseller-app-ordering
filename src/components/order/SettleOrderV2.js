import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../layout';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import ProductCartList from '../productCartList/ProductCartList';
import CartDetail from './CartDetail';
import GrandTotalFloating from './GrandTotalFloating';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    stepText: {
      color: theme.colors.brandTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 32,
    },
    ph16: {
      paddingHorizontal: 16,
    },
    safeArea: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 30,
    },
  });
  return {styles};
};

const SettleOrderV2 = ({
  data,
  step,
  openPoint,
  openPayment,
  openVoucher,
  selectedPaymentMethod,
  selectedAccount,
  vouchers,
  myMoneyPoint,
  myPoint,
  doPayment,
}) => {
  const {styles} = useStyles();
  const [availabeSelection, setAvailableSelection] = React.useState([]);
  const [isAgreeTnc, setIsAgreeTnc] = React.useState(false);
  const renderStep = () => {
    if (step) {
      return (
        <View>
          <GlobalText style={styles.stepText}>Step {step} of 4</GlobalText>
        </View>
      );
    }
    return null;
  };
  const handleSaveAvailableSelection = dataArray => {
    setAvailableSelection(dataArray);
  };

  const updateAgreeTnc = val => {
    setIsAgreeTnc(val);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header customRightIcon={renderStep} title={'Order Summary'} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ProductCartList
          setAvailaleForSelection={handleSaveAvailableSelection}
          step={step}
        />
        <View style={styles.ph16}>
          <View style={styles.divider} />
        </View>

        <CartDetail
          openPoint={openPoint}
          openPayment={openPayment}
          openVoucher={openVoucher}
          availableSelection={availabeSelection}
          data={data}
          selectedPaymentMethod={selectedPaymentMethod}
          selectedAccount={selectedAccount}
          vouchers={vouchers}
          myMoneyPoint={myMoneyPoint}
          myPoint={myPoint}
          onAgreeTnc={updateAgreeTnc}
          isAgreeTnc={isAgreeTnc}
        />
      </ScrollView>
      <GrandTotalFloating
        vouchers={vouchers}
        pointDisc={myPoint}
        btnText={'Pay'}
        onPressBtn={doPayment}
        disabledBtn={!isAgreeTnc || !selectedAccount}
      />
    </SafeAreaView>
  );
};

export default React.memo(SettleOrderV2);
