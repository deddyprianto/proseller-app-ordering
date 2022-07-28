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
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'white',
      elevation: 3,
      padding: 16,
    },
    flexRowCenter: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 16,
      height: 16,
      tintColor: theme.colors.primary,
    },
    iconBack: {
      width: 11,
      height: 18,
      tintColor: theme.colors.primary,
    },
    iconRemove: {
      width: 18,
      height: 18,
      tintColor: theme.colors.primary,
    },
    iconCart: {
      width: 11,
      height: 18,
      tintColor: theme.colors.primary,
    },
    textHeader: {
      color: theme.colors.text1,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsRegular,
    },
  });
  return styles;
};

const Header = ({title, remove, cart, scanner, removeOnClick, customTitle}) => {
  const styles = useStyles();
  const [isOpenScanner, setIsOpenScanner] = useState(false);

  const handleCloseScanner = () => {
    setIsOpenScanner(false);
  };

  const renderTitle = () => {
    if (customTitle) {
      return customTitle;
    } else {
      return <Text style={styles.textHeader}>{title}</Text>;
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

  const renderIconWrap = () => {
    return (
      <View style={styles.flexRowCenter}>
        {renderCartIcon()}
        {renderScannerIcon()}
        {renderRemoveIcon()}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Scanner open={isOpenScanner} handleClose={handleCloseScanner} />
      {renderBackIcon()}
      {renderTitle()}
      {renderIconWrap()}
    </View>
  );
};

export default Header;
