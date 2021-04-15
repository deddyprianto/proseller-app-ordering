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
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import awsConfig from '../../config/awsConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from './../loader';
import {clearAddress, getAccountPayment} from '../../actions/payment.actions';
import {
  defaultAddress,
  getUserProfile,
  updateUser,
} from '../../actions/user.action';
import {isEmptyArray, isEmptyData} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import CryptoJS from 'react-native-crypto-js';

class ListAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      refreshing: false,
      loading: false,
      address: [],
      selectedAddress: {},
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount = async () => {
    try {
      await this.props.dispatch(getUserProfile());

      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress,
      );
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

  setDefaultAccount = async () => {
    const {selectedAddress} = this.state;
    await this.props.dispatch(defaultAddress(selectedAddress));
    this.RBSheet.close();
  };

  removeAddress = async () => {
    try {
      this.RBSheet.close();
      const {selectedAddress} = this.state;
      await this.setState({loading: true});

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
          item => item.address != selectedAddress.address,
        );

        const response = await this.props.dispatch(updateUser(data));

        if (response) {
          try {
            if (selectedAddress.address == this.props.defaultAddress.address) {
              await this.props.dispatch(defaultAddress(undefined));
            }
          } catch (e) {}
          await this.props.dispatch(clearAddress());
        } else {
          Alert.alert('Oppss..', 'Please try again.');
        }
      }

      await this.setState({loading: false});
    } catch (e) {
      await this.setState({loading: false});
      Alert.alert('Sorry', 'Something went wrong, please try again');
    }
  };

  askUserToSelectPaymentType = () => {
    const {intlData} = this.props;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'fade'}
        height={150}
        duration={10}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        customStyles={{
          container: {
            backgroundColor: colorConfig.store.textWhite,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}>
        {/*<TouchableOpacity*/}
        {/*  onPress={() => this.setDefaultAccount()}*/}
        {/*  style={{*/}
        {/*    padding: 15,*/}
        {/*    backgroundColor: colorConfig.store.defaultColor,*/}
        {/*    borderRadius: 15,*/}
        {/*    width: '60%',*/}
        {/*    marginBottom: 20,*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'center',*/}
        {/*    alignItems: 'center',*/}
        {/*  }}>*/}
        {/*  <Icon*/}
        {/*    size={30}*/}
        {/*    name={Platform.OS === 'ios' ? 'ios-save' : 'md-save'}*/}
        {/*    style={{color: 'white'}}*/}
        {/*  />*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      marginLeft: 10,*/}
        {/*      color: 'white',*/}
        {/*      fontWeight: 'bold',*/}
        {/*      fontFamily: 'Poppins-Medium',*/}
        {/*      fontSize: 18,*/}
        {/*      textAlign: 'center',*/}
        {/*    }}>*/}
        {/*    Set as Default*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity*/}
        {/*  onPress={() => {*/}
        {/*    this.RBSheet.close();*/}
        {/*    Actions.push('editAddress', {*/}
        {/*      from: 'listAddress',*/}
        {/*      myAddress: this.state.selectedAddress,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*  style={{*/}
        {/*    padding: 15,*/}
        {/*    backgroundColor: colorConfig.store.secondaryColor,*/}
        {/*    borderRadius: 15,*/}
        {/*    width: '60%',*/}
        {/*    marginBottom: 20,*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'center',*/}
        {/*    alignItems: 'center',*/}
        {/*  }}>*/}
        {/*  <Icon*/}
        {/*    size={30}*/}
        {/*    name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}*/}
        {/*    style={{color: 'white'}}*/}
        {/*  />*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      marginLeft: 10,*/}
        {/*      color: 'white',*/}
        {/*      fontWeight: 'bold',*/}
        {/*      fontFamily: 'Poppins-Medium',*/}
        {/*      fontSize: 18,*/}
        {/*      textAlign: 'center',*/}
        {/*    }}>*/}
        {/*    Edit Address*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Remove address',
              'Are you sure to remove this address from list ?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Remove', onPress: () => this.removeAddress()},
              ],
              {cancelable: true},
            );
          }}
          style={{
            padding: 15,
            backgroundColor: colorConfig.store.colorError,
            borderRadius: 15,
            width: '60%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            size={30}
            name={Platform.OS === 'ios' ? 'ios-trash' : 'md-trash'}
            style={{color: 'white'}}
          />
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
              textAlign: 'center',
            }}>
            {/*{intlData.messages.takeAway}*/}
            Remove
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  checkDefaultAddress = item => {
    const {defaultAddress} = this.props;
    try {
      if (defaultAddress.streetName == item.streetName) return true;
      else return false;
    } catch (e) {
      return false;
    }
  };

  saveCVV = () => {
    try {
      let {selectedAccount} = this.state;
      selectedAccount.details.CVV = this.state.cvv;
      this.setDefaultAccount(selectedAccount);
      this.RBCVV.close();
      this.RBSheet.close();
    } catch (e) {
      this.RBCVV.close();
      this.RBSheet.close();
      Alert.alert('Sorry', 'Can`t set CVV, please try again');
      console.log(e);
    }
  };

  renderAddress = address => {
    return (
      <FlatList
        data={address}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{width: '85%'}}
                onPress={() => this.selectAddress(item)}>
                <View style={[styles.cardContent]}>
                  <View
                    style={{
                      marginBottom: 7,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.addressName}>{item.addressName}</Text>
                    {/*{defaultAddress &&*/}
                    {/*defaultAddress.addressName === item.addressName ? (*/}
                    {/*  <View*/}
                    {/*    style={{*/}
                    {/*      marginLeft: 15,*/}
                    {/*      borderRadius: 5,*/}
                    {/*      padding: 4,*/}
                    {/*      backgroundColor: colorConfig.store.disableButton,*/}
                    {/*    }}>*/}
                    {/*    <Text*/}
                    {/*      style={{*/}
                    {/*        fontSize: 10,*/}
                    {/*        color: colorConfig.store.defaultColor,*/}
                    {/*      }}>*/}
                    {/*      Default*/}
                    {/*    </Text>*/}
                    {/*  </View>*/}
                    {/*) : null}*/}
                  </View>
                </View>
                {item.recipient && (
                  <View style={styles.cardContent}>
                    <Text style={[styles.addressName, {maxWidth: '95%'}]}>
                      {item.recipient}
                    </Text>
                  </View>
                )}
                {item.phoneNumber && (
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardText, {maxWidth: '95%'}]}>
                      {item.phoneNumber}
                    </Text>
                  </View>
                )}
                <View style={styles.cardContent}>
                  <Text style={[styles.cardText, {maxWidth: '95%'}]}>
                    {item.streetName}
                  </Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardText, {maxWidth: '95%'}]}>
                    {item.unitNo}
                  </Text>
                </View>
                {awsConfig.COUNTRY != 'Singapore' ? (
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardText, {maxWidth: '95%'}]}>
                      {item.city}
                    </Text>
                  </View>
                ) : null}
                {item.province != undefined ? (
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardText, {maxWidth: '95%'}]}>
                      {item.province}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.cardContent}>
                  <Text style={[styles.cardText, {maxWidth: '95%'}]}>
                    {item.postalCode}
                  </Text>
                </View>
                {item.coordinate ? (
                  <View style={[styles.cardContent, {marginTop: 10}]}>
                    <Icon
                      size={28}
                      name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                      style={{
                        color: colorConfig.store.defaultColor,
                        marginRight: 15,
                      }}
                    />
                    <Text
                      style={[
                        styles.cardText,
                        {color: colorConfig.store.defaultColor},
                      ]}>
                      Location already pinned.
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.cardContent, {marginTop: 20}]}>
                    <Icon
                      size={28}
                      name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'}
                      style={{
                        color: colorConfig.pageIndex.grayColor,
                        marginRight: 15,
                      }}
                    />
                    <Text style={styles.cardText}>No Location pinned.</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.outerPoint} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                maxWidth: '100%',
              }}>
              {/*<TouchableOpacity*/}
              {/*  onPress={() => this.selectAddress(item)}*/}
              {/*  style={{*/}
              {/*    backgroundColor: colorConfig.store.defaultColor,*/}
              {/*    padding: 10,*/}
              {/*    borderRadius: 10,*/}
              {/*    marginTop: 20,*/}
              {/*    justifyContent: 'center',*/}
              {/*    alignItems: 'center',*/}
              {/*    width: '45%',*/}
              {/*    marginRight: '5%',*/}
              {/*  }}>*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      fontSize: 15,*/}
              {/*      fontFamily: 'Poppins-Medium',*/}
              {/*      color: 'white',*/}
              {/*    }}>*/}
              {/*    Select*/}
              {/*  </Text>*/}
              {/*</TouchableOpacity>*/}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    Actions.editAddress({
                      from: 'listAddress',
                      myAddress: item,
                      getDeliveryFee: this.props.getDeliveryFee,
                      clearDelivery: this.props.clearDelivery,
                    });
                  }}
                  style={{
                    borderColor: colorConfig.store.defaultColor,
                    borderWidth: 1,
                    // padding: 5,
                    borderRadius: 5,
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80%',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      color: colorConfig.store.defaultColor,
                    }}>
                    Edit Address
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({selectedAddress: item});
                    this.RBSheet.open();
                  }}
                  style={{
                    borderColor: colorConfig.store.defaultColor,
                    borderWidth: 1,
                    // padding: 5,
                    borderRadius: 5,
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '15%',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Poppins-Bold',
                      color: colorConfig.store.defaultColor,
                    }}>
                    ...
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(product, index) => index.toString()}
      />
    );
  };

  getDataCard = async () => {
    await this.props.dispatch(getAccountPayment());
    await this.setState({refreshing: false});
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataCard();
  };

  renderEmptyCard = () => {
    const {intlData, item} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Text style={{fontSize: 20, color: colorConfig.pageIndex.grayColor}}>
          You haven't added a delivery address
        </Text>
      </View>
    );
  };

  addNewAddress = async () => {
    Actions.push('pickCoordinate', {from: 'listAddress'});
  };

  render() {
    const {intlData, userDetail} = this.props;
    let address = [];
    let user = {};
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      user = undefined;
    }

    if (!isEmptyArray(user.deliveryAddress)) {
      address = user.deliveryAddress;
    }

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
            <Text style={styles.btnBackText}>My Delivery Address</Text>
          </TouchableOpacity>
        </View>
        {this.askUserToSelectPaymentType()}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {!isEmptyArray(address)
            ? this.renderAddress(address)
            : this.renderEmptyCard()}
        </ScrollView>
        <TouchableOpacity
          onPress={this.addNewAddress}
          style={styles.buttonBottomFixed}>
          <Icon
            size={25}
            name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
            style={{color: 'white', marginRight: 10}}
          />
          <Text style={styles.textAddCard}>Add New Address</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  userDetail: state.userReducer.getUser.userDetails,
  defaultAddress: state.userReducer.defaultAddress.defaultAddress,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ListAddress);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.store.containerColor,
  },
  btnBackIcon: {
    marginLeft: 10,
    color: colorConfig.store.defaultColor,
    margin: 10,
  },
  header: {
    // height: ,
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
    // width: 90,
    paddingVertical: 5,
  },
  btnBackText: {
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontSize: 15,
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
    padding: 20,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#00000021',
  },
  cardContent: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  cardSelected: {
    borderWidth: 1.2,
    borderColor: colorConfig.store.defaultColor,
  },
  headingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cardNumber: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 25,
  },
  cardName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 25,
  },
  cardText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: colorConfig.pageIndex.grayColor,
  },
  cardNumberText: {
    fontSize: 24,
    opacity: 0.6,
    color: 'white',
    // fontWeight: 'bold',
    // fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 2,
  },
  cardNameText: {
    fontSize: 18,
    width: '50%',
    opacity: 0.8,
    color: 'white',
    fontWeight: 'bold',
    // fontFamily: 'Poppins-Medium',
    // textAlign: 'center',
    // letterSpacing: 2,
  },
  cardValid: {
    fontSize: 13,
    opacity: 0.6,
    color: 'white',
    // fontWeight: 'bold',
    // fontFamily: 'monospace',
    textAlign: 'center',
    // letterSpacing: 2,
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  textAddCard: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Medium',
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
  addressName: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: colorConfig.store.titleSelected,
    // marginBottom: 10,
  },
  point: {
    backgroundColor: colorConfig.store.defaultColor,
    borderRadius: 50,
    width: 15,
    height: 15,
  },
  outerPoint: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerPointUnselected: {
    borderColor: colorConfig.pageIndex.grayColor,
    borderRadius: 50,
    borderWidth: 2,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
