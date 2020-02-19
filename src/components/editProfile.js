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
  ScrollView,
  Picker,
  BackHandler,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Form, TextValidator} from 'react-native-validator-form';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';
import {updateUser} from '../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import AwesomeAlert from 'react-native-awesome-alerts';
import Loader from './loader';
import {refreshToken} from '../actions/auth.actions';

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
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    this.props.dispatch(refreshToken);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  submitEdit = async () => {
    try {
      this.setState({loading: true});
      let dataProfile = {
        username: this.props.dataDiri.username,
        phoneNumber: this.props.dataDiri.phoneNumber,
        appClientId: awsConfig.appClientId,
        cognitoPoolId: awsConfig.cognitoPoolId,
        companyId: awsConfig.companyId,
        newName: this.state.name,
        birthDate: this.state.birthDate,
        address: this.state.address,
        gender: this.state.gender,
      };
      const response = await this.props.dispatch(updateUser(dataProfile));
      if (response) {
        this.setState({
          showAlert: true,
          pesanAlert: 'Your profile updated',
          titleAlert: 'Update Success!',
        });
      } else {
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

  handleConfirm = date => {
    let newDate = new Date(date);
    let dateBirth = newDate.getDate();
    let monthBirth = newDate.getMonth() + 1;
    let birthYear = newDate.getFullYear();

    this.setState({birthDate: `${monthBirth}/${dateBirth}/${birthYear}`});
    this.hideDatePicker();
  };

  formatDate = current_datetime => {
    console.log(current_datetime, 'current_datetime');
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
        current_datetime.getDate() +
        '-' +
        months[current_datetime.getMonth()] +
        '-' +
        current_datetime.getFullYear()
      );
    } else {
      return '';
    }
  };

  render() {
    return (
      <View style={styles.container}>
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
            <Text style={styles.btnBackText}> Edit Profile </Text>
          </TouchableOpacity>
          {/*<View style={styles.line} />*/}
        </View>
        <ScrollView>
          <View style={styles.card}>
            <Form ref="form" onSubmit={this.submitEdit}>
              <View style={styles.detail}>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 2}]}>Name</Text>
                  {/*<TextValidator*/}
                  {/*  style={{marginBottom: -10}}*/}
                  {/*  name="password"*/}
                  {/*  label="password"*/}
                  {/*  validators={['required']}*/}
                  {/*  errorStyle={{*/}
                  {/*    container: {top: 5, left: 5},*/}
                  {/*    text: {color: 'red'},*/}
                  {/*    underlineValidColor:*/}
                  {/*      colorConfig.pageIndex.activeTintColor,*/}
                  {/*    underlineInvalidColor: 'red',*/}
                  {/*  }}*/}
                  {/*  errorMessages={['This field is required']}*/}
                  {/*  placeholder="Name"*/}
                  {/*  type="text"*/}
                  {/*  under*/}
                  {/*  value={this.state.name}*/}
                  {/*  onChangeText={value => this.setState({name: value})}*/}
                  {/*/>*/}
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
                    <TouchableOpacity
                      style={[styles.btnChange]}
                      onPress={() => this.btnChangeCredentials('Email')}>
                      <Text style={[styles.textChange]}>Change</Text>
                    </TouchableOpacity>
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
                    <Text style={styles.desc}>Phone Number</Text>
                    <TouchableOpacity
                      onPress={() => this.btnChangeCredentials('Phone Number')}
                      style={[styles.btnChange]}>
                      <Text style={[styles.textChange]}>Change</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{paddingTop: 12}}>
                    {this.props.dataDiri.phoneNumber}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 0}]}>Birth Date</Text>
                  <Text
                    style={{
                      paddingTop: 12,
                      borderBottomColor: colorConfig.store.defaultColor,
                      borderBottomWidth: 1,
                    }}
                    onPress={this.showDatePicker}>
                    {this.state.birthDate == ''
                      ? 'Enter Birth Date'
                      : this.formatDate(this.state.birthDate)}
                  </Text>
                  <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="date"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                  />
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 0}]}>Gender</Text>
                  <Picker
                    selectedValue={this.state.gender}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({gender: itemValue})
                    }>
                    <Picker.Item label="Select one" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                  </Picker>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.desc, {marginLeft: 2}]}>Address</Text>
                  {/*<TextValidator*/}
                  {/*  style={{marginTop: 10}}*/}
                  {/*  name="address"*/}
                  {/*  label="address"*/}
                  {/*  validators={['required']}*/}
                  {/*  errorStyle={{*/}
                  {/*    container: {top: 5, left: 5},*/}
                  {/*    text: {color: 'red'},*/}
                  {/*    underlineValidColor:*/}
                  {/*      colorConfig.pageIndex.activeTintColor,*/}
                  {/*    underlineInvalidColor: 'red',*/}
                  {/*  }}*/}
                  {/*  errorMessages={['This field is required']}*/}
                  {/*  placeholder="Your address"*/}
                  {/*  type="text"*/}
                  {/*  under*/}
                  {/*  value={this.state.address}*/}
                  {/*  onChangeText={value => this.setState({address: value})}*/}
                  {/*/>*/}
                  <TextInput
                    placeholder="Your address"
                    style={{paddingVertical: 10}}
                    value={this.state.address}
                    onChangeText={value => this.setState({address: value})}
                  />
                  <View style={{borderWidth: 0.5, borderColor: 'gray'}} />
                </View>
              </View>
            </Form>
          </View>
        </ScrollView>
        <TouchableWithoutFeedback onPress={this.submitEdit}>
          <View style={styles.primaryButton}>
            <Text style={styles.buttonText}>Save</Text>
          </View>
        </TouchableWithoutFeedback>
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
            this.state.titleAlert != 'Update Success!' ? 'Confirm' : 'Clone'
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
      </View>
    );
  }
}

mapStateToProps = state => ({
  updateUser: state.userReducer.updateUser,
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
    width: 100,
    height: 80,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 19,
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