/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CryptoJS from 'react-native-crypto-js';
import {Actions} from 'react-native-router-flux';

import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import awsConfig from '../../../config/awsConfig';

import {isEmptyObject} from '../../../helper/CheckEmpty';
import {updateUser} from '../../../actions/user.action';
import LoadingScreen from '../../loadingScreen';
import Theme from '../../../theme';
import AddressPick from '../../../assets/svg/AddressPick';
import GlobalButton from '../../button/GlobalButton';
import ThreeDot from '../../../assets/svg/ThreeDotSvg';
import GlobalModal from '../../modal/GlobalModal';
import GlobalText from '../../globalText';
import ModalAction from '../../modal/ModalAction';
import useGetProtectionData from '../../../hooks/protection/useGetProtectioData';
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
      alignItems: 'center',
    },
    body: {
      marginTop: 16,
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
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textNameAndPhoneNumber: {
      color: theme.colors.text1,
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textStreetName: {
      color: theme.colors.text1,
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
      marginTop: 8,
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
      paddingVertical: 3,
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
    addressPickContainer: {
      position: 'absolute',
      left: -16,
    },
    editButtonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    bottomButtonContainer: {
      height: 36,
    },
    editBtnContainer: {
      width: '80%',
    },
    threeDotBtnContainer: {
      width: '15%',
    },
    defaultContainer: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      marginLeft: 8,
      borderRadius: 8,
    },
    defaultText: {
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 12,
    },
    optionMenuContainer: {
      paddingVertical: 8,
    },
    divideLine: {
      height: 1,
      backgroundColor: theme.colors.greyScale3,
      marginVertical: 8,
    },
    scrollContainerStyle: {
      paddingBottom: 16,
    },
  });
  return styles;
};

