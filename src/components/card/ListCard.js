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
  Platform,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from '../../config/colorConfig';
import awsConfig from '../../config/awsConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import Loader from './../loader';
import ProgressiveImage from '../helper/ProgressiveImage';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {getAccountPayment} from '../../actions/payment.actions';
import {defaultPaymentAccount, movePageIndex} from '../../actions/user.action';
import {isEmptyArray} from '../../helper/CheckEmpty';
import RBSheet from 'react-native-raw-bottom-sheet';

class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      refreshing: false,
      selectedAccount: {},
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
    // make event to detect page focus or not
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('willFocus', async () => {
      await this.getDataCard();
    });

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

  setDefaultAccount = async () => {
    const {selectedAccount} = this.state;
    await this.props.dispatch(defaultPaymentAccount(selectedAccount));
    this.RBSheet.close();
  };

  askUserToSelectPaymentType = () => {
    const {intlData} = this.props;
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        animationType={'fade'}
        height={210}
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
        <TouchableOpacity
          onPress={() => this.setDefaultAccount()}
          style={{
            padding: 15,
            backgroundColor: colorConfig.store.defaultColor,
            borderRadius: 15,
            width: '60%',
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            size={30}
            name={Platform.OS === 'ios' ? 'ios-save' : 'md-save'}
            style={{color: 'white'}}
          />
          <Text
            style={{
              marginLeft: 10,
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              textAlign: 'center',
            }}>
            {/*{intlData.messages.dineIn}*/}
            Set as Default
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Remove account',
              'Are you sure to remove this account from list ?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'Remove', onPress: () => console.log('OK Pressed')},
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
              fontFamily: 'Lato-Bold',
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

  checkDefaultAccount = item => {
    const {defaultAccount} = this.props;
    try {
      if (defaultAccount.accountID == item.accountID) return true;
      else return false;
    } catch (e) {
      return false;
    }
  };

  renderCard = () => {
    const {myCardAccount, item} = this.props;
    const paymentID = item.paymentID;
    return (
      <FlatList
        data={myCardAccount}
        renderItem={({item}) =>
          item.paymentID == paymentID ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({selectedAccount: item});
                this.RBSheet.open();
              }}
              style={[
                styles.card,
                {
                  backgroundColor:
                    item.details.cardType == 'visa'
                      ? colorConfig.card.otherCardColor
                      : colorConfig.card.cardColor,
                },
              ]}>
              <View style={styles.headingCard}>
                <Text style={styles.cardText}>{item.details.cardType}</Text>
                {/*<Text style={styles.cardText}>My First Card</Text>*/}
                {!this.checkDefaultAccount(item) ? (
                  <Icon
                    size={32}
                    name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                    style={{color: 'white'}}
                  />
                ) : null}
              </View>
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>
                  {item.details.maskedAccountNumber}
                </Text>
              </View>
              <View style={styles.cardName}>
                <Text style={styles.cardNameText}>
                  {item.details.firstName} {item.details.lastName}
                </Text>
                <View>
                  <Text style={styles.cardValid}>
                    {' '}
                    VALID THRU {item.details.cardExpiryMonth} /{' '}
                    {item.details.cardExpiryYear}
                  </Text>
                </View>
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
          ) : null
        }
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
          You haven't added a {item.paymentName} yet.
        </Text>
      </View>
    );
  };

  render() {
    const {intlData, myCardAccount, item} = this.props;
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
            <Text style={styles.btnBackText}>My {item.paymentName}</Text>
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
          {myCardAccount != undefined && myCardAccount.length > 0
            ? this.renderCard()
            : this.renderEmptyCard()}
        </ScrollView>
        {item.allowMultipleAccount != undefined &&
        item.allowMultipleAccount == true ? (
          <TouchableOpacity
            onPress={() => Actions.addCard()}
            style={styles.buttonBottomFixed}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
              style={{color: 'white', marginRight: 10}}
            />
            <Text style={styles.textAddCard}>ADD {item.paymentName}</Text>
          </TouchableOpacity>
        ) : myCardAccount != undefined && myCardAccount.length == 0 ? (
          <TouchableOpacity
            onPress={() => Actions.addCard()}
            style={styles.buttonBottomFixed}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
              style={{color: 'white', marginRight: 10}}
            />
            <Text style={styles.textAddCard}>ADD {item.paymentName}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  myCardAccount: state.cardReducer.myCardAccount.card,
  defaultAccount: state.userReducer.defaultPaymentAccount.defaultAccount,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ListCard);

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
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: colorConfig.store.defaultColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
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
    fontSize: 17,
    letterSpacing: 2,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  cardNumberText: {
    fontSize: 24,
    opacity: 0.6,
    color: 'white',
    // fontWeight: 'bold',
    fontFamily: 'monospace',
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
    fontFamily: 'monospace',
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
