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
    let recentTrx = [];
    if (this.props.pointTransaction.length != 0) {
      recentTrx = await _.orderBy(
        this.props.pointTransaction,
        ['createdAt'],
        ['desc'],
      ).slice(0, 3);

      this.setState({recentTrx});
    }
  };

  historyDetailPayment = item => {
    Actions.historyDetailPayment({item});
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recent Transactions</Text>
        <View style={styles.card}>
          {this.state.recentTrx != undefined
            ? this.state.recentTrx.map((item, key) => (
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
                          <Image
                            resizeMode="stretch"
                            style={styles.imageLogo}
                            source={
                              item.paymentType == 'Cash' ? logoCash : logoVisa
                            }
                          />
                          <Text
                            style={{
                              marginLeft: 10,
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
              {this.state.recentTrx != undefined
                ? this.state.recentTrx.length == 0
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
    color: colorConfig.pageIndex.activeTintColor,
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
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    marginBottom: 20,
  },
  item: {
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
