import React from 'react';
import PropTypes from 'prop-types';
import {Modal, ActivityIndicator} from 'react-native';

const styles = {
  loading: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
};

const LoadingScreen = ({loading}) => {
  return (
    <Modal animationType="none" transparent visible={loading}>
      <ActivityIndicator size="large" color="white" style={styles.loading} />
    </Modal>
  );
};

LoadingScreen.defaultProps = {
  loading: false,
};

LoadingScreen.propTypes = {
  loading: PropTypes.bool,
};

export default LoadingScreen;
