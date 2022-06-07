/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';
import {Actions} from 'react-native-router-flux';
import DashedLine from 'react-native-dashed-line';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colorConfig from '../../../config/colorConfig';
import awsConfig from '../../../config/awsConfig';

import {isEmptyObject} from '../../../helper/CheckEmpty';
import {updateUser} from '../../../actions/user.action';
import ConfirmationDialog from '../../confirmationDialog';
import LoadingScreen from '../../loadingScreen';

const styles = StyleSheet.create({
  root: {
    elevation: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
  },
  rootActive: {
    elevation: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 1,
    borderColor: colorConfig.primaryColor,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textEdit: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  textDefault: {
    fontSize: 12,
    color: colorConfig.primaryColor,
  },
  textNameAndPhoneNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  textStreetName: {
    fontSize: 12,
  },
  textLocationPinned: {
    fontSize: 10,
    color: colorConfig.primaryColor,
  },
  viewLocationPinned: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewEdit: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 50,
  },
  viewEditDisabled: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    backgroundColor: '#B7B7B7',
    borderRadius: 50,
  },

  iconEdit: {
    fontSize: 10,
    color: 'white',
    marginRight: 2,
  },
  dividerDashed: {
    textAlign: 'center',
    color: colorConfig.primaryColor,
  },
});

const MyDeliveryAddressItem = ({item, deliveryAddress}) => {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
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

  const handleRemove = async () => {
    const result = deliveryAddress.filter(value => value.index !== item.index);

    const payload = {
      username: user.username,
      deliveryAddress: result,
    };

    setIsLoading(true);
    await dispatch(updateUser(payload));
    setIsLoading(false);

    setIsOpenModal(false);
  };

  const handleSelectAddress = async () => {
    let result = user.deliveryAddress || [];

    result.forEach(value => {
      if (value.index === item.index) {
        value.isSelected = true;
      } else {
        value.isSelected = false;
      }
    });

    const payload = {
      selectedAddress: item,
      phoneNumber: user.phoneNumber,
      deliveryAddress: result,
    };

    setIsLoading(true);
    await dispatch(updateUser(payload));
    setIsLoading(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const renderDividerDashed = () => {
    return (
      <DashedLine
        dashLength={10}
        dashThickness={0.5}
        dashGap={5}
        dashColor="#c32626"
      />
    );
  };

  const renderNameAndPhoneNumber = () => {
    return (
      <Text style={styles.textNameAndPhoneNumber}>
        {item?.recipient?.name} - {item?.recipient?.phoneNumber}
      </Text>
    );
  };

  const renderDefaultText = () => {
    if (item?.isDefault) {
      return <Text style={styles.textDefault}>Default</Text>;
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {renderNameAndPhoneNumber()}
        {renderDefaultText()}
      </View>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Text style={styles.textStreetName}>{item.streetName}</Text>
      </View>
    );
  };

  const renderLocationPinned = () => {
    if (!isEmptyObject(item?.coordinate)) {
      return (
        <View style={styles.viewLocationPinned}>
          <MaterialIcons
            style={{color: colorConfig.primaryColor}}
            name="location-on"
          />
          <Text style={styles.textLocationPinned}>Location Already Pinned</Text>
        </View>
      );
    }
  };

  const renderEditButton = () => {
    return (
      <TouchableOpacity
        style={styles.viewEdit}
        onPress={() => {
          Actions.addNewAddress({address: item});
        }}>
        <MaterialIcons style={styles.iconEdit} name="edit" />
        <Text style={styles.textEdit}>Edit</Text>
      </TouchableOpacity>
    );
  };

  const renderRemoveButton = () => {
    const disabled = item.isSelected || item.isDefault;
    const styleButton = disabled ? styles.viewEditDisabled : styles.viewEdit;
    return (
      <TouchableOpacity
        style={styleButton}
        disabled={disabled}
        onPress={() => {
          handleOpenModal();
        }}>
        <MaterialIcons style={styles.iconEdit} name="remove" />
        <Text style={styles.textEdit}>Remove</Text>
      </TouchableOpacity>
    );
  };
  const renderSelectButton = () => {
    return (
      <TouchableOpacity
        style={styles.viewEdit}
        onPress={() => {
          handleSelectAddress();
        }}>
        <MaterialIcons style={styles.iconEdit} name="check" />
        <Text style={styles.textEdit}>select</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderLocationPinned()}
        {renderEditButton()}
        {renderRemoveButton()}
        {renderSelectButton()}
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
            handleRemove();
          }}
          isLoading={isLoading}
          textTitle="Remove Address"
          textDescription="Are you sure?"
          textSubmit="Remove"
        />
      );
    }
  };

  const handleStyleRoot = () => {
    if (item.isSelected) {
      return styles.rootActive;
    } else {
      return styles.root;
    }
  };

  return (
    <>
      <LoadingScreen loading={isLoading} />
      <View style={handleStyleRoot()}>
        {renderHeader()}
        <View style={{marginTop: 8}} />
        {renderBody()}
        <View style={{marginTop: 8}} />
        {renderDividerDashed()}
        <View style={{marginTop: 16}} />
        {renderFooter()}
      </View>
      {renderConfirmationDialog()}
    </>
  );
};

export default MyDeliveryAddressItem;
