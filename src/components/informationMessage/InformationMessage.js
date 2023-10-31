import React from 'react';
import {View, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
import InformationSvg from '../../assets/svg/InformationSvg';
import GlobalText from '../globalText';

const useStyles = () => {
  const {colors} = Theme();
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.accent,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    icon: {
      marginRight: 8,
      width: '8%',
    },
    children: {
      width: '92%',
    },
  });
  return {styles};
};

const InformationMessage = ({children}) => {
  const {styles} = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <InformationSvg size={24} />
      </View>
      <View style={styles.children}>{children}</View>
    </View>
  );
};

export default InformationMessage;
