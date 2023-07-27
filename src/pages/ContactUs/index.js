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

const useStyles = () => {
  const {colors} = Theme();
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

  const disableButton = () => {
    const emptyValue = fieldValidation(mandatoryField, payload);
    return emptyValue.length > 0;
  };

  const onChangeField = (key, value) => {
    setPayload({...payload, [key]: value});
  };

  const onSubmit = () => {
    dispatch(contactUsHandle(payload));
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header title={'Contact Us'} />
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
