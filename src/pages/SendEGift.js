import React, {useCallback, useEffect, useState} from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {CheckBox} from 'react-native-elements';

import colorConfig from '../config/colorConfig';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import EGiftCard from '../components/eGiftCard';
import {useDispatch, useSelector} from 'react-redux';
import {getGiftCardByCategory, sendGift} from '../actions/gift.action';
import FieldTextInput from '../components/fieldTextInput';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import LoadingScreen from '../components/loadingScreen';

import {Actions} from 'react-native-router-flux';
import {showSnackbar} from '../actions/setting.action';
import ConfirmationDialog from '../components/confirmationDialog';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
  },
  marginTop10: {
    marginTop: 10,
  },
  textTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  textDescription: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    width: WIDTH * 0.6,
    letterSpacing: 0.2,
    marginTop: 30,
    marginBottom: 20,
  },
  textPaymentMethodButton: {
    color: colorConfig.store.titleSelected,
    fontWeight: 'bold',
  },
  text1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  text2: {
    marginTop: 10,
    color: 'black',
    fontSize: 14,
  },
  text3: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  textRequired: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },
  input: {
    height: 35,
    marginTop: 5,
    borderWidth: 1,
    fontSize: 10,
    borderRadius: 5,
  },
  inputEmpty: {
    height: 35,
    marginTop: 5,
    borderWidth: 1,
    fontSize: 10,
    borderRadius: 5,
    borderColor: 'red',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
  },
  textOr: {
    color: 'black',
    fontSize: 20,
  },
  viewText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCheckboxItem: {
    marginLeft: -20,
  },
  viewButtonPayment: {
    backgroundColor: colorConfig.primaryColor,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  viewButtonPaymentDisabled: {
    backgroundColor: colorConfig.buttonDisabled,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  viewHeader: {
    paddingTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  viewBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    width: WIDTH * 0.35,
    height: HEIGHT * 0.035,
    backgroundColor: colorConfig.fifthColor,
  },
  viewOr: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCheckbox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  viewCheckboxItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -20,
  },
  touchablePaymentMethod: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderColor: '#00000061',
  },
  iconArrow: {
    color: colorConfig.store.titleSelected,
    fontSize: 25,
  },
});

