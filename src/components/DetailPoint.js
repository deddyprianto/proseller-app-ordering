import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {format} from 'date-fns';
import colorConfig from '../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import CryptoJS from 'react-native-crypto-js';
import awsConfig from '../config/awsConfig';
import {campaign, dataPoint, dataPointHistory} from '../actions/rewards.action';
import {getUserProfile} from '../actions/user.action';
import Loader from './loader';
import {isEmptyArray} from '../helper/CheckEmpty';
import LinearGradient from 'react-native-linear-gradient';

class DetailPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      loading: false,
      history: [],
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
    this.getInfoPoint();
  };

  getInfoPoint = async () => {
    await this.setState({loading: true});
    try {
      const response = await this.props.dispatch(dataPointHistory());
      if (response != false) {
        const history = response.history;
        if (!isEmptyArray(history)) {
          await this.setState({history});
        }
      }
      await this.props.dispatch(getUserProfile());
      await this.props.dispatch(campaign());
    } catch (e) {}
    await this.setState({loading: false});
  };

  componentWillUnmount() {
    try {
      this.backHandler.remove();
    } catch (e) {}
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  };

  goBack = async () => {
    Actions.pop();
  };

  roundToTwo = num => {
    return +(Math.round(num + 'e+2') + 'e-2');
  };

  getPointInfo = item => {
    try {
      if (item.pointBalance != undefined) return item.pointBalance;
      else {
        return this.roundToTwo(item.pointDebit - item.pointKredit);
      }
    } catch (e) {
      return 0;
    }
  };

  render() {
    const {intlData, campign} = this.props;
    const {history} = this.state;
    let userDetail;
    try {
      // Decrypt data user
      let bytes = CryptoJS.AES.decrypt(
        this.props.userDetail,
        awsConfig.PRIVATE_KEY_RSA,
      );
      userDetail = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      userDetail = undefined;
    }

    let color1 = `#f1c40f`;
    let color2 = `#f39c12`;
    let color3 = `#e67e22`;

    return (
      <SafeAreaView>
        {this.state.loading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={this.goBack}
                style={{alignItems: 'flex-start'}}>
                <Icon
                  size={Platform.OS === 'ios' ? 36 : 27}
                  name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                  style={{color: colorConfig.store.defaultColor}}
                />
              </TouchableOpacity>
              <Text style={styles.titleHeader}>Rewards Points</Text>
              {/*<Text style={styles.title}>{intlData.messages.myPoints}</Text>*/}
              {/*<Text style={styles.titlePoint}>{this.props.totalPoint}</Text>*/}
            </View>
            <LinearGradient
              colors={[color1, color2, color3]}
              style={styles.card}>
              <Text style={styles.textCustomerGroup}>You Have</Text>
              <View style={styles.line} />
              <Text style={styles.textPoint}>
                {this.props.totalPoint}{' '}
                <Text style={{fontSize: 23}}> {campign.name}</Text>
              </Text>
            </LinearGradient>

            <View style={styles.mainPanel}>
              <View style={[styles.panel, {paddingTop: 10}]}>
                <View style={styles.panelNoBorder}>
                  {!isEmptyArray(history)
                    ? history.map(item => (
                        <View style={styles.historyPoint}>
                          <View>
                            <Text style={styles.simpleText}>
                              <Text
                                style={{
                                  color: colorConfig.store.defaultColor,
                                  fontWeight: 'bold',
                                }}>
                                {this.getPointInfo(item)}
                              </Text>{' '}
                              points will expire on{' '}
                              {format(new Date(item.expiryDate), 'dd MMM yyyy')}
                            </Text>
                          </View>
                        </View>
                      ))
                    : null}
                </View>
              </View>

              <Text style={styles.subTitle}>{campign.campaignDesc}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    height: '100%',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  historyPoint: {
    marginTop: 15,
    borderRadius: 5,
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: colorConfig.pageIndex.grayColor,
  },
  mainPanel: {
    marginTop: -5,
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 30,
    zIndex: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10.49,
    elevation: 12,
  },
  panel: {
    marginVertical: 5,
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
  },
  panelNoBorder: {
    marginVertical: 5,
    paddingBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    opacity: 0.7,
    fontFamily: 'Lato-Medium',
    marginBottom: 5,
    textAlign: 'center',
  },
  titleHeader: {
    color: colorConfig.store.defaultColor,
    fontSize: 20,
    fontFamily: 'Lato-Medium',
    marginBottom: 5,
    textAlign: 'center',
    marginLeft: 30,
  },
  titlePoint: {
    color: 'white',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    color: colorConfig.store.titleSelected,
    fontSize: 17,
    marginVertical: 10,
    // textAlign: 'center',
    fontFamily: 'Lato-Medium',
  },
  subTitlePoint: {
    color: colorConfig.store.titleSelected,
    fontSize: 30,
    fontFamily: 'Lato-Bold',
  },
  value: {
    color: colorConfig.store.secondaryColor,
    fontSize: 37,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  simpleText: {
    color: colorConfig.store.titleSelected,
    fontSize: 16,
    padding: 2,
    fontFamily: 'Lato-Medium',
  },
  simpleTextValue: {
    color: colorConfig.store.secondaryColor,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  simpleTextValueRatio: {
    color: colorConfig.store.secondaryColor,
    fontSize: 18,
    // marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center',
    fontSize: 14,
  },
  btn: {
    color: colorConfig.pageIndex.listBorder,
    fontSize: 14,
    paddingTop: 5,
    fontWeight: 'bold',
  },
  stampsDescription: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  imageStamp: {
    height: Dimensions.get('window').height / 2,
    // borderRadius: 30,
    // marginHorizontal: 10,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  card: {
    backgroundColor: colorConfig.store.defaultColor,
    height: 180,
    marginTop: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10.49,
    elevation: 12,
  },
  textCustomerGroup: {
    color: 'white',
    marginTop: 20,
    marginLeft: 20,
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: 'Lato-Bold',
  },
  textPoint: {
    color: 'white',
    marginTop: 10,
    marginLeft: 20,
    fontSize: 35,
    fontFamily: 'Lato-Bold',
  },
  line: {
    borderBottomWidth: 2,
    marginHorizontal: 20,
    borderColor: 'white',
    marginTop: 20,
  },
});

mapStateToProps = state => ({
  campign: state.rewardsReducer.campaign.campaign,
  userDetail: state.userReducer.getUser.userDetails,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DetailPoint);