const MyDeliveryAddressItem = ({item, fromScene, handleResetProvider}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {getUserDetail} = useGetProtectionData();
  const userDetail = useSelector(
    state => state.userReducer.getUser.userDetails,
  );
  const [openAnotherOption, setOpenAnotherOption] = React.useState(false);
  const [changeDefaultAddress, setChangeDefaultAddress] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openSelectModal, setOpenSelectModal] = React.useState(false);
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

  const handleSelectAddress = async () => {
    let result = user.deliveryAddress || [];

    const payload = {
      selectedAddress: item,
      phoneNumber: user.phoneNumber,
      deliveryAddress: result,
    };

    try {
      setIsLoading(true);
      await dispatch(updateUser(payload));
      if (handleResetProvider && typeof handleResetProvider === 'function') {
        handleResetProvider();
      }
      setIsLoading(false);
      handleToggleSelectModal();
    } catch (e) {
      if (__DEV__) {
        console.log(e, 'tidakaman');
      }
    }
  };
  const handleOpenAnotherOption = () => setOpenAnotherOption(true);
  const handleCloseOptionModal = () => {
    setOpenAnotherOption(false);
  };
  const handleCloseDefaultModal = () => setChangeDefaultAddress(false);
  const handleToggleDefaltAddress = async () => {
    handleCloseOptionModal();
    setTimeout(() => {
      setChangeDefaultAddress(true);
    }, 500);
  };
  const handleOpenDeleteModal = async () => {
    handleCloseOptionModal();
    setTimeout(() => {
      setOpenDeleteModal(true);
    }, 500);
  };
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const renderTagAddress = () => {
    return (
      <View style={[styles.viewTagAddress]}>
        <Text style={styles.textTagAddress}>{item?.tagAddress}</Text>
        {item?.isDefault ? (
          <View style={styles.defaultContainer}>
            <GlobalText style={styles.defaultText}>Default</GlobalText>
          </View>
        ) : null}
      </View>
    );
  };

  const onRemoveAddress = async () => {
    const result = getUserDetail();
    const filterAddress = result.deliveryAddress?.filter(
      address => address.index !== item.index,
    );
    const payload = {
      username: result.username,
      deliveryAddress: filterAddress,
    };

    try {
      await dispatch(updateUser(payload));
      handleCloseDeleteModal();
    } catch (e) {
      handleCloseDeleteModal();
      if (__DEV__) {
        console.log(e, 'error');
      }
    }
  };

  const onSetDefaultAddress = async () => {
    const result = getUserDetail();
    const mapAddress = result.deliveryAddress?.map(deliverAddress => {
      if (deliverAddress.index === item.index) {
        return {...deliverAddress, isDefault: true};
      }
      return {...deliverAddress, isDefault: false};
    });
    const payload = {
      username: result.username,
      deliveryAddress: mapAddress,
    };
    try {
      await dispatch(updateUser(payload));
      handleCloseDefaultModal();
    } catch (e) {
      handleCloseDeleteModal();
      if (__DEV__) {
        console.log(e, 'error');
      }
    }
  };

  const renderHeader = () => {
    if (item?.tagAddress) {
      return (
        <View style={styles.header}>
          <View style={styles.addressPickContainer}>
            <AddressPick />
          </View>
          {renderTagAddress()}
        </View>
      );
    }
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <Text style={styles.textNameAndPhoneNumber}>
          {item?.recipient?.name}
        </Text>
        <Text style={styles.textStreetName}>{item?.streetName}</Text>
      </View>
    );
  };

  const renderEditButton = () => {
    return (
      <View style={styles.editButtonContainer}>
        <GlobalButton
          isOutline
          containerStyle={[
            styles.editBtnContainer,
            styles.bottomButtonContainer,
          ]}
          title="Edit Address"
          onPress={() => {
            Actions.addNewAddress({address: item});
          }}
        />
        <GlobalButton
          isOutline
          containerStyle={[
            styles.threeDotBtnContainer,
            styles.bottomButtonContainer,
          ]}
          onPress={handleOpenAnotherOption}>
          <ThreeDot />
        </GlobalButton>
      </View>
    );
  };

  const renderFooter = () => {
    return <View style={styles.footer}>{renderEditButton()}</View>;
  };

  const handleStyleRoot = () => {
    const selected = selectedIndex === item?.index;

    if (selected && !isFromProfileScene) {
      return styles.rootActive;
    } else {
      return styles.root;
    }
  };

  const handleToggleSelectModal = () => {
    setOpenSelectModal(prevState => !prevState);
  };

  const disableButton = () => {
    if (!handleResetProvider) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <LoadingScreen loading={isLoading} />
      <TouchableOpacity
        style={handleStyleRoot()}
        disabled={disableButton()}
        onPress={handleToggleSelectModal}>
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </TouchableOpacity>
      <GlobalModal
        isBottomModal
        isVisible={openAnotherOption}
        onBackdropPress={handleCloseOptionModal}
        closeModal={handleCloseOptionModal}
        title="Another Options">
        <TouchableOpacity
          onPress={handleToggleDefaltAddress}
          style={styles.optionMenuContainer}>
          <GlobalText>Set as default address</GlobalText>
        </TouchableOpacity>
        <View style={styles.divideLine} />
        <TouchableOpacity
          onPress={handleOpenDeleteModal}
          style={styles.optionMenuContainer}>
          <GlobalText>Delete address</GlobalText>
        </TouchableOpacity>
      </GlobalModal>
      <ModalAction
        isVisible={changeDefaultAddress}
        closeModal={handleCloseDefaultModal}
        title="Change Default Address"
        description="Are you sure to set this address as your default address?"
        onCancel={handleCloseDefaultModal}
        scrollContainerStyle={styles.scrollContainerStyle}
        onApprove={onSetDefaultAddress}
      />
      <ModalAction
        isVisible={openDeleteModal}
        closeModal={handleCloseDeleteModal}
        title="Delete Address"
        description="Are you sure you want to delete this address?"
        onCancel={handleCloseDeleteModal}
        scrollContainerStyle={styles.scrollContainerStyle}
        onApprove={onRemoveAddress}
      />
      <ModalAction
        isVisible={openSelectModal}
        closeModal={handleToggleSelectModal}
        onCancel={handleToggleSelectModal}
        title="Select Address"
        description="Are you sure you want to select this address
as the delivery address?"
        onApprove={handleSelectAddress}
      />
    </>
  );
};

export default React.memo(MyDeliveryAddressItem);
