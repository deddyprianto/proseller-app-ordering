import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import GlobalText from '../globalText';
import {useDispatch, useSelector} from 'react-redux';
import GlobalModal from '../modal/GlobalModal';
import GlobalButton from '../button/GlobalButton';
import Theme from '../../theme/Theme';
import usePayment from '../../hooks/payment/usePayment';
import useDate from '../../hooks/formatDate/useDate';
import {
  changeOrderingMode,
  saveDeliveryCustomField,
  updateProvider,
} from '../../actions/order.action';
import {showSnackbar} from '../../actions/setting.action';
import LoadingScreen from '../loadingScreen';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    viewMethod: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 1,
    },
    touchableMethod: {
      width: 120,
      borderRadius: 8,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textMethodValue: {
      textAlign: 'center',
      flex: 1,
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    noPadding: {
      padding: 0,
    },
    p16: {
      paddingHorizontal: 16,
    },
    touchableItem: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      borderColor: theme.colors.brandPrimary,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    touchableItemSelected: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      borderColor: theme.colors.brandPrimary,
      backgroundColor: theme.colors.accent,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    actionButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    btnStyle: {
      width: '48%',
    },
    textSave: {
      fontFamily: theme.fontFamily.poppinsMedium,
      color: 'white',
    },
  });
  return {
    styles,
  };
};

const CustomFieldProvider = () => {
  const {styles} = useStyles();
  const provider = useSelector(
    state => state.orderReducer.dataBasket?.product?.provider,
  );
  const [activeModal, setActiveModal] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [selectedName, setSelectedName] = React.useState(null);
  const [selectedRawName, setSelectedRawName] = React.useState(null);
  const [isLoadingDataDelivery, setIsLoadingDataDelivery] = React.useState(
    false,
  );
  const {getDeliveryProviderFee} = usePayment();
  const {convertOrderActionDate} = useDate();
  const orderingDate = useSelector(
    state =>
      state.orderReducer?.orderingDateTime?.orderingDateTimeSelected?.date,
  );
  const selectedCustomField = useSelector(
    state => state.orderReducer?.deliveryCustomField,
  );
  const basketProvider = useSelector(
    state => state.orderReducer?.dataBasket?.product?.provider,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  console.log({selectedCustomField, provider}, 'silap');
  const dispatch = useDispatch();
  const onOpenModal = async field => {
    await setOptions(field?.options);
    await setSelectedName(field?.value);
    await setSelectedRawName(field?.name);
    await setActiveModal(true);
  };

  const closeModal = () => setActiveModal(false);

  const onSelectedField = value => {
    setSelectedValue(value);
  };

  console.log({provider}, 'nana');

  const onSaveData = async () => {
    setIsLoadingDataDelivery(true);
    const payload = {
      ...selectedCustomField.deliveryCustomField,
      [selectedName]: selectedValue,
    };
    const orderDate = convertOrderActionDate(orderingDate);
    const response = await getDeliveryProviderFee(orderDate, payload);
    const findSelectedProfider = response.data?.dataProvider?.find(
      provider => provider.id === basketProvider?.id,
    );
    console.log({findSelectedProfider}, 'nanak');
    if (
      findSelectedProfider &&
      !findSelectedProfider?.actionRequired &&
      findSelectedProfider?.deliveryProviderError?.status
    ) {
      setIsLoadingDataDelivery(false);
      return dispatch(
        showSnackbar({
          message: findSelectedProfider?.deliveryProviderError?.message,
        }),
      );
    }
    if (findSelectedProfider) {
      dispatch(saveDeliveryCustomField(payload));

      await dispatch(
        changeOrderingMode({
          orderingMode: basket?.orderingMode,
          provider: findSelectedProfider,
        }),
      );
      await dispatch(updateProvider(findSelectedProfider));
      closeDeliveryPopup();
    } else {
      closeDeliveryPopup();
    }
  };

  const closeDeliveryPopup = () => {
    setIsLoadingDataDelivery(false);
    closeModal();
  };

  const handleName = () => {
    if (selectedCustomField?.deliveryCustomField?.[selectedName]) {
      return selectedCustomField?.deliveryCustomField?.[selectedName];
    }
    return 'Choose';
  };

  const handleStyle = option => {
    if (option === selectedValue) {
      return styles.touchableItemSelected;
    }
    return styles.touchableItem;
  };

  return (
    <>
      <LoadingScreen loading={isLoadingDataDelivery} />
      {orderingDate &&
        provider?.customFields?.map((field, index) => (
          <View style={styles.viewMethod}>
            <View>
              <GlobalText>{field?.name}</GlobalText>
            </View>
            <TouchableOpacity
              style={styles.touchableMethod}
              onPress={() => onOpenModal(field || [])}
              key={index}>
              <GlobalText style={styles.textMethodValue}>
                {handleName()}
              </GlobalText>
            </TouchableOpacity>
          </View>
        ))}
      <GlobalModal
        title={`Choose ${selectedRawName}`}
        closeModal={closeModal}
        hideCloseIcon
        modalContainerStyle={styles.noPadding}
        enableDividerOnTitle
        isVisible={activeModal}>
        <View style={styles.p16}>
          {options.map((option, index) => (
            <TouchableOpacity
              onPress={() => onSelectedField(option)}
              style={handleStyle(option)}
              key={index}>
              <GlobalText style={styles.textMethodValue}>{option}</GlobalText>
            </TouchableOpacity>
          ))}
          <View style={styles.actionButton}>
            <GlobalButton
              onPress={closeModal}
              isOutline
              buttonStyle={styles.btnStyle}
              title="Cancel"
            />

            <GlobalButton
              disabled={isLoadingDataDelivery}
              onPress={onSaveData}
              buttonStyle={styles.btnStyle}>
              <GlobalText style={styles.textSave}>Save </GlobalText>
            </GlobalButton>
          </View>
        </View>
      </GlobalModal>
    </>
  );
};

export default CustomFieldProvider;
