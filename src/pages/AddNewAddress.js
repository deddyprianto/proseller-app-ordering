/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import CryptoJS from 'react-native-crypto-js';
import {Actions} from 'react-native-router-flux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import Header from '../components/layout/header';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import awsConfig from '../config/awsConfig';

import {updateUser} from '../actions/user.action';
import FieldCheckBox from '../components/fieldCheckBox';
import LoadingScreen from '../components/loadingScreen';
import {isEmptyObject} from '../helper/CheckEmpty';
import FieldAddressTag from '../components/fieldAddressTag';
import Theme from '../theme';
import ConfirmationDialog from '../components/confirmationDialog';
import {showSnackbar} from '../actions/setting.action';
import appConfig from '../config/appConfig';

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
      marginVertical: 12,
      backgroundColor: theme.colors.border,
    },
  });
  return styles;
};

const AddNewAddress = ({address, coordinate}) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  const [tagAddress, setTagAddress] = useState('');
  const [streetName, setStreetName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [latitudeDelta, setLatitudeDelta] = useState(0);
  const [longitudeDelta, setLongitudeDelta] = useState(0);

  const [isSelected, setIsSelected] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const [user, setUser] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState([]);

  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  const update = !isEmptyObject(address);

  const titleHeader = update ? 'Edit Address' : 'Add New Address';

  useEffect(() => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));
    setUser(result);
    setDeliveryAddress(result?.deliveryAddress || []);
  }, [userDetail]);

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

  useEffect(() => {
    if (!isEmptyObject(coordinate)) {
      setLatitude(coordinate?.latitude);
      setLongitude(coordinate?.longitude);
      setLatitudeDelta(coordinate?.latitudeDelta);
      setLongitudeDelta(coordinate?.longitudeDelta);
    }
  }, [coordinate]);

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
          message: 'Delivery delete success',
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
      isDefault,
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

  const renderAddressTagField = () => {
    return (
      <FieldAddressTag
        value={tagAddress}
        onChange={value => {
          setTagAddress(value);
        }}
      />
    );
  };

  const renderStreetNameField = () => {
    return (
      <FieldTextInput
        label="Street Name"
        placeholder="Street Name"
        value={streetName}
        onChange={value => {
          setStreetName(value);
        }}
      />
    );
  };

  const renderUnitNumberField = () => {
    return (
      <FieldTextInput
        label="Unit Number"
        placeholder="Unit Number"
        value={unitNumber}
        onChange={value => {
          setUnitNumber(value);
        }}
      />
    );
  };
  const renderPostalCodeField = () => {
    return (
      <FieldTextInput
        label="Postal Code"
        placeholder="Postal Code"
        value={postalCode}
        onChange={value => {
          setPostalCode(value);
        }}
      />
    );
  };
  const renderRecipientNameField = () => {
    return (
      <FieldTextInput
        label="Recipient Name"
        placeholder="Recipient Name"
        value={recipientName}
        onChange={value => {
          setRecipientName(value);
        }}
      />
    );
  };

  const renderMobileNumberField = () => {
    return (
      <FieldPhoneNumberInput
        type="phone"
        label="Mobile Number"
        placeholder="Mobile Number"
        value={mobileNumber}
        valueCountryCode={countryCode}
        onChangeCountryCode={value => {
          setCountryCode(value);
        }}
        onChange={value => {
          setMobileNumber(value);
        }}
      />
    );
  };
  const renderDeliveryDetailFields = () => {
    return (
      <View>
        <View style={{marginTop: 16}} />
        <Text style={styles.textTitle}>Delivery Details</Text>
        <View style={{marginTop: 16}} />
        {renderAddressTagField()}
        <View style={{marginTop: 16}} />
        {renderStreetNameField()}
        <View style={{marginTop: 16}} />
        {renderUnitNumberField()}
        <View style={{marginTop: 16}} />
        {renderPostalCodeField()}
      </View>
    );
  };

  const renderRecipientDetailFields = () => {
    return (
      <View>
        <Text style={styles.textTitle}>Recipient Details</Text>
        <View style={{marginTop: 16}} />
        {renderRecipientNameField()}
        <View style={{marginTop: 16}} />
        {renderMobileNumberField()}
      </View>
    );
  };

  const renderMap = () => {
    return (
      <View style={styles.viewMap}>
        <MapView
          onPress={() => {
            Actions.pickCoordinate();
          }}
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          }}>
          <Marker coordinate={{latitude: latitude, longitude: longitude}} />
        </MapView>
        <TouchableOpacity
          onPress={() => {
            Actions.pickCoordinate();
          }}
          style={styles.touchableCoordinate}>
          <Image source={appConfig.iconLocation} style={styles.iconLocation} />
          <Text style={styles.textCoordinate}>Pick a Coordinate</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBody = () => {
    return (
      <ScrollView style={styles.scrollView}>
        {renderDeliveryDetailFields()}
        <View style={styles.divider} />
        {renderRecipientDetailFields()}
        <View style={styles.divider} />
        {renderMap()}
        {renderCheckBox()}
        <View style={{marginTop: 10}} />
      </ScrollView>
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
          disabled={!active || isLoading}
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
    <View style={styles.root}>
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
    </View>
  );
};

export default AddNewAddress;
