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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import awsConfig from '../../config/awsConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import appConfig from '../../config/appConfig';
import {isEmptyData} from '../../helper/CheckEmpty';
import {getSetting} from '../../actions/order.action';

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
    marginTop: 5,
    marginBottom: 10,
    // left: -20,
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

const WIDTH = Dimensions.get('window').width;

class Header extends Component {
  constructor(props) {
    super(props);
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
    this.state = {
      logo: null,
    };
  }

  gotoBack = () => {
    const {loginByMobile} = this.props;
    if (loginByMobile === false) {
      Actions.push('pageIndex');
    } else {
      Actions.pop();
    }
  };

  componentDidMount = async () => {
    try {
      const logo = await this.props.dispatch(getSetting('Logo'));
      if (!isEmptyData(logo)) await this.setState({logo});
    } catch (e) {}
  };

  render() {
    const {backButton, companyInfo} = this.props;
    const {logo} = this.state;
    return (
      <View>
        <StatusBar
          backgroundColor={colorConfig.store.defaultColor}
          barStyle="light-content"
        />

        <View
          style={{
            flexDirection: 'row',
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
                  color: colorConfig.store.titleSelected,
                  margin: 10,
                }}
              />
            </TouchableOpacity>
          ) : null}
          <View style={[styles.container, backButton ? {left: -25} : null]}>
            {!isEmptyData(logo) ? (
              <Image
                source={{uri: logo}}
                style={{width: WIDTH / 2, height: 90, resizeMode: 'contain'}}
              />
            ) : (
              <Image
                source={appConfig.welcomeLogo}
                style={{width: WIDTH / 2, height: 90, resizeMode: 'contain'}}
              />
            )}
            <Text
              style={{
                marginTop: 10,
                color: colorConfig.store.titleSelected,
                fontSize: 22,
                fontFamily: 'Poppins-Medium',
              }}>
              {this.props.titleHeader}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

mapStateToProps = state => ({
  companyInfo: state.userReducer.getCompanyInfo.companyInfo,
  loginByMobile: state.orderReducer.orderingSetting.loginByMobile,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Header);
