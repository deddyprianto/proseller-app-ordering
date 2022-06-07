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
import IconOcticons from 'react-native-vector-icons/Octicons';

import Header from '../components/layout/header';

import FieldAsyncInput from '../components/fieldAsyncInput';
import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';

import awsConfig from '../config/awsConfig';
import colorConfig from '../config/colorConfig';

import {updateUser} from '../actions/user.action';
import FieldCheckBox from '../components/fieldCheckBox';
import LoadingScreen from '../components/loadingScreen';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
  },
  map: {
    height: 200,
    width: '100%',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  textSave: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  footer: {
    borderTopWidth: 0.2,
    borderTopColor: 'grey',
    padding: 16,
    backgroundColor: 'white',
  },
  textCoordinate: {
    color: 'white',
  },
  viewMap: {
    alignItems: 'center',
  },
  touchableSave: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    paddingVertical: 10,
  },
  touchableSaveDisabled: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7B7B7',
    paddingVertical: 10,
  },
  touchableCoordinate: {
    backgroundColor: colorConfig.primaryColor,
    width: '100%',
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconCoordinate: {
    fontSize: 15,
    color: 'white',
    marginRight: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#00000080',
    marginVertical: 12,
  },
});

const AddNewAddress = ({address, coordinate}) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [streetName, setStreetName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  useEffect(() => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));
    setUser(result);
  }, [userDetail]);

  useEffect(() => {
    if (address) {
      setStreetName(address?.streetName || '');
      setUnitNumber(address?.unitNo || '');
      setPostalCode(address?.postalCode || '');
      setRecipientName(address?.recipient?.name || '');
      setMobileNumber(address?.recipient?.mobileNumber || '');
      setCountryCode(address?.recipient?.countryCode || '');
      setIsDefault(address?.isDefault || false);
    }
  }, [address]);

  const handleClickSave = async () => {
    let deliveryAddresses = user.deliveryAddress || [];

    if (isDefault) {
      deliveryAddresses.forEach(value => {
        value.isDefault = false;
      });
    }

    deliveryAddresses.push({
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
    });

    deliveryAddresses.forEach((value, index) => {
      value.index = index;
    });

    const deliveryAddressDefault = deliveryAddresses.find(
      deliveryAddress => deliveryAddress.isDefault,
    );

    const payload = {
      username: user.username,
      deliveryAddress: deliveryAddresses,
      deliveryAddressDefault,
    };

    setIsLoading(true);
    await dispatch(updateUser(payload));
    Actions.pop();
    setIsLoading(false);
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
        <View style={{marginTop: 12}} />
        <Text>Delivery Details</Text>
        <View style={{marginTop: 12}} />
        {renderStreetNameField()}
        <View style={{marginTop: 12}} />
        {renderUnitNumberField()}
        <View style={{marginTop: 12}} />
        {renderPostalCodeField()}
      </View>
    );
  };

  const renderRecipientDetailFields = () => {
    return (
      <View>
        <Text>Recipient Details</Text>
        <View style={{marginTop: 12}} />
        {renderRecipientNameField()}
        <View style={{marginTop: 12}} />
        {renderMobileNumberField()}
      </View>
    );
  };

  const latitude = 1.29027;
  const longitude = 103.851959;
  const latitudeDelta = 0.001;
  const longitudeDelta = 0.001;

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
          <IconOcticons style={styles.iconCoordinate} name="location" />
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
      streetName &&
      unitNumber &&
      postalCode &&
      recipientName &&
      mobileNumber
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
            handleClickSave();
          }}>
          <Text style={styles.textSave}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header title="Add New Address" />
      {renderBody()}
      {renderFooter()}
    </View>
  );
};

export default AddNewAddress;
