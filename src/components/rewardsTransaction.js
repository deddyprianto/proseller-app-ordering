import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../config/colorConfig';
import RecentTransactionPlaceHolder from '../components/placeHolderLoading/RecentTransactionPlaceHolder';
import {movePageIndex} from '../actions/user.action';
import {afterPayment} from '../actions/account.action';

class RewardsTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentTrx: [],
    };
  }

  historyDetailPayment = item => {
    // to disable refresh timeout on page index
    this.props.dispatch(movePageIndex(false));
    Actions.historyDetailPayment({item});
  };

  goToHistory = async () => {
    try {
      await this.props.dispatch(afterPayment(false));
      Actions.reset('app', {fromPayment: true});
      // this.props.screen.navigation.navigate('History');
    } catch (e) {}
  };

  render() {
    const {intlData} = this.props;
    let {outletSingle} = this.props;
    if (outletSingle === undefined) {
      outletSingle = {};
      outletSingle.name = '';
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{intlData.messages.recentTransactions}</Text>
        <View style={styles.card}>
          {this.props.isLoading ? (
            <RecentTransactionPlaceHolder />
          ) : this.props.recentTransaction != undefined ? (
            this.props.recentTransaction.map((item, key) => (
              <View key={key}>
                {
                  <View>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => this.historyDetailPayment(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Icon
                          size={18}
                          name={
                            item.paymentType == 'Cash'
                              ? Platform.OS === 'ios'
                                ? 'ios-cash'
                                : 'md-cash'
                              : Platform.OS === 'ios'
                              ? 'ios-card'
                              : 'md-card'
                          }
                          style={styles.imageLogo}
                        />
                        <Text
                          style={{
                            marginLeft: 12,
                            color: colorConfig.store.titleSelected,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {item.outlet
                            ? item.outlet.name.substr(0, 25)
                            : outletSingle.name.substr(0, 25)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginRight: 5,
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            marginRight: 5,
                            color: colorConfig.pageIndex.grayColor,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {item.pointDebit}
                        </Text>
                        <Icon
                          size={18}
                          name={
                            Platform.OS === 'ios'
                              ? 'ios-arrow-dropright'
                              : 'md-arrow-dropright'
                          }
                          style={{
                            color: colorConfig.pageIndex.activeTintColor,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.line} />
                  </View>
                }
              </View>
            ))
          ) : null}

          <TouchableOpacity
            style={{
              alignItems: 'center',
              margin: 10,
            }}
            onPress={this.goToHistory}>
            <Text
              style={{
                color: colorConfig.store.secondaryColor,
                fontWeight: 'bold',
              }}>
              {this.props.recentTransaction != undefined
                ? this.props.recentTransaction.length == 0
                  ? intlData.messages.empty
                  : intlData.messages.seeMore
                : intlData.messages.empty}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin: 10,
  },
  title: {
    color: colorConfig.store.title,
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
    fontFamily: 'Poppins-Medium',
  },
  card: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 7,
    marginLeft: 10,
    marginRight: 10,
    borderColor: colorConfig.store.border,
    // borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  item: {
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: colorConfig.pageIndex.inactiveTintColor,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  imageLogo: {
    width: 30,
    height: 20,
    paddingTop: 5,
    marginBottom: 5,
    color: colorConfig.store.defaultColor,
  },
});

mapStateToProps = state => ({
  recentTransaction: state.rewardsReducer.dataPoint.recentTransaction,
  outletSingle: state.storesReducer.dataOutletSingle.outletSingle,
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
)(RewardsTransaction);
