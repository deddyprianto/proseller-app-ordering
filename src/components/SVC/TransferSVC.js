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
  BackHandler,
  Platform,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  KeyboardAvoidingView,
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
import DropDownPicker from 'react-native-dropdown-picker';
import {Body} from '../layout';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colorConfig.store.defaultColor,
    accent: '#f1c40f',
  },
};

class TransferSVC extends Component {
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

  setPhoneNumber = item => {
    try {
      let data = item.item.phoneNumber;
      if (data != null && data != '') {
        data = data.replace(/[^a-zA-Z0-9]/g, '');
        data = data.replace(/\s/g, '');

        if (data[0] === '0') {
          data = data.substr(1, data.length);
        }

        let countryCode = data.substr(0, 2);
        countryCode = '+' + countryCode;

        if (
          countryCode.includes(awsConfig.phoneNumberCode) ||
          countryCode.includes('+62')
        ) {
          data = '+' + data;
        } else {
          if (data.length == 8) {
            data = awsConfig.phoneNumberCode + data;
          } else {
            data = '+62' + data;
          }
        }

        this.setState({mobileNo: data, phoneNumber: data});
      }
    } catch (e) {}
  };

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
          email: email.toLowerCase(),
        };
        payload.modeInvitation = 'Email';
        payload.address = email.toLowerCase();
      } else {
        payload = {
          mobileNo,
        };
        payload.modeInvitation = 'Mobile Number';
        payload.address = mobileNo;
      }

      Actions.virtualKeyboard({
        payload,
        transferSVC: true,
        amountSVC: 0,
        getCustomerActivity: this.props.getCustomerActivity,
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

    if (modeInvitation == 'email' && email != '') return false;
    if (modeInvitation == 'mobileNo' && mobileNo != '') return false;

    return true;
  };

  accessContact = () => {
    try {
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'View Contacts',
            message:
              'We want to display your contacts to make it easier to add a mobile number.',
          },
        ).then(granted => {
          if (granted === 'denied') {
            return;
          } else {
            this.loadContacts();
          }
        });
      } else {
        // this.loadContacts();
      }
    } catch (e) {}
  };

  // loadContacts = async () => {
  //   await this.setState({loading: true});
  //   try {
  //     Contacts.getAll((err, contacts) => {
  //       if (err === 'denied') {
  //         console.warn('Permission to access contacts was denied');
  //         Alert.alert('Permission', 'You denied permission to access contacts');
  //       } else {
  //         let dataContacts = [];
  //
  //         try {
  //           for (let i = 0; i < contacts.length; i++) {
  //             if (
  //               contacts[i].displayName != null &&
  //               contacts[i].displayName != '' &&
  //               contacts[i].displayName != undefined &&
  //               !isEmptyArray(contacts[i].phoneNumbers)
  //             ) {
  //               let data = {
  //                 name: contacts[i].displayName,
  //                 phoneNumber: contacts[i].phoneNumbers[0].number,
  //               };
  //               dataContacts.push(data);
  //             }
  //           }
  //           dataContacts = _.sortBy(dataContacts, [
  //             function(o) {
  //               return o.name;
  //             },
  //           ]);
  //         } catch (e) {}
  //         Actions.push('contacts', {
  //           dataContacts,
  //           setPhoneNumber: this.setPhoneNumber,
  //         });
  //       }
  //     });
  //   } catch (e) {}
  //   setTimeout(() => {
  //     this.setState({loading: false});
  //   }, 1000);
  // };

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
            <Text style={styles.btnBackText}> Transfer SVC Balance </Text>
          </TouchableOpacity>
        </View>
        <Body>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <View style={{paddingHorizontal: 15, marginTop: 15}}>
              <Text style={{marginBottom: 10, fontSize: 15}}>
                Transfer Mode :{' '}
              </Text>
              <DropDownPicker
                items={[
                  {label: 'Email', value: 'email'},
                  {label: 'Mobile No', value: 'mobileNo'},
                ]}
                defaultValue={this.state.modeInvitation}
                containerStyle={{height: 50}}
                style={{
                  backgroundColor: '#fafafa',
                  borderColor: colorConfig.pageIndex.grayColor,
                  borderRadius: 0,
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item =>
                  this.setState({
                    modeInvitation: item.value,
                    email: '',
                    mobileNo: '',
                    phoneNumber: awsConfig.phoneNumberCode,
                  })
                }
              />

              {modeInvitation == 'email' ? (
                <TextInput
                  style={{height: 60, marginVertical: 10}}
                  theme={theme}
                  // mode={'outlined'}
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        marginVertical: 15,
                        flexDirection: 'row',
                        color: colorConfig.store.title,
                        borderColor: colorConfig.pageIndex.grayColor,
                        borderWidth: 1,
                        width: '100%',
                      }}>
                      <PhoneInput
                        flagStyle={{width: 35, height: 25}}
                        textStyle={{
                          fontSize: 14,
                          fontFamily: 'Poppins-Regular',
                        }}
                        style={{
                          fontSize: 15,
                          width: '100%',
                          padding: 10,
                          paddingVertical: 15,
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
                    {/*<TouchableOpacity*/}
                    {/*  style={{*/}
                    {/*    backgroundColor: colorConfig.store.defaultColor,*/}
                    {/*    marginLeft: 20,*/}
                    {/*    borderRadius: 10,*/}
                    {/*  }}*/}
                    {/*  onPress={this.accessContact}>*/}
                    {/*  <Icon*/}
                    {/*    size={30}*/}
                    {/*    name={*/}
                    {/*      Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'*/}
                    {/*    }*/}
                    {/*    style={[styles.btnBackIcon, {color: 'white'}]}*/}
                    {/*  />*/}
                    {/*</TouchableOpacity>*/}
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
                  style={{
                    color: 'white',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 20,
                  }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Body>
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
)(TransferSVC);

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
    // marginBottom: 20,
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
