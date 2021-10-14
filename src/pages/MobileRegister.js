/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  Linking,
  TouchableHighlight,
  Alert,
  SafeAreaView,
  CheckBox,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import {createNewUser, resendOTPCognito} from '../actions/auth.actions';
import Loader from '../components/loader';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import Header from '../components/atom/header';
import generate from 'password-generation';
import {isEmptyArray} from '../helper/CheckEmpty';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {format} from 'date-fns';
import Icon from 'react-native-vector-icons/Ionicons';

const imageWidth = Dimensions.get('window').width / 2;

const styles = StyleSheet.create({
  $largeContainerSize: imageWidth,
  $largeImageSize: imageWidth - 50,
  $smallContainerSize: imageWidth / 2,
  $smallImageSize: imageWidth / 4,

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    left: -20,
  },
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signupText: {
    color: colorConfig.auth.signupText,
    fontSize: 16,
  },
  signupButton: {
    color: colorConfig.signin.signupButton,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingLeft: 10,
  },
  verifyButton: {
    color: colorConfig.signin.signupButton,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  button: {
    height: 45,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorConfig.auth.buttonText,
    textAlign: 'center',
  },
  errorText: {
    color: colorConfig.auth.errorText,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  viewLoginWith: {
    justifyContent: 'space-between',
    // paddingVertical:2,
    flexDirection: 'row',
    marginBottom: 30,
  },
  backgroundImage: {
    alignSelf: 'stretch',
    flex: 1,
  },
  logo: {
    width: '$largeImageSize',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
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
    marginBottom: 3,
  },
  desc: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
  },
});

class MobileRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: awsConfig.COMPANY_NAME,
      companyPolicyURL: awsConfig.COMPANY_POLICY_URL,
      phoneNumber: awsConfig.phoneNumberCode,
      loading: false,
      name: '',
      email: '',
      password: '',
      retypePassword: '',
      showPass: false,
      passwordInvalid: false,
    };
    this.imageWidth = new Animated.Value(styles.$largeImageSize);
  }

  generatePassword = () => {
    try {
      return generate([8], {specials: 0, nums: 2, uppers: 3, lowers: 3});
    } catch (e) {
      return 'P@ssw0rd123';
    }
  };

  submitRegister = async () => {
    this.setState({loading: true});
    const {
      fields,
      enableRegisterWithPassword,
      hideEmailOnRegistration,
    } = this.props;

    const {password, retypePassword, passwordInvalid} = this.state;
    if (passwordInvalid) {
      Alert.alert('Sorry', 'Please use a valid password');
      this.setState({loading: false});
      return;
    }

    if (password !== retypePassword) {
      Alert.alert('Sorry', 'Retype password is different from password');
      this.setState({loading: false});
      return;
    }
    if (password !== '' && password.length < 8) {
      Alert.alert('Sorry', 'Password consists of 8 characters or more');
      this.setState({loading: false});
      return;
    }

    if (!this.state.name) {
      Alert.alert('Opps', 'Name cannot be empty');
      this.setState({loading: false});
      return;
    }

    if (!this.state.email && hideEmailOnRegistration === false) {
      Alert.alert('Opps', 'Email cannot be empty');
      this.setState({loading: false});
      return;
    }

    try {
      let dataRequest = {
        username: this.props.phoneNumber,
        phoneNumber: this.props.phoneNumber,
        email: this.state.email,
        name: this.state.name,
        type: 'userPool',
        password: this.generatePassword(),
      };

      if (dataRequest.email === '' || !dataRequest.email) {
        let templateEmail = dataRequest.phoneNumber.replace('+', '');
        templateEmail = `${templateEmail}@proseller.io`;
        dataRequest.email = templateEmail;
      }

      // fill in password
      if (
        !passwordInvalid &&
        password !== '' &&
        retypePassword !== '' &&
        enableRegisterWithPassword
      ) {
        dataRequest.password = password;
      }

      for (let i = 0; i < fields.length; i++) {
        if (fields[i].signUpField) {
          if (fields[i].mandatory && !this.state[fields[i].fieldName]) {
            Alert.alert('Oppss..', `${fields[i].displayName} is Required.`);
            this.setState({loading: false});
            return;
          }
          if (this.state[fields[i].fieldName]) {
            dataRequest[[fields[i].fieldName]] = this.state[
              fields[i].fieldName
            ];
          }
        }
      }

      console.log(dataRequest, 'payload register');

      const response = await this.props.dispatch(createNewUser(dataRequest));
      if (response == true) {
        await this.sendOTP(dataRequest.phoneNumber);
        await this.setState({
          loading: false,
        });
        let phoneNumber = {
          phoneNumber: this.props.phoneNumber,
          password: dataRequest.password,
          email: this.state.email,
          fromMethod: 'mobile',
        };
        Actions.verifyRegister(phoneNumber);
      } else {
        this.setState({
          loading: false,
        });
        Alert.alert('Oopss..', response.Data.message);
      }
    } catch (error) {
      Alert.alert('Opss..', 'Something went wrong, please try again.');
      this.setState({
        loading: false,
      });
    }
  };

  sendOTP = async phoneNumber => {
    try {
      var dataRequest = {
        phoneNumber: phoneNumber,
      };
      console.log(dataRequest, 'payload send otp');
      const response = await this.props.dispatch(resendOTPCognito(dataRequest));
      console.log('send otp pada saat register ', response);
    } catch (error) {}
  };

  getMaxDate = () => {
    try {
      let year = new Date().getFullYear() - 1;
      return new Date(`${year}-12-31`);
    } catch (e) {
      return new Date();
    }
  };

  validateGender = gender => {
    try {
      if (gender === 'male' || gender === 'female') {
        return gender;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  };

  getKeyboardType = item => {
    try {
      if (item === 'number') return 'numeric';
      if (item === 'email') return 'email';
      return 'default';
    } catch (e) {
      return 'default';
    }
  };

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  pad = item => {
    try {
      item = item.toString();
      if (item.length == 1) {
        return `0${item}`;
      } else {
        return item;
      }
    } catch (e) {
      return item;
    }
  };

  handleConfirm = date => {
    this.hideDatePicker();
    let newDate = new Date(date);
    let dateBirth = newDate.getDate();
    let monthBirth = newDate.getMonth() + 1;
    let birthYear = newDate.getFullYear();

    dateBirth = this.pad(dateBirth);
    monthBirth = this.pad(monthBirth);

    this.setState({birthDate: `${birthYear}-${monthBirth}-${dateBirth}`});
  };

  formatDate = current_datetime => {
    if (current_datetime != undefined) {
      current_datetime = new Date(current_datetime);
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];
      return (
        current_datetime.getFullYear() +
        '-' +
        months[current_datetime.getMonth()] +
        '-' +
        current_datetime.getDate()
      );
    } else {
      return '';
    }
  };

  formatBirthDate = item => {
    try {
      let formatDate = 'dd-MMM-yyy';
      return format(new Date(item), formatDate);
    } catch (e) {
      return null;
    }
  };

  render() {
    const {
      intlData,
      fields,
      enableRegisterWithPassword,
      hideEmailOnRegistration,
    } = this.props;
    const {passwordInvalid} = this.state;
    return (
      <SafeAreaView style={styles.backgroundImage}>
        {this.state.loading && <Loader />}
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header titleHeader={'Mobile Register'} backButton={true} />
          <View style={{margin: 20}}>
            <View>
              <Text
                style={{
                  color: colorConfig.store.title,
                  fontSize: 15,
                  fontFamily: 'Poppins-Medium',
                }}>
                {intlData.messages.register} {intlData.messages.for}{' '}
                {this.props.phoneNumber}
              </Text>
            </View>
          </View>
          <View style={{marginHorizontal: 20}}>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingVertical: 10,
                  fontSize: 17,
                }}>
                {intlData.messages.name} <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TextInput
                placeholder={intlData.messages.fullName}
                value={this.state.name}
                onChangeText={value => this.setState({name: value})}
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  padding: 10,
                  color: colorConfig.store.title,
                  borderColor: colorConfig.pageIndex.inactiveTintColor,
                  borderWidth: 1.3,
                  borderRadius: 5,
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  color: colorConfig.pageIndex.grayColor,
                  paddingVertical: 10,
                  fontSize: 17,
                }}>
                Email
                {hideEmailOnRegistration === false ? (
                  <Text style={{color: 'red'}}>*</Text>
                ) : null}
              </Text>
              <TextInput
                placeholder={'Email'}
                keyboardType={'email-address'}
                autoCompleteType={'email'}
                value={this.state.email}
                onChangeText={value => this.setState({email: value.trim()})}
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  padding: 10,
                  color: colorConfig.store.title,
                  borderColor: colorConfig.pageIndex.inactiveTintColor,
                  borderWidth: 1.3,
                  borderRadius: 5,
                }}
              />
            </View>

            {/* Custom Fields */}
            {!isEmptyArray(fields) &&
              fields
                .filter(data => data.show && data.signUpField)
                .map(item => {
                  if (
                    item.fieldName === 'gender' ||
                    item.fieldName === 'Gender'
                  )
                    return (
                      <View>
                        <Text
                          style={{
                            color: colorConfig.pageIndex.grayColor,
                            paddingVertical: 10,
                            fontSize: 17,
                          }}>
                          {item.displayName}{' '}
                          {item.mandatory ? (
                            <Text style={{color: 'red'}}>*</Text>
                          ) : null}
                        </Text>
                        <DropDownPicker
                          placeholder={'Select gender'}
                          items={[
                            {
                              label: intlData.messages.male,
                              value: 'male',
                            },
                            {
                              label: intlData.messages.female,
                              value: 'female',
                            },
                          ]}
                          defaultValue={this.validateGender(this.state.gender)}
                          containerStyle={{height: 47}}
                          style={{
                            backgroundColor: 'white',
                            marginTop: 5,
                            borderRadius: 0,
                          }}
                          dropDownStyle={{
                            backgroundColor: '#fafafa',
                            zIndex: 3,
                          }}
                          onOpen={() => {
                            this.setState({openGender: true});
                          }}
                          onClose={() => {
                            this.setState({openGender: false});
                          }}
                          onChangeItem={item =>
                            this.setState({
                              gender: item.value,
                            })
                          }
                        />

                        {this.state.openGender ? (
                          <View style={{height: 50}} />
                        ) : null}
                      </View>
                    );

                  if (item.fieldName === 'birthDate')
                    return (
                      <View>
                        <Text
                          style={{
                            color: colorConfig.pageIndex.grayColor,
                            paddingVertical: 10,
                            fontSize: 17,
                          }}>
                          Select Birthday{' '}
                          {item.mandatory ? (
                            <Text style={{color: 'red'}}>*</Text>
                          ) : null}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Poppins-Regular',
                            padding: 10,
                            color: colorConfig.store.title,
                            borderColor:
                              colorConfig.pageIndex.inactiveTintColor,
                            borderWidth: 1.3,
                            borderRadius: 5,
                          }}
                          onPress={this.showDatePicker}>
                          {this.state.birthDate == '' ||
                          this.state.birthDate == undefined ||
                          this.state.birthDate.length == 3
                            ? 'Enter Birthday'
                            : this.formatBirthDate(this.state.birthDate)}
                        </Text>
                        <DatePicker
                          modal
                          mode={'date'}
                          androidVariant={'iosClone'}
                          maximumDate={this.getMaxDate()}
                          open={this.state.isDatePickerVisible}
                          date={
                            this.state.birthDate !== undefined &&
                            this.state.birthDate !== null &&
                            this.state.birthDate !== ''
                              ? new Date(this.state.birthDate)
                              : this.getMaxDate()
                          }
                          onConfirm={this.handleConfirm}
                          onCancel={this.hideDatePicker}
                        />
                      </View>
                    );

                  if (
                    item.fieldName !== 'postalcode' &&
                    item.fieldName !== 'gender' &&
                    item.fieldName !== 'birthDate'
                  ) {
                    if (item.dataType === 'dropdown') {
                      return (
                        <View>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.grayColor,
                              paddingVertical: 10,
                              fontSize: 17,
                            }}>
                            {item.displayName}{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <DropDownPicker
                            placeholder={item.displayName}
                            items={item.items}
                            defaultValue={this.state[item.fieldName]}
                            containerStyle={{height: 47}}
                            style={{
                              backgroundColor: 'white',
                              marginTop: 1,
                              borderRadius: 0,
                            }}
                            dropDownStyle={{
                              backgroundColor: '#fafafa',
                              zIndex: 3,
                            }}
                            onChangeItem={data => {
                              this.setState({
                                [item.fieldName]: data.value,
                              });
                            }}
                          />
                        </View>
                      );
                    } else if (item.dataType === 'checkbox') {
                      return (
                        <View
                          style={{
                            marginVertical: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.grayColor,
                              paddingVertical: 10,
                              fontSize: 17,
                            }}>
                            {item.displayName}{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <CheckBox
                            value={this.state[item.fieldName]}
                            onValueChange={e => {
                              this.setState({[item.fieldName]: e});
                            }}
                          />
                        </View>
                      );
                    } else {
                      return (
                        <View>
                          <Text
                            style={{
                              color: colorConfig.pageIndex.grayColor,
                              paddingVertical: 10,
                              fontSize: 17,
                            }}>
                            {item.displayName}{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <TextInput
                            placeholder={item.displayName}
                            style={{
                              fontSize: 14,
                              fontFamily: 'Poppins-Regular',
                              padding: 10,
                              color: colorConfig.store.title,
                              borderColor:
                                colorConfig.pageIndex.inactiveTintColor,
                              borderWidth: 1.3,
                              borderRadius: 5,
                            }}
                            value={this.state[item.fieldName]}
                            onChangeText={value =>
                              this.setState({[item.fieldName]: value})
                            }
                            keyboardType={this.getKeyboardType(item.dataType)}
                          />
                        </View>
                      );
                    }
                  }

                  if (item.fieldName === 'postalcode')
                    return (
                      <View style={styles.detailItem}>
                        <Text style={styles.desc}>
                          {item.displayName}{' '}
                          {item.mandatory ? (
                            <Text style={{color: 'red'}}>*</Text>
                          ) : null}
                        </Text>
                        <TextInput
                          keyboardType={'numeric'}
                          placeholder={item.displayName}
                          style={{paddingVertical: 10}}
                          value={this.state.postalcode}
                          onChangeText={value => {
                            try {
                              const isValid = new RegExp(
                                /((\d{6}.*)*\s)?(\d{6})([^\d].*)?$/,
                              ).test(Number(value));
                              if (isValid) {
                                this.setState({isPostalCodeValid: true});
                              } else {
                                this.setState({isPostalCodeValid: false});
                              }
                            } catch (e) {}
                            this.setState({postalcode: value});
                          }}
                        />
                        <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                        {!isPostalCodeValid && (
                          <Text
                            style={{
                              fontSize: 10,
                              fontStyle: 'italic',
                              color: colorConfig.store.colorError,
                            }}>
                            Postal code is not valid
                          </Text>
                        )}
                      </View>
                    );
                })}
            {/* Custom Fields */}

            {/* If Register with password enabled */}
            {enableRegisterWithPassword ? (
              <>
                <View>
                  <Text
                    style={{
                      color: colorConfig.pageIndex.grayColor,
                      paddingVertical: 10,
                      fontSize: 17,
                    }}>
                    Password
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      placeholder={'Password'}
                      secureTextEntry={this.state.showPass ? false : true}
                      value={this.state.password}
                      onChangeText={value => {
                        this.setState({password: value.trim()});
                        try {
                          if (
                            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)
                          ) {
                            this.setState({passwordInvalid: true});
                          } else {
                            this.setState({passwordInvalid: false});
                          }
                        } catch (e) {}
                      }}
                      style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                        padding: 10,
                        color: colorConfig.store.title,
                        borderColor: colorConfig.pageIndex.inactiveTintColor,
                        borderWidth: 1.3,
                        borderRadius: 5,
                        width: '100%',
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 20,
                      }}
                      onPress={() =>
                        this.setState({
                          showPass: !this.state.showPass,
                        })
                      }>
                      <Icon
                        name={
                          this.state.showPass == true ? 'md-eye-off' : 'md-eye'
                        }
                        size={26}
                        color={colorConfig.pageIndex.grayColor}
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordInvalid && (
                    <Text
                      style={{
                        color: colorConfig.store.colorError,
                        fontSize: 12,
                      }}>
                      Password must contain at least 1 uppercase, 1 lowercase
                      character
                    </Text>
                  )}
                </View>
                <View>
                  <Text
                    style={{
                      color: colorConfig.pageIndex.grayColor,
                      paddingVertical: 10,
                      fontSize: 17,
                    }}>
                    Retype Password
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      placeholder={'Retype your password'}
                      secureTextEntry={this.state.showPass ? false : true}
                      value={this.state.retypePassword}
                      onChangeText={value =>
                        this.setState({retypePassword: value.trim()})
                      }
                      style={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                        padding: 10,
                        width: '100%',
                        color: colorConfig.store.title,
                        borderColor: colorConfig.pageIndex.inactiveTintColor,
                        borderWidth: 1.3,
                        borderRadius: 5,
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 20,
                      }}
                      onPress={() =>
                        this.setState({
                          showPass: !this.state.showPass,
                        })
                      }>
                      <Icon
                        name={
                          this.state.showPass == true ? 'md-eye-off' : 'md-eye'
                        }
                        size={26}
                        color={colorConfig.pageIndex.grayColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : null}
            {/* If Register with password enabled */}

            <View style={{marginVertical: 40}}>
              <TouchableHighlight
                onPress={this.submitRegister}
                style={{
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor: colorConfig.store.defaultColor,
                }}>
                <Text
                  style={{
                    color: colorConfig.store.textWhite,
                    fontSize: 18,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {intlData.messages.createAccount}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{marginHorizontal: 19}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: colorConfig.pageIndex.grayColor,
                  fontFamily: 'Poppins-Regular',
                }}>
                {intlData.messages.string1}{' '}
                <Text
                  style={{
                    fontSize: 15,
                    color: colorConfig.store.defaultColor,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  {this.state.companyName}
                </Text>{' '}
                {intlData.messages.string2}
                <Text
                  style={{
                    fontSize: 15,
                    color: colorConfig.store.defaultColor,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  {this.state.companyName}
                </Text>{' '}
                {intlData.messages.string3}
                <Text
                  onPress={() => Linking.openURL(this.state.companyPolicyURL)}
                  style={{
                    color: colorConfig.store.defaultColor,
                    textDecorationLine: 'underline',
                  }}>
                  {' '}
                  {this.state.companyPolicyURL}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
mapStateToProps = state => ({
  status: state.accountsReducer.accountExist.status,
  intlData: state.intlData,
  fields: state.userReducer.customFields.fields,
  enableRegisterWithPassword:
    state.orderReducer.orderingSetting.enableRegisterWithPassword,
  hideEmailOnRegistration:
    state.orderReducer.orderingSetting.hideEmailOnRegistration,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  reduxForm({
    form: 'confirm',
  }),
)(MobileRegister);
