/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {Modal, View, Text, TouchableOpacity} from 'react-native';

import {closeSnackbar} from '../../actions/setting.action';

const styles = {
  root: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'absolute',
    top: 20,
    width: '100%',
    paddingHorizontal: 16,
  },
  viewSnackbarError: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 14,
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewSnackbarSuccess: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'green',
    padding: 14,
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
  },
  textSnackbar: {
    color: 'white',
  },
};

const Snackbar = () => {
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

  const renderSnackbarText = () => {
    const style =
      type === 'success'
        ? styles.viewSnackbarSuccess
        : styles.viewSnackbarError;
    return (
      <View style={style}>
        <Text style={styles.textSnackbar}>{message}</Text>
      </View>
    );
  };

  return (
    <Modal animationType="none" transparent visible={open}>
      <TouchableOpacity style={styles.root} onPress={handleClose}>
        <View style={styles.body}>{renderSnackbarText()}</View>
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
