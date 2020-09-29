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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {defaultAddress, updateUser} from '../../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../loader';
import {TextInput, DefaultTheme} from 'react-native-paper';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {isEmptyArray, isEmptyData} from '../../helper/CheckEmpty';
import Geocoder from 'react-native-geocoding';
import {selectedAddress} from '../../actions/payment.actions';
import appConfig from '../../config/appConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import {getAddress, getCityAddress} from '../../actions/address.action';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colorConfig.store.defaultColor,
    accent: '#f1c40f',
  },
};

class EditAddress extends Component {
  constructor(props) {
    super(props);

    const {myAddress} = this.props;

    const options = ['Work', 'Office', 'Home', 'School', 'Other'];

    if (!options.includes(myAddress.addressName)) {
      myAddress.addressName = 'Home';
    }

    this.state = {
      screenWidth: Dimensions.get('window').width,
      addressName: myAddress.addressName,
      address: myAddress.address,
      streetName: myAddress.streetName,
      unitNo: myAddress.unitNo,
      // oldAddress: myAddress.address,
      oldAddress: myAddress.streetName,
      postalCode: myAddress.postalCode,
      city: myAddress.city,
      province: myAddress.province == undefined ? '' : myAddress.province,
      dataProvince: [],
      dataCity: [],
      loading: true,
    };
  }

  getCity = async item => {
    try {
      await this.setState({loading: true});
      const dataCity = await this.props.dispatch(getCityAddress(item));

      await this.setState({dataCity});

      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}

    await this.setState({loading: false});
  };

  goBack = async () => {
    Actions.popTo(this.props.from);
  };

  componentDidMount = async () => {
    try {
      const dataProvince = await this.props.dispatch(getAddress());

      await this.setState({dataProvince});

      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
    } catch (e) {}
    await this.setState({loading: false});

    try {
      this.getFullAddress(this.state.oldAddress);
    } catch (e) {}
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack();
    return true;
  };

  submitEdit = async () => {
    try {
      this.setState({loading: true});

      let userDetail = {};
      try {
        // Decrypt data user
        let bytes = CryptoJS.AES.decrypt(
          this.props.userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        userDetail = {};
      }

      let data = {
        username: userDetail.username,
        deliveryAddress: [],
      };

      if (!isEmptyArray(userDetail.deliveryAddress)) {
        data.deliveryAddress = userDetail.deliveryAddress;
        data.deliveryAddress = data.deliveryAddress.filter(
          // item => item.address != this.state.oldAddress,
          item => item.streetName != this.state.oldAddress,
        );
      }

      let newAddress = {
        addressName: this.state.addressName,
        // address: this.state.address,
        streetName: this.state.streetName,
        unitNo: this.state.unitNo,
        postalCode: this.state.postalCode,
        city: this.state.city,
      };

      newAddress.address = `${newAddress.streetName}`;

      if (newAddress.unitNo != '' && newAddress.unitNo != undefined) {
        newAddress.address = `${newAddress.address}, ${newAddress.unitNo}`;
      }

      if (!isEmptyData(this.state.province)) {
        newAddress.province = this.state.province;
      }

      data.deliveryAddress.push(newAddress);

      const response = await this.props.dispatch(updateUser(data));

      if (response) {
        if (
          isEmptyArray(userDetail.deliveryAddress) ||
          userDetail.deliveryAddress.length == 1
        ) {
          await this.props.dispatch(defaultAddress(newAddress));
        }

        if (this.props.from == 'basket') {
          await this.props.dispatch(selectedAddress(newAddress));
          try {
            this.props.clearDelivery();
            this.props.getDeliveryFee();
          } catch (e) {}
        }

        if (this.props.from == 'selectAddress') {
          await this.props.dispatch(selectedAddress(newAddress));
        }

        this.goBack();
      } else {
        Alert.alert('Oppss..', 'Please try again.');
      }
      this.setState({loading: false});
    } catch (e) {
      Alert.alert(e.message, 'Something went wrong, please try again');
      this.setState({loading: false});
    }
  };

  getFullAddress = value => {
    Geocoder.init('AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4');
    if (value != '' && value != undefined)
      Geocoder.from(value)
        .then(json => {
          let location = json.results[0];

          try {
            if (awsConfig.COUNTRY !== 'Singapore') {
              let city = location.address_components.find(
                item =>
                  item.types[0] == 'administrative_area_level_2' ||
                  item.types[0] == 'locality',
              );

              this.setState({city: city.long_name});
            }

            let postalCode = location.address_components.find(
              item => item.types[0] == 'postal_code',
            );

            this.setState({postalCode: postalCode.long_name});
          } catch (e) {}
        })
        .catch(error => console.warn(error));
  };

  notCompleted = () => {
    const {addressName, address, city, postalCode} = this.state;

    if (addressName != '' && address != '') {
      return false;
    }
    return true;
  };

  render() {
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
            <Text style={styles.btnBackText}> Edit Address </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{padding: 15}}>
          <DropDownPicker
            items={[
              {label: 'Home', value: 'Home'},
              {label: 'Work', value: 'Work'},
              {label: 'School', value: 'School'},
              {label: 'Office', value: 'Office'},
              {label: 'Other', value: 'Other'},
            ]}
            defaultValue={this.state.addressName}
            containerStyle={{height: 55}}
            style={{
              backgroundColor: '#fafafa',
              borderColor: colorConfig.pageIndex.grayColor,
              borderRadius: 0,
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item =>
              this.setState({
                addressName: item.value,
              })
            }
          />

          {awsConfig.COUNTRY != 'Singapore' ? (
            <SearchableDropdown
              onItemSelect={item => {
                this.setState({province: item.name, city: '', dataCity: []});
                this.getCity(item.code);
              }}
              containerStyle={{marginTop: 15, backgroundColor: '#f2f2f2'}}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                color: 'white',
                backgroundColor: '#bbb',
                borderColor: '#bbb',
              }}
              itemTextStyle={{color: 'white'}}
              itemsContainerStyle={{maxHeight: 140}}
              items={this.state.dataProvince}
              textInputProps={{
                placeholder: 'Select Province',
                underlineColorAndroid: 'transparent',
                style: {
                  borderWidth: 1,
                  padding: 17,
                  borderColor: colorConfig.pageIndex.grayColor,
                },
              }}
            />
          ) : null}

