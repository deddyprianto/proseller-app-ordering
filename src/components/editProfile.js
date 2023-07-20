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
  TouchableWithoutFeedback,
  // ScrollView,
  BackHandler,
  Platform,
  TextInput,
  SafeAreaView,
  Alert,
  CheckBox,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import DatePicker from 'react-native-date-picker';
import {Form} from 'react-native-validator-form';
import colorConfig from '../config/colorConfig';
import {getUserProfile, updateUser} from '../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LoaderDarker from './LoaderDarker';
import {getMandatoryFields} from '../actions/account.action';
import {isEmptyArray, isEmptyData} from '../helper/CheckEmpty';
import {formatISO, format} from 'date-fns';
import {dataPoint, getStamps} from '../actions/rewards.action';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from './react-native-country-picker-modal/lib';
import {getTermsConditions} from '../actions/order.action';
import GlobalInputText from './globalInputText';
import CalendarSvg from '../assets/svg/CalendareSvg';
import withHooksComponent from './HOC';
import NavbarBack from './navbar/navbarBack';
import {Body} from './layout';
import appConfig from '../config/appConfig';

const backupMandatoryFields = [
  {
    format: 'dd-MM-yyyy',
    show: true,
    sequence: 1,
    fieldName: 'birthDate',
    mandatory: true,
    displayName: '1a. Birthday (dd-MM-yyyy)',
  },
  {
    format: 'MMM',
    show: false,
    sequence: 2,
    fieldName: 'birthDate',
    mandatory: false,
    displayName: '1b. Birthday (MMM)',
  },
  {
    show: true,
    sequence: 3,
    fieldName: 'gender',
    mandatory: true,
    displayName: '2. Gender',
  },
  {
    show: true,
    sequence: 4,
    fieldName: 'address',
    mandatory: true,
    displayName: 'Address',
  },
];

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

