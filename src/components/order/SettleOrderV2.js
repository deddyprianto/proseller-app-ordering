import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../layout';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import ProductCartList from '../productCartList/ProductCartList';
import CartDetail from './CartDetail';
import GrandTotalFloating from './GrandTotalFloating';
import useCalculation from '../../hooks/calculation/useCalculation';

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
  totalPointToPay,
  fullPoint,
  myMoneyPoint,
  myPoint,
  doPayment,
  totalAmount,
  latestSelfSelectionDate,
}) => {
  const {styles} = useStyles();
  const [availableSelection, setAvailableSelection] = React.useState([]);
  const {calculationAmountPaidByVisa, calculateVoucherPoint} = useCalculation();
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

  const hanldeDisableButton = isHidePaymentMethod => {
    const totalPointVoucher = calculateVoucherPoint(vouchers);
    const amountToPaid = calculationAmountPaidByVisa(
      data?.totalNettAmount,
      vouchers,
      totalPointVoucher,
    );
    if (amountToPaid <= 0) {
      return false;
    } else {
      if (isHidePaymentMethod) {
        return true;
      }
      if (!selectedAccount) {
        return true;
      }
      return false;
    }
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
          totalPointToPay={totalPointToPay}
          fullPoint={fullPoint}
          availableSelection={availableSelection}
          data={data}
          selectedPaymentMethod={selectedPaymentMethod}
          selectedAccount={selectedAccount}
          vouchers={vouchers}
          totalAmount={totalAmount}
          myMoneyPoint={myMoneyPoint}
          myPoint={myPoint}
          onAgreeTnc={updateAgreeTnc}
          isAgreeTnc={isAgreeTnc}
          latestSelfSelectionDate={latestSelfSelectionDate}
          showPaymentMethod={hanldeDisableButton(true)}
        />
      </ScrollView>
      <GrandTotalFloating
        vouchers={vouchers}
        pointDisc={myPoint}
        btnText={'Pay'}
        onPressBtn={doPayment}
        disabledBtn={!isAgreeTnc || hanldeDisableButton()}
        totalPointToPay={myMoneyPoint}
      />
    </SafeAreaView>
  );
};

export default React.memo(SettleOrderV2);