          {awsConfig.COUNTRY != 'Singapore' ? (
            <SearchableDropdown
              onItemSelect={item => {
                this.setState({city: item.name});
              }}
              containerStyle={{marginTop: 15, backgroundColor: '#f2f2f2'}}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                color: 'white',
                backgroundColor: '#bbb',
                borderColor: '#bbb',
              }}
              itemTextStyle={{color: 'white'}}
              itemsContainerStyle={{maxHeight: 140}}
              items={this.state.dataCity}
              textInputProps={{
                placeholder: 'Select City',
                underlineColorAndroid: 'transparent',
                style: {
                  borderWidth: 1,
                  padding: 17,
                  borderColor: colorConfig.pageIndex.grayColor,
                },
              }}
            />
          ) : null}

          {/*<TextInput*/}
          {/*  style={{height: 58, marginVertical: 10, fontSize: 13}}*/}
          {/*  theme={theme}*/}
          {/*  multiline={true}*/}
          {/*  mode={'outlined'}*/}
          {/*  label="Address"*/}
          {/*  value={this.state.address}*/}
          {/*  onChangeText={text => {*/}
          {/*    this.setState({address: text});*/}
          {/*    this.getFullAddress(text);*/}
          {/*  }}*/}
          {/*/>*/}
          <TextInput
            style={{height: 58, marginVertical: 8, fontSize: 13}}
            theme={theme}
            multiline={true}
            mode={'outlined'}
            label="Street Name"
            value={this.state.streetName}
            onChangeText={text => {
              this.setState({streetName: text});
            }}
          />

          <TextInput
            style={{height: 58, marginVertical: 8, fontSize: 13}}
            theme={theme}
            multiline={true}
            mode={'outlined'}
            label="Unit No"
            value={this.state.unitNo}
            onChangeText={text => {
              this.setState({unitNo: text});
            }}
          />

          {awsConfig.COUNTRY != 'Singapore' ? (
            <TextInput
              style={{
                height: 55,
                marginVertical: 10,
              }}
              theme={theme}
              mode={'outlined'}
              label="City"
              value={this.state.city}
              onChangeText={text => this.setState({city: text})}
            />
          ) : null}

          <TextInput
            style={{height: 58, marginVertical: 8, fontSize: 13}}
            theme={theme}
            keyboardType={'numeric'}
            mode={'outlined'}
            label="Postal Code"
            value={this.state.postalCode}
            onChangeText={text => this.setState({postalCode: text})}
          />

          <TouchableOpacity
            onPress={this.submitEdit}
            disabled={this.notCompleted() ? true : false}
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
              Save
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  updateUser: state.userReducer.updateUser,
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
)(EditAddress);

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
