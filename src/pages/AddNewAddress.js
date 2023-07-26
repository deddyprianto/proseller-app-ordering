/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {Actions} from 'react-native-router-flux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';

import {updateUser} from '../actions/user.action';
import {showSnackbar} from '../actions/setting.action';

import Header from '../components/layout/header';
import FieldCheckBox from '../components/fieldCheckBox';
import LoadingScreen from '../components/loadingScreen';
import ConfirmationDialog from '../components/confirmationDialog';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import {isEmptyObject} from '../helper/CheckEmpty';

import Theme from '../theme';
import {LATITUDE_SINGAPORE, LONGITUDE_SINGAPORE} from '../constant/location';
import GlobalInputText from '../components/globalInputText';
import GlobalText from '../components/globalText';
import {Body} from '../components/layout';
import AutocompleteAddress from '../components/autocompleteAddress';
import useGetProtectionData from '../hooks/protection/useGetProtectioData';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
    },
    footer: {
      borderTopWidth: 0.2,
      padding: 16,
      borderTopColor: theme.colors.border1,
      backgroundColor: theme.colors.background,
    },
    map: {
      height: 200,
      width: '100%',
    },
    scrollView: {
      paddingHorizontal: 16,
    },
    textTitle: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textSave: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCoordinate: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    viewMap: {
      alignItems: 'center',
    },
    touchableSave: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
    },
    touchableSaveDisabled: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.buttonDisabled,
    },
    touchableCoordinate: {
      width: '100%',
      height: 30,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: theme.colors.primary,
    },
    iconLocation: {
      width: 17,
      height: 17,
      marginRight: 10,
      tintColor: theme.colors.text4,
    },
    divider: {
      width: '100%',
      height: 1,
      marginVertical: 24,
      backgroundColor: theme.colors.border,
    },
    marginTop16: {
      marginTop: 16,
    },
    labelAddress: {
      flexDirection: 'row',
      flex: 1,
      marginTop: 8,
    },
    itemLabelAddress: isActive => ({
      marginRight: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: isActive ? theme.colors.primary : 'white',
    }),
    itemLabelText: isActive => ({
      color: isActive ? 'white' : theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
    }),
  });
  return styles;
};

