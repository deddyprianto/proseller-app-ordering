import React, {Component} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';

class AccountUserDetail extends Component {
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

  renderCustomerGroupBG = cg => {
    try {
      let bg;
      if (cg == 'Standard') bg = '#414141';
      else if (cg == 'Gold') bg = '#e6b31e';
      else bg = '#bbbbbb';
      return bg;
    } catch (e) {
      return '#414141';
    }
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
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: colorConfig.store.defaultColor,
          shadowColor: '#00000021',
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.7,
          shadowRadius: 7.49,
          elevation: 12,
        }}>
        <View style={{padding: 20}}>
          <View>
            <Image
              style={{
                height: 85,
                width: 85,
                marginBottom: 20,
                borderRadius: 10,
                alignSelf: 'center',
              }}
              source={appConfig.appImageNull}
            />
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  fontFamily: 'Lato-Bold',
                }}>
                {userDetail != undefined ? userDetail.name : ''}
              </Text>
            </View>
            <View style={{marginBottom: 7}}>
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'white',
                  padding: 3,
                  borderRadius: 5,
                  alignSelf: 'center',
                  backgroundColor: this.renderCustomerGroupBG(
                    userDetail.customerGroupName,
                  ),
                }}>
                {userDetail != undefined
                  ? userDetail.customerGroupName.toUpperCase()
                  : ''}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.store.darkColor,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: 'Lato-Medium',
                }}>
                {userDetail != undefined ? userDetail.phoneNumber : ''}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.store.darkColor,
                  textAlign: 'center',
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
)(AccountUserDetail);
