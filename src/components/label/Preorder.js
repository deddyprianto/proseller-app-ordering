import React from 'react';
import Theme from '../../theme/Theme';
import {StyleSheet, View} from 'react-native';
import GlobalText from '../globalText';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    preOrderLabel: {
      paddingVertical: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.greyScale3,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    preOrderText: {
      fontFamily: theme.fontFamily.poppinsMedium,
      fontSize: 12,
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

const PreorderLabel = props => {
  const {styles} = useStyles();
  return (
    <View style={[styles.preOrderLabel, props.containerStyle]}>
      <GlobalText style={styles.preOrderText}>Preorder</GlobalText>
    </View>
  );
};

export default PreorderLabel;
