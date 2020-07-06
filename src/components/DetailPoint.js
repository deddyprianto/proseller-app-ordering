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
    return (
      <SafeAreaView>
        {this.state.loading && <Loader />}
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={this.goBack}>
                <Icon
                  size={32}
                  name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                  style={{color: 'white'}}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{intlData.messages.myPoints}</Text>
              <Text style={styles.titlePoint}>{this.props.totalPoint}</Text>
            </View>
            <View style={styles.mainPanel}>
              <View style={[styles.panel, {paddingTop: 45}]}>
                <Text style={styles.subTitle}>Customer Group</Text>
                <Text style={styles.value}>
                  {userDetail != undefined
                    ? userDetail.customerGroupName.toUpperCase()
                    : ''}
                </Text>
              </View>
              {campign.points != undefined ? (
                <View style={styles.panel}>
                  <Text style={styles.subTitle}>Campaign Rules</Text>
                  <Text style={styles.simpleTextValue}>
                    Get {campign.points.netSpendToPoint1} points for every $
                    {campign.points.netSpendToPoint0} Purchases
                  </Text>
                </View>
              ) : null}
              <View style={styles.panelNoBorder}>
                <Text style={styles.subTitle}>Expiry</Text>
                {!isEmptyArray(history)
                  ? history.map(item => (
                      <View style={styles.historyPoint}>
                        <Icon
                          size={27}
                          name={
                            Platform.OS === 'ios' ? 'ios-ellipse' : 'md-list'
                          }
                          style={{
                            color: colorConfig.store.defaultColor,
                            marginRight: 10,
                          }}
                        />
                        <View>
                          <Text style={styles.simpleText}>
                            Point :{' '}
                            <Text
                              style={{color: colorConfig.store.secondaryColor}}>
                              {this.getPointInfo(item)}
                            </Text>
                          </Text>
                          <Text style={styles.simpleText}>
                            Expiry :{' '}
                            <Text
                              style={{color: colorConfig.store.secondaryColor}}>
                              {format(new Date(item.expiryDate), 'dd-MM-yyyy')}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    ))
                  : null}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorConfig.store.defaultColor,
    height: '100%',
  },
  header: {
    padding: 20,
  },
  historyPoint: {
    margin: 5,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colorConfig.pageIndex.grayColor,
  },
  mainPanel: {
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 40,
  },
  panel: {
    marginVertical: 5,
    borderBottomWidth: 1,
    paddingBottom: 15,
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
  },
  panelNoBorder: {
    marginVertical: 5,
    paddingBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    opacity: 0.7,
    fontFamily: 'Lato-Medium',
    marginBottom: 5,
    textAlign: 'center',
  },
  titlePoint: {
    color: 'white',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    color: colorConfig.pageIndex.grayColor,
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
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
    fontSize: 13,
    padding: 2,
    fontWeight: 'bold',
  },
  simpleTextValue: {
    color: colorConfig.store.secondaryColor,
    fontSize: 14,
    marginTop: 15,
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
