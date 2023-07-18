import React from 'react';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalText from '../globalText';
import DropDownPicker from 'react-native-dropdown-picker';
import ErrorInput from '../../assets/svg/ErorInputSvg';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    inputParentContainer: {
      marginTop: 16,
    },
    inpurContainer: (editable, isError) => ({
      marginTop: 4,
      borderWidth: isError ? 2 : 1,
      borderColor: isError ? '#EB4B41' : theme.colors.greyScale2,
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderRadius: 8,
      backgroundColor: editable === false ? '#F9F9F9' : 'white',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
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
      width: '80%',
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
    errorContainer: {
      paddingHorizontal: 16,
      marginTop: 4,
    },
    textError: {
      color: '#EB4B41',
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    dropdownContainerStyle: {
      backgroundColor: 'white',
      marginTop: 4,
      borderRadius: 0,
      paddingVertical: 5,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderColor: theme.colors.greyScale2,
    },
    dropDownStyle: {
      backgroundColor: '#fafafa',
      zIndex: 3,
    },
    maxLexthStyle: {
      marginLeft: 'auto',
      marginTop: 4,
    },
    maxLengthText: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.greyScale5,
    },
  });
  return styles;
};

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
 * @property {boolean} isError
 * @property {string} errorMessage
 * @property {Array} items
 * @property {Function} onOpen
 * @property {Function} onClose
 * @property {Function} onChangeItem
 */

/**
 * @param {InputTextProps & ParamProps} props
 */

const GlobalInputText = React.forwardRef((props, ref) => {
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
  if (props.type === 'dropdown') {
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
        <DropDownPicker
          placeholder={props.placeholder}
          items={props.items}
          defaultValue={props.defaultValue}
          style={[styles.dropdownContainerStyle]}
          dropDownStyle={styles.dropDownStyle}
          onOpen={props.onOpen}
          onClose={props.onClose}
          onChangeItem={props.onChangeItem}
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
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
      <View style={styles.inpurContainer(props.editable, props.isError)}>
        <TextInput
          ref={ref}
          style={styles.inputStyle(props.editable)}
          {...props}
        />
        {props.isError ? (
          <View>
            <ErrorInput />
          </View>
        ) : null}
        {props.rightIcon ? props.rightIcon : null}
      </View>
      {props.isError ? (
        <View style={styles.errorContainer}>
          <GlobalText style={styles.textError}>
            {props.errorMessage}{' '}
          </GlobalText>
        </View>
      ) : null}
      {props.maxLength ? (
        <View style={styles.maxLexthStyle}>
          <GlobalText style={styles.maxLengthText}>
            {props.value?.length}/{props.maxLength}{' '}
          </GlobalText>
        </View>
      ) : null}
    </View>
  );
});

export default GlobalInputText;
