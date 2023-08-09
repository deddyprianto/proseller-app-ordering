/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {Actions} from 'react-native-router-flux';
import MapView, {Marker} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
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
import additionalSetting from '../config/additionalSettings';
import appConfig from '../config/appConfig';
import ModalAction from '../components/modal/ModalAction';

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
    mt24: {
      marginTop: 24,
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
    mb12: {
      marginBottom: 12,
    },
    scrollContainer: {
      paddingBottom: 100,
    },
    mb8: {
      marginBottom: 8,
    },
    buttonActionStyle: {
      paddingHorizontal: 16,
    },
    noPadding: {
      padding: 0,
    },
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
  const [latitudeDelta, setLatitudeDelta] = useState(1);
  const [longitudeDelta, setLongitudeDelta] = useState(1);

  const [isSelected, setIsSelected] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const [user, setUser] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState([]);
  const {getUserDetail} = useGetProtectionData();
  const {mapType} = additionalSetting();
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
          showNumberLengthText={true}
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

  const onSetAddress = value => {
    setStreetName(value);
  };

  const renderAddressText = () => (
    <GlobalInputText
      label="Street Name"
      placeholder="Street Name"
      value={streetName}
      onChangeText={onSetAddress}
      isMandatory
    />
  );

  const renderStreetNameField = () => {
    if (mapType === 'dropdown') {
      return (
        <View style={styles.mb8}>
          <AutocompleteAddress
            onSelectAddress={onSelectAddress}
            enableCurrentLocation
            value={streetName}
          />
        </View>
      );
    }
    return renderAddressText();
  };

  const handleUnitNumber = value => {
    if (value.length > 50) {
      return null;
    }
    setUnitNumber(value);
  };

  const onSetPostalCode = value => {
    setPostalCode(value);
  };

  const renderPostalCodeField = () => {
    return (
      <GlobalInputText
        label="Postal Code"
        placeholder="Postal Code"
        value={postalCode}
        isMandatory
        onChangeText={onSetPostalCode}
      />
    );
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
        showNumberLengthText={true}
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
      <View style={styles.mb8}>
        <GlobalInputText
          label="Recipient Name"
          isMandatory
          value={recipientName}
          onChangeText={handleRecipientName}
          placeholder="Recipient Name"
          maxLength={50}
        />
      </View>
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

  const handleSetCoordinate = coordinate => {
    if (!isEmptyObject(coordinate)) {
      setLatitude(coordinate?.latitude);
      setLongitude(coordinate?.longitude);
      setLatitudeDelta(coordinate?.latitudeDelta);
      setLongitudeDelta(coordinate?.longitudeDelta);
    }
  };

  const renderMap = () => {
    return (
      <View style={styles.viewMap}>
        <MapView
          onPress={() => {
            Actions.pickCoordinate({
              coordinated: {
                latitude,
                longitude,
              },
              handleChoose: value => {
                handleSetCoordinate(value);
              },
            });
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
            Actions.pickCoordinate({
              coordinated: {
                latitude,
                longitude,
              },
              handleChoose: value => {
                handleSetCoordinate(value);
              },
            });
          }}
          style={styles.touchableCoordinate}>
          <Image source={appConfig.iconLocation} style={styles.iconLocation} />
          <Text style={styles.textCoordinate}>Pick a Coordinate</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDeliveryDetailFields = () => {
    return (
      <View>
        <View style={styles.mt24} />
        <Text style={styles.textTitle}>Delivery Details</Text>
        {renderStreetNameField()}
        {renderUnitNumberField()}
        {mapType === 'map' ? renderPostalCodeField() : null}
        {renderLabelAddress()}
      </View>
    );
  };

  const renderRecipientDetailFields = () => {
    return (
      <View>
        <Text style={styles.textTitle}>Recipient Details</Text>
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
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={styles.scrollContainer}
            nestedScrollEnabled={true}
            style={styles.scrollView}>
            {renderDeliveryDetailFields()}
            <View style={styles.divider} />
            {renderRecipientDetailFields()}
            <View style={[styles.divider, {marginBottom: 12}]} />
            {mapType === 'map' ? renderMap() : null}
            {renderCheckBox()}
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
    return (
      <ModalAction
        title="Delete Address"
        description="Are you sure you want to delete this address?"
        isVisible={isOpenDeleteModal}
        onApprove={handleRemove}
        closeModal={handleCloseDeleteModal}
        onCancel={handleCloseDeleteModal}
        buttonActionStyle={styles.buttonActionStyle}
        ModalContainerStyle={styles.noPadding}
        hideCloseButton
      />
    );
  };

  const renderEditConfirmationDialog = () => {
    return (
      <ModalAction
        title="Edit Confirmation"
        description="Are your sure you want to edit this address detail?"
        isVisible={isOpenEditModal}
        onApprove={handleClickSave}
        closeModal={handleCloseEditModal}
        onCancel={handleCloseEditModal}
        buttonActionStyle={styles.buttonActionStyle}
        ModalContainerStyle={styles.noPadding}
        hideCloseButton
      />
    );
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
