import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
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
import GlobalInputText from '../globalInputText';

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
    selected: isSelected => ({
      backgroundColor: isSelected ? theme.colors.primary : 'white',
    }),
    textSelected: isSelected => ({
      color: isSelected ? 'white' : theme.colors.primary,
    }),
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
  const [selectedField, setSelectedField] = React.useState(false);

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

  const dispatch = useDispatch();

  const onOpenModal = async field => {
    await setOptions(field?.options);
    await setSelectedName(field?.value);
    await setSelectedRawName(field?.name);
    await setActiveModal(true);
    setSelectedField(field);
  };

  const closeModal = () => setActiveModal(false);

  const onSelectedField = value => {
    setSelectedValue(value);
  };

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
      setSelectedValue(null);
    } else {
      closeDeliveryPopup();
      setSelectedValue(null);
    }
  };
  const closeDeliveryPopup = () => {
    setIsLoadingDataDelivery(false);
    closeModal();
  };

  const handleName = value => {
    if (selectedCustomField?.deliveryCustomField?.[value]) {
      return selectedCustomField?.deliveryCustomField?.[value];
    }
    return 'Choose';
  };
  const handleStyle = option => {
    let value = selectedValue;
    if (!value) {
      value = selectedCustomField?.deliveryCustomField?.[selectedName];
    }
    if (option === value) {
      return styles.touchableItemSelected;
    }
    return styles.touchableItem;
  };

  const handleDisableSaveButton = () => {
    const isDisabled = isLoadingDataDelivery || !selectedValue
    if (!options) {
      return isDisabled || selectedValue > selectedField?.max || selectedValue < selectedField?.min
    }
    return isDisabled
  }

  return (
    <>
      {orderingDate &&
        provider?.customFields?.map((field, index) => (
          <View style={styles.viewMethod}>
            <View>
              <GlobalText>{field?.name}</GlobalText>
            </View>
            <TouchableOpacity
              style={[
                styles.touchableMethod,
                styles.selected(
                  selectedCustomField?.deliveryCustomField?.[field.value],
                ),
              ]}
              onPress={() => onOpenModal(field || [])}
              key={index}>
              <GlobalText
                style={[
                  styles.textMethodValue,
                  styles.textSelected(
                    selectedCustomField?.deliveryCustomField?.[field.value],
                  ),
                ]}>
                {handleName(field?.value)}
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
          <LoadingScreen loading={isLoadingDataDelivery} />
          {options ? (
            options?.map((option, index) => (
              <TouchableOpacity
                onPress={() => onSelectedField(option)}
                style={handleStyle(option)}
                key={index}>
                <GlobalText style={styles.textMethodValue}>{option}</GlobalText>
              </TouchableOpacity>
            ))
          ) : (
            <GlobalInputText
              value={selectedValue}
              onChangeText={value => setSelectedValue(value)}
              placeholder={selectedRawName}
              label={`${selectedRawName} (min ${selectedField.min} max ${selectedField.max})`}
              isError={
                selectedValue > selectedField?.max ||
                selectedValue < selectedField?.min ||
                !selectedValue
              }
              errorMessage={`Please enter a ${selectedRawName} from ${
                selectedField?.min
              } to ${selectedField?.max}`}
              keyboardType="numeric"
            />
          )}
          <View style={styles.actionButton}>
            <GlobalButton
              onPress={closeModal}
              isOutline
              buttonStyle={styles.btnStyle}
              title="Cancel"
            />

            <GlobalButton
              disabled={handleDisableSaveButton()}
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
