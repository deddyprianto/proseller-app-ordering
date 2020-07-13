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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Form} from 'react-native-validator-form';
import colorConfig from '../config/colorConfig';
import {getUserProfile, updateUser} from '../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LoaderDarker from './LoaderDarker';
import {getMandatoryFields} from '../actions/account.action';
import {isEmptyArray, isEmptyData, isEmptyObject} from '../helper/CheckEmpty';
import {formatISO, format} from 'date-fns';
import {dataPoint, getStamps} from '../actions/rewards.action';

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
      data = {
        name: this.props.dataDiri.name,
        birthDate: this.props.dataDiri.birthDate,
        address: this.props.dataDiri.address,
        gender: this.props.dataDiri.gender,
      };
    } catch (e) {
      data = {
        name: '',
        birthDate: '',
        address: '',
        gender: '',
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

    this.state = {
      screenWidth: Dimensions.get('window').width,
      name: data.name,
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
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  getMandatoryField = async () => {
    await this.setState({loading: true});
    try {
      const response = await this.props.dispatch(getMandatoryFields());
      if (!isEmptyObject(response)) {
        await this.setState({fields: response.fields});
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
        if (item.fieldName.toLowerCase() === 'address' && item.mandatory) {
          fields[index].filled = this.state.address;
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
      this.setState({loading: true});
      let dataProfile = {
        username: this.props.dataDiri.username,
        // phoneNumber: this.props.dataDiri.phoneNumber,
        newName: this.state.name,
        birthDate: this.state.birthDate,
        address: this.state.address,
        gender: this.state.gender,
      };
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
    this.setState({isDatePickerVisible: true});
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  toChangeCredentials = () => {
    let fieldToChange = {
      field: this.state.field,
      dataDiri: this.props.dataDiri,
    };
    Actions.changeCredentials(fieldToChange);
  };

  btnChangeCredentials = field => {
    // this.setState(
    //   {
    //     field,
    //   },
    //   () => {
    //     this.toChangeCredentials();
    //   },
    // );
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
    let newDate = new Date(date);
    let dateBirth = newDate.getDate();
    let monthBirth = newDate.getMonth() + 1;
    let birthYear = newDate.getFullYear();

    dateBirth = this.pad(dateBirth);
    monthBirth = this.pad(monthBirth);

    this.setState({birthDate: `${birthYear}-${monthBirth}-${dateBirth}`});
    this.hideDatePicker();
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
      const date = new Date(item);
      return `2000-${this.pad(date.getMonth() + 1)}-01`;
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

  render() {
    const {intlData} = this.props;
    const {fields} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <LoaderDarker />}
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
            <Text style={styles.btnBackText}>
              {' '}
              {intlData.messages.editProfile}{' '}
            </Text>
          </TouchableOpacity>
          {/*<View style={styles.line} />*/}
        </View>
        <KeyboardAwareScrollView>
          <View>
            <View style={styles.card}>
              <Form ref="form" onSubmit={this.checkMandatory}>
                <View style={styles.detail}>
                  <View style={styles.detailItem}>
                    <Text style={styles.desc}>{intlData.messages.name}</Text>
                    <TextInput
                      placeholder="Name"
                      style={{paddingVertical: 10}}
                      value={this.state.name}
                      onChangeText={value => this.setState({name: value})}
                    />
                    <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                  </View>
                  <View style={styles.detailItem}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.desc}>Email</Text>
                      {/*<TouchableOpacity*/}
                      {/*  style={[styles.btnChange]}*/}
                      {/*  onPress={() => this.btnChangeCredentials('Email')}>*/}
                      {/*  <Text style={[styles.textChange]}>*/}
                      {/*    {intlData.messages.change}*/}
                      {/*  </Text>*/}
                      {/*</TouchableOpacity>*/}
                    </View>
                    <Text style={{paddingTop: 12}}>
                      {this.props.dataDiri.email}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.desc}>
                        {intlData.messages.phoneNumber}
                      </Text>
                      {/*<TouchableOpacity*/}
                      {/*  onPress={() => this.btnChangeCredentials('Phone Number')}*/}
                      {/*  style={[styles.btnChange]}>*/}
                      {/*  <Text style={[styles.textChange]}>*/}
                      {/*    {intlData.messages.change}*/}
                      {/*  </Text>*/}
                      {/*</TouchableOpacity>*/}
                    </View>
                    <Text style={{paddingTop: 12}}>
                      {this.props.dataDiri.phoneNumber}
                    </Text>
                  </View>

                  {fields.map(item => {
                    if (
                      item.fieldName === 'birthDate' &&
                      item.format.length > 40 &&
                      item.show
                    )
                      return (
                        <View style={styles.detailItem}>
                          <Text style={[styles.desc, {marginLeft: 0}]}>
                            {intlData.messages.birthDate}{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <Text
                            style={{
                              paddingTop: 12,
                              borderBottomColor: colorConfig.store.defaultColor,
                              borderBottomWidth: 1,

                              paddingBottom: 5,
                            }}
                            onPress={this.showDatePicker}>
                            {this.state.birthDate == '' ||
                            this.state.birthDate == undefined ||
                            this.state.birthDate.length == 3
                              ? 'Enter Birth Date'
                              : this.formatBirthDate(this.state.birthDate)}
                          </Text>
                          <DateTimePickerModal
                            isVisible={this.state.isDatePickerVisible}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                          />
                        </View>
                      );

                    if (
                      item.fieldName === 'birthDate' &&
                      // item.format.length <= 4 &&
                      item.show
                    )
                      return (
                        <View style={styles.detailItem}>
                          <Text style={[styles.desc, {marginLeft: 0}]}>
                            Birth Month{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <DropDownPicker
                            placeholder={'Select your birth month'}
                            items={this.state.MM}
                            defaultValue={this.getMonth(this.state.birthDate)}
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
                            onChangeItem={item =>
                              this.setState({
                                birthDate: item.value,
                              })
                            }
                          />
                        </View>
                      );

                    if (
                      (item.fieldName === 'gender' ||
                        item.fieldName === 'Gender') &&
                      item.show
                    )
                      return (
                        <View style={styles.detailItem}>
                          <Text style={[styles.desc, {marginLeft: 0}]}>
                            {intlData.messages.gender}{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <DropDownPicker
                            placeholder={'Select gender'}
                            items={[
                              {label: intlData.messages.male, value: 'male'},
                              {
                                label: intlData.messages.female,
                                value: 'female',
                              },
                            ]}
                            defaultValue={this.state.gender}
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

                    if (
                      (item.fieldName === 'address' ||
                        item.fieldName === 'Address') &&
                      item.show
                    )
                      return (
                        <View style={styles.detailItem}>
                          <Text style={styles.desc}>
                            {intlData.messages.address}{' '}
                            {item.mandatory ? (
                              <Text style={{color: 'red'}}>*</Text>
                            ) : null}
                          </Text>
                          <TextInput
                            placeholder={intlData.messages.yourAddress}
                            style={{paddingVertical: 10}}
                            value={this.state.address}
                            onChangeText={value =>
                              this.setState({address: value})
                            }
                          />
                          <View
                            style={{borderWidth: 0.5, borderColor: 'gray'}}
                          />
                        </View>
                      );
                  })}
                </View>
              </Form>
            </View>
            <TouchableOpacity onPress={this.checkMandatory}>
              <View style={styles.primaryButton}>
                <Text style={styles.buttonText}>{intlData.messages.save}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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
)(AccountEditProfil);

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
    borderRadius: 40,
    padding: 12,
    alignSelf: 'stretch',
    marginLeft: 30,
    marginRight: 30,
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
