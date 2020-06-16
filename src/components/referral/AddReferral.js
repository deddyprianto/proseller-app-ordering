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
  Alert,
  Picker,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../loader';
import {TextInput, DefaultTheme} from 'react-native-paper';
import awsConfig from '../../config/awsConfig';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import {addReferral} from '../../actions/referral.action';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colorConfig.store.defaultColor,
    accent: '#f1c40f',
  },
};

class AddReferral extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      modeInvitation: 'email',
      email: '',
      mobileNo: '',
      phoneNumber: awsConfig.phoneNumberCode,
      openModalCountry: false,
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

  submitReferral = async () => {
    try {
      this.setState({loading: true});

      const {modeInvitation, email, mobileNo} = this.state;
      let payload = {};

      if (modeInvitation == 'email') {
        payload = {
          email,
        };
      } else {
        payload = {
          mobileNo,
        };
      }

      const response = await this.props.dispatch(addReferral(payload));
      //
      if (response != false) {
        if (response.status == false) {
          let message = 'Please try again.';
          if (response.message != undefined) message = response.message;
          Alert.alert('Oppss...', message);
        } else {
          let address =
            payload.mobileNo != undefined ? payload.mobileNo : payload.email;
          Alert.alert(
            'Invitation Sent!',
            `Invitation has been sent to ${address}`,
          );

          if (payload.mobileNo != '' && modeInvitation == 'mobileNo') {
            Linking.openURL(response.url);
          }
        }
      } else {
        Alert.alert('Oppss..', 'Please try again.');
      }

      this.setState({
        email: '',
        mobileNo: '',
        phoneNumber: awsConfig.phoneNumberCode,
      });
      this.setState({loading: false});
    } catch (e) {
      Alert.alert(e.message, 'Something went wrong, please try again');
      this.setState({loading: false});
      this.setState({
        email: '',
        mobileNo: '',
        phoneNumber: awsConfig.phoneNumberCode,
      });
    }
  };

  notCompleted = () => {
    const {modeInvitation, mobileNo, email} = this.state;
    const {referral} = this.props;

    if (
      modeInvitation == 'email' &&
      email != '' &&
      referral.amount < referral.capacity
    )
      return false;
    if (
      modeInvitation == 'mobileNo' &&
      mobileNo != '' &&
      referral.amount < referral.capacity
    )
      return false;

    return true;
  };

  render() {
    const {modeInvitation} = this.state;
    const {referral} = this.props;
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
            <Text style={styles.btnBackText}> New Invitation </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{paddingHorizontal: 15}}>
            <Text
              style={{
                marginBottom: 20,
                fontSize: 16,
                color: colorConfig.store.defaultColor,
                fontFamily: 'Lato-Bold',
                padding: 5,
                textAlign: 'right',
              }}>
              Referral Cap : {referral.amount}/{referral.capacity}
            </Text>

            <Text style={{marginBottom: 10, fontSize: 15}}>
              Invitation Mode :{' '}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: colorConfig.pageIndex.grayColor,
              }}>
              <Picker
                selectedValue={modeInvitation}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({modeInvitation: itemValue})
                }>
                <Picker.Item label="Email" value="email" />
                <Picker.Item label="Mobile No" value="mobileNo" />
              </Picker>
            </View>

            {modeInvitation == 'email' ? (
              <TextInput
                style={{height: 50, marginVertical: 10}}
                theme={theme}
                mode={'outlined'}
                label="Email Address"
                value={this.state.email}
                onChangeText={text => this.setState({email: text})}
              />
            ) : (
              <>
                <View style={{width: 0, height: 0}}>
                  <CountryPicker
                    translation="eng"
                    withCallingCode
                    visible={this.state.openModalCountry}
                    onClose={() => this.setState({openModalCountry: false})}
                    withFilter
                    placeholder={`x`}
                    withFlag={true}
                    onSelect={country => {
                      this.setState({
                        phoneNumber: `+${country.callingCode[0]}`,
                        country: country.name,
                      });
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 15,
                  }}>
                  Enter Mobile Number
                </Text>
                <View
                  style={{
                    marginVertical: 15,
                    flexDirection: 'row',
                    color: colorConfig.store.title,
                    borderColor: colorConfig.pageIndex.grayColor,
                    borderWidth: 1,
                  }}>
                  <PhoneInput
                    flagStyle={{width: 35, height: 25}}
                    textStyle={{fontSize: 18, fontFamily: 'Lato-Medium'}}
                    style={{
                      fontSize: 15,
                      width: '100%',
                      padding: 15,
                      color: 'black',
                    }}
                    ref={ref => {
                      this.phone = ref;
                    }}
                    onChangePhoneNumber={() => {
                      this.setState({
                        phoneNumber: this.phone.getValue(),
                        mobileNo: this.phone.getValue(),
                      });
                    }}
                    value={this.state.phoneNumber}
                    onPressFlag={() => {
                      this.setState({
                        openModalCountry: true,
                      });
                    }}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={this.submitReferral}
              disabled={this.notCompleted()}
              style={{
                marginTop: 40,
                backgroundColor: this.notCompleted()
                  ? colorConfig.store.disableButton
                  : colorConfig.store.defaultColor,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{color: 'white', fontFamily: 'Lato-Bold', fontSize: 20}}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  updateUser: state.userReducer.updateUser,
  referral: state.referralReducer.getReferral.referral,
  userDetail: state.userReducer.getUser.userDetails,
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
)(AddReferral);

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
