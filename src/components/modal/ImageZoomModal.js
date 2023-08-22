import React, {useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';

import Swiper from 'react-native-swiper';

import appConfig from '../../config/appConfig';

import Theme from '../../theme';

const HEIGHT = Dimensions.get('window').height;

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },

    header: {
      height: 54,
      width: '100%',
      alignItems: 'flex-end',
      padding: 16,
      backgroundColor: 'black',
    },

    viewPagination: {
      position: 'absolute',
      bottom: 24,
    },

    viewImageSingle: {
      flex: 1,
      backgroundColor: 'black',
    },

    viewImageMultiple: {
      display: 'flex',
      backgroundColor: 'black',
    },

    image: {
      marginTop: HEIGHT / 11,
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1,
    },

    activeDot: {
      opacity: 0.5,
      margin: 3,
      width: 8,
      height: 8,
      borderRadius: 50,
      backgroundColor: theme.colors.greyScale2,
    },

    inactiveDot: {
      margin: 3,
      width: 8,
      height: 8,
      borderRadius: 50,
      backgroundColor: theme.colors.greyScale4,
    },

    iconClose: {
      width: 24,
      height: 24,
      tintColor: 'white',
    },
  });
  return styles;
};

const ImageZoomModal = ({open, handleClose, images, index}) => {
  const styles = useStyles();
  const [isMultiple, setIsMultiple] = useState(false);

  useEffect(() => {
    if (images instanceof Array) {
      setIsMultiple(true);
    } else {
      setIsMultiple(false);
    }
  }, [images, index]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleClose();
          }}>
          <Image source={appConfig.iconClose} style={styles.iconClose} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderImageMultipleValue = () => {
    const result = images?.map(image => {
      return (
        <Image
          key={image}
          style={styles.image}
          resizeMode="stretch"
          source={{uri: image}}
        />
      );
    });

    return result;
  };

  const renderImageMultiple = () => {
    return (
      <Swiper
        index={index}
        style={styles.viewImageMultiple}
        autoplayTimeout={6}
        animated={true}
        paginationStyle={styles.viewPagination}
        dot={<View style={styles.inactiveDot} />}
        activeDot={<View style={styles.activeDot} />}
        loop={false}>
        {renderImageMultipleValue()}
      </Swiper>
    );
  };

  const renderImageSingle = () => {
    if (typeof images === 'string') {
      return (
        <View style={styles.viewImageSingle}>
          <Image
            style={styles.image}
            resizeMode="stretch"
            source={{uri: images}}
          />
        </View>
      );
    }
  };

  const renderBody = () => {
    if (isMultiple) {
      return renderImageMultiple();
    } else {
      return renderImageSingle();
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        handleClose();
      }}>
      <View style={styles.root}>
        {renderHeader()}
        {renderBody()}
      </View>
    </Modal>
  );
};

export default ImageZoomModal;
