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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {defaultAddress, updateUser} from '../../actions/user.action';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from '../loader';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../../config/awsConfig';
import {
  isEmptyArray,
  isEmptyData,
  isEmptyObject,
} from '../../helper/CheckEmpty';
import {selectedAddress} from '../../actions/payment.actions';
import {getAddress, getCityAddress} from '../../actions/address.action';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import MapView from 'react-native-maps';
import CountryPicker from '../react-native-country-picker-modal';
import PhoneInput from 'react-native-phone-input';
import {navigate} from '../../utils/navigation.utils';

class AddAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      addressName: '',
      phoneNumber: awsConfig.phoneNumberCode,
      phone: '',
      recipient: '',
      address: '',
      streetName: '',
      unitNo: '',
      postalCode: '',
      city: awsConfig.COUNTRY == 'Singapore' ? awsConfig.COUNTRY : '',
      dataProvince: [],
      dataCity: [],
      loading: true,
      province: '',
      isPostalCodeValid: true,
      coordinate: this.props.coordinate,
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
    if (this.props.from == 'basket') {
      Actions.popTo(this.props.from);
    } else {
      Actions.popTo(this.props.from);
    }
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
      }

      let newAddress = {
        addressName: this.state.addressName,
        // address: this.state.address,
        unitNo: this.state.unitNo,
        streetName: this.state.streetName,
        postalCode: this.state.postalCode,
        city: this.state.city,
        recipient: this.state.recipient,
        phoneNumber: this.state.phoneNumber + this.state.phone,
      };

      newAddress.address = `${newAddress.streetName}`;

      if (newAddress.unitNo != '' && newAddress.unitNo != undefined) {
        newAddress.address = `${newAddress.address}, ${newAddress.unitNo}`;
      }

      if (newAddress.postalCode != '' && newAddress.postalCode != undefined) {
        newAddress.address = `${newAddress.address}, ${newAddress.postalCode}`;
      }

      if (!isEmptyData(this.state.province)) {
        newAddress.province = this.state.province;
      }

      if (!isEmptyObject(this.state.coordinate)) {
        newAddress.coordinate = this.state.coordinate;
      }

      data.deliveryAddress.push(newAddress);

      const response = await this.props.dispatch(updateUser(data));

      if (response) {
        if (isEmptyArray(userDetail.deliveryAddress)) {
          await this.props.dispatch(defaultAddress(newAddress));
        }
        if (this.props.from == 'basket') {
          await this.props.dispatch(selectedAddress(newAddress));
          try {
            await this.props.getDeliveryFee();
          } catch (e) {}
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

  notCompleted = () => {
    const {streetName, postalCode} = this.state;

    if (streetName !== '' && postalCode !== '') {
      if (this.state.isPostalCodeValid === false) return true;
      return false;
    }
    return true;
  };

  setCoordinate = coordinate => {
    this.setState({
      coordinate,
    });

    // if (coordinate.detailAddress !== '') {
    //   try {
    //     const streetName = `${
    //       coordinate.detailAddress.address_components[0].long_name
    //     } ${coordinate.detailAddress.address_components[1].long_name}`;
    //     this.setState({streetName});
    //   } catch (e) {}
    //
    //   try {
    //     const postalCode = `${
    //       coordinate.detailAddress.address_components.find(
    //         item => item.types[0] === 'postal_code',
    //       ).long_name
    //     }`;
    //     this.setState({postalCode});
    //
    //     const isValid = new RegExp(/((\d{6}.*)*\s)?(\d{6})([^\d].*)?$/).test(
    //       Number(postalCode),
    //     );
    //     if (isValid) {
    //       this.setState({isPostalCodeValid: true});
    //     } else {
    //       this.setState({isPostalCodeValid: false});
    //     }
    //   } catch (e) {}
    // }
  };

  render() {
    const {isPostalCodeValid} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}
        <View
          style={[
            styles.header,
            {backgroundColor: colorConfig.pageIndex.backgroundColor},
          ]}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => Actions.pop()}>
            <Icon
              size={28}
              name={
                Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'
              }
              style={styles.btnBackIcon}
            />
            <Text style={styles.btnBackText}> Add New Address </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{padding: 15}}>
          <Text style={styles.textInput}>Address Label</Text>
          <TextInput
            style={styles.input}
            autoFocus={true}
            keyboardType={'default'}
            defaultValue={this.state.addressName}
            onChangeText={text =>
              this.setState({
                addressName: text,
              })
            }
          />
          <View
            style={{
              marginVertical: 10,
              marginBottom: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={styles.badgeAddressName}
              onPress={() => {
                this.setState({addressName: 'Home'});
              }}>
              <Text style={styles.textAddressName}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.badgeAddressName}
              onPress={() => {
                this.setState({addressName: 'Work'});
              }}>
              <Text style={styles.textAddressName}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.badgeAddressName}
              onPress={() => {
                this.setState({addressName: 'School'});
              }}>
              <Text style={styles.textAddressName}>School</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.badgeAddressName}
              onPress={() => {
                this.setState({addressName: 'Office'});
              }}>
              <Text style={styles.textAddressName}>Office</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.textInput}>Recipient</Text>
          <TextInput
            style={styles.input}
            keyboardType={'default'}
            defaultValue={this.state.recipient}
            onChangeText={text =>
              this.setState({
                recipient: text,
              })
            }
          />
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
          <View>
            <Text style={styles.textInput}>Mobile No</Text>
            <View
              style={{
                flexDirection: 'row',
                color: colorConfig.store.title,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  maxWidth: '100%',
                }}>
                <PhoneInput
                  flagStyle={{
                    width: 25,
                    height: 18,
                    justifyContent: 'center',
                    marginRight: -5,
                    marginLeft: 5,
                  }}
                  textStyle={{fontSize: 0, fontFamily: 'Poppins-Regular'}}
                  style={{
                    backgroundColor: colorConfig.store.transparentBG,
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
                    paddingHorizontal: 2,
                  }}>
                  <Text
                    style={{
                      fontSize: Platform.OS === 'ios' ? 13 : 14,
                      fontFamily: 'Poppins-Regular',
                      marginTop: Platform.OS === 'ios' ? 3 : 5,
                    }}>
                    {this.state.phoneNumber}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  value={this.state.phone}
                  keyboardType={'numeric'}
                  onChangeText={value => {
                    try {
                      if (value[0] !== 0 && value[0] !== '0') {
                        this.setState({phone: value});
                      }
                    } catch (e) {
                      this.setState({phone: value});
                    }
                  }}
                  style={styles.input}
                />
              </View>
            </View>
          </View>

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

          <Text style={styles.textInput}>Street Name</Text>
          <TextInput
            style={styles.input}
            keyboardType={'default'}
            defaultValue={this.state.streetName}
            onChangeText={text =>
              this.setState({
                streetName: text,
              })
            }
          />

          <Text style={styles.textInput}>Unit No</Text>
          <TextInput
            style={styles.input}
            keyboardType={'default'}
            defaultValue={this.state.unitNo}
            onChangeText={text =>
              this.setState({
                unitNo: text,
              })
            }
          />

          {awsConfig.COUNTRY != 'Singapore' ? (
            <TextInput
              style={{
                height: 58,
                marginVertical: 8,
                fontSize: 13,
              }}
              mode={'outlined'}
              label="City"
              value={this.state.city}
              onChangeText={text => this.setState({city: text})}
            />
          ) : null}

          <Text style={styles.textInput}>Postal Code</Text>
          <TextInput
            style={styles.input}
            keyboardType={'numeric'}
            defaultValue={this.state.postalCode}
            onChangeText={text => {
              try {
                const isValid = new RegExp(
                  /((\d{6}.*)*\s)?(\d{6})([^\d].*)?$/,
                ).test(Number(text));
                if (isValid) {
                  this.setState({isPostalCodeValid: true});
                } else {
                  this.setState({isPostalCodeValid: false});
                }
              } catch (e) {}
              this.setState({postalCode: text});
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

          <TouchableOpacity
            style={{
              borderRadius: 6,
              marginTop: 5,
            }}
            onPress={() =>
              navigate('pickCoordinate', {
                setCoordinate: this.setCoordinate,
                oldCoordinate: this.state.coordinate,
                from: 'address',
              })
            }>
            <Text style={styles.textInput}>Pick Coordinate</Text>
            {!isEmptyObject(this.state.coordinate) ? (
              <>
                <MapView style={styles.map} region={this.state.coordinate} />
                <View style={styles.markerFixed}>
                  <Icon
                    size={28}
                    name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                    style={styles.btnBackIcon}
                  />
                  <Text style={styles.textPintpoint}>Edit Pinpoint</Text>
                </View>
              </>
            ) : (
              <>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: 1.29027,
                    longitude: 103.851959,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                  }}
                />
                <View style={styles.markerFixed}>
                  <Icon
                    size={28}
                    name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                    style={[
                      styles.btnBackIcon,
                      {color: colorConfig.pageIndex.grayColor},
                    ]}
                  />
                  <Text
                    style={[
                      styles.textPintpoint,
                      {color: colorConfig.pageIndex.grayColor},
                    ]}>
                    Pin Location
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>

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
              style={{
                color: 'white',
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
              }}>
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
)(AddAddress);

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
  map: {
    width: '100%',
    height: 90,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -80,
    marginTop: -5,
    position: 'absolute',
    top: '50%',
    zIndex: 99,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colorConfig.store.defaultColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textPintpoint: {
    padding: 12,
    color: colorConfig.store.defaultColor,
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  textInput: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colorConfig.store.titleSelected,
    marginTop: 20,
    paddingBottom: 7,
  },
  input: {
    borderBottomWidth: 0.7,
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    padding: 3,
    width: '100%',
  },
  badgeAddressName: {
    borderRadius: 10,
    width: 65,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colorConfig.store.defaultColor,
    marginRight: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAddressName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colorConfig.store.defaultColor,
  },
});
