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
import {isEmptyArray} from '../../helper/CheckEmpty';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colorConfig.store.defaultColor,
    accent: '#f1c40f',
  },
};

class AddAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      addressName: '',
      address: '',
      postalCode: '',
      city: '',
    };
  }

  goBack = async () => {
    Actions.replace(this.props.from);
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
        address: this.state.address,
        postalCode: this.state.postalCode,
        city: this.state.city,
      };

      data.deliveryAddress.push(newAddress);

      const response = await this.props.dispatch(updateUser(data));

      if (response) {
        await this.props.dispatch(defaultAddress(newAddress));
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
            <Text style={styles.btnBackText}> Add New Address </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{padding: 15}}>
            <TextInput
              style={{height: 50, marginVertical: 10}}
              theme={theme}
              mode={'outlined'}
              label="Address Name"
              value={this.state.addressName}
              onChangeText={text => this.setState({addressName: text})}
            />
            <TextInput
              style={{height: 60, marginVertical: 10}}
              theme={theme}
              multiline={true}
              mode={'outlined'}
              label="Address"
              value={this.state.address}
              onChangeText={text => this.setState({address: text})}
            />

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={{
                  height: 50,
                  marginVertical: 10,
                  width: '45%',
                  marginRight: 30,
                }}
                theme={theme}
                mode={'outlined'}
                label="City"
                value={this.state.city}
                onChangeText={text => this.setState({city: text})}
              />
              <TextInput
                style={{height: 50, marginVertical: 10, width: '45%'}}
                theme={theme}
                keyboardType={'numeric'}
                mode={'outlined'}
                label="Postal Code"
                value={this.state.postalCode}
                onChangeText={text => this.setState({postalCode: text})}
              />
            </View>

            <TouchableOpacity
              onPress={this.submitEdit}
              style={{
                marginTop: 40,
                backgroundColor: colorConfig.store.defaultColor,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{color: 'white', fontFamily: 'Lato-Bold', fontSize: 20}}>
                Save
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
});
