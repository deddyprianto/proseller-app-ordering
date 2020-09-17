import React, {Component} from 'react';
import {View, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export default class AccountUserDetail extends Component {
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
      return '#ff6b6b';
    } catch (e) {
      return '#414141';
    }
  };

  openQRCode = () => {
    try {
      this.props.setQrCodeVisibility(true);
    } catch (e) {}
  };

  render() {
    const {userDetail} = this.props;
    return (
      <View
        style={{
          marginBottom: 10,
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: colorConfig.store.defaultColor,
        }}>
        <View style={{padding: 20}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              color: 'white',
              marginBottom: 10,
              fontSize: 18,
            }}>
            My Account
          </Text>
          <View>
            <TouchableOpacity onPress={this.openQRCode}>
              <Image
                style={{
                  height: 90,
                  width: 90,
                  marginBottom: 10,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
                source={appConfig.userQRCode}
              />
            </TouchableOpacity>
            <View
              style={{
                marginBottom: 7,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  fontFamily: 'Lato-Bold',
                }}>
                {userDetail != undefined ? userDetail.name : ''}
              </Text>
            </View>
            <View
              style={{
                marginBottom: 7,
                marginHorizontal: 5,
              }}>
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'white',
                  padding: 3,
                  borderRadius: 5,
                  alignSelf: 'center',
                  position: 'absolute',
                  zIndex: 2,
                }}>
                {userDetail != undefined
                  ? userDetail.customerGroupName != undefined
                    ? userDetail.customerGroupName.toUpperCase()
                    : ''
                  : ''}
              </Text>
              <ShimmerPlaceHolder
                autoRun={true}
                duration={1700}
                style={{
                  alignSelf: 'center',
                  height: 22,
                  width: 110,
                  borderRadius: 5,
                }}
                colorShimmer={[
                  this.renderCustomerGroupBG(userDetail.customerGroupName),
                  'white',
                  this.renderCustomerGroupBG(userDetail.customerGroupName),
                ]}
              />
            </View>
            <View>
              <Text
                style={{
                  color: 'white',
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
                  color: 'white',
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
