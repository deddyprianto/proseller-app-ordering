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
  TextInput,
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
import {registerCard} from '../../actions/payment.actions';

class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      name: '',
      loading: false,
    };
  }

  goBack = async () => {
    Actions.pop();
  };

  componentDidMount() {
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

  registerCard = async () => {
    try {
      const payload = {
        name: this.state.name,
        referenceNo: 'xxx-xxx-xx',
        paymentID: 'DBS_Wirecard',
      };

      await this.setState({loading: true});
      const response = await this.props.dispatch(registerCard(payload));
      await this.setState({loading: false});
      if (response.success == true) {
        Actions.hostedPayment({url: response.response.data.url});
      } else {
        Alert.alert('Sorry', 'Cant add credit card.');
      }
    } catch (e) {
      Alert.alert('Oppss..', 'Something went wrong, please try again.');
    }
  };

  render() {
    const {intlData} = this.props;
    const {name, loading} = this.state;
    return (
      <View style={styles.container}>
        {loading && <Loader />}
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
            <Text style={styles.btnBackText}>Add Card</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder={'Enter Card Name'}
          onChangeText={text => this.setState({name: text})}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colorConfig.store.defaultColor,
            padding: 10,
            fontSize: 17,
            margin: 10,
          }}
          multiline={false}
        />

        <TouchableOpacity
          disabled={name == '' ? true : false}
          onPress={this.registerCard}
          style={[
            styles.buttonBottomFixed,
            name == ''
              ? {backgroundColor: colorConfig.store.disableButton}
              : null,
          ]}>
          <Text style={styles.textAddCard}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

mapStateToProps = state => ({
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
)(AddCard);

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
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: colorConfig.card.cardColor,
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
    padding: 25,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
  },
  cardNumberText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    // textAlign: 'center',
    letterSpacing: 2,
  },
  buttonBottomFixed: {
    backgroundColor: colorConfig.store.defaultColor,
    padding: 15,
    margin: 10,
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
