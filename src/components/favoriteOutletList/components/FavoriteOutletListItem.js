import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {
  setFavoriteOutlet,
  unsetFavoriteOutlet,
} from '../../../actions/stores.action';
import Theme from '../../../theme';
import appConfig from '../../../config/appConfig';
import {getDistance} from 'geolib';
import useTime from '../../../hooks/time/useTime';
import CheckOutletStatus from '../../../helper/CheckOutletStatus';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginTop: 10,
      marginBottom: 10,
      width: '48%',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      height: 240,
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 2,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    body: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 8,
    },
    bodyTop: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    bodyBottom: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerOpen: {
      flex: 1,
    },
    containerClose: {
      flex: 1,
      opacity: 0.6,
    },
    image: {
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
    },
    iconStar: {
      fontSize: 16,
      color: 'red',
    },
    viewImage: {
      width: '100%',
      height: 113,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
    },
    viewStar: {
      backgroundColor: 'white',
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 9,
      right: 7,
    },
    viewOpen: {
      paddingTop: 4,
      backgroundColor: theme.colors.semanticSuccess,
      paddingHorizontal: 14,
      paddingVertical: 2,
      borderRadius: 100,
      marginRight: 4,
    },
    viewClose: {
      paddingTop: 4,
      backgroundColor: theme.colors.semanticError,
      paddingHorizontal: 14,
      paddingVertical: 2,
      borderRadius: 100,
      marginRight: 4,
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
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textBodyBottom: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textNameAvailable: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textNameUnavailable: {
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textDistance: {
      flex: 1,
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
  });
  return styles;
};

const FavoriteOutletListItem = ({item, disabled}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [distance, setDistance] = useState('');

  const [isFavorite, setIsFavorite] = useState(false);

  const userPosition = useSelector(
    state => state.userReducer?.userPosition.userPosition,
  );

  const isOpen = CheckOutletStatus(item) === 'OPEN';
  const isUnavailable = CheckOutletStatus(item) === 'UNAVAILABLE';

  const handleNumberDigit = number => {
    const numberSplit = number.toString().split('.') || '';
    if (numberSplit[1]) {
      return number.toFixed(2);
    } else {
      return number;
    }
  };

  useEffect(() => {
    const userCoordinate = userPosition?.coords;
    if (userCoordinate && item?.latitude && item?.longitude) {
      const userPositionLat = userCoordinate?.latitude;
      const userPositionLngt = userCoordinate?.longitude;
      const result = getDistance(
        {latitude: userPositionLat, longitude: userPositionLngt},
        {latitude: item?.latitude, longitude: item?.longitude},
      );

      const renderMeter = handleNumberDigit(result) + ' m';

      const renderKilometer =
        handleNumberDigit(Math.round(result) / 1000) + ' km';

      const distanceString = result < 1000 ? renderMeter : renderKilometer;

      setDistance(distanceString);
    }
  }, [userPosition, item]);

  useEffect(() => {
    setIsFavorite(item.isFavorite);
  }, [item]);

  const handleSetFavoriteOutlet = async () => {
    await dispatch(setFavoriteOutlet({outletId: item?.id}));
  };

  const handleUnsetFavoriteOutlet = async () => {
    await dispatch(unsetFavoriteOutlet({outletId: item?.id}));
  };

  const handleStarClicked = () => {
    if (isFavorite) {
      handleUnsetFavoriteOutlet();
      setIsFavorite(false);
    } else {
      handleSetFavoriteOutlet();
      setIsFavorite(true);
    }
  };

  const renderStar = () => {
    const star = isFavorite ? 'star' : 'star-o';

    return (
      <View style={styles.viewStar}>
        <TouchableOpacity
          onPress={() => {
            handleStarClicked();
          }}>
          <IconFontAwesome name={star} style={styles.iconStar} />
        </TouchableOpacity>
      </View>
    );
  };
  const renderImageAvailable = image => {
    return (
      <ImageBackground
        style={styles.viewImage}
        imageStyle={styles.image}
        source={{uri: image}}
      />
    );
  };

  const renderImageUnavailable = image => {
    return (
      <ImageBackground
        style={styles.viewImage}
        imageStyle={styles.image}
        source={{uri: image}}>
        <View style={styles.viewTransparentImage} />
      </ImageBackground>
    );
  };

  const renderImage = () => {
    const image = item?.defaultImageURL;

    if (isOpen) {
      return renderImageAvailable(image);
    } else {
      return renderImageUnavailable(image);
    }
  };

  const renderHeader = () => {
    return (
      <View>
        {renderImage()}
        {renderStar()}
      </View>
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

  const renderBodyTop = () => {
    return (
      <View style={styles.bodyTop}>
        {renderStatus()}
        {renderDistance()}
      </View>
    );
  };

  const renderBodyMiddle = () => {
    const styleText = isOpen
      ? styles.textNameAvailable
      : styles.textNameUnavailable;
    return (
      <Text style={styleText} numberOfLines={3}>
        {item?.name}
      </Text>
    );
  };

  const renderBodyBottom = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.favoriteOutletDetail({outlet: item});
        }}
        style={styles.bodyBottom}>
        <Text style={styles.textBodyBottom}>Outlet Detail</Text>
        <Image
          style={styles.iconBodyBottom}
          source={appConfig.iconArrowRight}
        />
      </TouchableOpacity>
    );
  };

  const renderBody = () => {
    return (
      <View style={styles.body}>
        <View>
          {renderBodyTop()}
          {renderBodyMiddle()}
        </View>
        {renderBodyBottom()}
      </View>
    );
  };

  const renderItem = () => {
    const styleView = isUnavailable
      ? styles.containerClose
      : styles.containerOpen;
    return (
      <View style={styleView}>
        {renderHeader()}
        {renderBody()}
      </View>
    );
  };

  return <View style={styles.root}>{renderItem()}</View>;
};

export default FavoriteOutletListItem;
