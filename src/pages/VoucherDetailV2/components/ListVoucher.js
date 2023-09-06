import React from 'react';
import {View, StyleSheet, Pressable, ImageBackground} from 'react-native';
import Theme from '../../../theme/Theme';
import {normalizeLayoutSizeWidth} from '../../../helper/Layout';
import GlobalText from '../../../components/globalText';
import moment from 'moment';
import CalendarWhite from '../../../assets/svg/CalenderWhite';
import appConfig from '../../../config/appConfig';
import {Actions} from 'react-native-router-flux';
import PointSmall from '../../../assets/svg/SmallPointSvg';
import {useSelector} from 'react-redux';
const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      marginBottom: 16,
    },
    imageStyle: {
      width: normalizeLayoutSizeWidth(201),
      height: normalizeLayoutSizeWidth(54),
    },
    imageContainer: disable => ({
      alignItems: 'center',
      height: normalizeLayoutSizeWidth(78),
      borderWidth: 1,
      borderColor: disable ? colors.greyScale5 : colors.primary,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    }),
    content: disable => ({
      padding: 12,
      backgroundColor: disable ? colors.greyScale5 : colors.primary,

      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      minHeight: normalizeLayoutSizeWidth(77),
    }),
    whiteText: {
      color: 'white',
    },
    boldFont: {
      fontFamily: fontFamily.poppinsBold,
    },
    expiredContainer: {
      marginTop: 8,
      fontFamily: fontFamily.poppinsMedium,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconStyle: {
      marginRight: 4,
    },
    imageStyleBg: {
      borderTopLeftRadius: 14,
      borderTopRightRadius: 14,
    },
    pointContainer: {
      backgroundColor: 'white',
      minHeight: normalizeLayoutSizeWidth(22),
      width: normalizeLayoutSizeWidth(76),
      borderRadius: 8,
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pointText: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: fontFamily.poppinsSemiBold,
    },
    pointTextContainer: {
      marginLeft: 5,
    },
    mediumFont: {
      fontFamily: fontFamily.poppinsMedium,
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    mr8: {
      marginRight: 8,
    },
    mt7: {
      marginTop: 7,
    },
    counter: {
      backgroundColor: colors.primary,
      paddingVertical: 4,
      borderRadius: 16,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textCounter: {
      color: 'white',
      fontFamily: fontFamily.poppinsMedium,
      fontSize: 12,
    },
  });
  return {styles};
};

const ListVoucher = ({item, isRedeem, vouchers}) => {
  const {styles} = useStyles();
  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );
  const handleImage = () => {
    if (item?.image) {
      return {uri: item?.image};
    }
    return appConfig.appImageNull;
  };

  const handleCountVoucher = () => {
    if (vouchers && Array.isArray(vouchers)) {
      const count = vouchers.filter(voucher => voucher.id === item.id);
      return count.length;
    }
    return 0;
  };

  const onPress = () => {
    Actions.voucher({
      dataVoucher: item,
    });
  };

  const renderReddemVoucher = () => (
    <View style={styles.pointContainer}>
      <View>
        <PointSmall />
      </View>
      <View style={styles.pointTextContainer}>
        <GlobalText style={styles.pointText}>
          {item?.redeemValue || 0} pts{' '}
        </GlobalText>
      </View>
    </View>
  );

  const handleDisableButton = () => {
    if (isRedeem) {
      if (totalPoint < item?.redeemValue) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={handleDisableButton()}
      style={styles.cardContainer}>
      <ImageBackground
        resizeMode="cover"
        source={handleImage()}
        style={styles.imageContainer(handleDisableButton())}
        imageStyle={styles.imageStyleBg}>
        {!isRedeem ? (
          <View style={[styles.mlAuto, styles.mr8, styles.mt7, styles.counter]}>
            <GlobalText style={styles.textCounter}>
              {handleCountVoucher()}x{''}
            </GlobalText>
          </View>
        ) : null}
      </ImageBackground>

      <View style={styles.content(handleDisableButton())}>
        <GlobalText style={[styles.boldFont, styles.whiteText]}>
          {item?.name}
        </GlobalText>
        {isRedeem ? (
          renderReddemVoucher()
        ) : (
          <View style={styles.expiredContainer}>
            <View style={styles.iconStyle}>
              <CalendarWhite />
            </View>
            <GlobalText style={[styles.whiteText, styles.mediumFont]}>
              Expire on {moment(item?.expiryDate).format('DD MMMM YYYY')}
            </GlobalText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ListVoucher;
