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

import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import awsConfig from '../../../config/awsConfig';

import {isEmptyObject} from '../../../helper/CheckEmpty';
import {updateUser} from '../../../actions/user.action';
import LoadingScreen from '../../loadingScreen';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';
import ConfirmationDialog from '../../confirmationDialog';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    rootActive: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    body: {
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'column',
    },
    footer: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textEdit: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDefault: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textTagAddress: {
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNameAndPhoneNumber: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textStreetName: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textLocationPinned: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textLocationNotPinned: {
      color: theme.colors.text2,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    viewTagAddress: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      paddingHorizontal: 8,
      paddingVertical: 3,
      backgroundColor: theme.colors.primary,
      marginBottom: 16,
    },
    viewLocation: {
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
      paddingVertical: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
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
      width: 14,
      height: 14,
      marginRight: 4,
      tintColor: theme.colors.text4,
    },
    dividerDashed: {
      textAlign: 'center',
      color: theme.colors.primary,
    },
    primaryColor: {
      color: theme.colors.primary,
    },
    iconLocationPinned: {
      width: 15,
      height: 15,
      tintColor: theme.colors.primary,
      marginRight: 4,
    },
    iconLocationNotPinned: {
      width: 15,
      height: 15,
      tintColor: theme.colors.text2,
      marginRight: 4,
    },
  });
  return styles;
};

const MyDeliveryAddressItem = ({item, fromScene}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [user, setUser] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );

  const isFromProfileScene = fromScene === 'profile';

  useEffect(() => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );

    const result = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    const selected = !isEmptyObject(result?.selectedAddress)
      ? result?.selectedAddress?.index
      : result?.deliveryAddressDefault?.index;

    setSelectedIndex(selected);
    setUser(result);
  }, [userDetail]);

  const handleOpenConfirmationModal = () => {
    const isAlreadySelected = selectedIndex === item?.index;
    if (!isAlreadySelected) {
      setIsOpenModal(true);
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsOpenModal(false);
  };

  const handleSelectAddress = async () => {
    let result = user.deliveryAddress || [];

    const payload = {
      selectedAddress: item,
      phoneNumber: user.phoneNumber,
      deliveryAddress: result,
    };

    setIsLoading(true);
    await dispatch(updateUser(payload));
    setIsLoading(false);
    handleCloseConfirmationModal();
  };

  const renderDividerDashed = () => {
    return (
      <DashedLine
        dashLength={10}
        dashThickness={0.5}
        dashGap={5}
        dashColor={styles.primaryColor.color}
      />
    );
  };

  const renderTagAddress = () => {
    return (
      <View style={styles.viewTagAddress}>
        <Text style={styles.textTagAddress}>{item?.tagAddress}</Text>
      </View>
    );
  };

  const renderDefaultText = () => {
    if (item?.isDefault) {
      return <Text style={styles.textDefault}>Default</Text>;
    }
  };

  const renderHeader = () => {
    if (item?.tagAddress) {
      return (
        <View style={styles.header}>
          {renderTagAddress()}
          {renderDefaultText()}
        </View>
      );
    }
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Text style={styles.textNameAndPhoneNumber}>
          {item?.recipient?.name} - {item?.recipient?.phoneNumber}
        </Text>
        <Text style={styles.textStreetName}>{item.streetName}</Text>
      </View>
    );
  };

  const renderLocationPinned = () => {
    if (!isEmptyObject(item?.coordinate)) {
      return (
        <View style={styles.viewLocation}>
          <Image
            source={appConfig.iconLocation}
            style={styles.iconLocationPinned}
          />
          <Text style={styles.textLocationPinned}>Location Already Pinned</Text>
        </View>
      );
    }
  };

  const renderLocationNotPinned = () => {
    if (!isEmptyObject(item?.coordinate)) {
      return (
        <View style={styles.viewLocation}>
          <Image
            source={appConfig.iconLocation}
            style={styles.iconLocationNotPinned}
          />
          <Text style={styles.textLocationNotPinned}>Not pinned yet</Text>
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
        <Image source={appConfig.iconEdit} style={styles.iconEdit} />
        <Text style={styles.textEdit}>Edit</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    const location = item?.coordinate?.latitude
      ? renderLocationPinned()
      : renderLocationNotPinned();

    return (
      <View style={styles.footer}>
        {location}
        {renderEditButton()}
      </View>
    );
  };

  const handleStyleRoot = () => {
    const selected = selectedIndex === item?.index;

    if (selected && !isFromProfileScene) {
      return styles.rootActive;
    } else {
      return styles.root;
    }
  };

  const renderConfirmationDialog = () => {
    if (isOpenModal) {
      return (
        <ConfirmationDialog
          open={isOpenModal}
          handleClose={() => {
            handleCloseConfirmationModal();
          }}
          handleSubmit={() => {
            handleSelectAddress();
          }}
          isLoading={isLoading}
          textTitle="Change Delivery Address"
          textDescription="Are you sure you want to use this address?"
          textSubmit="Sure"
        />
      );
    }
  };

  return (
    <>
      <LoadingScreen loading={isLoading} />
      <TouchableOpacity
        style={handleStyleRoot()}
        disabled={isFromProfileScene}
        onPress={() => {
          handleOpenConfirmationModal();
        }}>
        {renderHeader()}
        {renderBody()}
        {renderDividerDashed()}
        {renderFooter()}
      </TouchableOpacity>
      {renderConfirmationDialog()}
    </>
  );
};

export default MyDeliveryAddressItem;
