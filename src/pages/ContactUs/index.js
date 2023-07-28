import React from 'react';
import {ScrollView, StyleSheet, KeyboardAvoidingView, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {Header} from '../../components/layout';
import Theme from '../../theme/Theme';
import GlobalInputText from '../../components/globalInputText';
import GlobalButton from '../../components/button/GlobalButton';
import {fieldValidation} from '../../helper/Validation';
import {useDispatch} from 'react-redux';
import {contactUsHandle} from '../../actions/contactus.action';
import AnimationMessage from '../../components/animationMessage';
import GlobalText from '../../components/globalText';
import CheckboxWhite from '../../assets/svg/CheckboxWhite';
import ErrorIcon from '../../assets/svg/ErrorIcon';
import LoadingScreen from '../../components/loadingScreen/LoadingScreen';

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
  });
  return {styles, colors};
};

const ContactUs = () => {
  const {styles} = useStyles();
  const [mandatoryField] = React.useState([
    'name',
    'from',
    'subject',
    'message',
  ]);
  const dispatch = useDispatch();
  const [payload, setPayload] = React.useState({});
  const [showMessage, setShowMessage] = React.useState(false);
  const [type, setType] = React.useState(null);
  const [isLoading, setIsloading] = React.useState(false);
  const disableButton = () => {
    const emptyValue = fieldValidation(mandatoryField, payload);
    return emptyValue.length > 0;
  };

  const onChangeField = (key, value) => {
    setPayload({...payload, [key]: value});
  };

  const onSubmit = async () => {
    setIsloading(true);
    const response = await dispatch(contactUsHandle(payload));
    if (response.success) {
      setType('success');
    } else {
      setType('error');
    }
    setShowMessage(true);
    setIsloading(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <LoadingScreen loading={isLoading} />
      <Header title={'Contact Us'} />
      <View style={styles.containerMessage}>
        <AnimationMessage
          type={type}
          containerStyle={styles.parentContainer}
          setShow={isShow => setShowMessage(isShow)}
          show={showMessage}>
          <View style={styles.message}>
            <View style={styles.messageIcon}>
              {type === 'success' ? <CheckboxWhite /> : <ErrorIcon />}
            </View>
            <GlobalText style={styles.whiteText}>
              {type === 'success'
                ? ' Message sent successfully!'
                : 'Failed to sent message. Please try again.'}
            </GlobalText>
          </View>
        </AnimationMessage>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView>
          <GlobalInputText
            isMandatory
            label="Name"
            placeholder="Enter your name"
            onChangeText={val => onChangeField('name', val)}
          />
          <GlobalInputText
            isMandatory
            label="Email"
            placeholder="Enter your email"
            onChangeText={val => onChangeField('from', val)}
          />
          <GlobalInputText
            isMandatory
            label="Subject"
            placeholder="Tell us the subject of your message."
            onChangeText={val => onChangeField('subject', val)}
          />
          <GlobalInputText
            isMandatory
            label="Message"
            placeholder="Write your message here."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            onChangeText={val => onChangeField('message', val)}
            showNumberLengthText
            value={payload.message}
            maxLength={2000}
          />
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

export default ContactUs;
