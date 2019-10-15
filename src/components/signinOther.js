import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import colorConfig from '../config/colorConfig';

export default class SigninOther extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmitGoogle = values => {
    console.log('Google');
  };

  onSubmitFacebook = values => {
    console.log('Facebook');
  };

  render() {
    return (
      <View>
        <Text style={styles.textLoginWith}>-- OR --</Text>
        <TouchableOpacity style={styles.buttonFB} onPress={this.onSubmitGoogle}>
          <Image
            style={styles.logoLoginWith}
            source={require('../assets/img/icon-facebook.png')}
          />
          <Text style={styles.buttonTextFB}>Login With Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonGoogle}
          onPress={this.onSubmitGoogle}>
          <Image
            style={styles.logoLoginWith}
            source={require('../assets/img/icon-google.png')}
          />
          <Text style={styles.buttonTextGoogle}>Login With Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonLoginWith: {
    width: 50,
    height: 50,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 50,
    marginHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  buttonTextLoginWith: {
    fontSize: 16,
    fontWeight: '500',
    color: colorConfig.signin.buttonTextLoginWith,
    textAlign: 'center',
  },
  logoLoginWith: {
    width: 35,
    height: 35,
    marginLeft: 5,
    marginRight: 10,
  },
  textLoginWith: {
    fontSize: 14,
    color: colorConfig.signin.textLoginWith,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  viewLoginWith: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 30,
  },
  buttonFB: {
    width: 300,
    height: 45,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 25,
    marginVertical: 10,
    borderColor: '#4267B2',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextFB: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4267B2',
    textAlign: 'center',
  },
  buttonGoogle: {
    width: 300,
    height: 45,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 25,
    marginVertical: 10,
    borderColor: 'red',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTextGoogle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
});
