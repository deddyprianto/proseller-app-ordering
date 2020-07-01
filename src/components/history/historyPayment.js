import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import {dataTransaction} from '../../actions/sales.action';
import {notifikasi, refreshToken} from '../../actions/auth.actions';
import {isEmptyArray} from '../../helper/CheckEmpty';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import appConfig from '../../config/appConfig';

class HistoryPayment extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      refreshing: false,
    };
  }

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      ' ' +
      this.getMonth(tanggal.getMonth()) +
      ' ' +
      tanggal.getFullYear() +
      ' • ' +
      tanggal.getHours() +
      ':' +
      tanggal.getMinutes()
    );
  }

  getMonth(value) {
    var mount = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return mount[value];
  }

  historyDetailPayment = item => {
    Actions.historyDetailPayment({item});
  };

  componentDidMount = async () => {
    this.setState({refreshing: true});
    await this.props.dispatch(refreshToken());
    this.getDataHistory();
  };

  getDataHistory = async () => {
    try {
      await this.setState({refreshing: true});
      await this.props.dispatch(dataTransaction());
      // if (this.props.isSuccessGetTrx) {
      //   this.setState({refreshing: false});
      // } else {
      //   await this.props.dispatch(
      //     notifikasi(
      //       "We're Sorry...",
      //       "We can't get history transaction, please try again",
      //       console.log('Cancel Pressed'),
      //     ),
      //   );
      //   this.setState({refreshing: false});
      this.setState({refreshing: false});
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          "We're Sorry...",
          "We can't get history transaction, please try again",
          console.log('Cancel Pressed'),
        ),
      );
      console.log(error);
    }
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataHistory();
  };

  renderFooter = () => {
    let dataLength = this.props.dataLength;
    let trxLength = this.props.pointTransaction.length;

    if (!this.state.refreshing && trxLength < dataLength) {
      return <ActivityIndicator style={{color: '#000'}} />;
    } else {
      return null;
    }
  };

  handleLoadMore = () => {
    try {
      let dataLength = this.props.dataLength;
      let trxLength = this.props.pointTransaction.length;

      if (!this.state.refreshing && trxLength < dataLength) {
        this.getDataHistory();
      }
    } catch (e) {
      console.log(e);
    }
    console.log('mau load more');
  };

  format = item => {
    try {
      const curr = appConfig.appMataUang;
      item = item.replace(curr, '');
      if (curr != 'RP' && curr != 'IDR' && item.includes('.') == false) {
        return `${item}.00`;
      }
      return item;
    } catch (e) {
      return item;
    }
  };

  formatCurrency = value => {
    try {
      return this.format(CurrencyFormatter(value).match(/[a-z]+|[^a-z]+/gi)[1]);
    } catch (e) {
      return value;
    }
  };

  render() {
    const {intlData} = this.props;
    return (
      <>
        {this.props.pointTransaction == undefined ||
        this.props.pointTransaction.length == 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            <Text style={styles.empty}>{intlData.messages.noTransaction}</Text>
          </ScrollView>
        ) : (
          // <View style={styles.component}>
          <FlatList
            data={this.props.pointTransaction}
            extraData={this.props}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => this.historyDetailPayment(item)}>
                <View style={styles.sejajarSpace}>
                  <View style={styles.detail}>
                    <View style={styles.sejajarSpace}>
                      <Text style={styles.storeName}>{item.outletName}</Text>
                      {item.point > 0 ? (
                        <Text style={styles.itemType}>
                          <Text style={{color: colorConfig.store.title}}>
                            x{' '}
                          </Text>
                          {item.point + ' ' + intlData.messages.point}
                        </Text>
                      ) : null}
                    </View>
                    {!isEmptyArray(item.stamps) && item.stamps.length > 1 ? (
                      <View style={styles.sejajarSpaceFlexEnd}>
                        <Text style={styles.itemTypeStamps}>
                          <Text style={{color: colorConfig.store.title}}>
                            x{' '}
                          </Text>
                          {item.stamps.length + ' ' + intlData.messages.stamp}
                        </Text>
                      </View>
                    ) : null}
                    <View style={styles.sejajarSpace}>
                      <View style={{flexDirection: 'row'}}>
                        <Icon
                          size={18}
                          name={
                            Platform.OS === 'ios'
                              ? 'ios-pricetag'
                              : 'md-pricetag'
                          }
                          style={styles.paymentTypeLogo}
                        />
                        <Text style={styles.paymentType}>
                          {/*{appConfig.appMataUang}*/}
                          {this.formatCurrency(item.price)}
                        </Text>
                      </View>
                      <Text style={styles.paymentTgl}>
                        {this.getDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.btnDetail}>
                    <Icon
                      size={20}
                      name={
                        Platform.OS === 'ios'
                          ? 'ios-arrow-dropright-circle'
                          : 'md-arrow-dropright-circle'
                      }
                      style={{
                        color: colorConfig.pageIndex.activeTintColor,
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={this.renderFooter}
            onEndReachedThreshold={0.01}
            onEndReached={this.handleLoadMore}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: -3,
    marginBottom: 10,
    // flexDirection: 'row',
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: colorConfig.pageIndex.inactiveTintColor,
    textAlign: 'center',
    fontFamily: 'Lato-Medium',
    fontSize: 20,
    marginHorizontal: '5%',
    marginTop: 50,
  },
  item: {
    paddingVertical: 10,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    marginBottom: 10,
    borderColor: colorConfig.pageIndex.grayColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.7,
    shadowRadius: 7.49,
    elevation: 12,
  },
  sejajarSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sejajarSpaceFlexEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detail: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 5,
    width: Dimensions.get('window').width - 60,
  },
  storeName: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  paymentTgl: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontFamily: 'Lato-Medium',
  },
  paymentTypeLogo: {
    width: 20,
    // height: 15,
    marginTop: 2,
    color: colorConfig.store.defaultColor,
  },
  paymentType: {
    // paddingLeft: 10,
    color: colorConfig.store.title,
    fontWeight: 'bold',
    fontFamily: 'Lato-Medium',
  },
  itemType: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 12,
    fontFamily: 'Lato-Medium',
  },
  itemTypeStamps: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 12,
    fontFamily: 'Lato-Medium',
    alignItems: 'flex-end',
  },
  btnDetail: {
    alignItems: 'center',
    borderLeftColor: colorConfig.pageIndex.activeTintColor,
    borderLeftWidth: 1,
    width: 40,
    paddingTop: 15,
  },
});

mapStateToProps = state => ({
  pointTransaction: state.rewardsReducer.dataPoint.pointTransaction,
  isSuccessGetTrx: state.rewardsReducer.dataPoint.isSuccessGetTrx,
  dataLength: state.rewardsReducer.dataPoint.dataLength,
  page: state.rewardsReducer.dataPoint.page,
  take: state.rewardsReducer.dataPoint.take,
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
)(HistoryPayment);