const AddNewAddress = ({address}) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [tagAddress, setTagAddress] = useState('');
  const [streetName, setStreetName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [latitude, setLatitude] = useState(LATITUDE_SINGAPORE);
  const [longitude, setLongitude] = useState(LONGITUDE_SINGAPORE);
  const [, setLatitudeDelta] = useState(1);
  const [, setLongitudeDelta] = useState(1);

  const [isSelected, setIsSelected] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const [user, setUser] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState([]);
  const {getUserDetail} = useGetProtectionData();

  const update = !isEmptyObject(address);

  const titleHeader = update ? 'Edit Address' : 'Add New Address';

  useEffect(() => {
    const result = getUserDetail();
    setUser(result);
    setDeliveryAddress(result?.deliveryAddress || []);
  }, []);
  useEffect(() => {
    if (address) {
      setIsSelected(address?.isSelected);
      setTagAddress(address?.tagAddress || '');
      setStreetName(address?.streetName || '');
      setUnitNumber(address?.unitNo || '');
      setPostalCode(address?.postalCode || '');
      setRecipientName(address?.recipient?.name || '');
      setMobileNumber(address?.recipient?.mobileNumber || '');
      setCountryCode(address?.recipient?.countryCode || '');
      setLatitude(address?.coordinate?.latitude || 1.29027);
      setLongitude(address?.coordinate?.longitude || 103.851959);
      setLatitudeDelta(address?.coordinate?.latitudeDelta || 0.001);
      setLongitudeDelta(address?.coordinate?.longitudeDelta || 0.001);
      setIsDefault(address?.isDefault || false);
    }
  }, [address]);

  const handleRemove = async () => {
    const deliveryAddressFormatted = deliveryAddress.filter(
      value => value.index !== address.index,
    );
    const payload = {
      username: user.username,
      deliveryAddress: deliveryAddressFormatted,
    };

    setIsLoading(true);
    const result = await dispatch(updateUser(payload));
    setIsLoading(false);
    Actions.pop();

    if (result.success) {
      await dispatch(
        showSnackbar({
          message: 'Address deleted',
          type: 'success',
        }),
      );
    } else {
      await dispatch(showSnackbar({message: 'Delivery delete failed'}));
    }
  };

  const handlePayload = () => {
    let deliveryAddresses = user?.deliveryAddress || [];

    if (isDefault) {
      deliveryAddresses.forEach(value => {
        value.isDefault = false;
      });
    }

    const value = {
      isSelected,
      tagAddress,
      streetName,
      postalCode,
      unitNo: unitNumber,
      coordinate: {
        latitude,
        longitude,
      },
      recipient: {
        name: recipientName,
        countryCode,
        mobileNumber,
        phoneNumber: countryCode + mobileNumber,
      },
      isDefault: deliveryAddresses?.length === 0 || isDefault,
    };

    if (typeof address?.index === 'number') {
      deliveryAddresses[address.index] = value;
    } else {
      deliveryAddresses.push(value);
    }

    deliveryAddresses.forEach((item, index) => {
      item.index = index;
    });

    const deliveryAddressDefault = deliveryAddresses.find(
      item => item.isDefault,
    );

    return {
      username: user?.username,
      deliveryAddress: deliveryAddresses,
      deliveryAddressDefault,
    };
  };

  const handleClickSave = async () => {
    const payload = handlePayload();

    setIsLoading(true);
    const result = await dispatch(updateUser(payload));
    setIsLoading(false);
    Actions.pop();

    if (result.success) {
      const text = update
        ? 'Address has been successfully changed'
        : 'New address added';

      await dispatch(
        showSnackbar({
          message: text,
          type: 'success',
        }),
      );
    } else {
      await dispatch(showSnackbar({message: 'Save failed'}));
    }
  };

  const handleOpenEditModal = () => {
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setIsOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const handleButtonSave = () => {
    if (update) {
      handleOpenEditModal();
    } else {
      handleClickSave();
    }
  };

  const handleCheckboxSelected = () => {
    if (isDefault) {
      setIsDefault(false);
    } else {
      setIsDefault(true);
    }
  };

  const renderCheckBox = () => {
    return (
      <FieldCheckBox
        label="Set as default"
        checked={isDefault}
        onPress={() => {
          handleCheckboxSelected();
        }}
      />
    );
  };

  const listLabelAddress = ['Home', 'Work', 'School', 'Office', 'Other'];

  const handleLabelAddress = value => {
    if (value.length > 50) {
      return null;
    }
    setTagAddress(value);
  };

  const handlePressLabel = value => {
    setTagAddress(value);
  };

  const renderLabelAddress = () => {
    const component = listLabelAddress.map((label, index) => (
      <Pressable
        key={index}
        onPress={() => handlePressLabel(label)}
        style={styles.itemLabelAddress(
          tagAddress.toLowerCase() === label.toLowerCase(),
        )}>
        <GlobalText
          style={styles.itemLabelText(
            tagAddress.toLowerCase() === label.toLowerCase(),
          )}>
          {label}
        </GlobalText>
      </Pressable>
    ));
    return (
      <View>
        <GlobalInputText
          label="Address Label"
          placeholder="Enter Address label"
          value={tagAddress}
          onChangeText={handleLabelAddress}
          maxLength={50}
          isMandatory
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.labelAddress}>
          {component}
        </ScrollView>
      </View>
    );
  };

  const onSelectAddress = item => {
    setStreetName(item['ADDRESS']);
    setPostalCode(item['POSTAL']);
  };

  const renderStreetNameField = () => {
    return (
      <AutocompleteAddress
        onSelectAddress={onSelectAddress}
        enableCurrentLocation
        value={streetName}
      />
    );
  };

  const handleUnitNumber = value => {
    if (value.length > 50) {
      return null;
    }
    setUnitNumber(value);
  };

  const renderUnitNumberField = () => {
    return (
      <GlobalInputText
        label="Building Name/Unit Number"
        placeholder="Enter building name or unit number "
        value={unitNumber}
        maxLength={50}
        onChangeText={handleUnitNumber}
        isMandatory
      />
    );
  };

  const handleRecipientName = value => {
    if (value.length > 50) {
      return null;
    }
    setRecipientName(value);
  };

  const renderRecipientNameField = () => {
    return (
      <GlobalInputText
        label="Recipient Name"
        isMandatory
        value={recipientName}
        onChangeText={handleRecipientName}
        placeholder="Recipient Name"
        maxLength={50}
      />
    );
  };

  const renderMobileNumberField = () => {
    return (
      <FieldPhoneNumberInput
        type="phone"
        label="Mobile Number"
        placeholder="Enter recipient mobile no"
        value={mobileNumber}
        valueCountryCode={countryCode}
        onChangeCountryCode={value => {
          setCountryCode(value);
        }}
        onChange={value => {
          setMobileNumber(value);
        }}
        withoutFlag={true}
        isMandatory={true}
        inputLabel={'Mobile No'}
      />
    );
  };
  const renderDeliveryDetailFields = () => {
    return (
      <View>
        <View style={styles.marginTop16} />
        <Text style={styles.textTitle}>Delivery Details</Text>
        <View style={styles.marginTop16} />
        <View style={styles.marginTop16} />
        {renderStreetNameField()}
        <View style={styles.marginTop16} />
        {renderUnitNumberField()}
        <View style={styles.marginTop16} />
        {renderLabelAddress()}
      </View>
    );
  };

  const renderRecipientDetailFields = () => {
    return (
      <View>
        <Text style={styles.textTitle}>Recipient Details</Text>
        <View style={styles.marginTop16} />
        {renderRecipientNameField()}
        <View style={styles.marginTop16} />
        {renderMobileNumberField()}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={{flex: 1}}>
        <Body>
          <ScrollView
            // keyboardShouldPersistTaps={true}
            nestedScrollEnabled={true}
            style={styles.scrollView}>
            {renderDeliveryDetailFields()}
            <View style={styles.divider} />
            {renderRecipientDetailFields()}
            <View style={styles.divider} />
            {/* {renderMap()} */}
            {renderCheckBox()}
            <View style={styles.marginTop16} />
          </ScrollView>
        </Body>
      </View>
    );
  };
  const handleActive = () => {
    if (
      tagAddress &&
      streetName &&
      unitNumber &&
      postalCode &&
      recipientName &&
      mobileNumber?.length > 6
    ) {
      return true;
    }
    return false;
  };

  const renderFooter = () => {
    const active = handleActive();
    const styleActive =
      active && !isLoading
        ? styles.touchableSave
        : styles.touchableSaveDisabled;
    const text = isLoading ? 'Loading....' : 'Save';

    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styleActive}
          disabled={!active}
          onPress={() => {
            handleButtonSave();
          }}>
          <Text style={styles.textSave}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeleteConfirmationDialog = () => {
    if (isOpenDeleteModal) {
      return (
        <ConfirmationDialog
          open={isOpenDeleteModal}
          handleClose={() => {
            handleCloseDeleteModal();
          }}
          handleSubmit={() => {
            handleRemove();
          }}
          isLoading={isLoading}
          textTitle="Delete Address"
          textDescription="Are your sure you want to delete this address?
           This action cannot be undone and you will be unable to recover any data."
          textSubmit="Sure"
        />
      );
    }
  };

  const renderEditConfirmationDialog = () => {
    if (isOpenEditModal) {
      return (
        <ConfirmationDialog
          open={isOpenEditModal}
          handleClose={() => {
            handleCloseEditModal();
          }}
          handleSubmit={() => {
            handleClickSave();
          }}
          isLoading={isLoading}
          textTitle="Edit Confirmation"
          textDescription="Are your sure you want to edit this address detail?"
          textSubmit="Sure"
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header
        title={titleHeader}
        remove={!isEmptyObject(address)}
        removeOnClick={() => {
          handleOpenDeleteModal();
        }}
      />
      {renderBody()}
      {renderFooter()}
      {renderDeleteConfirmationDialog()}
      {renderEditConfirmationDialog()}
    </SafeAreaView>
  );
};

export default AddNewAddress;
