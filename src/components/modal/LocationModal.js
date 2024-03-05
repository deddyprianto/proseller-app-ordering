import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Theme from '../../theme/Theme';
import GlobalModal from './GlobalModal';
import GlobalButton from '../button/GlobalButton';
import GlobalText from '../../components/globalText';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    containerBtnOpenSettings: {
      display: 'flex',
      flexDirection: 'row',
    },
    textPopUpContentCenter: {
      fontFamily: theme.fontFamily.poppinsMedium,
      textAlign: 'center',
    },
    gapBtnOpenSettings: {
      paddingHorizontal: 4,
    },
    txtBold: {
      fontFamily: theme.fontFamily.poppinsBold,
    },
  });
  return styles;
};

const LocationModal = ({
  openLocationModal,
  handleClose,
  onClickSubmitLocationModal,
  outlet,
}) => {
  const styles = useStyles();
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setOpenModal(!!openLocationModal);
      }, 300);
    };
    loadData();
  }, [openLocationModal]);

  const title =
    openLocationModal === 'requestPermission'
      ? 'Location Services & Permission'
      : 'Outside Store Range';
  const txtSubmit =
    openLocationModal === 'requestPermission' ? 'Open Settings' : 'Understood';

  const description = () => {
    if (openLocationModal === 'requestPermission') {
      return (
        <Text>
          To use {outlet?.storeCheckOutName || 'Store Checkout'}, please{' '}
          <BoldText>enable location services</BoldText> and{' '}
          <BoldText>grant location permissions</BoldText> to the app.
        </Text>
      );
    } else {
      return `You're currently beyond the store's location range. To use ${outlet?.storeCheckOutName ||
        'Store Checkout'}, please move closer to the store`;
    }
  };

  const BoldText = props => {
    return <Text style={styles.txtBold}>{props.children}</Text>;
  };

  return (
    <GlobalModal
      title={title}
      stickyBottom={
        <View style={styles.containerBtnOpenSettings}>
          {openLocationModal === 'requestPermission' && (
            <>
              <View style={styles.root}>
                <GlobalButton
                  isOutline
                  onPress={() => handleClose()}
                  title="Cancel"
                />
              </View>
              <View style={styles.gapBtnOpenSettings} />
            </>
          )}
          <View style={styles.root}>
            <GlobalButton
              onPress={() => onClickSubmitLocationModal()}
              title={txtSubmit}
            />
          </View>
        </View>
      }
      isVisible={openModal && !!openLocationModal}
      hideCloseIcon>
      <GlobalText style={styles.textPopUpContentCenter}>
        {description()}
      </GlobalText>
    </GlobalModal>
  );
};

export default LocationModal;
