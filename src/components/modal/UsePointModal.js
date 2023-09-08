import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';

import Theme from '../../theme';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {useSelector} from 'react-redux';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.backgroundTransparent1,
    },
    container: {
      width: '100%',
      maxHeight: '100%',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 16,
    },
    body: {
      width: '100%',
      padding: 16,
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      width: '100%',
    },
    viewPointBalance: {
      width: '100%',
      padding: 8,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.greyScale4,
    },
    viewButtonPay: {
      flex: 1,
      borderRadius: 8,
      marginLeft: 8,
      paddingVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonActive,
    },
    viewButtonCancel: {
      flex: 1,
      borderRadius: 8,
      marginRight: 8,
      paddingVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.buttonActive,
      backgroundColor: theme.colors.buttonStandBy,
    },
    viewInputPoint: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    textInputPoint: {
      flex: 1,
      height: 48,
      marginLeft: 16,
      marginVertical: 0,
      paddingVertical: 0,
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.greyScale2,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textHeader: {
      marginBottom: -2,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textPointBalance1: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPointBalance2: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[36],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textPointBalance3: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[12],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textAmountToUse: {
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textButtonCancel: {
      color: theme.colors.textQuaternary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textButtonPay: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.greyScale2,
    },
  });
  return styles;
};

const UsePointModal = ({
  open,
  totalAmount,
  pointBalance,
  pointRatio,
  handleClose,
  handleUsePoint,
}) => {
  const styles = useStyles();

  const campaign = useSelector(state => state.rewardsReducer.campaign.campaign);

  const [value, setValue] = useState(0);

  const renderDivider = () => {
    return <View style={styles.divider} />;
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.textHeader}>Use Points</Text>
      </View>
    );
  };

  const renderPointBalance = () => {
    const totalPointValue = pointBalance * pointRatio;

    return (
      <View style={styles.body}>
        <View style={styles.viewPointBalance}>
          <Text style={styles.textPointBalance1}>Your Point Balance</Text>
          <Text style={styles.textPointBalance2}>{pointBalance} Points</Text>
          <Text style={styles.textPointBalance3}>
            worth {CurrencyFormatter(totalPointValue)}
          </Text>
        </View>
      </View>
    );
  };

  const to2PointDecimal = data => {
    try {
      if (data !== 0) {
        let money = data.toString().split('.');
        if (money[1] !== undefined) {
          money = `${money[0]}.${money[1].substr(0, 2)}`;
        }
        return parseFloat(money);
      } else {
        return parseFloat(0);
      }
    } catch (e) {
      return parseFloat(0);
    }
  };

  const handleOnChange = result => {
    const totalResultAmount = Number(result) * pointRatio;
    const totalPointUse = totalAmount / pointRatio;
    if (totalResultAmount < totalAmount) {
      setValue(result);
    } else if (campaign?.points?.roundingOptions === 'INTEGER') {
      setValue(`${Math.ceil(totalPointUse)}`);
    } else {
      setValue(`${to2PointDecimal(totalPointUse)}`);
    }
  };

  const renderInputPoint = () => {
    return (
      <View style={styles.viewInputPoint}>
        <Text style={styles.textAmountToUse}>Amount to Use</Text>
        <TextInput
          keyboardType={'numeric'}
          style={styles.textInputPoint}
          placeholder="Input amount"
          value={value}
          onChangeText={result => {
            handleOnChange(result?.replace(/[^0-9]/g, ''));
          }}
        />
      </View>
    );
  };

  const renderButtonCancel = () => {
    return (
      <TouchableOpacity onPress={handleClose} style={styles.viewButtonCancel}>
        <Text style={styles.textButtonCancel}>Cancel</Text>
      </TouchableOpacity>
    );
  };

  const renderButtonPay = () => {
    const text = value || 0;
    return (
      <TouchableOpacity
        onPress={() => {
          handleUsePoint(value);
        }}
        style={styles.viewButtonPay}>
        <Text style={styles.textButtonPay}>Use {text} Points</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.footer}>
        {renderButtonCancel()}
        {renderButtonPay()}
      </View>
    );
  };

  return (
    <Modal animationType="none" transparent={true} visible={open}>
      <View style={styles.root} onPress={handleClose}>
        <View style={styles.container}>
          {renderHeader()}
          {renderDivider()}
          {renderPointBalance()}
          {renderDivider()}
          {renderInputPoint()}
          {renderDivider()}
          {renderFooter()}
        </View>
      </View>
    </Modal>
  );
};

export default UsePointModal;
