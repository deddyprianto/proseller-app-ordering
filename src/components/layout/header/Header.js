import React, {useState} from 'react';

import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

import {Actions} from 'react-native-router-flux';
import appConfig from '../../../config/appConfig';
import Theme from '../../../theme';

import Scanner from '../../scanner';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      overflow: 'hidden',
      paddingBottom: 2,
    },
    container: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: theme.colors.greyScale2,
      elevation: 3,
      height: 56,
      maxHeight: 56,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 16,
      backgroundColor: theme.colors.header,
    },
    containerLeft: {
      flex: 1,
      alignItems: 'flex-start',
    },
    containerCenter: {
      elevation: 1,
      flex: 2,
      alignItems: 'center',
    },
    containerRight: {
      flex: 1,
      alignItems: 'flex-end',
    },
    flexRowCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: '70%',
      height: '100%',
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: theme.colors.textQuaternary,
    },
    iconBack: {
      width: 30,
      height: 30,
      tintColor: theme.colors.textQuaternary,
    },
    iconRemove: {
      width: 18,
      height: 18,
      tintColor: theme.colors.textQuaternary,
    },
    iconCart: {
      width: 11,
      height: 18,
      tintColor: theme.colors.textQuaternary,
    },
    textHeader: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
  });
  return styles;
};

const Header = ({
  title,
  isLogo,
  isMiddleLogo,
  remove,
  cart,
  search,
  scanner,
  removeOnClick,
  customTitle,
}) => {
  const styles = useStyles();
  const [isOpenScanner, setIsOpenScanner] = useState(false);

  const handleCloseScanner = () => {
    setIsOpenScanner(false);
  };

  const renderLogo = () => {
    return (
      <Image
        source={appConfig.logoMerchant}
        resizeMode="contain"
        style={styles.logo}
      />
    );
  };

  const renderTitle = () => {
    if (isMiddleLogo) {
      return renderLogo();
    } else if (customTitle) {
      return customTitle;
    } else {
      return (
        <Text style={styles.textHeader} numberOfLines={1}>
          {title}
        </Text>
      );
    }
  };

  const renderBackIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Actions.pop();
        }}>
        <Image source={appConfig.iconArrowLeft} style={styles.iconBack} />
      </TouchableOpacity>
    );
  };

  const renderCartIcon = () => {
    if (cart) {
      return (
        <TouchableOpacity
          onPress={() => {
            Actions.cart();
          }}>
          <Image source={appConfig.iconCart} style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  const renderScannerIcon = () => {
    if (scanner) {
      return (
        <TouchableOpacity
          onPress={() => {
            setIsOpenScanner(true);
          }}>
          <Image source={appConfig.iconScan} style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  const renderRemoveIcon = () => {
    if (remove && removeOnClick) {
      return (
        <TouchableOpacity
          onPress={() => {
            removeOnClick();
          }}>
          <Image source={appConfig.iconDelete} style={styles.iconRemove} />
        </TouchableOpacity>
      );
    }
  };

  const renderSearchIcon = () => {
    if (search) {
      return (
        <TouchableOpacity
          onPress={() => {
            Actions.searchProduct();
          }}>
          <Image source={appConfig.iconSearch} style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  const renderIconLeftWrap = () => {
    if (isLogo) {
      return renderLogo();
    } else {
      return renderBackIcon();
    }
  };

  const renderIconRightWrap = () => {
    return (
      <View style={styles.flexRowCenter}>
        {renderSearchIcon()}
        {renderCartIcon()}
        {renderScannerIcon()}
        {renderRemoveIcon()}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Scanner open={isOpenScanner} handleClose={handleCloseScanner} />
        <View style={styles.containerLeft}>{renderIconLeftWrap()}</View>
        <View style={styles.containerCenter}>{renderTitle()}</View>
        <View style={styles.containerRight}>{renderIconRightWrap()}</View>
      </View>
    </View>
  );
};

export default Header;
