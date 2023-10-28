/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import colorConfig from '../config/colorConfig';
import {isEmptyArray} from '../helper/CheckEmpty';
import {Header} from './layout';
import GlobalText from './globalText';
import InputVoucher from './vouchers/InputVoucher';
import {checkPromo} from '../actions/rewards.action';
import {useDispatch, useSelector} from 'react-redux';
import LoadingScreen from './loadingScreen/LoadingScreen';
import {showSnackbar} from '../actions/setting.action';
import VoucherListCheckout from './voucherList/VoucherListCheckout';
import GlobalButton from './button/GlobalButton';
import {normalizeLayoutSizeWidth} from '../helper/Layout';
import {getCalculationStep3} from '../actions/order.action';
import ArrowBottomSvg from '../assets/svg/ArrowBottomSvg';
import ArrowUpSvg from '../assets/svg/ArrowUpSvg';
import ModalAction from './modal/ModalAction';
import {getVoucherCheckout} from '../actions/user.action';
import useCalculation from '../hooks/calculation/useCalculation';
import appConfig from '../config/appConfig';
import additionalSetting from '../config/additionalSettings';
import InformationRedeem from './informationMessage/InformationRedeem';

const PaymentAddVouchersV2 = props => {
  const [usedVoucher, setUsedVoucher] = React.useState(props?.dataVoucer || []);
  const cartDetail = useSelector(
    state => state.orderReducer.dataBasket?.product,
  );

  const [newAvailableVoucher, setNewAvailableVoucher] = React.useState([]);
  const [unavailabelVoucher, setUnavailabelVocuher] = React.useState([]);
  const [loadingCheckVoucher, setLoadingCheckVoucher] = React.useState(false);
  const [showMoreAvailVoucher, setShowMoreAvailVoucher] = React.useState(false);
  const [showMoreUnavailVoucher, setShowMoreUnavailVoucher] = React.useState(
    false,
  );
  const [confirmPopup, setConfirmPopup] = React.useState(false);
  const [saveSubmitVoucher, setSubmitVoucher] = React.useState([]);
  const companyInfo = useSelector(
    state => state.userReducer.getCompanyInfo?.companyInfo,
  );
  const [loading, setLoading] = React.useState(false);
  const selectedAccount = useSelector(
    state => state.cardReducer.selectedAccount.selectedAccount,
  );
  const dispatch = useDispatch();
  const {removePointAmount} = useCalculation();
  const voucherPointUsedCalculation = (vouchers = []) => {
    const mapVoucherPoint = vouchers?.map(data => data?.paymentAmount);
    if (mapVoucherPoint.length > 0) {
      return mapVoucherPoint?.reduce((a, b) => a + b);
    }
    return 0;
  };

  const findMinTransactionHandle = () => {
    const findMinPayment = companyInfo?.paymentTypes.find(
      item => item.paymentID === selectedAccount?.paymentID,
    );
    return findMinPayment;
  };

  const onSubmit = async () => {
    setLoadingCheckVoucher(true);
    const voucherMap = mappingPayment(usedVoucher);
    // need more check about this
    // const payloadVoucher = removePointAmount(voucherMap);

    const payloadVoucher =
      appConfig.pointType === 'maxPointAutoApply'
        ? removePointAmount(voucherMap)
        : voucherMap;
    const onlyVoucher = usedVoucher?.filter(voucher => !voucher?.isPoint);
    const payload = {
      details: cartDetail?.details,
      outletId: cartDetail?.outletID,
      total: cartDetail?.totalNettAmount,
      customerId: cartDetail?.customerId,
      payments: payloadVoucher,
    };
    const findMinTransaction = findMinTransactionHandle();
    const response = await dispatch(getCalculationStep3(payload));
    if (response.message) {
      setLoadingCheckVoucher(false);
      return dispatch(showSnackbar({message: response.message}));
    }
    const mappigResponse = mappingPayment(response.payments);
    setLoadingCheckVoucher(false);
    if (response.total <= 0 && onlyVoucher?.length > 0) {
      setSubmitVoucher(mappigResponse);
      return setConfirmPopup(true);
    }
    const voucherUsedAmount = voucherPointUsedCalculation(mappigResponse);
    const totalPayment = cartDetail?.totalNettAmount - voucherUsedAmount || 0;
    const minTransaction = findMinTransaction?.minimumPayment;
    const voucherOnly = mappigResponse?.filter(voucher => !voucher?.isPoint);
    if (totalPayment < minTransaction && voucherOnly.length > 0) {
      return Alert.alert(
        "Can't Add Voucher",
        "You haven't passed the minimum payment required if you use this voucher.",
      );
    }
    adjustVoucher(mappigResponse);
  };

  const getVoucher = async () => {
    const payload = {
      details: cartDetail?.details,
      outletId: cartDetail?.outletId,
      total: cartDetail?.totalNettAmount,
    };
    setLoading(true);
    const response = await dispatch(getVoucherCheckout(payload));
    let myAvailableVoucher = [];
    let myUnAvailableVoucher = [];
    response?.forEach(voucher => {
      const isVoucherUsed = usedVoucher?.find(
        dataVoucher => dataVoucher?.serialNumber === voucher?.serialNumber,
      );
      if (voucher.isAvailable && !isVoucherUsed) {
        myAvailableVoucher.push(voucher);
      }
      if (!voucher.isAvailable) {
        myUnAvailableVoucher.push(voucher);
      }
    });
    setNewAvailableVoucher(myAvailableVoucher);
    setUnavailabelVocuher(myUnAvailableVoucher);
    setLoading(false);
  };

  React.useEffect(() => {
    getVoucher();
  }, []);

  const adjustVoucher = mappigResponse => {
    props.setDataVoucher(mappigResponse);
    Actions.pop();
    setConfirmPopup(false);
  };

  const mappingPayment = (payments = []) => {
    return payments?.map(voucher => {
      if (voucher.isPoint || voucher?.paymentType === 'point') {
        return {...voucher, paymentType: 'point'};
      }
      if (voucher.code) {
        return {
          ...voucher,
          isVoucherPromoCode: true,
        };
      }
      return {
        ...voucher,
        isVoucher: true,
        serialNumber: voucher?.serialNumber,
        voucherId: voucher?.id,
      };
    });
  };

  const handleAddVoucher = async (item, isFromSearch) => {
    if (item) {
      setUsedVoucher(prevState => [...prevState, item]);
      if (!isFromSearch) {
        setNewAvailableVoucher(prevState =>
          prevState.filter(
            voucher => voucher.serialNumber !== item.serialNumber,
          ),
        );
      } else {
        setNewAvailableVoucher(prevState =>
          prevState.filter(voucher => voucher.code !== item.code),
        );
      }
    }
  };
  const handleRemoveVoucher = (item, index) => {
    if (item) {
      setUsedVoucher(prevState =>
        prevState.filter(voucher => item.serialNumber !== voucher.serialNumber),
      );
      setNewAvailableVoucher(prevState => [...prevState, item]);
    }
  };

  const checkVoucher = async voucherCode => {
    setLoadingCheckVoucher(true);
    const checkPromoResponse = await dispatch(checkPromo(voucherCode));

    if (!checkPromoResponse.status) {
      let errorMessage = 'Invalid promo code.';
      dispatch(
        showSnackbar({
          message: checkPromoResponse?.message || errorMessage,
        }),
      );
    } else {
      handleAddVoucher(checkPromoResponse, true);
    }
    setLoadingCheckVoucher(false);
  };
  const filterOnlyVoucher = () => {
    if (!isEmptyArray(usedVoucher)) {
      const onlyVoucher = usedVoucher.filter(voucher => !voucher.isPoint);
      return onlyVoucher;
    }
    return [];
  };
  const renderNotAvailableVoucher = ({item, index}) => {
    if (index >= 3 && !showMoreUnavailVoucher) return null;
    return <VoucherListCheckout key={index} type={'unavailable'} item={item} />;
  };

  const renderTitle = title => (
    <View style={[styles.dividerTitle]}>
      <View style={styles.divider} />
      <GlobalText style={styles.titleText}>{title}</GlobalText>
    </View>
  );

  const renderUsedVoucherList = ({item, index}) => {
    return (
      <VoucherListCheckout
        key={index}
        onPress={() => handleRemoveVoucher(item)}
        type={'used'}
        item={item}
      />
    );
  };

  const renderAvaulableVoucherList = ({item, index}) => {
    if (index >= 3 && !showMoreAvailVoucher) return null;
    return (
      <VoucherListCheckout
        key={index}
        onPress={() => handleAddVoucher(item)}
        type={'available'}
        item={item}
        disabled={handleDisableVoucher()}
      />
    );
  };

  const renderSeeMoreBtn = (text = '', showSeeMoreText, onPress, isOpen) => (
    <>
      {showSeeMoreText ? (
        <View style={styles.seeMoreContainer}>
          <TouchableOpacity onPress={onPress} style={styles.rowContain}>
            <GlobalText>{text}</GlobalText>
            {isOpen ? <ArrowUpSvg /> : <ArrowBottomSvg />}
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );

  const toggleAvailVoucher = () =>
    setShowMoreAvailVoucher(prevState => !prevState);

  const toggleNotAvailVoucher = () =>
    setShowMoreUnavailVoucher(prevState => !prevState);

  const closeConfirmVoucher = () => {
    setConfirmPopup(false);
  };

  const handleDisableVoucher = () => {
    if (additionalSetting().maxVoucherInOneTransaction) {
      if (
        filterOnlyVoucher()?.length >=
        additionalSetting().maxVoucherInOneTransaction
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingScreen loading={loadingCheckVoucher} />
      <Header title={'My Vouchers'} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getVoucher} />
        }
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.informationContainer}>
          <InformationRedeem />
        </View>
        {renderTitle('USE VOUCHER CODE')}
        <View style={styles.searchContainer}>
          <InputVoucher onPressVoucher={checkVoucher} />
        </View>
        {filterOnlyVoucher()?.length > 0 ? (
          <View>
            {renderTitle('VOUCHER USED')}
            {filterOnlyVoucher()?.map((voucher, index) => {
              return renderUsedVoucherList({
                item: voucher,
                index,
              });
            })}
          </View>
        ) : null}
        {newAvailableVoucher?.length > 0 ? (
          <View>
            {renderTitle('AVAILABLE VOUCHER')}
            {newAvailableVoucher.map((voucher, index) => {
              return renderAvaulableVoucherList({
                item: voucher,
                index,
              });
            })}
          </View>
        ) : null}
        {renderSeeMoreBtn(
          `See ${showMoreAvailVoucher ? 'less' : 'more'} available voucher`,
          newAvailableVoucher.length > 3,
          toggleAvailVoucher,
          showMoreAvailVoucher,
        )}
        {unavailabelVoucher.length > 0 ? (
          <View>
            {renderTitle('NOT AVAILABLE')}
            {unavailabelVoucher.map((voucher, index) => {
              return renderNotAvailableVoucher({
                item: voucher,
                index,
              });
            })}
          </View>
        ) : null}
        {renderSeeMoreBtn(
          `See ${
            showMoreUnavailVoucher ? 'less' : 'more'
          } not available voucher`,
          unavailabelVoucher.length > 3,
          toggleNotAvailVoucher,
          showMoreUnavailVoucher,
        )}
      </ScrollView>
      <View onPress={onSubmit} style={styles.buttonBottomFixed}>
        <View style={styles.centerAlign}>
          <GlobalText>{filterOnlyVoucher()?.length} Voucher Applied</GlobalText>
        </View>
        <View style={styles.centerAlign}>
          <GlobalButton
            onPress={onSubmit}
            buttonStyle={styles.buttonStyle}
            title="Apply"
          />
        </View>
      </View>
      <ModalAction
        title="Transaction Amount Exceeded"
        description="By using this voucher, you will pay more than your transaction amount. Are you sure?"
        isVisible={confirmPopup}
        onCancel={closeConfirmVoucher}
        onApprove={() => adjustVoucher(saveSubmitVoucher)}
        approveTitle="Confirm"
        closeModal={closeConfirmVoucher}
      />
    </SafeAreaView>
  );
};

export default PaymentAddVouchersV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    margin: 10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor,
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    width: '100%',
    resizeMode: 'contain',
    aspectRatio: 2.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: Dimensions.get('window').width / 4,
    width: Dimensions.get('window').width / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 5,
    borderTopColor: colorConfig.store.defaultColor,
    borderTopWidth: 1,
    paddingBottom: 10,
  },
  status: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    height: 20,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    width: 70,
  },
  statusTitle: {
    fontSize: 12,
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
  },
  nameVoucher: {
    fontSize: 17,
    color: colorConfig.store.secondaryColor,
    fontWeight: 'bold',
  },
  descVoucher: {
    fontSize: 12,
    maxWidth: '95%',
    color: colorConfig.store.titleSelected,
  },
  descVoucherTime: {
    fontSize: 11,
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  pointVoucher: {
    fontSize: 13,
    color: colorConfig.pageIndex.activeTintColor,
  },
  pointVoucherText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.backgroundColor,
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
  },
  buttonBottomFixed: {
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    justifyContent: 'space-between',
  },
  dividerTitle: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 16,
    paddingRight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    width: '100%',
    position: 'absolute',
    top: '50%',
  },
  titleText: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  flatlistCOntainer: {
    paddingHorizontal: 12,
  },
  buttonStyle: {
    marginTop: 0,
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
    width: normalizeLayoutSizeWidth(192),
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  seeMoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    marginBottom: 0,
  },
  rowContain: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchContainer: {
    marginTop: 16,
  },
  informationContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});
