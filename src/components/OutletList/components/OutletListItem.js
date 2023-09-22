import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import {useSelector} from 'react-redux';
import Theme from '../../../theme';
import appConfig from '../../../config/appConfig';
import {getDistance} from 'geolib';
import {isEmptyArray} from '../../../helper/CheckEmpty';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginTop: 10,
      marginBottom: 10,
      width: '100%',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      maxHeight: 96,
      height: 96,
    },
    containerOpen: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    containerClose: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      opacity: 0.6,
    },
    right: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
    },
    left: {
      padding: 12,
    },
    viewImage: {
      width: 96,
      height: 96,
      borderBottomLeftRadius: 16,
      borderTopLeftRadius: 16,
    },
    viewImageLogo: {
      width: 72,
      height: 72,
    },
    viewStatusAndDistance: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewOpen: {
      width: 54,
      height: 19,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginRight: 4,
      backgroundColor: theme.colors.semanticSuccess,
    },
    viewClose: {
      width: 54,
      height: 19,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginRight: 4,
      backgroundColor: theme.colors.semanticError,
    },
    viewTransparentImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    textStatus: {
      marginBottom: -2,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textName: {
      marginTop: 6,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textLocation: {
      marginTop: -6,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textDistance: {
      textAlign: 'right',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    iconBodyBottom: {
      height: 16,
      width: 8,
      marginLeft: 14,
      tintColor: theme.colors.textQuaternary,
    },
    image: {
      borderBottomLeftRadius: 16,
      borderTopLeftRadius: 16,
    },
  });
  return styles;
};

const OutletListItem = ({item, handleChange}) => {
  const styles = useStyles();

  const [distance, setDistance] = useState('');

  const userPosition = useSelector(
    state => state.userReducer?.userPosition?.userPosition,
  );

  const isAvailable = item?.orderingStatus !== 'UNAVAILABLE';
  const isOperationalHours = !isEmptyArray(item?.operationalHours);
  const isOpen = isAvailable && isOperationalHours;

  useEffect(() => {
    const userCoordinate = userPosition?.coords;
    if (userCoordinate && item?.latitude && item?.longitude) {
      const userPositionLat = userCoordinate?.latitude;
      const userPositionLngt = userCoordinate?.longitude;
      const result = getDistance(
        {latitude: userPositionLat, longitude: userPositionLngt},
        {latitude: item?.latitude, longitude: item?.longitude},
      );

      const distanceString =
        result < 1
          ? result * 1000 + ' m'
          : Math.round(result * 10) / 10 + ' km';
      setDistance(distanceString);
    }
  }, [userPosition, item]);

  const renderImage = outletImage => {
    const image = outletImage ? {uri: outletImage} : appConfig.logoMerchant;
    const styleView = outletImage ? styles.viewImage : styles.viewImageLogo;
    const resizeMode = outletImage ? 'stretch' : 'contain';

    return (
      <ImageBackground
        style={styleView}
        imageStyle={styles.image}
        source={image}
        resizeMode={resizeMode}
      />
    );
  };

  const renderStatus = () => {
    const textAvailable = isOpen ? 'OPEN' : 'CLOSED';
    const styleView = isOpen ? styles.viewOpen : styles.viewClose;
    return (
      <View style={styleView}>
        <Text style={styles.textStatus}>{textAvailable}</Text>
      </View>
    );
  };

  const renderDistance = () => {
    return (
      <Text style={styles.textDistance} numberOfLines={1}>
        {distance} away
      </Text>
    );
  };

  const renderStatusAndDistance = () => {
    return (
      <View style={styles.viewStatusAndDistance}>
        {renderStatus()}
        {renderDistance()}
      </View>
    );
  };

  const renderName = () => {
    return (
      <Text style={styles.textName} numberOfLines={1}>
        {item?.name}
      </Text>
    );
  };

  const renderLocation = () => {
    return (
      <Text style={styles.textLocation} numberOfLines={2}>
        {item?.location}
      </Text>
    );
  };

  const renderLeft = () => {
    const outletImage = item?.defaultImageURL;
    const styleView = !outletImage && styles.left;

    return <View style={styleView}>{renderImage(outletImage)}</View>;
  };

  const renderRight = () => {
    return (
      <View style={styles.right}>
        {renderStatusAndDistance()}
        {renderName()}
        {renderLocation()}
      </View>
    );
  };

  const renderBody = () => {
    const styleView = isOpen ? styles.containerOpen : styles.containerClose;
    return (
      <View style={styleView}>
        {renderLeft()}
        {renderRight()}
      </View>
    );
  };

  return (
    <TouchableOpacity
      disabled={!isOpen}
      onPress={() => handleChange(item)}
      style={styles.root}>
      {renderBody()}
    </TouchableOpacity>
  );
};

export default OutletListItem;
