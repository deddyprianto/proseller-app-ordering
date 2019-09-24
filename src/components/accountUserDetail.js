import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';

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

  render() {
    return (
      <View
        style={{
          marginTop: 10,
          height: 160,
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 100,
            width: this.state.screenWidth - 100,
            backgroundColor: colorConfig.pageIndex.backgroundColor,
            marginTop: 50,
            position: 'absolute',
            alignItems: 'center',
            borderRadius: 10,
            borderColor: colorConfig.pageIndex.activeTintColor,
            borderWidth: 1,
          }}>
          <View
            style={{
              height: 75,
              width: 75,
              borderRadius: 75,
              backgroundColor: colorConfig.pageIndex.backgroundColor,
              position: 'absolute',
              top: -40,
              alignItems: 'center',
              borderColor: colorConfig.pageIndex.activeTintColor,
              borderWidth: 1,
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
          <View
            style={{
              marginTop: 40,
              marginBottom: 5,
            }}>
            <Text
              style={{
                color: colorConfig.pageIndex.activeTintColor,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {this.props.userDetail.name}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={this.editProfil}
              style={{
                flexDirection: 'row',
                borderColor: colorConfig.pageIndex.inactiveTintColor,
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 10,
                paddingRight: 5,
                paddingBottom: 2,
                paddingTop: 2,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.inactiveTintColor,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}>
                Edit Profile
              </Text>
              <Icon
                size={15}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright'
                    : 'md-arrow-dropright-circle'
                }
                style={{
                  color: colorConfig.pageIndex.inactiveTintColor,
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>
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
