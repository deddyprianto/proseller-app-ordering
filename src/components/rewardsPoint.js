import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/EvilIcons';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {isEmptyArray, isEmptyData, isEmptyObject} from '../helper/CheckEmpty';

class RewardsPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      rewardPoint: 0,
    };
  }

  editProfile = () => {
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

    var dataDiri = {dataDiri: userDetail};
    Actions.editProfile(dataDiri);
  };

  render() {
    const {intlData, campaignActive, totalPoint} = this.props;
    const HEIGHT = campaignActive ? 4 : 6;
    const {campign, detailPoint} = this.props;
    return (
      <View
        style={{
          // height: '100%',
          // height: this.state.screenHeight / HEIGHT - 40,
          borderWidth: 1,
          borderColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          width: '100%',
          padding: 8,
          // marginBottom: 10,
        }}>
        {totalPoint != undefined &&
        campaignActive &&
        detailPoint != undefined &&
        !isEmptyObject(detailPoint.trigger) &&
        detailPoint.trigger.campaignTrigger === 'USER_SIGNUP' ? (
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // marginLeft: 13,
                // paddingTop: 25,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                My Rewards Points
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                Actions.detailPoint({intlData});
              }}>
              <Text
                style={{
                  marginLeft: 40,
                  color: colorConfig.pageIndex.backgroundColor,
                  textAlign: 'center',
                  fontSize: 25,
                  fontFamily: 'Poppins-Medium',
                }}>
                {totalPoint} PTS
              </Text>
              <Icon
                size={40}
                name={'chevron-right'}
                style={{color: 'white', marginBottom: 5}}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {campaignActive &&
        detailPoint != undefined &&
        !isEmptyObject(detailPoint.trigger) &&
        detailPoint.trigger.campaignTrigger === 'COMPLETE_PROFILE' &&
        detailPoint.trigger.status === false ? (
          <View style={styles.information}>
            <View style={styles.boxInfo}>
              <Text style={styles.textInfo}>
                {intlData.messages.pleaseCompleteProfile}
              </Text>
              <TouchableOpacity
                onPress={this.editProfile}
                style={styles.buttonComplete}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Complete Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : totalPoint != undefined &&
          campaignActive &&
          detailPoint != undefined &&
          !isEmptyObject(detailPoint.trigger) &&
          detailPoint.trigger.campaignTrigger === 'COMPLETE_PROFILE' &&
          detailPoint.trigger.status === true ? (
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // marginLeft: 13,
                // paddingTop: 25,
                // marginBottom: 10,
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                My Rewards Points
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                Actions.detailPoint({intlData});
              }}>
              <Text
                style={{
                  marginLeft: 40,
                  color: colorConfig.pageIndex.backgroundColor,
                  textAlign: 'center',
                  fontSize: 30,
                  fontFamily: 'Poppins-Medium',
                }}>
                {totalPoint}
              </Text>
              <Icon size={40} name={'chevron-right'} style={{color: 'white'}} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonComplete: {
    backgroundColor: colorConfig.store.secondaryColor,
    borderRadius: 10,
    marginHorizontal: '20%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  boxInfo: {
    marginHorizontal: '15%',
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colorConfig.store.TransBG,
  },
  textInfo: {
    color: colorConfig.store.colorError,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

mapStateToProps = state => ({
  campign: state.rewardsReducer.campaign.campaign,
  fields: state.accountsReducer.mandatoryFields.fields,
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
  detailPoint: state.rewardsReducer.dataPoint.detailPoint,
  campaignActive: state.rewardsReducer.dataPoint.campaignActive,
  intlData: state.intlData,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RewardsPoint);
