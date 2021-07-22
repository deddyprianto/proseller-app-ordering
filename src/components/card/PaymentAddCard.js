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
import ProgressiveImage from '../helper/ProgressiveImage';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import {
  getAccountPayment,
  netsclickRegister,
  registerCard,
  selectedAccount,
} from '../../actions/payment.actions';
import {defaultPaymentAccount, movePageIndex} from '../../actions/user.action';
import RBSheet from 'react-native-raw-bottom-sheet';
import UUIDGenerator from 'react-native-uuid-generator';
import {isEmptyArray} from '../../helper/CheckEmpty';

class PaymentAddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      refreshing: false,
      cvv: '',
      selectedItem: {},
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

  saveCVV = () => {
    try {
      let {selectedItem} = this.state;
      selectedItem.details.CVV = this.state.cvv;
      this.selectAccount(selectedItem);
      this.RBSheet.close();
    } catch (e) {
      this.RBSheet.close();
      Alert.alert('Sorry', 'Can`t set CVV, please try again');
      console.log(e);
    }
  };

  askUserToEnterCVV = () => {
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
        <Text
          style={{
            color: colorConfig.pageIndex.inactiveTintColor,
            fontSize: 22,
            paddingBottom: 5,
            fontWeight: 'bold',
            fontFamily: 'Poppins-Medium',
          }}>
          Please Enter CVV
        </Text>

        <TextInput
          onChangeText={value => {
            this.setState({cvv: value});
          }}
          keyboardType={'numeric'}
          secureTextEntry={true}
          maxLength={3}
          style={{
            padding: 10,
            fontSize: 22,
            textAlign: 'center',
            fontWeight: 'bold',
            fontFamily: 'Poppins-Medium',
            color: colorConfig.pageIndex.grayColor,
            borderColor: colorConfig.pageIndex.grayColor,
            borderRadius: 10,
            borderWidth: 1.5,
            letterSpacing: 20,
            width: '35%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />

        <TouchableOpacity
          disabled={this.state.cvv.length != 3 ? true : false}
          onPress={this.saveCVV}
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor:
              this.state.cvv.length != 3
                ? colorConfig.store.disableButton
                : colorConfig.store.defaultColor,
            borderRadius: 15,
            width: '35%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              textAlign: 'center',
            }}>
            SAVE
          </Text>
        </TouchableOpacity>
      </RBSheet>
    );
  };

  isCVVRequired = item => {
    let requiredCVV = item.details.userInput.find(
      data => data.name == 'cardCVV',
    );

    if (requiredCVV != undefined && requiredCVV.required == true) {
      this.RBSheet.open();
      this.setState({selectedItem: item});
    } else {
      this.selectedAccount(item);
    }
  };

  selectAccount = async item => {
    try {
      const {page} = this.props;
      await this.props.dispatch(selectedAccount(item));
      if (page == 'paymentDetail') {
        Actions.popTo('paymentDetail');
      } else {
        Actions.popTo('settleOrder');
      }
    } catch (e) {}
  };

  checkSelectedAccount = item => {
    const {selectedAccount} = this.props;
    try {
      if (
        selectedAccount != undefined &&
        selectedAccount.accountID == item.accountID
      ) {
        return true;
      } else {
        return false;
      }
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
              onPress={() => this.selectAccount(item)}
              style={[
                styles.card,
                this.checkSelectedAccount(item) ? styles.cardSelected : null,
                {
                  backgroundColor: this.getCardIssuer(item),
                },
              ]}>
              <View style={styles.headingCard}>
                <Text style={styles.cardText}>
                  {item.details.cardIssuer.toUpperCase()}
                </Text>
                {/*<Text style={styles.cardText}>My First Card</Text>*/}
                <Icon
                  size={32}
                  name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                  style={{color: 'white'}}
                />
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
            </TouchableOpacity>
          ) : null
        }
        keyExtractor={(product, index) => index.toString()}
      />
    );
  };

  registerCard = async () => {
    const {page} = this.props;
    const {item} = this.props;
    await this.setState({loading: true});
    try {
      const paymentID = item.paymentID;
      const referenceNo = await UUIDGenerator.getRandomUUID();
      const payload = {
        referenceNo,
        paymentID,
      };

      const response = await this.props.dispatch(registerCard(payload));

      await this.setState({loading: false});

      if (response.success == true) {
        let rootPage = '';
        if (page == 'paymentDetail') {
          rootPage = 'paymentDetail';
        } else {
          rootPage = 'settleOrder';
        }

        Actions.hostedPayment({
          url: response.response.data.url,
          data: response.response.data,
          page: rootPage,
        });
      } else {
        Alert.alert('Sorry', 'Cant add credit card, please try again');
      }
    } catch (e) {
      await this.setState({loading: false});
      Alert.alert('Oppss..', 'Something went wrong, please try again.');
    }
  };

  handleNetsClick = async item => {
    try {
      await this.props.dispatch(netsclickRegister(item));
      await this.setState({loading: true});
      await this.props.dispatch(getAccountPayment());
      const {myCardAccount} = this.props;
      const selectedAccount = myCardAccount[myCardAccount.length - 1];
      await this.selectAccount(selectedAccount);
      await this.props.dispatch(defaultPaymentAccount(selectedAccount));
    } catch (e) {}
    await this.setState({loading: false});
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
        <Text
          style={{
            fontSize: 20,
            color: colorConfig.pageIndex.grayColor,
            textAlign: 'center',
          }}>
          You haven't added a {item.paymentName} yet.
        </Text>
      </View>
    );
  };

  getCountCard = () => {
    try {
      const {myCardAccount, item} = this.props;

      if (isEmptyArray(myCardAccount)) {
        return true;
      } else {
        const find = myCardAccount.find(
          data => data.paymentID == item.paymentID,
        );
        if (find == undefined) {
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      return false;
    }
  };

  getCardIssuer = item => {
    try {
      if (item.details.cardIssuer != undefined) {
        if (item.details.cardIssuer.toUpperCase() == 'VISA') {
          return colorConfig.card.otherCardColor;
        } else {
          return colorConfig.card.cardColor;
        }
      } else {
        return colorConfig.card.cardColor;
      }
    } catch (e) {
      return colorConfig.card.cardColor;
    }
  };

  render() {
    const {intlData, myCardAccount, item} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}

        {this.askUserToEnterCVV()}

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
        {item.allowMultipleAccount != false ? (
          <TouchableOpacity
            onPress={() => {
              if (item.paymentID === 'Netsclick') {
                this.handleNetsClick(item);
              } else {
                this.registerCard();
              }
            }}
            style={styles.buttonBottomFixed}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
              style={{color: 'white', marginRight: 10}}
            />
            <Text style={styles.textAddCard}>ADD {item.paymentName}</Text>
          </TouchableOpacity>
        ) : myCardAccount != undefined && this.getCountCard() ? (
          <TouchableOpacity
            onPress={() => {
              if (item.paymentID === 'Netsclick') {
                this.handleNetsClick(item);
              } else {
                this.registerCard();
              }
            }}
            style={styles.buttonBottomFixed}>
            <Icon
              size={25}
              name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
              style={{color: 'white', marginRight: 10}}
            />
            <Text style={styles.textAddCard}>ADD {item.paymentName}</Text>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  myCardAccount: state.cardReducer.myCardAccount.card,
  selectedAccount: state.cardReducer.selectedAccount.selectedAccount,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentAddCard);

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
    fontFamily: 'Poppins-Medium',
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
    alignItems: 'center',
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
    fontSize: 15,
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
  cardSelected: {
    borderWidth: 5,
    borderColor: '#f1c40f',
  },
});
