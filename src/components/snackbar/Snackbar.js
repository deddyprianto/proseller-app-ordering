import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import debounce from 'lodash/debounce';
import {
  Modal,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {closeSnackbar} from '../../actions/setting.action';
import colorConfig from '../../config/colorConfig';

const styles = {
  loading: {
    height: '100%',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
};

const Snackbar = () => {
  const dispatch = useDispatch();
  const message = useSelector(state => state.settingReducer.snackbar.message);
  const open = message ? true : false;

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  return (
    <Modal animationType="none" transparent visible={open}>
      <TouchableOpacity
        onPress={handleClose}
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            top: 20,
            width: '100%',
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: colorConfig.primaryColor,
              padding: 14,
              justifyContent: 'space-between',
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>{message}</Text>
          </View>
        </View>
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
