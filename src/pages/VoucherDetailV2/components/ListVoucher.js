import React from 'react';
import {View, StyleSheet, Pressable, ImageBackground} from 'react-native';
import Theme from '../../../theme/Theme';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../../helper/Layout';
import GlobalText from '../../../components/globalText';
import moment from 'moment';
import CalendarWhite from '../../../assets/svg/CalenderWhite';
import appConfig from '../../../config/appConfig';
import {Actions} from 'react-native-router-flux';
import PointSmall from '../../../assets/svg/SmallPointSvg';
const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 16,
      marginBottom: 16,
    },
    imageStyle: {
      width: normalizeLayoutSizeWidth(201),
      height: normalizeLayoutSizeHeight(54),
    },
    imageContainer: {
      alignItems: 'center',
      height: normalizeLayoutSizeHeight(78),
    },
    content: {
      padding: 12,
      backgroundColor: colors.primary,

      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      height: normalizeLayoutSizeHeight(96),
    },
    whiteText: {
      color: 'white',
      fontFamily: fontFamily.poppinsMedium,
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
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    pointContainer: {
      backgroundColor: 'white',
      minHeight: normalizeLayoutSizeWidth(22),
      width: normalizeLayoutSizeHeight(76),
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
  });
  return {styles};
};

const ListVoucher = ({item, isRedeem}) => {
  const {styles} = useStyles();

  const handleImage = () => {
    if (item?.image) {
      return {uri: item?.image};
    }
    return appConfig.appImageNull;
  };

  const onPress = () => {
    Actions.voucher({
      dataVoucher: item,
    });
  };
  console.log(item, 'usaha');
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

  return (
    <Pressable onPress={onPress} style={styles.cardContainer}>
      <ImageBackground
        resizeMode="cover"
        source={handleImage()}
        style={styles.imageContainer}
        imageStyle={styles.imageStyleBg}
      />

      <View style={styles.content}>
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
            <GlobalText style={styles.whiteText}>
              Expire on {moment(item?.expiryDate).format('DD MMMM YYYY')}
            </GlobalText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ListVoucher;
