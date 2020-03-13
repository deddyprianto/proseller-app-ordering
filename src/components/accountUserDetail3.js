import React, {Component} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';

class AccountUserDetail3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  editProfil = () => {
    var dataDiri = {dataDiri: this.props.userDetail};
    Actions.accountEditProfil(dataDiri);
  };

  render() {
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: colorConfig.pageIndex.backgroundColor,
          width: this.state.screenWidth,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: 75,
              width: 75,
              borderRadius: 75,
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              alignItems: 'center',
              borderColor: colorConfig.pageIndex.activeTintColor,
              borderWidth: 1,
              marginRight: 10,
            }}>
            <Image
              style={{
                height: 73,
                width: 73,
                borderRadius: 73,
              }}
              source={appConfig.appImageNull}
            />
          </View>
          <View>
            <View
              style={{
                marginTop: 5,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.activeTintColor,
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                }}>
                {userDetail != undefined ? userDetail.name : ''}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  fontSize: 14,
                  fontFamily: 'Lato-Medium',
                }}>
                {userDetail != undefined ? userDetail.phoneNumber : ''}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  fontSize: 14,
                  fontFamily: 'Lato-Italic',
                }}>
                {userDetail != undefined ? userDetail.email : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(AccountUserDetail3);
