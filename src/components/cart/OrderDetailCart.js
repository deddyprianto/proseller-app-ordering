/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalText from '../globalText';
import GlobalButton from '../button/GlobalButton';
import Theme from '../../theme/Theme';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    cardContainer: {
      padding: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 1,
      backgroundColor: 'white',
      marginHorizontal: 16,
      borderRadius: 8,
      marginTop: 16,
      marginBottom: 16,
    },
    parentContainer: {
      marginTop: 24,
    },
    titleTextContainer: {
      paddingHorizontal: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonSTyle: {
      width: '49%',
    },
    informationText: {
      color: colors.greyScale5,
      marginTop: 12,
      fontFamily: fontFamily.poppinsMedium,
    },
  });
  return {styles};
};

const OrderDetailCart = ({setSelectSelection, itemSelection}) => {
  const {styles} = useStyles();
  const [status, setStatus] = React.useState(itemSelection);

  const onSelectSelection = name => {
    setStatus(name);
  };

  React.useEffect(() => {
    if (setSelectSelection && typeof setSelectSelection === 'function') {
      setSelectSelection(status);
    }
  }, [status]);

  return (
    <View style={styles.parentContainer}>
      <View style={styles.titleTextContainer}>
        <GlobalText>Ordering Details</GlobalText>
      </View>
      <View style={styles.cardContainer}>
        <GlobalText>Items Selections</GlobalText>
        <View style={styles.buttonContainer}>
          <GlobalButton
            isOutline={status === 'own' ? false : true}
            buttonStyle={styles.buttonSTyle}
            title="Choose Your Own"
            onPress={() => onSelectSelection('own')}
          />
          <GlobalButton
            isOutline={status === 'staff' ? false : true}
            buttonStyle={styles.buttonSTyle}
            title="Choose By Staff"
            onPress={() => onSelectSelection('staff')}
          />
        </View>
        {status === 'own' ? (
          <GlobalText style={styles.informationText}>
            Please visit the selected outlet for item selection.
          </GlobalText>
        ) : null}
      </View>
    </View>
  );
};

export default OrderDetailCart;
