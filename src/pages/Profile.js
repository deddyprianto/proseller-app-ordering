import React from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {ProgressBar} from 'react-native-paper';

import {connect} from 'react-redux';

import colorConfig from '../config/colorConfig';
import appConfig from '../config/appConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {},
  viewBody: {
    width: WIDTH,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  divider: {
    width: WIDTH,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  imageIcon: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    tintColor: colorConfig.primaryColor,
  },
  viewOption: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewLogout: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  imageIconLogout: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
    tintColor: 'grey',
  },
});

const mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const Profile = ({...props}) => {
  const renderPointBar = () => {
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: colorConfig.sixthColor,
          width: '100%',
        }}>
        <Text
          style={{
            fontSize: 20,
            color: colorConfig.primaryColor,

            marginTop: 30,
          }}>
          Hi, XXXXXX!
        </Text>
        <View
          style={{
            marginTop: 10,
            width: 125,
            height: 26,
            backgroundColor: '#E5E5E5',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>E-Card</Text>
        </View>
        <Text style={{fontSize: 20, marginTop: 20}}>55 PTS</Text>
        <View style={{width: '80%', justifyContent: 'center', marginTop: 15}}>
          <ProgressBar
            progress={0.5}
            color={colorConfig.primaryColor}
            style={{backgroundColor: '#E5E5E5', height: 25, borderRadius: 10}}
          />
          <Image
            style={{height: 50, width: 50, position: 'absolute', left: '45%'}}
            source={appConfig.funtoastCoffee}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '80%',
            justifyContent: 'space-between',
            marginTop: 30,
          }}>
          <Text style={{fontSize: 10}}>Silver</Text>
          <Text style={{fontSize: 10}}>Gold</Text>
        </View>
        <Text style={{fontSize: 10, marginVertical: 20}}>
          Spend 300 Point by 31 Dec 2022 to upgrade to Gold
        </Text>
      </View>
    );
  };

  const handleEditProfile = () => {
    let userDetail;
    try {
      let bytes = CryptoJS.AES.decrypt(
        props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }

    const value = {dataDiri: userDetail};
    return Actions.editProfile(value);
  };

  const renderEditProfile = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          handleEditProfile();
        }}>
        <Image style={styles.imageIcon} source={appConfig.editProfile} />
        <Text>Edit Profile</Text>
      </TouchableOpacity>
    );
  };

  const renderMyDeliveryAddress = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.listAddress();
        }}>
        <Image style={styles.imageIcon} source={appConfig.editProfile} />
        <Text>My Delivery address</Text>
      </TouchableOpacity>
    );
  };

  const renderNotifications = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.notifications();
        }}>
        <Image style={styles.imageIcon} source={appConfig.notifications} />
        <Text>Notifications</Text>
      </TouchableOpacity>
    );
  };

  const renderTermsAndConditions = () => {
    return (
      <TouchableOpacity
        style={styles.viewOption}
        onPress={() => {
          Actions.termsCondition();
        }}>
        <Image style={styles.imageIcon} source={appConfig.termsAndConditions} />
        <Text>Terms And Conditions</Text>
      </TouchableOpacity>
    );
  };

  const renderSettings = () => {
    return (
      <View>
        <View style={{padding: 10}}>
          <Text>Settings</Text>
        </View>
        <View style={styles.divider} />
        {renderMyDeliveryAddress()}
        <View style={styles.divider} />
        {renderEditProfile()}
        <View style={styles.divider} />
        {renderNotifications()}
        <View style={styles.divider} />
        {renderTermsAndConditions()}
        <View style={styles.divider} />
      </View>
    );
  };

  const renderLogout = () => {
    return (
      <TouchableOpacity style={styles.viewLogout}>
        <Image style={styles.imageIconLogout} source={appConfig.logout} />
        <Text style={{color: 'grey'}}>Logout</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderPointBar()}
      {renderSettings()}
      {renderLogout()}
    </ScrollView>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
