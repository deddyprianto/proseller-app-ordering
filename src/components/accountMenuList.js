import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import {logoutUser} from '../actions/auth.actions';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import awsConfig from '../config/awsConfig';
import CryptoJS from 'react-native-crypto-js';
import {Dialog} from 'react-native-paper';

class AccountMenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      dialogChangeLanguage: false,
    };
  }

  logout = async () => {
    const response = await this.props.dispatch(logoutUser());
  };

  editProfil = () => {
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

  updateLanguage = () => {
    this.props.setLanguage();
  };

  render() {
    // const {intlData} = this.props;
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.itemMenu}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-timer' : 'md-time'}
              style={{color: colorConfig.pageIndex.activeTintColor}}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.item}
              onPress={() => this.props.screen.navigation.navigate('History')}>
              <Text style={styles.title}>History Transactions</Text>
              <Icon
                size={20}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright-circle'
                    : 'md-arrow-dropright-circle'
                }
                style={{color: colorConfig.pageIndex.activeTintColor}}
              />
            </TouchableOpacity>
            <View style={styles.line} />
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={styles.itemMenu}>
            <Icon
              size={20}
              name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
              style={{color: colorConfig.pageIndex.activeTintColor}}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.item} onPress={this.editProfil}>
              <Text style={styles.title}>Edit Profile</Text>
              <Icon
                size={20}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-arrow-dropright-circle'
                    : 'md-arrow-dropright-circle'
                }
                style={{color: colorConfig.pageIndex.activeTintColor}}
              />
            </TouchableOpacity>

            <View style={styles.line} />
          </View>
        </View>

        {/*<View style={{flexDirection: 'row'}}>*/}
        {/*  <View style={styles.itemMenu}>*/}
        {/*    <Icon*/}
        {/*      size={20}*/}
        {/*      name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'}*/}
        {/*      style={{color: colorConfig.pageIndex.activeTintColor}}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*  <View>*/}
        {/*    <TouchableOpacity style={styles.item} onPress={this.updateLanguage}>*/}
        {/*      <Text style={styles.title}> {intlData.messages.languages} </Text>*/}
        {/*      <Icon*/}
        {/*        size={20}*/}
        {/*        name={*/}
        {/*          Platform.OS === 'ios'*/}
        {/*            ? 'ios-arrow-dropright-circle'*/}
        {/*            : 'md-arrow-dropright-circle'*/}
        {/*        }*/}
        {/*        style={{color: colorConfig.pageIndex.activeTintColor}}*/}
        {/*      />*/}
        {/*    </TouchableOpacity>*/}

        {/*    /!*<View style={styles.line} />*!/*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/*<View style={{flexDirection: 'row'}}>*/}
        {/*  <View*/}
        {/*    style={styles.itemMenu}>*/}
        {/*    <Icon*/}
        {/*      size={20}*/}
        {/*      name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}*/}
        {/*      style={{color: colorConfig.pageIndex.activeTintColor}}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*  <View>*/}
        {/*    <TouchableOpacity style={styles.item}>*/}
        {/*      <Text style={styles.title}> Settings </Text>*/}
        {/*      <Icon*/}
        {/*        size={20}*/}
        {/*        name={*/}
        {/*          Platform.OS === 'ios'*/}
        {/*            ? 'ios-arrow-dropright-circle'*/}
        {/*            : 'md-arrow-dropright-circle'*/}
        {/*        }*/}
        {/*        style={{color: colorConfig.pageIndex.activeTintColor}}*/}
        {/*      />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    borderTopColor: colorConfig.pageIndex.inactiveTintColor,
    borderTopWidth: 1,
  },
  item: {
    margin: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 60,
  },
  itemMenu: {
    paddingVertical: 12,
    justifyContent: 'center',
    marginLeft: 10,
    width: 25,
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    color: colorConfig.store.defaultColor,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Lato-Medium',
  },
});

mapStateToProps = state => ({
  logoutUser: state.authReducer.logoutUser,
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
)(AccountMenuList);
