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
  FlatList,
  RefreshControl,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Loader from './../loader';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {
  cancelReferral,
  referral,
  resendReferral,
} from '../../actions/referral.action';

class ListReferral extends Component {
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
      await this.props.dispatch(referral());

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

  getStatusReferral = item => {
    if (item.signUpStatus == 'PENDING' && item.purchaseStatus == 'PENDING') {
      return 'PENDING';
    }
    if (item.signUpStatus == 'DONE' && item.purchaseStatus == 'PENDING') {
      return 'CUSTOMER REGISTER';
    }
    if (item.signUpStatus == 'DONE' && item.purchaseStatus == 'DONE') {
      return 'CUSTOMER PURCHASED';
    }
  };

  cancelInvitation = async item => {
    await this.setState({loading: true});
    try {
      const response = await this.props.dispatch(cancelReferral(item.id));

      if (response != false) {
        if (response.status == false) {
          let message = 'Please try again.';
          if (response.message != undefined) message = response.message;
          Alert.alert('Oppss...', message);
        } else {
          let address = item.mobileNo != undefined ? item.mobileNo : item.email;
          Alert.alert(
            'Invitation Canceled.',
            `Your invitation to ${address} has been canceled.`,
          );
        }
      } else {
        Alert.alert('Oppss..', 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Opsss', 'Please try again');
    }
    await this.setState({loading: false});
  };

  resendInvitation = async item => {
    await this.setState({loading: true});
    try {
      const response = await this.props.dispatch(resendReferral(item.id));

      if (response != false) {
        if (response.status == false) {
          let message = 'Please try again.';
          if (response.message != undefined) message = response.message;
          Alert.alert('Oppss...', message);
        } else {
          let address = item.mobileNo != undefined ? item.mobileNo : item.email;
          Alert.alert(
            'Invitation Resent!',
            `Invitation to ${address} has been resent.`,
          );

          if (item.mobileNo != undefined) {
            Linking.openURL(response.url);
          }
        }
      } else {
        Alert.alert('Oppss..', 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Opsss', 'Please try again');
    }
    await this.setState({loading: false});
  };

  renderAddress = address => {
    return (
      <FlatList
        data={address}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>Contact : </Text>
                <Text style={styles.cardText}>
                  {item.email != undefined ? item.email : item.mobileNo}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>Status : </Text>
                <Text style={[styles.cardText, {maxWidth: '60%'}]}>
                  {this.getStatusReferral(item)}
                </Text>
              </View>
            </View>
            {item.signUpStatus == 'PENDING' ? (
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Resend Invitation ?',
                      'Are you sure want to resend this invitation ?',
                      [
                        {
                          text: 'No',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => this.resendInvitation(item),
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                  style={{
                    backgroundColor: colorConfig.store.secondaryColor,
                    padding: 8,
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      color: 'white',
                    }}>
                    Resend
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Cancel Invitation ?',
                      'Are you sure want to cancel this invitation ?',
                      [
                        {
                          text: 'No',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Yes',
                          onPress: () => this.cancelInvitation(item),
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                  style={{
                    backgroundColor: colorConfig.store.colorError,
                    padding: 8,
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Medium',
                      color: 'white',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
        keyExtractor={(product, index) => index.toString()}
      />
    );
  };

  getDataCard = async () => {
    await this.props.dispatch(referral());
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
        <Text style={{fontSize: 18, color: colorConfig.pageIndex.grayColor}}>
          You haven't sent a referral invitation yet.
        </Text>
      </View>
    );
  };

  addNewReferral = async () => {
    Actions.push('addReferral', {from: 'listReferral'});
  };

  render() {
    const {intlData, referral} = this.props;
    let dataList = [];
    let capacity = 0;
    let amount = 0;
    if (referral != undefined) {
      if (!isEmptyArray(referral.list)) {
        dataList = referral.list;
      }
      capacity = referral.capacity;
      amount = referral.amount;
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
            <Text style={styles.btnBackText}>Referral</Text>
          </TouchableOpacity>
          {referral != undefined ? (
            <Text style={[styles.btnBackText, {paddingRight: 10}]}>
              ( {amount}/{capacity} )
            </Text>
          ) : null}
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {!isEmptyArray(dataList)
            ? this.renderAddress(dataList)
            : this.renderEmptyCard()}
        </ScrollView>
        {amount < capacity ? (
          <TouchableOpacity
            onPress={this.addNewReferral}
            style={styles.buttonBottomFixed}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
              style={{color: 'white', marginRight: 10}}
            />
            <Text style={styles.textAddCard}>New Invitation</Text>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  userDetail: state.userReducer.getUser.userDetails,
  referral: state.referralReducer.getReferral.referral,
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
)(ListReferral);

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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
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
  cardSelected: {
    borderWidth: 4,
    borderColor: colorConfig.store.defaultColor,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    fontSize: 14,
    color: colorConfig.store.title,
    fontFamily: 'Poppins-Regular',
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
});
