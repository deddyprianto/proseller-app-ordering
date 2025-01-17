import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TextInputProps,
  StyleProp,
} from 'react-native';
import Theme from '../../theme/Theme';
import GlobalText from '../globalText';
import DropDownPicker from 'react-native-dropdown-picker';
import ErrorInput from '../../assets/svg/ErorInputSvg';
import {normalizeLayoutSizeWidth} from '../../helper/Layout';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    inputParentContainer: {
      marginTop: 16,
    },
    inpurContainer: (editable, isError, numberOfLines) => ({
      marginTop: 4,
      borderWidth: isError ? 2 : 1,
      borderColor: isError
        ? theme.colors.semanticColorError
        : theme.colors.greyScale2,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: editable === false ? '#F9F9F9' : 'white',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      paddingTop: numberOfLines && numberOfLines > 0 ? 8 : 0,
    }),
    labelStyle: {
      fontSize: 14,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    mandatoryStyle: {
      color: '#CE1111',
    },
    inputStyle: (editable, numberOfLines) => ({
      color: editable === false ? theme.colors.greyScale2 : 'black',
      fontFamily: theme.fontFamily.poppinsRegular,
      paddingBottom: 0,
      paddingTop: 0,
      flex: 1,
      height:
        numberOfLines && numberOfLines > 0
          ? 'auto'
          : normalizeLayoutSizeWidth(48),
    }),
    buttonStyle: {
      flexDirection: 'row',
      paddingVertical: 10,
    },
    iconStyle: {
      marginLeft: 'auto',
      marginTop: 6,
    },
    textInputContainer: {
      width: '100%',
      justifyContent: 'center',
    },
    valueBtnText: editable => ({
      color: editable === false ? theme.colors.greyScale2 : 'black',
      marginTop: 6,
      fontFamily: theme.fontFamily.poppinsMedium,
    }),
    errorContainer: {
      paddingHorizontal: 16,
      marginTop: 4,
    },
    textError: {
      color: theme.colors.semanticColorError,
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textSuccess: {
      color: theme.colors.semanticColorSuccess,
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
    countTextContainer: {
      marginLeft: 'auto',
      marginRight: 16,
      marginTop: 5,
    },
    countText: {
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.greyScale5,
    },
    placeholderDropdown: {
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    btnHeight: {
      height: normalizeLayoutSizeWidth(48),
    },
    row: {
      flexDirection: 'row',
    },
    heightOpenDropDown: {
      height: 100,
    },
  });
  return styles;
};

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
 * @property {boolean}  showNumberLengthText
 * @property {Boolean} autoReset
 * @property {any} childrenLabel
 * @property {StyleProp} customInputStyle
 * @property {StyleProp} customLabelStyle
 * @property {StyleProp} inputParentContainerCustom
 */

/**
 * @param {TextInputProps & ParamProps} props
 */

const GlobalInputText = React.forwardRef((props, ref) => {
  const [start, setStart] = React.useState({start: 0});
  const styles = useStyles();

  const onFocus = () => setStart(null);

  const onBlur = () => setStart({start: 0});

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onFocus);
    Keyboard.addListener('keyboardDidHide', onBlur);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onFocus);
      Keyboard.removeListener('keyboardDidHide', onBlur);
    };
  }, []);

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
          style={[
            styles.inpurContainer(props.editable),
            styles.buttonStyle,
            styles.btnHeight,
          ]}>
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
      <View style={[styles.inputParentContainer]}>
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
          placeholderStyle={styles.placeholderDropdown}
          labelStyle={styles.placeholderDropdown}
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
    <View
      style={[styles.inputParentContainer, props.inputParentContainerCustom]}>
      <View style={styles.row}>
        {props?.label ? (
          <GlobalText style={[styles.labelStyle, props.customLabelStyle]}>
            {props.label}{' '}
            {props.isMandatory ? (
              <GlobalText style={styles.mandatoryStyle}>*</GlobalText>
            ) : null}
          </GlobalText>
        ) : null}

        {props?.childrenLabel ? props.childrenLabel : null}
      </View>
      <View
        style={styles.inpurContainer(
          props.editable,
          props.isError,
          props.numberOfLines,
        )}>
        <TextInput
          ref={ref}
          style={[
            styles.inputStyle(props.editable, props.numberOfLines),
            props.customInputStyle,
          ]}
          textAlignVertical={'center'}
          selection={props.autoReset ? start : null}
          {...props}
        />
        {props.isError ? (
          <View>
            <ErrorInput />
          </View>
        ) : null}
        {props.rightIcon ? props.rightIcon : null}
      </View>
      {props.showNumberLengthText ? (
        <View style={styles.countTextContainer}>
          <GlobalText style={styles.countText}>
            {props.value?.length || 0}/{props.maxLength}{' '}
          </GlobalText>
        </View>
      ) : null}
      {props.isError ? (
        <View style={styles.errorContainer}>
          <GlobalText style={styles.textError}>
            {props.errorMessage}{' '}
          </GlobalText>
        </View>
      ) : null}
      {props.isSuccess ? (
        <View style={styles.errorContainer}>
          <GlobalText style={styles.textSuccess}>
            {props.successMessage}{' '}
          </GlobalText>
        </View>
      ) : null}
    </View>
  );
});

export default GlobalInputText;
