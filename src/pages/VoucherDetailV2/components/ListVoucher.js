import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
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
const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 16,
    },
    imageStyle: {
      width: normalizeLayoutSizeWidth(201),
      height: normalizeLayoutSizeHeight(54),
    },
    imageContainer: {
      marginTop: 12,
      alignItems: 'center',
    },
    content: {
      marginTop: 12,
      padding: 12,
      backgroundColor: colors.primary,

      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
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
  });
  return {styles};
};

const ListVoucher = ({item}) => {
  const {styles} = useStyles();
  return (
    <View style={styles.cardContainer}>
      <View>
        <View style={styles.imageContainer}>
          <Image style={styles.imageStyle} source={Logo} />
        </View>
      </View>
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
    </View>
  );
};

export default ListVoucher;
