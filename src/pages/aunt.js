/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  ImageBackground,
  Dimensions
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";
import { Field, reduxForm } from 'redux-form';

import InputText from "../components/inputText";
import {confirmUser} from "../actions/auth.actions";
import Loader from "../components/loader";
import {Actions} from 'react-native-router-flux';
import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth-50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container : {
    flex: 1,
    alignItems:'center',
    justifyContent :'center',
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
  	color:colorConfig.auth.signupText,
  	fontSize:16
  },
  signupButton: {
  	color:colorConfig.signin.signupButton,
  	fontSize:14,
    fontWeight:'bold',
    textAlign: 'left',
    paddingLeft: 10
  },
  verifyButton: {
  	color:colorConfig.signin.signupButton,
    fontSize:14,
    fontWeight:'bold',
    textAlign: 'right',
    paddingRight: 10
  },
  button: {
    width:300,
    backgroundColor:colorConfig.auth.button,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    // shadowColor: colorConfig.auth.shadowColor,
    // shadowOffset: { width: 0, height: 1},
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'bold',
    color:colorConfig.auth.buttonText,
    textAlign:'center'
  },
  errorText: {
    color: colorConfig.auth.errorText,
    fontSize:14,
    paddingHorizontal:16,
    paddingBottom: 8
  },
  viewLoginWith: {
    justifyContent :'space-between',
    // paddingVertical:2,
    flexDirection:'row',
    marginBottom:30
  },
  backgroundImage: {        
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
});

class Aunt extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

	signin() {
    Actions.signin();
  }

  signup() {
		Actions.signup()
  }

  confirmUser = async (values) => {
    try {
      const response =  await this.props.dispatch(confirmUser(values));
      if (!response.success) {
        throw response;
      } else {
        Actions.signin()
      }
    } catch (error) {
      let errorText;
      if (error.message) {
        errorText = error.message
      }
      errorText = error.responseBody;
      Alert.alert(
        'Authentication Failed!',
        errorText.message,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]
      );
    }
  }

  onSubmit = (values) => {
    this.confirmUser(values);
  }

  renderTextInput = (field) => {
    const {meta: {touched, error}, label, icon, secureTextEntry, maxLength, keyboardType, placeholder, input: {onChange, ...restInput}} = field;
    return (
      <View>
        <InputText
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          icon={icon}
          {...restInput} />
      {(touched && error) && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

	render() {
    const { handleSubmit, loginUser} = this.props;
    const imageStyle = [styles.logo, { width: this.imageWidth }];
		return(
      <ImageBackground
        source={appConfig.appBackground}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        {(loginUser && loginUser.isLoading) && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <Animated.Image
              source={appConfig.appLogo}
              style={imageStyle}
              resizeMode="contain"
            />
          </View>
          <Field
            name="username"
            placeholder="Username"
            icon='md-contact'
            component={this.renderTextInput} />
          <Field
            name="confirmationCode"
            placeholder="Code Authentification"
            icon='md-key'
            component={this.renderTextInput} />
          <TouchableOpacity style={styles.button} onPress={handleSubmit(this.onSubmit)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <View style={styles.viewLoginWith}>
            <TouchableOpacity onPress={this.signin}><Text style={styles.signupButton}>Login</Text></TouchableOpacity>
            <TouchableOpacity onPress={this.signup}><Text style={styles.verifyButton}>Create Account</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    )
	}
}

const validate = (values) => {
  const errors = {};
  if(!values.email) {
    errors.email = "Email is required"
  }
  if(!values.code_auth) {
    errors.code_auth = "Code is required"
  }
  return errors;
};

mapStateToProps = (state) => ({
  confirmUser: state.authReducer.confirmUser
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: "confirm",
    validate
  })
)(Aunt);
