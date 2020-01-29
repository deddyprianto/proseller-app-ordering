import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

import logoCash from '../assets/img/cash.png';
import logoVisa from '../assets/img/visa.png';
import colorConfig from '../config/colorConfig';

// action
import {dataTransaction} from '../actions/sales.action';
import * as _ from 'lodash';

class RewardsTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentTrx: [],
    };
  }

  componentDidMount = async () => {
    // let recentTrx = [];
    // if (this.props.pointTransaction.length != 0) {
    //   recentTrx = await _.orderBy(
    //     this.props.pointTransaction,
    //     ['createdAt'],
    //     ['desc'],
    //   ).slice(0, 3);
    //
    //   this.setState({recentTrx});
    // }
  };

  historyDetailPayment = item => {
    Actions.historyDetailPayment({item});
  };

  render() {
    let recentTrx = [];
    if (this.props.pointTransaction != undefined) {
      recentTrx = _.orderBy(
        this.props.pointTransaction,
        ['createdAt'],
        ['desc'],
      ).slice(0, 3);
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.card}>
          {this.props.pointTransaction != undefined
            ? recentTrx.map((item, key) => (
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
                          {/*<Image*/}
                          {/*  resizeMode="stretch"*/}
                          {/*  style={styles.imageLogo}*/}
                          {/*  source={*/}
                          {/*    item.paymentType == 'Cash' ? logoCash : logoVisa*/}
                          {/*  }*/}
                          {/*/>*/}
                          <Icon
                            size={22}
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
                              fontWeight: 'bold',
                              color: colorConfig.pageIndex.grayColor,
                              fontFamily: 'Lato-Medium',
                            }}>
                            {item.outletName}
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
                              fontFamily: 'Lato-Medium',
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
            : null}

          <TouchableOpacity
            style={{
              alignItems: 'center',
              margin: 10,
            }}
            onPress={() => this.props.screen.navigation.navigate('History')}>
            <Text
              style={{
                color: colorConfig.pageIndex.activeTintColor,
                fontWeight: 'bold',
              }}>
              {recentTrx != undefined
                ? recentTrx.length == 0
                  ? 'Empty'
                  : 'See More'
                : 'Empty'}
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
    fontFamily: 'Lato-Bold',
  },
  card: {
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    borderRadius: 15,
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
  pointTransaction: state.rewardsReducer.dataPoint.pointTransaction,
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
