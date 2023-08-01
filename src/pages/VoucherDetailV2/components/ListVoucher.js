import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native';
import Theme from '../../../theme/Theme';
import Logo from '../../../assets/img/logo.png';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../../../helper/Layout';
import GlobalText from '../../../components/globalText';
import moment from 'moment';
import CalendarSvg from '../../../assets/svg/CalendareSvg';
import CalendarWhite from '../../../assets/svg/CalenderWhite';
import appConfig from '../../../config/appConfig';
import {Actions} from 'react-native-router-flux';
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
  });
  return {styles};
};

const ListVoucher = ({item}) => {
  console.log({item}, 'buaya');
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
        <View style={styles.expiredContainer}>
          <View style={styles.iconStyle}>
            <CalendarWhite />
          </View>
          <GlobalText style={styles.whiteText}>
            Expire on {moment(item?.expiryDate).format('DD MMMM YYYY')}
          </GlobalText>
        </View>
      </View>
    </Pressable>
  );
};

export default ListVoucher;
