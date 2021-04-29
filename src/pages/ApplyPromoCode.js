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
import colorConfig from '../config/colorConfig';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {TextInput, DefaultTheme} from 'react-native-paper';
import Loader from '../components/loader';
import {checkPromo} from '../actions/rewards.action';
import {isEmptyArray} from '../helper/CheckEmpty';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: colorConfig.store.defaultColor,
    accent: '#f1c40f',
  },
};

class ApplyPromoCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenWidth: Dimensions.get('window').width,
      promoCode: '',
    };
  }

  goBack = async () => {
    Actions.pop();
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

  applyCode = async () => {
    try {
      const {promoCode} = this.state;
      this.setState({loading: true});
      const voucher = await this.props.dispatch(checkPromo(promoCode));
      if (voucher.status !== false) {
        try {
          if (!isEmptyArray(this.props.dataVoucher)) {
            const find = this.props.dataVoucher.find(
              item => item.isVoucherPromoCode === true,
            );
            if (find) {
              let message = 'Promo code can only be used once in one order.';
              if (find.id !== voucher.id) {
                message = 'Can only apply 1 promo code in this transaction';
              }
              Alert.alert('Sorry', message);
              this.setState({loading: false});
              return;
            }

            /* Check if voucher can be mixed */
            try {
              if (
                !isEmptyArray(this.props.dataVoucher) &&
                voucher.validity &&
                voucher.validity.cannotBeMixed === true
              ) {
                this.setState({loading: false});
                Alert.alert(
                  'Sorry',
                  "Promo code can't be used with this voucher.",
                );
                return;
              }

              if (!isEmptyArray(this.props.dataVoucher)) {
                let cannotBeMixed = false;
                let voucherName = '';
                for (let i = 0; i < this.props.dataVoucher.length; i++) {
                  if (
                    this.props.dataVoucher[i].validity &&
                    this.props.dataVoucher[i].validity.cannotBeMixed === true
                  ) {
                    cannotBeMixed = true;
                    voucherName = this.props.dataVoucher[i].name;
                    break;
                  }
                }

                if (cannotBeMixed === true) {
                  this.setState({loading: false});
                  Alert.alert(
                    'Sorry',
                    "Promo code can't be used with this voucher.",
                  );
                  return;
                }
              }
            } catch (e) {}
          }
        } catch (e) {}

        if (voucher.minPurchaseAmount > 0) {
          if (Number(this.props.originalPurchase) < voucher.minPurchaseAmount) {
            Alert.alert(
              'Sorry',
              `Minimum purchase amount for using this voucher is $${
                voucher.minPurchaseAmount
              }`,
            );
            this.setState({loading: false});
            return;
          }
        }
        voucher.isVoucherPromoCode = true;
        this.props.setDataVoucher(voucher);
        Actions.pop();
      } else {
        Alert.alert('Sorry', voucher.message);
      }

      this.setState({loading: false});
    } catch (e) {
      Alert.alert(e.message, 'Something went wrong, please try again');
      this.setState({loading: false});
      this.setState({
        promoCode: '',
      });
    }
  };

  render() {
    const {promoCode} = this.state;
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
            <Text style={styles.btnBackText}> Apply Promo Code </Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View style={{paddingHorizontal: 15}}>
            <TextInput
              style={{height: 60, marginVertical: 10}}
              theme={theme}
              label="Enter Promo Code"
              value={this.state.email}
              onChangeText={text => this.setState({promoCode: text})}
            />

            <TouchableOpacity
              onPress={this.applyCode}
              disabled={promoCode === '' ? true : false}
              style={{
                marginTop: 20,
                backgroundColor:
                  promoCode === ''
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
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

mapStateToProps = state => ({
  updateUser: state.userReducer.updateUser,
  referral: state.referralReducer.getReferral.referral,
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
)(ApplyPromoCode);

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
