/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import colorConfig from '../config/colorConfig';
import MyDeliveryAddressList from '../components/myDeliveryAddressList';

import Header from '../components/layout/header';

import OrderingTypeSelectorModal from '../components/modal/OrderingTypeSelectorModal';
import DeliveryProviderSelectorModal from '../components/modal/DeliveryProviderSelectorModal';
import DeliveryDateSelectorModal from '../components/modal/DeliveryDateSelectorModal';
import {color} from 'react-native-reanimated';
import appConfig from '../config/appConfig';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';

import FieldAsyncInput from '../components/fieldAsyncInput';
import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
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
  touchableSave: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorConfig.primaryColor,
    paddingVertical: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#00000080',
    marginVertical: 12,
  },
});

const AddNewAddress = () => {
  const [streetName, setStreetName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const renderStreetNameField = () => {
    return (
      <FieldAsyncInput
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
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
          }}>
          <Text>See Location</Text>
          <IconEvilIcons name="location" style={{fontSize: 24}} />
        </View>
        <MapView
          onPress={() => {
            Actions.pickCoordinate();
          }}
          style={{height: 50, width: 100}}
          region={{
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          }}>
          <Marker
            coordinate={{latitude: latitude, longitude: longitude}}
            title={'MARTIN'}
            description={'MARTIN'}
          />
        </MapView>
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
      </ScrollView>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.touchableSave}>
          <Text style={styles.textSave}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Header title="Add New Address" />
      {renderBody()}
      {renderFooter()}
    </View>
  );
};

export default AddNewAddress;
