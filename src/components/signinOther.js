import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import colorConfig from "../config/colorConfig";

export default class SigninOther extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSubmitGoogle = (values) => {
    console.log('Google')
  }

  onSubmitFacebook = (values) => {
    console.log('Facebook');
  }

  render() {
    return (
      <View>
        <Text style={styles.textLoginWith}>-- OR --</Text>
          <View style={styles.viewLoginWith}>
            <TouchableOpacity style={styles.buttonLoginWith} onPress={this.onSubmitGoogle}>
              <Image  style={styles.logoLoginWith}
                source={require('../assets/img/icon-google.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLoginWith} onPress={this.onSubmitFacebook}>
              <Image  style={styles.logoLoginWith}
                source={require('../assets/img/icon-facebook.png')}/>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonLoginWith: {
    width:50,
    height:50,
    backgroundColor:colorConfig.signin.buttonLoginWith,
    borderRadius: 50,
    marginHorizontal: 10,
    paddingVertical: 5,
    alignItems:'center',
    shadowColor: colorConfig.signin.shadowColor,
    shadowOffset: { width: 0, height: 5, },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  buttonTextLoginWith: {
    fontSize:16,
    fontWeight:'500',
    color:colorConfig.signin.buttonTextLoginWith,
    textAlign:'center'
  },
  logoLoginWith: {
    width:40,
    height:40,
  },
  textLoginWith: {
    fontSize:14,
    color:colorConfig.signin.textLoginWith,
    textAlign:'center',
    fontStyle: 'italic'
  },
  viewLoginWith: {
    justifyContent :'space-between',
    // paddingVertical:2,
    flexDirection:'row',
    marginBottom:30
  },
});
