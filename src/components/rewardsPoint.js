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
    const HEIGHT = campaignActive ? 3 : 5;
    return (
      <View
        style={{
          backgroundColor: colorConfig.pageIndex.activeTintColor,
          height: this.state.screenHeight / HEIGHT - 30,
        }}>
        {totalPoint != undefined && campaignActive ? (
          <View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 32,
                paddingTop: 25,
              }}
              onPress={() => {
                Actions.detailPoint({intlData});
              }}>
              <Text
                style={{
                  color: colorConfig.pageIndex.backgroundColor,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {intlData.messages.myPoints}
              </Text>
              <Icon size={32} name={'chevron-right'} style={{color: 'white'}} />
            </TouchableOpacity>
            <Text
              style={{
                color: colorConfig.pageIndex.backgroundColor,
                textAlign: 'center',
                fontSize: 42,
                fontFamily: 'Lato-Bold',
              }}>
              {totalPoint}
            </Text>
          </View>
        ) : (
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
        )}
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
    fontFamily: 'Lato-Medium',
  },
});

mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
