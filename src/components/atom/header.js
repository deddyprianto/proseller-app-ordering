/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import awsConfig from '../../config/awsConfig';

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    left: -20,
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signupText: {
    color: colorConfig.auth.signupText,
    fontSize: 16,
  },
  signupButton: {
    color: colorConfig.signin.signupButton,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
  },
  verifyButton: {
    color: colorConfig.signin.signupButton,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  button: {
    height: 45,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorConfig.auth.buttonText,
    textAlign: 'center',
  },
  errorText: {
    color: colorConfig.auth.errorText,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  viewLoginWith: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 30,
  },
  backgroundImage: {
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
});

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: awsConfig.phoneNumberCode,
      confirmationCode: '',
      press: false,
      showPass: true,
      showAlert: false,

      pesanAlert: '',
      titleAlert: '',
      loading: false,
      showPageConfirmation: false,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  gotoBack() {
    Actions.pop();
  }

  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={colorConfig.store.defaultColor}
          barStyle="light-content"
        />

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colorConfig.store.defaultColor,
            paddingVertical: !this.props.backButton ? 5 : 0,
          }}>
          {this.props.backButton ? (
            <TouchableOpacity style={{padding: 5}} onPress={this.gotoBack}>
              <Icon
                size={28}
                name={
                  Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'
                }
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  margin: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
          <View style={styles.container}>
            <Text
              style={{
                color: colorConfig.pageIndex.backgroundColor,
                fontSize: 17,
                fontWeight: 'bold',
              }}>
              {this.props.titleHeader}
            </Text>
          </View>
        </View>
        <View style={styles.line} />
      </View>
    );
  }
}
