/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {Modal, View, Text, TouchableOpacity, Image} from 'react-native';

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
      top: 20,
      width: '100%',
      position: 'absolute',
      paddingHorizontal: 16,
    },
    textSnackbar: {
      marginLeft: 12,
      color: theme.colors.text4,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewSnackbarFailed: {
      width: '100%',
      padding: 14,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.snackbarFailed,
    },
    viewSnackbarSuccess: {
      width: '100%',
      padding: 14,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.snackbarSuccess,
    },
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
  };
  return styles;
};

const Snackbar = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const message = useSelector(state => state.settingReducer.snackbar.message);
  const type = useSelector(state => state.settingReducer.snackbar.type);
  const open = message ? true : false;

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
      <View style={styles.viewSnackbarSuccess}>
        <View style={styles.viewIcon}>
          <Image source={appConfig.iconCheck} style={styles.iconCheck} />
        </View>
        <Text style={styles.textSnackbar}>{message}</Text>
      </View>
    );
  };

  const renderSnackbarFailed = () => {
    return (
      <View style={styles.viewSnackbarFailed}>
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

  return (
    <Modal animationType="none" transparent visible={open}>
      <TouchableOpacity style={styles.root} onPress={handleClose}>
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
