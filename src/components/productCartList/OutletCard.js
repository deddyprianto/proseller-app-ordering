import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import MapSvg from '../../assets/svg/MapSvg';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      padding: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      display: 'flex',

      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 1,
      marginTop: 8,
    },
    titleContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    outletNameContainer: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginLeft: 'auto',
      backgroundColor: theme.colors.greyScale5,
      borderRadius: 8,
    },
    textOutletName: {
      color: 'white',
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 14,
    },
    addressOutletContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    mapIcon: {
      marginRight: 10,
    },
    boldText: {
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    addressText: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
  });
  return {styles};
};

const OutletCard = ({outlet}) => {
  console.log({outlet}, 'jiha');
  const {styles} = useStyles();
  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        <GlobalText>Outlet</GlobalText>
        <View style={styles.outletNameContainer}>
          <GlobalText style={styles.textOutletName}>{outlet?.name}</GlobalText>
        </View>
      </View>
      <View style={styles.addressOutletContainer}>
        <View style={styles.mapIcon}>
          <MapSvg />
        </View>
        <View>
          <GlobalText style={styles.boldText}>Choose your item at</GlobalText>
        </View>
      </View>
      <View style={styles.addressOutletContainer}>
        <View>
          <GlobalText style={styles.addressText}>{outlet?.name} </GlobalText>
          <GlobalText style={styles.addressText}>{outlet?.address} </GlobalText>
        </View>
      </View>
    </View>
  );
};

export default React.memo(OutletCard);
