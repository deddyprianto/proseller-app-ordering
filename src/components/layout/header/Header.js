import React, {useState} from 'react';

import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';

import {Actions} from 'react-native-router-flux';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colorConfig from '../../../config/colorConfig';
// import QRCodeScanner from 'react-native-qrcode-scanner';

import Scanner from '../../scanner';

const styles = StyleSheet.create({
  root: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    // borderColor: '#D6D6D6',
    // borderBottomWidth: 1,
    elevation: 3,
  },
  touchableIcon: {
    position: 'absolute',
    left: 16,
  },
  touchableIconCart: {
    position: 'absolute',
    right: 16,
  },
  iconCart: {
    fontSize: 25,
    color: colorConfig.primaryColor,
  },
  icon: {
    fontSize: 21,
    color: colorConfig.primaryColor,
  },

  sectionContainer: {
    marginTop: 32,
  },
  centerText: {
    marginRight: 80,
    marginLeft: 80,
    marginTop: 24,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

const Header = ({title, cart, scanner, onChange}) => {
  const [isOpenScanner, setIsOpenScanner] = useState(false);

  const handleCloseScanner = () => {
    setIsOpenScanner(false);
  };

  const renderBackIcon = () => {
    return (
      <TouchableOpacity
        style={styles.touchableIcon}
        onPress={() => {
          Actions.pop();
        }}>
        <IconAntDesign name="left" style={styles.icon} />
      </TouchableOpacity>
    );
  };

  const renderCartIcon = () => {
    if (cart) {
      return (
        <TouchableOpacity
          style={styles.touchableIconCart}
          onPress={() => {
            Actions.cart();
          }}>
          <IconAntDesign name="shoppingcart" style={styles.iconCart} />
        </TouchableOpacity>
      );
    }
  };

  const renderScannerIcon = () => {
    if (scanner) {
      return (
        <TouchableOpacity
          style={styles.touchableIconCart}
          onPress={() => {
            setIsOpenScanner(true);
          }}>
          <IconMaterialCommunityIcons
            name="barcode-scan"
            style={styles.iconCart}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.root}>
      <Scanner open={isOpenScanner} handleClose={handleCloseScanner} />
      {renderBackIcon()}
      <Text>{title}</Text>
      {/* {renderCartIcon()} */}
      {renderScannerIcon()}
    </View>
  );
};

export default Header;
