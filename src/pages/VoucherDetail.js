import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import colorConfig from '../config/colorConfig';

import VoucherItem from '../components/voucherList/components/VoucherListItem';
import ConfirmationDialog from '../components/confirmationDialog';
import appConfig from '../config/appConfig';
import Header from '../components/layout/header';
import moment from 'moment';
import {redeemVoucher} from '../actions/rewards.action';
import LoadingScreen from '../components/loadingScreen';
import {showSnackbar} from '../actions/setting.action';

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
  footer: {
    borderTopWidth: 0.2,
    borderTopColor: 'grey',
    padding: 16,
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
    fontSize: 12,
    fontWeight: '700',
  },
  textValidityValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  textDescription: {
    fontSize: 12,
    fontWeight: '700',
  },
  textDescriptionValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  textRedeemButton: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  textInfoPointTitle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  textInfoPointValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textPointLocked: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  touchableRedeemButton: {
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 8,
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

const VoucherDetail = ({voucher}) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  const pendingPoint = useSelector(
    state => state.rewardsReducer?.dataPoint.pendingPoints,
  );

  const handleOpenSuccessModal = () => {
    setOpenModal(false);
    setOpenSuccessModal(true);
  };

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
      handleOpenSuccessModal();
    } else {
      const message = response?.message || 'Redeem failed';
      await dispatch(showSnackbar({message}));
    }

    setIsLoading(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  const renderValidity = () => {
    const text = moment(voucher?.expiryDate).format('ddd MMM DD YYYY hh:mm:ss');

    return (
      <View>
        <Text style={styles.textValidity}>Validity</Text>
        <View style={{marginTop: 8}} />
        <Text style={styles.textValidityValue}>{text} UTC</Text>
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

  const renderImageRedeemSuccess = () => {
    if (openSuccessModal) {
      return (
        <TouchableOpacity
          onPress={() => {
            handleCloseSuccessModal();
          }}
          style={styles.touchableImage}>
          <Image source={appConfig.imageRedeemed} />
        </TouchableOpacity>
      );
    }
  };

  const renderCurrentPoint = () => {
    return (
      <View style={styles.viewInfoPointValue}>
        <Text style={styles.textInfoPointTitle}>Your current point:</Text>
        <Text style={styles.textInfoPointValue}>{totalPoint} Points</Text>
      </View>
    );
  };

  const renderReducedPoint = () => {
    return (
      <View style={styles.viewInfoPointValue}>
        <Text style={styles.textInfoPointTitle}>Points required : </Text>
        <Text style={styles.textInfoPointValue}>
          {voucher?.redeemValue} Points
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
        <ScrollView>
          <View style={styles.backgroundColorHeader} />

          <View style={styles.container}>
            <View style={{marginTop: '5%'}} />
            <VoucherItem voucher={voucher} />
            <View style={{marginTop: '2%'}} />
            {renderInfoPoint()}
            <View style={{marginTop: '5%'}} />
            {renderValidity()}
            <View style={{marginTop: '5%'}} />
            {renderDescription()}
            <View style={{marginTop: '5%'}} />
            {renderBlockedPoint()}
          </View>
        </ScrollView>

        <View style={styles.footer}>{renderRedeemButton()}</View>
      </View>
      {renderConfirmationDialog()}
      {renderImageRedeemSuccess()}
    </SafeAreaView>
  );
};

export default VoucherDetail;
