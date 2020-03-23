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
import {movePageIndex} from '../../actions/user.action';

class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      refreshing: false,
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

  renderCard = () => {
    const {myCardAccount} = this.props;
    return (
      <FlatList
        data={myCardAccount}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.headingCard}>
              <Text style={styles.cardTextCard}>DBS</Text>
              <Text style={styles.cardTextName}>{item.paymentName}</Text>
            </View>
            <View style={styles.cardNumber}>
              <Icon
                size={40}
                name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
                style={{color: colorConfig.store.defaultColor}}
              />
            </View>
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

  render() {
    const {intlData, myCardAccount} = this.props;
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
            <Text style={styles.btnBackText}>My Card</Text>
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
            : null}
        </ScrollView>
        <TouchableOpacity
          onPress={() => Actions.addCard()}
          style={styles.buttonBottomFixed}>
          <Icon
            size={25}
            name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
            style={{color: 'white', marginRight: 10}}
          />
          <Text style={styles.textAddCard}>Add New Card</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

mapStateToProps = state => ({
  intlData: state.intlData,
  myCardAccount: state.cardReducer.myCardAccount.card,
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
    width: 90,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  headingCard: {
    flexDirection: 'column',
    // justifyContent: '',
    padding: 10,
  },
  cardNumber: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  cardTextCard: {
    fontSize: 20,
    paddingBottom: 10,
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  cardTextName: {
    fontSize: 16,
    color: colorConfig.store.title,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    letterSpacing: 2,
  },
  cardNumberText: {
    fontSize: 18,
    color: colorConfig.card.cardColor,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    // textAlign: 'center',
    letterSpacing: 2,
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
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
