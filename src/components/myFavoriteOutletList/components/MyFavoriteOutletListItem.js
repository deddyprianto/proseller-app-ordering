import React, {useState} from 'react';
import moment from 'moment';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import CryptoJS from 'react-native-crypto-js';

import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Theme from '../../../theme';
import appConfig from '../../../config/appConfig';
import {Actions} from 'react-native-router-flux';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeOrderingMode,
  getBasket,
  removeBasket,
} from '../../../actions/order.action';
import {updateUser} from '../../../actions/user.action';
import {getOutletById} from '../../../actions/stores.action';
import awsConfig from '../../../config/awsConfig';
import LoadingScreen from '../../loadingScreen';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    divider: {
      backgroundColor: '#D6D6D6',
      height: 1,
      width: '100%',
    },
    iconStar: {
      fontSize: 24,
      color: 'red',
      marginRight: 8,
    },
    iconWarning: {
      fontSize: 24,
    },
    margin10: {
      marginTop: 10,
    },
    textDay: {
      fontWeight: 'bold',
      width: '30%',
    },
    textButtonOrder: {
      textAlign: 'center',
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textButtonOrderDisabled: {
      textAlign: 'center',
      color: theme.colors.textTertiary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewDescription: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'white',
    },
    viewDescriptionSelected: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#F9F9F9',
    },
    viewStarAndName: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewDescriptionDetail: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    viewOperationalHours: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewOrder: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      padding: 8,
      marginTop: 16,
    },
    viewOrderDisabled: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.buttonDisabled,
      padding: 8,
      marginTop: 16,
    },
    iconBox: {
      height: 18,
      width: 18,
      marginRight: 8,
      tintColor: theme.colors.buttonActive,
    },
    iconBoxDisabled: {
      height: 18,
      width: 18,
      marginRight: 8,
      tintColor: theme.colors.buttonDisabled,
    },
  });

  return styles;
};

const MyFavoriteOutletItemList = ({outlet}) => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const [selected, setSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);
  const userDetail = useSelector(
    state => state.userReducer?.getUser?.userDetails,
  );

  const enableOrdering = useSelector(
    state => state.settingReducer.enableOrderingSettings.enableOrdering,
  );

  const handleSelect = () => {
    if (selected) {
      setSelected(false);
    } else {
      setSelected(true);
    }
  };

  const handleGetStoreById = async item => {
    await dispatch(getOutletById(item.id));
    Actions.push('orderHere');
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
    if (basket && basket.outlet.id !== item.storeId) {
      return showAlertBasketNotEmpty(item);
    } else {
      return handleGetStoreById(item);
    }
  };

  const renderTextName = () => {
    return <Text>{outlet?.name}</Text>;
  };

  const renderStar = () => {
    return <IconFontAwesome name="star" style={styles.iconStar} />;
  };

  const renderStarAndName = () => {
    return (
      <View style={styles.viewStarAndName}>
        {renderStar()}
        {renderTextName()}
      </View>
    );
  };

  const renderWarning = () => {
    return (
      <IconAntDesign name="exclamationcircleo" style={styles.iconWarning} />
    );
  };

  const renderOutletItem = () => {
    const style = selected
      ? styles.viewDescriptionSelected
      : styles.viewDescription;

    return (
      <TouchableOpacity
        style={style}
        onPress={() => {
          handleSelect();
        }}>
        {renderStarAndName()}
        {renderWarning()}
      </TouchableOpacity>
    );
  };

  const renderTextAddress = () => {
    return <Text>{outlet?.address}</Text>;
  };

  const handleTimeFormatter = value => {
    const result = moment(value, 'hh:mm').format('hh:mm a');
    return result;
  };

  const renderOperationalHourItem = value => {
    const timeActive = value?.active;
    const timeOpen = handleTimeFormatter(value?.open);
    const timeClose = handleTimeFormatter(value?.close);

    const textTime = timeActive ? `: ${timeOpen} - ${timeClose}` : 'Close';

    return (
      <View style={styles.viewOperationalHours}>
        <Text style={styles.textDay}>{value?.nameOfDay}</Text>
        <Text>{textTime}</Text>
      </View>
    );
  };

  const renderOperationalHours = () => {
    const result = outlet?.operationalHours?.map(value => {
      return renderOperationalHourItem(value);
    });
    return result;
  };

  const renderButtonOrder = () => {
    const isDisabled = !enableOrdering;
    const styleView = isDisabled ? styles.viewOrderDisabled : styles.viewOrder;
    const styleIcon = isDisabled ? styles.iconBoxDisabled : styles.iconBox;
    const styleText = isDisabled
      ? styles.textButtonOrderDisabled
      : styles.textButtonOrder;
    return (
      <TouchableOpacity
        disabled={isDisabled}
        style={styleView}
        onPress={() => {
          handleClickOutlet(outlet);
        }}>
        <Text style={styleText} numberOfLines={1}>
          <Image style={styleIcon} source={appConfig.iconBox} /> Order from{' '}
          {outlet?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOutletItemDetail = () => {
    if (selected) {
      return (
        <>
          <View style={styles.viewDescriptionDetail}>
            {renderTextAddress()}
            <View style={styles.margin10} />
            {renderOperationalHours()}
            {renderButtonOrder()}
          </View>
          <View style={styles.divider} />
        </>
      );
    }
  };

  return (
    <View style={{width: '100%'}}>
      <LoadingScreen loading={isLoading} />
      {renderOutletItem()}
      <View style={styles.divider} />
      {renderOutletItemDetail()}
    </View>
  );
};

export default MyFavoriteOutletItemList;
