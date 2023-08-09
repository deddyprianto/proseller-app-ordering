import React from 'react';
import Theme from '../../theme/Theme';
import {StyleSheet, View} from 'react-native';
import GlobalText from '../globalText';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    preOrderLabel: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.brandTertiary,
      paddingHorizontal: 8,
      borderRadius: 4,
      height: 26,
      marginRight: 4,
    },
    preOrderText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 12,
      color: 'white',
    },
  });
  return {styles};
};

/**
 * @typedef {Object} PreorderProps
 * @property {any} containerStyle
 */

/**
 *
 * @param {PreorderProps} props
 */

const AllowSelfSelectionLabel = props => {
  const {styles} = useStyles();
  return (
    <View style={[styles.preOrderLabel, props.containerStyle]}>
      <GlobalText style={styles.preOrderText}>
        Available for self-selection
      </GlobalText>
    </View>
  );
};

export default AllowSelfSelectionLabel;
