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
import {compose} from 'redux';
import {connect} from 'react-redux';
import Loader from './../loader';
import {
  getAccountPayment,
  netsclickRegister,
  registerCard,
  selectedAccount,
} from '../../actions/payment.actions';
import {defaultPaymentAccount} from '../../actions/user.action';
import RBSheet from 'react-native-raw-bottom-sheet';
import UUIDGenerator from 'react-native-uuid-generator';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {check, PERMISSIONS} from 'react-native-permissions';
import {Header} from '../layout';
import CardProfilePayment from './CardProfilePayment';
import EmptyListPayment from '../../pages/ProfilePaymentMethod/EmptyListPayment';
import {navigate} from '../../utils/navigation.utils';
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
      if (page === 'paymentDetail') {
        Actions.popTo('paymentDetail');
      } else if (page === 'sendEGift') {
        Actions.popTo('sendEGift');
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

  renderCardPaymentMethod = ({item: data}) => {
    if (data.paymentID === this.props.item.paymentID) {
      return (
        <CardProfilePayment
          isActive={this.checkSelectedAccount(data)}
          item={data}
          onPress={() => this.selectAccount(data)}
        />
      );
    }
    return null;
  };

  renderCard = () => {
    const {myCardAccount} = this.props;
    console.log(this.props.item);
    return (
      <FlatList
        data={myCardAccount}
        renderItem={this.renderCardPaymentMethod}
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
        // let rootPage = '';
        // if (page == 'paymentDetail') {
        //   rootPage = 'paymentDetail';
        // } else {
        //   rootPage = 'settleOrder';
        // }
        navigate('hostedPayment', {
          url: response.response.data.url,
          data: response.response.data,
          page,
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
      if (Platform.OS === 'android') {
        await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
          .then(result => {
            if (result === 'denied') {
              Alert.alert(
                'Sorry',
                `We can't open NETS Click because you don't give permission to access storage and phone calls on your device.`,
              );
              return;
            }
          })
          .catch(error => {});
      }
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
    return <EmptyListPayment />;
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

  handleAddPayment = () => {
    if (this.props.item.paymentID === 'Netsclick') {
      this.handleNetsClick(this.props.item);
    } else {
      this.registerCard();
    }
  };

  render() {
    const {myCardAccount, item} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loader />}

        {this.askUserToEnterCVV()}

        <Header title={'My Cards'} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {myCardAccount !== undefined && myCardAccount.length > 0
            ? this.renderCard()
            : this.renderEmptyCard()}
        </ScrollView>
        {item.allowMultipleAccount !== false ||
        (myCardAccount !== undefined && this.getCountCard()) ? (
          <View style={styles.containerBtnFix}>
            <TouchableOpacity
              onPress={this.handleAddPayment}
              style={styles.buttonBottomFixed}>
              <Icon
                size={25}
                name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
                style={{color: 'white', marginRight: 10}}
              />
              <Text style={styles.textAddCard}>Add Card</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  intlData: state.intlData,
  myCardAccount: state.cardReducer.myCardAccount.card,
  selectedAccount: state.cardReducer.selectedAccount.selectedAccount,
});

const mapDispatchToProps = dispatch => ({
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
    backgroundColor: 'white',
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
    height: 36,
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
    borderRadius: 8,
  },
  textAddCard: {
    fontSize: 14,
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
  containerBtnFix: {
    padding: 16,
  },
});
