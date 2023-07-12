import React from 'react';
import {TextInputProps, TextInput, View, Text, StyleSheet} from 'react-native';
import Theme from '../../theme/Theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import GlobalText from '../globalText';
/**
 * @typedef {import('react-native').TextInputProps} InputTextProps
 */

/**
 * @typedef {Object} ParamProps
 * @property {string} label
 * @property {boolean} isMandatory
 * @property {string} type
 * @property {any} rightIcon
 * @property {string} selectedCountry
 * @property {Function} onPressBtn
 */

/**
 * @param {InputTextProps & ParamProps} props
 */

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    inputParentContainer: {
      marginTop: 16,
    },
    inpurContainer: editable => ({
      marginTop: 4,
      borderWidth: 1,
      borderColor: theme.colors.greyScale2,
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderRadius: 8,
      backgroundColor: editable === false ? '#F9F9F9' : 'white',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    labelStyle: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    mandatoryStyle: {
      color: '#CE1111',
    },
    inputStyle: editable => ({
      color: editable === false ? theme.colors.greyScale2 : 'black',
      width: '100%',
    }),
    buttonStyle: {
      flexDirection: 'row',
      paddingVertical: 10,
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    textInputContainer: {
      width: '100%',
      justifyContent: 'center',
    },
    valueBtnText: editable => ({
      color: editable === false ? theme.colors.greyScale2 : 'black',
    }),
  });
  return styles;
};

const GlobalInputText = props => {
  const styles = useStyles();
  if (props.type === 'button') {
    return (
      <View style={styles.inputParentContainer}>
        <View>
          <GlobalText style={styles.labelStyle}>
            {props.label}{' '}
            {props.isMandatory ? (
              <GlobalText style={styles.mandatoryStyle}>*</GlobalText>
            ) : null}
          </GlobalText>
        </View>
        <TouchableOpacity
          onPress={props.onPressBtn}
          disabled={props.editable === false}
          style={[styles.inpurContainer(props.editable), styles.buttonStyle]}>
          <GlobalText style={styles.valueBtnText(props.editable)}>
            {props.value || props.defaultValue}
          </GlobalText>
          <View style={styles.iconStyle}>
            {props.rightIcon ? props.rightIcon : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.inputParentContainer}>
      <View>
        <GlobalText style={styles.labelStyle}>
          {props.label}{' '}
          {props.isMandatory ? (
            <GlobalText style={styles.mandatoryStyle}>*</GlobalText>
          ) : null}
        </GlobalText>
      </View>
      <View style={styles.inpurContainer(props.editable)}>
        <TextInput style={styles.inputStyle(props.editable)} {...props} />
      </View>
    </View>
  );
};

export default GlobalInputText;
