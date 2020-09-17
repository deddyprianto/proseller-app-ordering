import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  BackHandler,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {dataPoint, vouchers} from '../actions/rewards.action';

import colorConfig from '../config/colorConfig';
import RewardsStamp from '../components/rewardsStamp';
import RewardsStampDetail from '../components/rewardsStampDetail';
import Loader from '../components/loader';

class RewardsStamps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: [],
      isLoading: true,
      rewardPoint: 0,
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    // if (this.props.vouchers.length === 0){
    //   this.setState({ isLoading: true });
    // } else {
    this.setState({isLoading: false});
    // }
    // this.getDataVoucher();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
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

  getDataVoucher = async () => {
    await this.props.dispatch(vouchers());
    await this.props.dispatch(dataPoint());
    this.setState({isLoading: false});
  };

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataVoucher();
    this.setState({refreshing: false});
  };

  goBack = async () => {
    Actions.pop();
  };

  render() {
    const {intlData} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingLeft: 25,
              // marginBottom: -25,
              zIndex: 2,
              paddingVertical: 10,
              alignItems: 'center',
              backgroundColor: colorConfig.store.defaultColor,
              shadowColor: '#00000021',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.7,
              shadowRadius: 7.49,
              elevation: 12,
            }}>
            <TouchableOpacity style={styles.btnBack} onPress={this.goBack}>
              <Icon
                size={Platform.OS === 'ios' ? 38 : 30}
                name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'}
                style={{color: 'white'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                fontSize: 18,
                marginLeft: 20,
                fontWeight: 'bold',
              }}>
              {intlData.messages.stampsCard}
            </Text>
          </View>
          {/*<View style={styles.line} />*/}
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          {this.state.isLoading === true ? (
            <View style={styles.loading}>
              {this.state.isLoading && <Loader />}
            </View>
          ) : (
            <View>
              {/*<Text style={styles.title}>{intlData.messages.stampsCard}</Text>*/}
              <RewardsStamp />
              <RewardsStampDetail />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
  },
  title: {
    backgroundColor: colorConfig.store.defaultColor,
    color: 'white',
    marginTop: 25,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnBackIcon: {
    color: 'white',
    margin: 10,
  },
  btnBack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor,
    fontWeight: 'bold',
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor,
    borderBottomWidth: 2,
  },
  loading: {
    height: Dimensions.get('window').height - 50,
  },
  point: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
});

mapStateToProps = state => ({
  vouchers: state.rewardsReducer.vouchers.dataVoucher,
  totalPoint: state.rewardsReducer.dataPoint.totalPoint,
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
)(RewardsStamps);
