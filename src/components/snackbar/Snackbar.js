/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import {closeSnackbar} from '../../actions/setting.action';
import Theme from '../../theme';
import appConfig from '../../config/appConfig';

const useStyles = () => {
  const theme = Theme();
  const styles = {
    root: {
      height: '100%',
    },
    container: {
      // top: 50,
      width: '100%',
      // position: 'absolute',
      paddingHorizontal: 16,
    },
    textSnackbar: {
      marginLeft: 12,
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewSnackbarFailed: background => ({
      width: '100%',
      padding: 14,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: background ? background : theme.colors.snackbarFailed,
    }),
    viewSnackbarSuccess: background => ({
      width: '100%',
      padding: 14,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: background ? background : theme.colors.snackbarSuccess,
    }),
    viewIcon: {
      width: 20,
      height: 20,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    iconCheck: {
      width: 18,
      height: 18,
      tintColor: theme.colors.snackbarSuccess,
    },
    iconClose: {
      width: 18,
      height: 18,
      tintColor: theme.colors.snackbarFailed,
    },
    marginTopIos: {
      marginTop: 50,
    },
    marginTopAndroid: {
      marginTop: 5,
    },
    marginTopIphone14Pro: {
      marginTop: 70,
    },
  };
  return styles;
};

const Snackbar = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [deviceInfo, setDeviceInfo] = useState('');

  const message = useSelector(state => state.settingReducer.snackbar.message);
  const type = useSelector(state => state.settingReducer.snackbar.type);
  const background = useSelector(
    state => state.settingReducer.snackbar?.background,
  );

  const open = message ? true : false;

  useEffect(() => {
    const loadData = async () => {
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceOS = Platform.OS;

      if (deviceName.includes('iPhone 14 Pro')) {
        setDeviceInfo('typeIphone14Pro');
      } else if (deviceOS === 'ios') {
        setDeviceInfo('typeIos');
      } else {
        setDeviceInfo('typeAndroid');
      }
    };

    loadData();
  }, []);

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const countdown = async () => {
    let second = 3;
    const result = setInterval(() => {
      second = second - 1;
      if (second === 0) {
        clearInterval(result);
        dispatch(closeSnackbar());
      }
    }, 1000);
  };

  useEffect(() => {
    const loadData = async () => {
      if (open) {
        await countdown();
      }
    };
    loadData();
  }, [open]);

  const renderSnackbarSuccess = () => {
    return (
      <View style={styles.viewSnackbarSuccess(background)}>
        <View style={styles.viewIcon}>
          <Image source={appConfig.iconCheck} style={styles.iconCheck} />
        </View>
        <Text style={styles.textSnackbar}>{message}</Text>
      </View>
    );
  };

  const renderSnackbarFailed = () => {
    return (
      <View style={styles.viewSnackbarFailed(background)}>
        <View style={styles.viewIcon}>
          <Image source={appConfig.iconClose} style={styles.iconClose} />
        </View>
        <Text style={styles.textSnackbar}>{message}</Text>
      </View>
    );
  };

  const renderSnackbar = () => {
    if (type === 'success') {
      return renderSnackbarSuccess();
    } else {
      return renderSnackbarFailed();
    }
  };

  const renderMarginTop = () => {
    let style = {};
    switch (deviceInfo) {
      case 'typeAndroid':
        style = styles.marginTopAndroid;
        break;

      case 'typeIos':
        style = styles.marginTopIos;
        break;

      case 'typeIphone14Pro':
        style = styles.marginTopIphone14Pro;
        break;
      default:
        style = styles.marginTopAndroid;
    }

    return <View style={style} />;
  };

  return (
    <Modal animationType="none" transparent visible={open}>
      <TouchableOpacity style={styles.root} onPress={handleClose}>
        {renderMarginTop()}
        <View style={styles.container}>{renderSnackbar()}</View>
      </TouchableOpacity>
    </Modal>
  );
};

Snackbar.defaultProps = {
  loading: false,
};

Snackbar.propTypes = {
  loading: PropTypes.bool,
};

export default Snackbar;
