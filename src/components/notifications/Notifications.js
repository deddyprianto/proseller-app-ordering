/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
  SafeAreaView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {getUserProfile, updateUser} from '../../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../loader';
import {List} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';

class Notifications extends Component {
  constructor(props) {
    super(props);
    var data;
    try {
      data = {
        username: this.props.dataDiri.username,
        emailNotification: this.props.dataDiri.emailNotification,
        smsNotification: this.props.dataDiri.smsNotification,
      };
    } catch (e) {
      data = {
        emailNotification: true,
        smsNotification: false,
      };
    }

    this.state = {
      screenWidth: Dimensions.get('window').width,
      username: data.username,
      emailNotification:
        data.emailNotification == undefined ? true : data.emailNotification,
      smsNotification:
        data.smsNotification == undefined ? false : data.smsNotification,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    try {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
  }

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  changeSetting = async (field, value) => {
    try {
      this.setState({loading: true});
      let message = '';
      let dataProfile = {};
      dataProfile.username = this.state.username;
      if (field == 'emailNotification') {
        dataProfile.emailNotification = value;
        value
          ? (message = 'Email Notification Enabled')
          : (message = 'Email Notification Disabled');
      } else {
        dataProfile.smsNotification = value;
        value
          ? (message = 'SMS Notification Enabled')
          : (message = 'SMS Notification Disabled');
      }

      const response = await this.props.dispatch(updateUser(dataProfile));
      await this.props.dispatch(getUserProfile());
      if (response) {
        Snackbar.show({
          text: message,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: 'Oppss.. Please try again',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
      this.setState({loading: false});
    } catch (e) {
      this.setState({loading: false});
    }
  };

  changeEmailSetting = value => {
    this.setState({emailNotification: !value});
    this.changeSetting('emailNotification', !value);
  };

  changeSMSSetting = value => {
    this.setState({smsNotification: !value});
    this.changeSetting('smsNotification', !value);
  };

  render(marginRight: number) {
    const {intlData} = this.props;
    const {smsNotification, emailNotification} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Notification Setting </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <List.Section>
            <List.Subheader>Notification Settings</List.Subheader>

            <List.Item
              title="Email Notification"
              description="Allow Funtoast to send you promotion through your email."
              left={props => <List.Icon {...props} icon="email" />}
              right={() => (
                <Switch
                  trackColor={{
                    false: '#767577',
                    true: colorConfig.store.disableButton,
                  }}
                  thumbColor={true ? colorConfig.store.defaultColor : 'white'}
                  ios_backgroundColor="white"
                  onValueChange={() => {
                    this.changeEmailSetting(emailNotification);
                  }}
                  value={emailNotification}
                />
              )}
            />

            <List.Item
              title="SMS Notification"
              description="Allow sending notification to your mobile number."
              left={props => <List.Icon {...props} icon="phone" />}
              right={() => (
                <Switch
                  trackColor={{
                    false: '#767577',
                    true: colorConfig.store.disableButton,
                  }}
                  thumbColor={true ? colorConfig.store.defaultColor : 'white'}
                  ios_backgroundColor="white"
                  onValueChange={() => {
                    this.changeSMSSetting(smsNotification);
                  }}
                  value={smsNotification}
                />
              )}
            />
          </List.Section>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  updateUser: state.userReducer.updateUser,
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
)(Notifications);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  header: {
    height: 65,
    marginBottom: 20,
    justifyContent: 'center',
    // backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  btnBack: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // width: 100,
    height: 80,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
  primaryButton: {
    borderColor: colorConfig.pageIndex.activeTintColor,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    padding: 12,
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    // margin: 10,
    // borderColor: colorConfig.pageIndex.activeTintColor,
    // borderWidth: 1,
    // borderRadius: 5,
    // backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  item: {
    alignItems: 'center',
    borderBottomColor: colorConfig.pageIndex.activeTintColor,
    margin: 10,
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    marginLeft: 30,
    marginRight: 30,
  },
  detailItem: {
    padding: 10,
    justifyContent: 'space-between',
    // borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    // borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 10,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
  },
  textChange: {
    color: colorConfig.pageIndex.inactiveTintColor,
    // color: 'gray',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnChange: {
    padding: 5,
    marginLeft: 'auto',
  },
  descAddress: {
    color: colorConfig.pageIndex.grayColor,
    marginLeft: 8,
    maxWidth: Dimensions.get('window').width / 2 + 20,
    textAlign: 'right',
  },
});
