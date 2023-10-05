import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';

import CryptoJS from 'react-native-crypto-js';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOutletById,
  setFavoriteOutlet,
  unsetFavoriteOutlet,
} from '../../../actions/stores.action';
import Theme from '../../../theme';
import appConfig from '../../../config/appConfig';
import awsConfig from '../../../config/awsConfig';
import {
  changeOrderingMode,
  getOrderingMode,
  removeBasket,
} from '../../../actions/order.action';
import {getBasket} from '../../../actions/product.action';
import {updateUser} from '../../../actions/user.action';
import LoadingScreen from '../../loadingScreen';
import {getDistance} from 'geolib';
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
    viewImage: {
      width: '100%',
      height: 113,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
    },
    viewTransparentImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      backgroundColor: theme.colors.backgroundTransparent1,
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
    textStatus: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textDistance: {
      flex: 1,
      textAlign: 'right',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[10],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textBodyBottom: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    iconBodyBottom: {
      height: 16,
      width: 8,
      marginLeft: 14,
      tintColor: theme.colors.textQuaternary,
    },
    iconStar: {
      fontSize: 16,
      color: 'red',
    },
    image: {
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
    },
  });
  return styles;
};

const MyFavoriteOutletListItem = ({item}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [distance, setDistance] = useState('');
  const [isFavorite, setIsFavorite] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

  const userPosition = useSelector(
    state => state.userReducer?.userPosition.userPosition,
  );

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  const isOpen = CheckOutletStatus(item) === 'OPEN';
  const isUnavailable = CheckOutletStatus(item) === 'UNAVAILABLE';

  useEffect(() => {
    const userCoordinate = userPosition?.coords;
    if (userCoordinate) {
      const userPositionLat = userCoordinate?.latitude;
      const userPositionLngt = userCoordinate?.longitude;
      const result = getDistance(
        {latitude: userPositionLat, longitude: userPositionLngt},
        {latitude: item.latitude, longitude: item.longitude},
      );

      const distanceString =
        result < 1
          ? result * 1000 + ' m'
          : Math.round(result * 10) / 10 + ' km';
      setDistance(distanceString);
    }
  }, [userPosition, item]);

  const handleGetStoreById = async item => {
    const orderingMode = await dispatch(getOrderingMode(item));
    await dispatch(getOutletById(item.id));

    if (orderingMode.length === 1) {
      await dispatch(changeOrderingMode({orderingMode: orderingMode[0].key}));
      Actions.push('orderHere');
    } else {
      Actions.push('orderingMode');
    }
  };

  const handleRemoveSelectedAddress = async () => {
    const userDecrypt = CryptoJS.AES.decrypt(
      userDetail,
      awsConfig.PRIVATE_KEY_RSA,
    );
    const user = JSON.parse(userDecrypt.toString(CryptoJS.enc.Utf8));

    await dispatch(
      updateUser({selectedAddress: null, phoneNumber: user.phoneNumber}),
    );
  };

  const handleRemoveCart = async () => {
    setIsLoading(true);
    await handleRemoveSelectedAddress();
    await dispatch(changeOrderingMode({orderingMode: ''}));
    await dispatch(removeBasket());
    await dispatch(getBasket());
    setIsLoading(false);
  };

  const showAlertBasketNotEmpty = async item => {
    Alert.alert(
      'Change outlet ?',
      `You will delete your cart in outlet ${basket.outlet.name}`,
      [
        {text: 'Cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            await handleRemoveCart();
            await handleGetStoreById(item);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleClickOutlet = item => {
    if (basket && basket.outlet.id !== item?.id) {
      return showAlertBasketNotEmpty(item);
    } else {
      return handleGetStoreById(item);
    }
  };

  useEffect(() => {
    setIsFavorite(item.isFavorite);
  }, [item]);

  const handleSetFavoriteOutlet = async () => {
    setIsLoading(true);
    await dispatch(setFavoriteOutlet({outletId: item?.id}));
    setIsLoading(false);
  };

  const handleUnsetFavoriteOutlet = async () => {
    setIsLoading(true);
    await dispatch(unsetFavoriteOutlet({outletId: item?.id}));
    setIsLoading(false);
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

  return (
    <TouchableOpacity
      disabled={isUnavailable}
      onPress={() => {
        handleClickOutlet(item);
      }}
      style={styles.root}>
      <LoadingScreen loading={isLoading} />
      {renderItem()}
    </TouchableOpacity>
  );
};

export default MyFavoriteOutletListItem;
