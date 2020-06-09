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
import {reduxForm} from 'redux-form';
import Loader from './../loader';
import {
  getAccountPayment,
  registerCard,
  removeCard,
  selectedAddress,
} from '../../actions/payment.actions';
import {
  defaultPaymentAccount,
  getUserProfile,
  movePageIndex,
} from '../../actions/user.action';
import {
  isEmptyArray,
  isEmptyData,
  isEmptyObject,
} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';
import CryptoJS from 'react-native-crypto-js';

class SelectAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      refreshing: false,
      loading: false,
      address: [],
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount = async () => {
    try {
      const {defaultAddress, selectedAddress} = this.props;
      await this.props.dispatch(getUserProfile());

      let user = {};
      try {
        let bytes = CryptoJS.AES.decrypt(
          this.props.userDetail,
          awsConfig.PRIVATE_KEY_RSA,
        );
        user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        user = {};
      }

      let address = {};
      if (!isEmptyData(user.address)) {
        address = {
          addressName: 'My Default Address',
          address: user.address,
          postalCode: '-',
          city: '',
        };
        this.props.dispatch(selectedAddress(address));
      }

      if (!isEmptyObject(defaultAddress) && isEmptyObject(selectedAddress)) {
        this.props.dispatch(selectedAddress(defaultAddress));
      }

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

  checkDefaultAccount = item => {
    const {defaultAccount} = this.props;
    try {
      if (defaultAccount.accountID == item.accountID) return true;
      else return false;
    } catch (e) {
      return false;
    }
  };

  checkSelectedAddress = item => {
    const {selectedAddress} = this.props;
    try {
      if (
        !isEmptyObject(selectedAddress) &&
        selectedAddress.address == item.address
      ) {
        return true;
      } else return false;
    } catch (e) {
      return false;
    }
  };

  renderAddress = address => {
    return (
      <FlatList
        data={address}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              try {
                this.setState({selectedAddress: item});
                this.props.dispatch(selectedAddress(item));
                this.goBack();
              } catch (e) {}
            }}
            style={[
              styles.card,
              this.checkSelectedAddress(item) ? styles.cardSelected : null,
            ]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Address Name : </Text>
              <Text style={styles.cardText}>{item.addressName}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Address Detail : </Text>
              <Text style={[styles.cardText, {maxWidth: '60%'}]}>
                {item.address}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>City : </Text>
              <Text style={[styles.cardText, {maxWidth: '60%'}]}>
                {item.city}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Postal Code : </Text>
              <Text style={[styles.cardText, {maxWidth: '70%'}]}>
                {item.postalCode}
              </Text>
            </View>

            {this.checkDefaultAccount(item) ? (
              <View
                style={{
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  backgroundColor: colorConfig.store.transparentColor,
                  height: 40,
                  width: '35%',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  zIndex: 2,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.cardNameText,
                    {textAlign: 'center', fontSize: 12},
                  ]}>
                  DEFAULT
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
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
    Actions.replace('addAddress', {from: 'selectAddress'});
  };

  render() {
    const {intlData, defaultAddress} = this.props;
    console.log({defaultAddress});
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

    if (!isEmptyData(user.address)) {
      let tempAddress = {
        addressName: 'My Default Address',
        address: user.address,
        postalCode: '-',
        city: '-',
      };

      address.push(tempAddress);
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
  selectedAddress: state.userReducer.selectedAddress.selectedAddress,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SelectAddress);

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
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardSelected: {
    borderWidth: 4,
    borderColor: '#f1c40f',
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
    // fontFamily: 'Lato-Bold',
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
    fontFamily: 'Lato-Bold',
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
});
