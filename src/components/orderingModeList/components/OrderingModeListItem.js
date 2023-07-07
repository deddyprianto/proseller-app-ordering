import React from 'react';
import {TouchableOpacity, StyleSheet, View, Image, Text} from 'react-native';
import Theme from '../../../theme/Theme';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.textQuaternary,
    },
    rootSelected: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderColor: theme.colors.textQuaternary,
      backgroundColor: theme.colors.accent,
    },
    body: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewImage: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      backgroundColor: theme.colors.buttonStandBy,
    },
    textName: {
      textAlign: 'left',
      marginLeft: 16,
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textWaitingTime: {
      textAlign: 'left',
      marginLeft: 16,
      fontSize: theme.fontSize[12],
      color: theme.colors.textTertiary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    image: {
      tintColor: theme.colors.textQuaternary,
    },
  });
  return styles;
};

const OrderingModeListItem = ({item, selected, handleSelect, waitingTime}) => {
  const styles = useStyles();

  const styleRoot = selected ? styles.rootSelected : styles.root;

  const renderWaitingTime = () => {
    if (waitingTime) {
      return <Text style={styles.textWaitingTime}>{waitingTime}</Text>;
    }
  };

  return (
    <TouchableOpacity
      style={styleRoot}
      onPress={() => {
        handleSelect(item);
      }}>
      <View style={styles.body}>
        <View style={styles.viewImage}>
          <Image source={item?.image} style={styles.image} />
        </View>
        <View>
          <Text style={styles.textName}>{item?.displayName}</Text>
          {renderWaitingTime()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderingModeListItem;
