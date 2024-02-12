import React from 'react';
import {View, StyleSheet} from 'react-native';

import GlobalModal from './GlobalModal';
import GlobalButton from '../button/GlobalButton';
import GlobalText from '../../components/globalText';

const useStyles = () => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    containerBtnOpenSettings: {
      display: 'flex',
      flexDirection: 'row',
    },
    textPopUpContentCenter: {
      textAlign: 'center',
    },
    gapBtnOpenSettings: {
      paddingHorizontal: 4,
    },
  });
  return styles;
};

const LocationModal = ({
  openLocationModal,
  handleClose,
  onClickSubmitLocationModal,
}) => {
  const styles = useStyles();
  const title =
    openLocationModal === 'requestPermission'
      ? 'Location Services Disabled'
      : 'Outside Store Range';
  const description =
    openLocationModal === 'requestPermission'
      ? 'To use Scan and Go, enable your GPS/Location Services'
      : `You're currently beyond the store's location range. To use Scan and Go,
        please move closer to the store`;
  const txtSubmit =
    openLocationModal === 'requestPermission' ? 'Open Settings' : 'Understood';

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
      isVisible={openLocationModal}
      hideCloseIcon>
      <GlobalText style={styles.textPopUpContentCenter}>
        {description}
      </GlobalText>
    </GlobalModal>
  );
};

export default LocationModal;