class AccountEditProfil extends Component {
  constructor(props) {
    super(props);
    var data;
    try {
      const phoneNumber = this.props.dataDiri.phoneNumber.substr(0, 3);
      const phone = this.props.dataDiri.phoneNumber.replace(phoneNumber, '');
      data = {
        name: this.props.dataDiri.name,
        birthDate: this.props.dataDiri.birthDate,
        address: this.props.dataDiri.address,
        gender: this.props.dataDiri.gender,
        email: this.props.dataDiri.email,
        postalcode: this.props.dataDiri.postalcode,
        phoneNumber: phoneNumber,
        phone: phone,
      };
    } catch (e) {
      data = {
        name: '',
        birthDate: '',
        address: '',
        gender: '',
        email: '',
        phoneNumber: '',
        postalcode: '',
      };
    }

    const MMM = [
      {label: 'January', value: '2000-Jan-01'},
      {label: 'February', value: '2000-Feb-01'},
      {label: 'March', value: '2000-Mar-01'},
      {label: 'April', value: '2000-Apr-01'},
      {label: 'May', value: '2000-May-01'},
      {label: 'June', value: '2000-Jun-01'},
      {label: 'July', value: '2000-Jul-01'},
      {label: 'August', value: '2000-Aug-01'},
      {label: 'September', value: '2000-Sep-01'},
      {label: 'October', value: '2000-Oct-01'},
      {label: 'November', value: '2000-Nov-01'},
      {label: 'December', value: '2000-Dec-01'},
    ];

    const MM = [
      {label: 'January', value: '2000-01-01'},
      {label: 'February', value: '2000-02-01'},
      {label: 'March', value: '2000-03-01'},
      {label: 'April', value: '2000-04-01'},
      {label: 'May', value: '2000-05-01'},
      {label: 'June', value: '2000-06-01'},
      {label: 'July', value: '2000-07-01'},
      {label: 'August', value: '2000-08-01'},
      {label: 'September', value: '2000-09-01'},
      {label: 'October', value: '2000-10-01'},
      {label: 'November', value: '2000-11-01'},
      {label: 'December', value: '2000-12-01'},
    ];

    let isPostalCodeValid = true;

    try {
      if (data.postalcode !== undefined && data.postalcode !== '') {
        const isValid = new RegExp(/((\d{6}.*)*\s)?(\d{6})([^\d].*)?$/).test(
          Number(data.postalcode),
        );
        if (!isValid) isPostalCodeValid = false;
      }
    } catch (e) {}

    this.state = {
      screenWidth: Dimensions.get('window').width,
      originalData: data,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      postalcode: data.postalcode,
      phone: data.phone,
      gender: data.gender,
      birthDate: data.birthDate,
      address: data.address,
      isDatePickerVisible: false,
      showAlert: false,
      loading: false,
      field: '',
      MMM,
      MM,
      fields: [],
      openGender: false,
      openBirthDate: false,
      openModalCountry: false,
      editEmail: false,
      editPhoneNumber: false,
      appSetting: {},
      isPostalCodeValid,
      customFields: [],
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  refreshDataCustomer = async () => {
    try {
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

      if (!isEmptyData(userDetail)) {
        await this.setState({
          name: userDetail.name,
          gender: userDetail.gender,
          birthDate: userDetail.birthDate,
          address: userDetail.address,
          postalcode: userDetail.postalcode,
        });
      }
    } catch (e) {}
  };

  getMandatoryField = async () => {
    await this.setState({loading: true});
    await this.props.dispatch(getUserProfile());
    const appSetting = await this.props.dispatch(getTermsConditions());
    if (appSetting != false) this.setState({appSetting});
    await this.refreshDataCustomer();
    try {
      const response = await this.props.dispatch(getMandatoryFields());
      if (!isEmptyArray(response)) {
        await this.setState({fields: response});
        let {customFields} = this.state;
        for (let i = 0; i < response.length; i++) {
          await this.setState({
            [response[i].fieldName]: response[i].defaultValue,
          });
          if (this.props.dataDiri[response[i].fieldName]) {
            await this.setState({
              [response[i].fieldName]: this.props.dataDiri[
                response[i].fieldName
              ],
            });
          }
        }
      } else {
        await this.setState({fields: backupMandatoryFields});
      }
    } catch (e) {}
    await this.setState({loading: false});
  };

  componentDidMount() {
    try {
      this.getMandatoryField();
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

  checkMandatory = async () => {
    try {
      let {fields} = this.state;
      await fields.map((item, index) => {
        if (item.fieldName.toLowerCase() === 'birthdate' && item.mandatory) {
          fields[index].filled = this.state.birthDate;
        }
        if (item.fieldName.toLowerCase() === 'gender' && item.mandatory) {
          fields[index].filled = this.state.gender;
        }
        if (item.fieldName.toLowerCase() === 'postalcode' && item.mandatory) {
          fields[index].filled = this.state.postalcode;
        }
        if (item.mandatory) {
          fields[index].filled = this.state[item.fieldName];
        }
      });

      let passed = true;

      for (let i = 0; i < fields.length; i++) {
        if (fields[i].mandatory && isEmptyData(fields[i].filled)) {
          passed = false;
          break;
        }
      }

      if (!passed) {
        Alert.alert(
          'Are you sure want to save ?',
          'There is some mandatory information that you have not filled out.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Save',
              onPress: () => {
                this.submitEdit();
              },
            },
          ],
          {cancelable: true},
        );
        return false;
      } else {
        this.submitEdit();
      }
    } catch (e) {
      return true;
    }
  };

  submitEdit = async () => {
    try {
      let {fields} = this.state;
      this.setState({loading: true});

      if (this.state.editEmail && this.state.email == '') {
        Alert.alert('Sorry', 'Please provide a valid email');
        this.setState({loading: false});
        return;
      }

      if (this.state.editPhoneNumber && this.state.phone == '') {
        Alert.alert('Sorry', 'Please provide a valid phone number');
        this.setState({loading: false});
        return;
      }

      let dataProfile = {
        username: this.props.dataDiri.username,
        cognitoUsername: this.props.dataDiri.cognitoUsername,
        // phoneNumber: this.props.dataDiri.phoneNumber,
        newName: this.state.name,
        birthDate: this.state.birthDate,
        // address: this.state.address,
        gender: this.state.gender,
        postalcode: this.state.postalcode,
      };

      await fields.map(item => {
        if (item.show) {
          dataProfile[item.fieldName] = this.state[item.fieldName];
        }
      });

      // detect change email
      if (this.state.editEmail) {
        if (
          this.props.dataDiri.email.toLowerCase() !=
          this.state.email.toLowerCase()
        ) {
          dataProfile.newEmail = this.state.email.toLowerCase();
        }
      }

      // detect change phoneNumber
      if (this.state.editPhoneNumber) {
        if (
          this.props.dataDiri.phoneNumber !=
          this.state.phoneNumber + this.state.phone
        ) {
          dataProfile.newPhoneNumber =
            this.state.phoneNumber + this.state.phone;
        }
      }
      console.log(dataProfile);
      const response = await this.props.dispatch(updateUser(dataProfile));
      if (response) {
        await this.props.dispatch(getUserProfile());
        await this.props.dispatch(dataPoint());
        await this.props.dispatch(getStamps());
        this.setState({
          showAlert: true,
          pesanAlert: 'Your profile updated',
          titleAlert: 'Update Success!',
        });
      } else {
        await this.props.dispatch(getUserProfile());
        await this.props.dispatch(dataPoint());
        await this.props.dispatch(getStamps());
        this.setState({
          showAlert: true,
          pesanAlert: 'Something went wrong, please try again!',
          titleAlert: "We're Sorry!",
        });
      }
      this.setState({loading: false});
    } catch (e) {
      this.setState({
        showAlert: true,
        pesanAlert: 'Something went wrong, please try again!',
        titleAlert: "We're Sorry!",
      });
      this.setState({loading: false});
    }
  };

  showDatePicker = () => {
    const {disableChangeBirthday} = this.props;
    if (!disableChangeBirthday) {
      this.setState({isDatePickerVisible: true});
    } else {
      Alert.alert('Sorry', 'You have filled out the birthday form.');
    }
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  toChangeCredentials = mode => {
    const {appSetting} = this.state;
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

    if (mode === 'Email') {
      if (appSetting != undefined && !isEmptyArray(appSetting.settings)) {
        const find = appSetting.settings.find(
          item => item.settingKey === 'MaxChangeEmailPerDay',
        );
        if (find != undefined) {
          if (userDetail.changeEmailTodayCount >= find.settingValue) {
            Alert.alert(
              'Sorry',
              'You have reached the limit for changing email today.',
            );
            return;
          }
        }
      }
    } else {
      if (appSetting != undefined && !isEmptyArray(appSetting.settings)) {
        const find = appSetting.settings.find(
          item => item.settingKey === 'MaxChangePhonePerDay',
        );
        if (find != undefined) {
          if (userDetail.changePhoneTodayCount >= find.settingValue) {
            Alert.alert(
              'Sorry',
              'You have reached the limit for changing phone number today.',
            );
            return;
          }
        }
      }
    }
    Actions.changeCredentials({mode, dataDiri: this.props.dataDiri});
  };

  btnChangeCredentials = field => {
    if (field === 'email') {
      this.setState({editEmail: !this.state.editEmail});
      this.setState({email: this.state.originalData.email});
    } else if (field === 'phoneNumber') {
      this.setState({editPhoneNumber: !this.state.editPhoneNumber});
      this.setState({
        phone: this.state.originalData.phone,
        phoneNumber: this.state.originalData.phoneNumber,
      });
    }
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

  isShow = async index => {
    try {
      const {fields} = this.state;
      if (!isEmptyArray(fields) && fields[index].show != undefined) {
        if (fields[index].show == true) return true;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  isMandatory = async index => {
    try {
      const {fields} = this.state;
      if (!isEmptyArray(fields) && fields[index].mandatory != undefined) {
        if (fields[index].mandatory == true) return true;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  getMonth = item => {
    try {
      if (isEmptyData(item)) {
        return null;
      } else {
        const date = new Date(item);
        return `2000-${this.pad(date.getMonth() + 1)}-01`;
      }
    } catch (e) {
      return null;
    }
  };

  formatBirthDate = item => {
    try {
      const {fields} = this.state;
      let formatDate = 'dd-MMM-yyy';

      let find = fields.find(item => item.displayName.includes('1a. Birthday'));
      if (find != undefined && find.format != undefined) {
        formatDate = find.format;
      }

      return format(new Date(item), formatDate);
    } catch (e) {
      return null;
    }
  };

  getFormatMonth = () => {
    try {
      const {fields} = this.state;
      let find = fields.find(item => item.displayName.includes('1b. Birthday'));
      if (find != undefined && find.format != undefined) {
        if (find.format === 'MMM') {
          return this.state.MMM;
        } else {
          return this.state.MM;
        }
      }
    } catch (e) {
      return this.state.MMM;
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

  getMaxDate = () => {
    try {
      let year = new Date().getFullYear() - 1;
      return new Date(`${year}-12-31`);
    } catch (e) {
      return new Date();
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

  canSaveProfile = () => {
    let mandatoryKey = ['name', 'email', 'phoneNumber'];
    const dynamicMandatory = this.state.fields
      .filter(field => field.mandatory)
      .map(dataMap => dataMap.fieldName);
    mandatoryKey = [...mandatoryKey, ...dynamicMandatory];
    let emptyValue = [];
    mandatoryKey.forEach(key => {
      if (
        this.state[key] === undefined ||
        this.state[key] === null ||
        this.state[key] === ''
      ) {
        emptyValue.push(key);
      }
    });
    return emptyValue.length <= 0;
  };

  render() {
    const {intlData, colors, fontFamily} = this.props;
    const {fields, isPostalCodeValid, customFields} = this.state;
    const {
      disableChangePhoneNumber,
      disableChangeEmail,
      hideEmailOnRegistration,
      disableChangeBirthday,
    } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <LoaderDarker />}
        <NavbarBack title={intlData.messages.editProfile} />
        <Body>
          <KeyboardAwareScrollView>
            <View>
              <View style={styles.card}>
                <Form ref="form" onSubmit={this.checkMandatory}>
                  <View style={styles.detail}>
                    <GlobalInputText
                      value={this.state.name}
                      onChangeText={value => this.setState({name: value})}
                      placeholder="Name"
                      label="Name"
                      isMandatory
                    />
                    <GlobalInputText
                      placeholder="Email"
                      value={this.state.email}
                      onChangeText={value => this.setState({email: value})}
                      disabled
                      label="Email"
                      isMandatory
                      editable={false}
                    />
                    <View style={styles.detailItem}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={[
                            styles.desc,
                            {fontFamily: this.props.fontFamily.poppinsMedium},
                          ]}>
                          Mobile No{' '}
                          <Text
                            style={[
                              styles.mandatoryStyle,
                              {
                                fontFamily: this.props.fontFamily.poppinsMedium,
                              },
                            ]}>
                            *
                          </Text>{' '}
                        </Text>
                        {!disableChangePhoneNumber ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.toChangeCredentials('Mobile Number')
                            }
                            style={[styles.btnChange]}>
                            <Text style={[styles.textChange]}>
                              {this.state.editPhoneNumber ? 'Cancel' : 'Change'}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                      <View style={{width: 0, height: 0}}>
                        <CountryPicker
                          translation="eng"
                          withCallingCode
                          visible={this.state.openModalCountry}
                          onClose={() =>
                            this.setState({openModalCountry: false})
                          }
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
                      {!this.state.editPhoneNumber ? (
                        <Text style={{paddingTop: 12}}>
                          {this.props.dataDiri.phoneNumber}
                        </Text>
                      ) : (
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            maxWidth: '100%',
                            marginTop: 10,
                          }}>
                          <PhoneInput
                            flagStyle={{
                              width: 30,
                              height: 20,
                              justifyContent: 'center',
                              marginRight: -5,
                              marginLeft: 5,
                            }}
                            textStyle={{
                              fontSize: 0,
                              fontFamily: 'Poppins-Regular',
                            }}
                            style={{
                              padding: 5,
                              color: 'black',
                              backgroundColor: colorConfig.store.transparentBG,
                              borderRadius: 5,
                            }}
                            ref={ref => {
                              this.phone = ref;
                            }}
                            onChangePhoneNumber={() => {
                              this.setState({phone: this.phone.getValue()});
                            }}
                            value={this.state.phoneNumber}
                            onPressFlag={() => {
                              this.setState({
                                openModalCountry: true,
                              });
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                openModalCountry: true,
                              });
                            }}
                            style={{
                              justifyContent: 'center',
                              paddingHorizontal: 5,
                            }}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: 'Poppins-Regular',
                              }}>
                              {this.state.phoneNumber}
                            </Text>
                          </TouchableOpacity>
                          <TextInput
                            value={this.state.phone}
                            keyboardType={'numeric'}
                            onChangeText={value =>
                              this.setState({phone: value})
                            }
                            style={{
                              fontSize: 15,
                              fontFamily: 'Poppins-Regular',
                              paddingHorizontal: 10,
                              paddingVertical: 10,
                              color: colorConfig.store.title,
                              borderColor:
                                colorConfig.pageIndex.inactiveTintColor,
                              borderWidth: 1,
                              borderRadius: 5,
                              flex: 1,
                            }}
                          />
                        </View>
                      )}
                    </View>

                    {!isEmptyArray(fields) &&
                      fields
                        .filter(data => data.show)
                        .map(item => {
                          if (
                            item.fieldName === 'birthDate' &&
                            item.format.length > 4
                          )
                            return (
                              <>
                                <GlobalInputText
                                  label="Birthdate"
                                  isMandatory={item.mandatory}
                                  editable={
                                    appConfig.appName !== 'fareastflora'
                                  }
                                  onPressBtn={this.showDatePicker}
                                  type="button"
                                  value={this.formatBirthDate(
                                    this.state.birthDate,
                                  )}
                                  defaultValue="Birthdate"
                                  rightIcon={<CalendarSvg />}
                                />
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
                              </>
                            );

                          if (
                            item.fieldName === 'birthDate' &&
                            item.format.length <= 4
                          )
                            return (
                              <View style={styles.detailItem}>
                                <Text
                                  style={[
                                    styles.desc,
                                    {
                                      marginLeft: 0,
                                      fontFamily: fontFamily.poppinsMedium,
                                    },
                                  ]}>
                                  Birth Month{' '}
                                  {item.mandatory ? (
                                    <Text
                                      style={{
                                        color: 'red',
                                      }}>
                                      *
                                    </Text>
                                  ) : null}
                                </Text>
                                <DropDownPicker
                                  placeholder={'Select your birth month'}
                                  items={this.state.MM}
                                  defaultValue={this.getMonth(
                                    this.state.birthDate,
                                  )}
                                  containerStyle={{
                                    height: 47,
                                  }}
                                  style={[
                                    styles.dropdownContainerStyle,
                                    {
                                      borderColor: colors.greyScale2,
                                    },
                                  ]}
                                  dropDownStyle={{
                                    backgroundColor: '#fafafa',
                                    zIndex: 3,
                                  }}
                                  onChangeItem={item =>
                                    this.setState({
                                      birthDate: item.value,
                                    })
                                  }
                                  onOpen={() => {
                                    this.setState({
                                      openBirthDate: true,
                                    });
                                  }}
                                  onClose={() => {
                                    this.setState({
                                      openBirthDate: false,
                                    });
                                  }}
                                />

                                {this.state.openBirthDate ? (
                                  <View
                                    style={{
                                      height: 130,
                                    }}
                                  />
                                ) : null}
                              </View>
                            );

                          if (
                            item.fieldName === 'gender' ||
                            item.fieldName === 'Gender'
                          )
                            return (
                              <View style={styles.detailItem}>
                                <Text
                                  style={[
                                    styles.desc,
                                    {
                                      marginLeft: 0,
                                      fontFamily: fontFamily.poppinsMedium,
                                    },
                                  ]}>
                                  {intlData.messages.gender}{' '}
                                  {item.mandatory ? (
                                    <Text
                                      style={[
                                        styles.mandatoryStyle,
                                        {
                                          fontFamily: fontFamily.poppinsMedium,
                                        },
                                      ]}>
                                      *
                                    </Text>
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
                                  defaultValue={this.validateGender(
                                    this.state.gender,
                                  )}
                                  style={[
                                    styles.dropdownContainerStyle,
                                    {borderColor: colors.greyScale2},
                                  ]}
                                  dropDownStyle={{
                                    backgroundColor: '#fafafa',
                                    zIndex: 3,
                                  }}
                                  onOpen={() => {
                                    this.setState({
                                      openGender: true,
                                    });
                                  }}
                                  onClose={() => {
                                    this.setState({
                                      openGender: false,
                                    });
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

                          if (
                            item.fieldName !== 'postalcode' &&
                            item.fieldName !== 'gender' &&
                            item.fieldName !== 'birthDate'
                          ) {
                            if (item.dataType === 'dropdown') {
                              return (
                                <View style={styles.detailItem}>
                                  <Text style={[styles.desc, {marginLeft: 0}]}>
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
                                      marginTop: 5,
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
                                  style={[
                                    styles.detailItem,
                                    {
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    },
                                  ]}>
                                  <Text style={styles.desc}>
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
                                <GlobalInputText
                                  placeholder={item.displayName}
                                  value={this.state[item.fieldName]}
                                  onChangeText={value =>
                                    this.setState({[item.fieldName]: value})
                                  }
                                  label={item.displayName}
                                  isMandatory={item.mandatory}
                                  keyboardType={this.getKeyboardType(
                                    item.dataType,
                                  )}
                                />
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
                                        this.setState({
                                          isPostalCodeValid: true,
                                        });
                                      } else {
                                        this.setState({
                                          isPostalCodeValid: false,
                                        });
                                      }
                                    } catch (e) {}
                                    this.setState({postalcode: value});
                                  }}
                                />
                                <View
                                  style={{
                                    borderWidth: 0.5,
                                    borderColor: 'gray',
                                  }}
                                />
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
                  </View>
                </Form>
              </View>
              <TouchableOpacity
                disabled={!isPostalCodeValid || !this.canSaveProfile()}
                onPress={this.checkMandatory}>
                <View
                  style={
                    isPostalCodeValid && this.canSaveProfile()
                      ? styles.primaryButton
                      : styles.disabledPrimaryButton
                  }>
                  <Text style={styles.buttonText}>
                    {intlData.messages.save}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Body>
        {/*{Platform.OS != 'ios' ? (*/}
        {/*  <>*/}
        {/*    <TouchableWithoutFeedback onPress={this.submitEdit}>*/}
        {/*      <View style={styles.primaryButton}>*/}
        {/*        <Text style={styles.buttonText}>{intlData.messages.save}</Text>*/}
        {/*      </View>*/}
        {/*    </TouchableWithoutFeedback>*/}
        {/*  </>*/}
        {/*) : null}*/}
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.titleAlert}
          message={this.state.pesanAlert}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="Close"
          confirmText={
            this.state.titleAlert != 'Update Success!' ? 'Confirm' : 'Close'
          }
          confirmButtonColor={colorConfig.pageIndex.activeTintColor}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            if (this.state.titleAlert == 'Update Success!') {
              this.hideAlert();
              this.goBack();
            }
            if (this.state.titleAlert == "We're Sorry!") {
              this.hideAlert();
            }
            // if (this.state.titleAlert == 'Confirmation code has been sent!') {
            //   this.hideAlert();
            //   this.toChangeCredentials();
            // }
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  userDetail: state.userReducer.getUser.userDetails,
  updateUser: state.userReducer.updateUser,
  disableChangeEmail: state.orderReducer.orderingSetting.disableChangeEmail,
  disableChangePhoneNumber:
    state.orderReducer.orderingSetting.disableChangePhoneNumber,
  disableChangeBirthday:
    state.orderReducer.orderingSetting.disableChangeBirthday,
  hideEmailOnRegistration:
    state.orderReducer.orderingSetting.hideEmailOnRegistration,
  intlData: state.intlData,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default withHooksComponent(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    ),
  )(AccountEditProfil),
);

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
    // height: 65,
    paddingVertical: 6,
    marginBottom: 16,
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
    marginTop: 25,
    borderRadius: 8,
    padding: 8,
    alignSelf: 'stretch',
    marginLeft: 16,
    marginRight: 16,
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
  disabledPrimaryButton: {
    opacity: 0.3,
    borderColor: colorConfig.pageIndex.activeTintColor,
    backgroundColor: colorConfig.pageIndex.activeTintColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    borderRadius: 8,
    padding: 8,
    alignSelf: 'stretch',
    marginLeft: 16,
    marginRight: 16,
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
    fontSize: 14,
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  card: {
    marginTop: 20,
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
    paddingHorizontal: 16,
  },
  detailItem: {
    justifyContent: 'space-between',
    // borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    // borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 3,
    marginTop: 16,
  },
  desc: {
    fontSize: 14,
  },
  textChange: {
    color: colorConfig.store.defaultColor,
    // color: 'gray',
    fontSize: 13,
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
  mandatoryStyle: {
    color: '#CE1111',
  },
  dropdownContainerStyle: {
    backgroundColor: 'white',
    marginTop: 4,
    borderRadius: 0,
    paddingVertical: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
