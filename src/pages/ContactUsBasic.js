import React from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  BackHandler,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Header} from '../components/layout';
import Theme from '../theme/Theme';
import GlobalInputText from '../components/globalInputText';
import GlobalButton from '../components/button/GlobalButton';
import {fieldValidation} from '../helper/Validation';
import {useDispatch} from 'react-redux';
import {contactUsHandle} from '../actions/contactus.action';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';
import {Actions} from 'react-native-router-flux';
import useBackHandler from '../hooks/backHandler/useBackHandler';
import {normalizeLayoutSizeWidth} from '../helper/Layout';
import {showSnackbar} from '../actions/setting.action';
import useValidation from '../hooks/validation/useValidation';

const useStyles = () => {
  const {colors, fontFamily} = Theme();
  const styles = StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 16,
    },
    buttonContainer: {
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowColor: colors.greyScale2,
      elevation: 3,
      height: 56,
      maxHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.header,
      padding: 16,
      zIndex: 1000,
      borderTopWidth: 1,
      borderTopColor: colors.greyScale2,
      justifyContent: 'center',
    },
    safeAreaView: {
      flex: 1,
    },
    buttonStyle: {
      padding: 8,
      flex: 1,
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 0,
    },
    messageContainer: {
      flexDirection: 'row',
    },
    containerMessage: {
      position: 'absolute',
      top: 80,
      zIndex: 1000,
    },
    whiteText: {
      color: 'white',
      fontFamily: fontFamily.poppinsMedium,
    },
    message: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    messageIcon: {
      marginRight: 12,
    },
    parentContainer: {
      height: 56,
      justifyContent: 'center',
    },
    iosTextArea: {
      height: normalizeLayoutSizeWidth(180),
      width: '100%',
    },
    androidTextArea: {
      width: '100%',
    },
  });
  return {styles, colors};
};

const ContactUsBasic = () => {
  const {styles} = useStyles();
  useBackHandler();
  const [mandatoryField] = React.useState([
    'name',
    'from',
    'subject',
    'message',
  ]);
  const dispatch = useDispatch();
  const inputRefEmail = React.useRef(null);
  const [payload, setPayload] = React.useState({});
  const [isLoading, setIsloading] = React.useState(false);
  const [isEmailValid, setIsValidEmail] = React.useState(false);
  const isIos = Platform.OS === 'ios';
  const {isValidEmail} = useValidation();
  const disableButton = () => {
    const emptyValue = fieldValidation(mandatoryField, payload);
    return emptyValue.length > 0 || !isEmailValid;
  };
  const onChangeField = (key, value) => {
    if (key === 'from') {
      setIsValidEmail(isValidEmail(value));
    }
    setPayload({...payload, [key]: value});
  };
  const onSubmit = async () => {
    setIsloading(true);
    const response = await dispatch(contactUsHandle(payload));
    if (response.success) {
      setPayload({});
      dispatch(
        showSnackbar({message: 'Message sent successfully!', type: 'success'}),
      );
      if (inputRefEmail.current) {
        inputRefEmail.current.focus();
      }
    } else {
      dispatch(
        showSnackbar({
          message: 'Failed to sent message. Please try again.',
        }),
      );
    }
    setIsloading(false);
  };

  const handleBackButton = () => {
    Actions.pop();
    return true;
  };

  const renderMessageField = () => {
    if (!isIos) {
      return (
        <GlobalInputText
          isMandatory
          label="Message"
          placeholder="Write your message here."
          multiline={true}
          numberOfLines={10}
          textAlignVertical="top"
          onChangeText={val => onChangeField('message', val)}
          showNumberLengthText
          value={payload.message || ''}
          maxLength={2000}
          customInputStyle={styles.androidTextArea}
        />
      );
    }
    return (
      <GlobalInputText
        isMandatory
        label="Message"
        placeholder="Write your message here."
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
        onChangeText={val => onChangeField('message', val)}
        showNumberLengthText
        value={payload.message || ''}
        maxLength={2000}
        customInputStyle={styles.iosTextArea}
      />
    );
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <LoadingScreen loading={isLoading} />
      <Header title={'Contact Us'} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView>
          <GlobalInputText
            ref={inputRefEmail}
            isMandatory
            label="Name"
            placeholder="Enter your name"
            value={payload.name || ''}
            onChangeText={val => onChangeField('name', val)}
          />
          <GlobalInputText
            isMandatory
            label="Email"
            placeholder="Enter your email"
            value={payload.from || ''}
            onChangeText={val => onChangeField('from', val)}
            isError={!isEmailValid && payload?.from?.length > 0}
            errorMessage={'Please enter a valid email address.'}
          />
          <GlobalInputText
            isMandatory
            label="Subject"
            value={payload.subject || ''}
            placeholder="Tell us the subject of your message."
            onChangeText={val => onChangeField('subject', val)}
          />
          {renderMessageField()}
        </KeyboardAvoidingView>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <GlobalButton
          disabled={disableButton()}
          buttonStyle={styles.buttonStyle}
          onPress={onSubmit}
          title="Submit"
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactUsBasic;
