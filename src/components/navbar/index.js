import React from 'react';
import {View, StyleSheet} from 'react-native';
import colorConfig from '../../config/colorConfig';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';

const styles = StyleSheet.create({
  containerNavbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shadowBox: {
    shadowColor: 'black',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  navbarTitle: {
    fontSize: 18,
    padding: 13,
    color: 'white',
    fontWeight: 'bold',
  },
});

/**
 * @typedef {Object} NavbarProps
 * @property {string} title
 */

/**
 * @param {NavbarProps} props
 */

const Navbar = props => {
  const {colors} = Theme();
  return (
    <View
      style={{
        backgroundColor: colorConfig.pageIndex.backgroundColor,
      }}>
      <View style={[styles.containerNavbar, styles.shadowBox]}>
        <GlobalText style={[styles.navbarTitle, {color: colors.primary}]}>
          {props.title}
        </GlobalText>
      </View>
    </View>
  );
};

export default Navbar;
