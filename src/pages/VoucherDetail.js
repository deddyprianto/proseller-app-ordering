import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import colorConfig from '../config/colorConfig';

import VoucherItem from '../components/voucherList/components/VoucherListItem';
import ConfirmationDialog from '../components/confirmationDialog';
import Header from '../components/layout/header';
import moment from 'moment';
import {redeemVoucher} from '../actions/rewards.action';
import LoadingScreen from '../components/loadingScreen';
import {showSnackbar} from '../actions/setting.action';
import {Body} from '../components/layout';
import Theme from '../theme/Theme';
import useTime from '../hooks/time/useTime';
import additionalSetting from '../config/additionalSettings';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      display: 'flex',
      paddingHorizontal: 20,
    },
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    body: {
      flex: 1,
    },
    footer: {
      borderTopWidth: 0.2,
      borderTopColor: 'grey',
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    backgroundColorHeader: {
      flex: 1,
      position: 'absolute',
      top: 0,
      width: '100%',
      height: 70,
      backgroundColor: '#FFEBEB',
    },
    textValidity: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textValidityValue: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
      marginTop: 8,
    },
    textDescription: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textDescriptionValue: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textRedeemButton: {
      fontSize: 14,
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textInfoPointTitle: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textInfoPointValue: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textPointLocked: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    touchableRedeemButton: {
      width: '100%',
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: colorConfig.primaryColor,
    },
    touchableRedeemButtonDisabled: {
      width: '100%',
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B7B7B7',
      borderRadius: 8,
    },
    touchableImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      flex: 2,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewInfoPoint: {
      display: 'flex',
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
    },
    viewInfoPointValue: {
      padding: 10,
      width: '50%',
    },
    viewPointLocked: {
      backgroundColor: '#E5EAF8',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    dividerVertical: {
      height: 'auto',
      borderWidth: 0.5,
    },
  });
  return styles;
};

const VoucherDetail = props => {
  const styles = useStyles();
  const {navigation, isMyVoucher} = props;
  const {params} = navigation.state;
  const voucher = params?.dataVoucher;
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {convertTime} = useTime();
  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  const pendingPoint = useSelector(
    state => state.rewardsReducer?.dataPoint.pendingPoints,
  );

  const handleRedeem = async () => {
    const payload = {
      voucher: {
        id: voucher?.id,
      },
      qty: 1,
    };

    setIsLoading(true);
    const response = await dispatch(redeemVoucher(payload));
    if (response?.data?.status) {
      dispatch(
        showSnackbar({
          message: 'Voucher successfully redeemed',
          type: 'success',
          background: '#1A883C',
        }),
      );
      setOpenModal(false);
    } else {
      const message = response?.message || 'Redeem failed';
      await dispatch(showSnackbar({message, type: 'error'}));
      setOpenModal(false);
    }

    setIsLoading(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const renderValidity = () => {
    const text = convertTime(
      voucher?.expiryDate,
      voucher?.followMembershipPeriod,
      voucher?.defaultExpiryDays,
    );

    return (
      <View>
        <Text style={styles.textValidity}>
          {additionalSetting().isUsingValidityDays ? 'Validity' : 'Expire on'}{' '}
        </Text>
        <Text style={styles.textValidityValue}>
          {!additionalSetting().isUsingValidityDays && isMyVoucher
            ? moment(voucher?.expiryDate).format('DD MMMM YYYY')
            : text}
        </Text>
      </View>
    );
  };
  const renderDescription = () => {
    return (
      <View>
        <Text style={styles.textDescription}>Description</Text>
        <View style={{marginTop: 8}} />
        <Text style={styles.textDescriptionValue}>{voucher?.voucherDesc}</Text>
      </View>
    );
  };

  const renderRedeemButton = () => {
    const disabled = totalPoint < voucher?.redeemValue;
    const styleButton = disabled
      ? styles.touchableRedeemButtonDisabled
      : styles.touchableRedeemButton;
    return (
      <TouchableOpacity
        disabled={disabled}
        style={styleButton}
        onPress={() => {
          handleOpenModal();
        }}>
        <Text style={styles.textRedeemButton}>REDEEM</Text>
      </TouchableOpacity>
    );
  };

  const renderCurrentPoint = () => {
    return (
      <View style={styles.viewInfoPointValue}>
        <Text style={styles.textInfoPointTitle}>Current points:</Text>
        <Text style={styles.textInfoPointValue}>{totalPoint} Points</Text>
      </View>
    );
  };

  const renderReducedPoint = () => {
    return (
      <View style={styles.viewInfoPointValue}>
        <Text style={styles.textInfoPointTitle}>Points to be deducted: </Text>
        <Text style={styles.textInfoPointValue}>
          {voucher?.redeemValue ? `${voucher.redeemValue} Points` : '-'}
        </Text>
      </View>
    );
  };

  const renderInfoPoint = () => {
    return (
      <View style={styles.viewInfoPoint}>
        {renderCurrentPoint()}
        <View style={styles.dividerVertical} />
        {renderReducedPoint()}
      </View>
    );
  };

  const renderBlockedPoint = () => {
    if (pendingPoint) {
      return (
        <View style={styles.viewPointLocked}>
          <Text style={styles.textPointLocked}>
            Your {pendingPoint} points is locked because your order has not been
            completed.
          </Text>
        </View>
      );
    }
  };

  const renderConfirmationDialog = () => {
    if (openModal) {
      return (
        <ConfirmationDialog
          open={openModal}
          handleClose={() => {
            handleCloseModal();
          }}
          handleSubmit={() => {
            handleRedeem();
          }}
          isLoading={isLoading}
          textTitle="Redeem Voucher"
          textDescription={`This will spend your points by ${
            voucher?.redeemValue
          } points`}
          textSubmit="Redeem"
        />
      );
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.root}>
        <LoadingScreen loading={isLoading} />
        <Header title="Voucher Details" />
        <Body style={styles.body}>
          <ScrollView>
            <View style={styles.container}>
              <View style={{marginTop: '5%'}} />
              <VoucherItem voucher={voucher} />
              {isMyVoucher ? null : (
                <>
                  <View style={{marginTop: '2%'}} />
                  {renderInfoPoint()}
                  <View style={{marginTop: '5%'}} />
                </>
              )}

              {renderValidity()}
              <View style={{marginTop: '5%'}} />
              {renderDescription()}
              <View style={{marginTop: '5%'}} />
              {renderBlockedPoint()}
            </View>
          </ScrollView>
          {isMyVoucher ? null : (
            <View style={styles.footer}>{renderRedeemButton()}</View>
          )}
        </Body>
      </View>
      {renderConfirmationDialog()}
      {/* {renderImageRedeemSuccess()} */}
    </SafeAreaView>
  );
};

export default VoucherDetail;
