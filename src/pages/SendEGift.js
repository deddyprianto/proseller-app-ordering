import React, {useEffect, useState} from 'react';

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
import EGiftCard from '../components/eGiftCard/EGiftCard';
import {useDispatch, useSelector} from 'react-redux';
import {getGiftCardByCategory, sendGift} from '../actions/gift.action';
import FieldTextInput from '../components/fieldTextInput';
import CurrencyFormatter from '../helper/CurrencyFormatter';
import LoadingScreen from '../components/loadingScreen';

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
  viewButton: {
    backgroundColor: colorConfig.primaryColor,
    height: 35,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});

const SendEGift = ({categoryId}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState({});
  const [quantityValue, setQuantityValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [confirmEmailValue, setConfirmEmailValue] = useState('');
  const [recipientNameValue, setRecipientNameValue] = useState('');
  const [recipientEmailValue, setRecipientEmailValue] = useState('');
  const [giftCardImage, setGiftCardImage] = useState('');

  const giftCard = useSelector(
    state => state.giftReducer.giftCardByCategory.giftCard,
  );
  useEffect(() => {
    const loadData = async () => {
      await dispatch(getGiftCardByCategory({categoryId}));
    };
    loadData();
  }, [dispatch, categoryId]);

  useEffect(() => {
    setSelectedValue(giftCard?.values[0]);
  }, [giftCard]);

  const handleCheckboxSelected = value => {
    if (selectedValue === value) {
      return true;
    } else {
      return false;
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    await dispatch(
      sendGift({
        image: giftCardImage,
        value: quantityValue?.value,
        recipientName: recipientNameValue,
        recipientEmail: recipientEmailValue,
        giftCardCategoryId: categoryId,
        payments: [],
      }),
    );
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
        value={quantityValue}
        onChange={value => {
          setQuantityValue(value);
        }}
        placeholder="Quantity"
      />
    );
  };

  const renderTextInputEmail = () => {
    return (
      <FieldTextInput
        label="Your Email Address :"
        value={emailValue}
        onChange={value => {
          setEmailValue(value);
        }}
        placeholder="Your Email Address"
      />
    );
  };

  const renderTextInputConfirmEmail = () => {
    return (
      <FieldTextInput
        label="Confirm your email Address :"
        value={confirmEmailValue}
        onChange={value => {
          setConfirmEmailValue(value);
        }}
        placeholder="Confirm your email Address"
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
    return (
      <View>
        {renderTextPickDesign()}
        <EGiftCard
          cards={giftCard?.images}
          onChange={value => {
            setGiftCardImage(value);
          }}
        />
      </View>
    );
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

  const renderGiftFrom = () => {
    return (
      <View>
        <Text style={styles.text3}>This gift is from : </Text>
        <View style={styles.marginTop10} />
        {renderTextInputEmail()}
        <View style={styles.marginTop10} />
        {renderTextInputConfirmEmail()}
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

  const renderButtonPayment = () => {
    const disabled =
      !selectedValue ||
      !quantityValue ||
      !emailValue ||
      !confirmEmailValue ||
      !recipientNameValue ||
      !recipientEmailValue ||
      !giftCardImage;

    return (
      <TouchableOpacity
        onPress={() => {
          handlePayment();
        }}
        disabled={disabled}>
        <View style={styles.viewButton}>
          <Text style={styles.textButton}>
            Pay {CurrencyFormatter(selectedValue?.price)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderButtonPaymentWithPaylah = () => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.viewButton}>
          <Text style={styles.textButton}>Pay with Paylah</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTextOr = () => {
    return (
      <View style={styles.viewOr}>
        <Text style={styles.textOr}>OR</Text>
      </View>
    );
  };
  const renderTextInstruction = () => {
    return <Text style={styles.text1}>Select the following options</Text>;
  };

  return (
    <ScrollView style={styles.container}>
      <LoadingScreen loading={isLoading} />
      {renderHeader()}
      {renderTextInstruction()}
      {renderPickDesign()}
      {renderValueOfVoucher()}
      {renderTextInputQuantity()}
      {renderGiftFrom()}
      {renderGiftTo()}
      {renderButtonPayment()}
      {/* {renderTextOr()}
      {renderButtonPaymentWithPaylah()} */}
    </ScrollView>
  );
};

export default SendEGift;