const SendEGift = ({categoryId}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const [quantityValue, setQuantityValue] = useState('');
  const [recipientNameValue, setRecipientNameValue] = useState('');
  const [recipientEmailValue, setRecipientEmailValue] = useState('');
  const [giftCardImage, setGiftCardImage] = useState('');

  const giftCard = useSelector(
    state => state.giftReducer.giftCardByCategory.giftCard,
  );

  const selectedAccount = useSelector(
    state => state.cardReducer.selectedAccount.selectedAccount,
  );

  const refreshGiftCard = useCallback(() => {
    setGiftCardImage(giftCard?.images[0]);
    setSelectedValue(giftCard?.values[0]);
  }, [giftCard]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(getGiftCardByCategory({categoryId}));
      setIsLoading(false);
    };
    loadData();
  }, [dispatch, categoryId]);

  useEffect(() => {
    refreshGiftCard();
  }, [refreshGiftCard]);

  const handleCheckboxSelected = value => {
    if (selectedValue === value) {
      return true;
    } else {
      return false;
    }
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleClear = () => {
    setQuantityValue('');
    setRecipientEmailValue('');
    setRecipientNameValue('');
    handleCloseModal();
    refreshGiftCard();
    dispatch({
      type: 'SELECTED_ACCOUNT',
      selectedAccount: undefined,
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const response = await dispatch(
      sendGift({
        image: giftCardImage,
        value: selectedValue?.value,
        quantity: quantityValue,
        recipientName: recipientNameValue,
        recipientEmail: recipientEmailValue,
        giftCardCategoryId: categoryId,
        payments: [
          {
            accountId: selectedAccount?.accountID,
            paymentID: selectedAccount?.paymentID,
            paymentName: selectedAccount?.paymentName,
            paymentType: selectedAccount?.paymentID,
          },
        ],
      }),
    );

    if (response.success) {
      const message = response?.responseBody?.message;
      await dispatch(showSnackbar({message, type: 'success'}));
      handleClear();
    } else {
      const message = response?.responseBody?.message || 'Failed';
      await dispatch(showSnackbar({message}));
    }
    setIsLoading(false);
  };

  const renderHeader = () => {
    return (
      <View style={styles.viewHeader}>
        <View style={styles.viewTitle}>
          <Text style={styles.textTitle}>Send A Gift</Text>
        </View>
        <Text style={styles.textDescription}>
          Send a gift to your love ones or friends with a custom design voucher
        </Text>
      </View>
    );
  };

  const renderCheckboxItem = value => {
    return (
      <View style={styles.viewCheckboxItem}>
        <CheckBox
          onPress={() => {
            setSelectedValue(value);
          }}
          checked={handleCheckboxSelected(value)}
          checkedColor={colorConfig.primaryColor}
        />
        <Text style={styles.textCheckboxItem}>${value?.value}</Text>
      </View>
    );
  };

  const renderCheckbox = () => {
    const result = giftCard?.values?.map(value => {
      return renderCheckboxItem(value);
    });

    return <View style={styles.viewCheckbox}>{result}</View>;
  };

  const renderTextInputQuantity = () => {
    return (
      <FieldTextInput
        label="Quantity :"
        type="number"
        value={quantityValue}
        onChange={value => {
          setQuantityValue(value);
        }}
        placeholder="Quantity"
      />
    );
  };

  const renderTextInputRecipientName = () => {
    return (
      <FieldTextInput
        label="Recipient Name :"
        value={recipientNameValue}
        onChange={value => {
          setRecipientNameValue(value);
        }}
        placeholder="Recipient Name"
      />
    );
  };

  const renderTextInputRecipientEmail = () => {
    return (
      <FieldTextInput
        label="Recipient Email :"
        value={recipientEmailValue}
        onChange={value => {
          setRecipientEmailValue(value);
        }}
        placeholder="Recipient Email"
      />
    );
  };

  const renderTextPickDesign = () => {
    return (
      <View style={styles.viewText}>
        <Text style={styles.text2}>Pick a Design </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
    );
  };

  const renderPickDesign = () => {
    if (giftCard) {
      return (
        <View>
          {renderTextPickDesign()}
          <EGiftCard
            cards={giftCard?.images}
            selectedCard={giftCardImage}
            onChange={value => {
              setGiftCardImage(value);
            }}
          />
        </View>
      );
    }
  };

  const renderTextValueOfVoucher = () => {
    return (
      <View style={styles.viewText}>
        <Text style={styles.text2}>Value of Voucher </Text>
        <Text style={styles.textRequired}>*</Text>
      </View>
    );
  };

  const renderValueOfVoucher = () => {
    return (
      <View>
        {renderTextValueOfVoucher()}
        {renderCheckbox()}
      </View>
    );
  };

  const renderGiftTo = () => {
    return (
      <View>
        <Text style={styles.text3}>Deliver this gift to :</Text>
        <View style={styles.marginTop10} />
        {renderTextInputRecipientName()}
        <View style={styles.marginTop10} />
        {renderTextInputRecipientEmail()}
      </View>
    );
  };

  const HandleSelectedPaymentMethod = value => {
    const maskedAccountNumber = value?.details?.maskedAccountNumber;

    if (!value?.isAccountRequired) {
      return value?.paymentName;
    }

    if (maskedAccountNumber) {
      const number = maskedAccountNumber.substr(
        maskedAccountNumber.length - 4,
        4,
      );

      return `${value?.details.cardIssuer.toUpperCase()} ${number}`;
    } else {
      return null;
    }
  };

  const renderButtonPayment = () => {
    const payment = HandleSelectedPaymentMethod(selectedAccount);
    const disabled =
      !selectedValue ||
      !quantityValue ||
      !recipientNameValue ||
      !recipientEmailValue ||
      !giftCardImage ||
      !payment;

    const style = disabled
      ? styles.viewButtonPaymentDisabled
      : styles.viewButtonPayment;

    const totalPrice = selectedValue?.price * quantityValue;
    return (
      <TouchableOpacity
        onPress={() => {
          handleOpenModal();
        }}
        disabled={disabled}>
        <View style={style}>
          <Text style={styles.textButton}>
            Pay {CurrencyFormatter(totalPrice)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTextInstruction = () => {
    return <Text style={styles.text1}>Select the following options</Text>;
  };

  const renderPaymentMethodButton = () => {
    const text = selectedAccount
      ? HandleSelectedPaymentMethod(selectedAccount)
      : 'Payment Method';

    return (
      <TouchableOpacity
        style={styles.touchablePaymentMethod}
        onPress={() =>
          Actions.paymentMethods({
            page: 'sendEGift',
            paySVC: null,
          })
        }>
        <Text style={styles.textPaymentMethodButton}>{text}</Text>
        <IconIonicons name={'md-arrow-dropright'} style={styles.iconArrow} />
      </TouchableOpacity>
    );
  };

  const renderPaymentMethod = () => {
    return (
      <View>
        <Text style={styles.text3}>Payment Method :</Text>
        <View style={styles.marginTop10} />
        {renderPaymentMethodButton()}
      </View>
    );
  };

  const renderConfirmationDialog = () => {
    if (isOpenModal) {
      return (
        <ConfirmationDialog
          open={isOpenModal}
          handleClose={() => {
            handleCloseModal();
          }}
          handleSubmit={() => {
            handlePayment();
          }}
          isLoading={isLoading}
          textTitle="Sending Gift Card"
          textDescription={`Sending this gift card to ${recipientEmailValue}`}
          textSubmit="Send & Pay"
        />
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingScreen loading={isLoading} />
      {renderHeader()}
      {renderTextInstruction()}
      {renderPickDesign()}
      {renderValueOfVoucher()}
      {renderTextInputQuantity()}
      {renderGiftTo()}
      {renderPaymentMethod()}
      {renderButtonPayment()}
      {renderConfirmationDialog()}
    </ScrollView>
  );
};

export default SendEGift;
