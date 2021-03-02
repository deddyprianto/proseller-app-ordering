import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../../config/colorConfig';
import {Actions} from 'react-native-router-flux';
import {notifikasi} from '../../actions/auth.actions';
import {getCart, getPendingCart, setCart} from '../../actions/order.action';
import {isEmptyArray} from '../../helper/CheckEmpty';
import CurrencyFormatter from '../../helper/CurrencyFormatter';
import appConfig from '../../config/appConfig';

class HistoryPayment extends Component {
  constructor(props) {
    super(props);
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
      this.pad(tanggal.getHours()) +
      ':' +
      this.pad(tanggal.getMinutes())
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

  gotToBasket = async item => {
    if (item != undefined) {
      await this.props.dispatch(setCart(item));
      if (
        item.status == 'PROCESSING' ||
        item.status == 'READY_FOR_COLLECTION' ||
        item.status == 'READY_FOR_DELIVERY' ||
        item.status == 'ON_THE_WAY'
      ) {
        Actions.waitingFood({myCart: item, isPop: true});
      } else {
        Actions.cart({myCart: item});
      }
    }
  };

  componentDidMount = async () => {
    this.setState({refreshing: true});
    this.getDataHistory();
    // try {
    //   clearInterval(this.interval);
    //   this.interval = setInterval(() => {
    //     this.props.dispatch(getPendingCart());
    //   }, 60000);
    // } catch (e) {}
  };

  componentWillUnmount() {
    try {
      clearInterval(this.interval);
    } catch (e) {}
  }

  getDataHistory = async () => {
    try {
      await this.setState({refreshing: true});
      await this.props.dispatch(getPendingCart());
      await this.setState({refreshing: false});
    } catch (error) {
      await this.props.dispatch(
        notifikasi(
          "We're Sorry...",
          "We can't get pending cart, please try again",
          console.log('Cancel Pressed'),
        ),
      );
      console.log(error);
    }
  };

  loadMoreHistory = async () => {
    try {
      await this.setState({refreshing: true});
      const payload = {
        skip: this.props.pendingCart.length,
        take: 10,
      };
      await this.props.dispatch(getPendingCart(payload));
      await this.setState({refreshing: false});
    } catch (error) {
      console.log(error);
    }
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.getDataHistory();
  };

  // renderFooter = () => {
  //   let dataLength = this.props.dataLength;
  //   let trxLength = this.props.pointTransaction.length;
  //
  //   if (!this.state.refreshing && trxLength < dataLength) {
  //     return <ActivityIndicator style={{color: '#000'}} />;
  //   } else {
  //     return null;
  //   }
  // };
  //
  // handleLoadMore = () => {
  //   try {
  //     let dataLength = this.props.dataLength;
  //     let trxLength = this.props.pointTransaction.length;
  //
  //     if (!this.state.refreshing && trxLength < dataLength) {
  //       this.getDataHistory();
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   console.log('mau load more');
  // };

  getStatusText = item => {
    try {
      if (item === 'SUBMITTED') {
        return 'Submitted';
      } else if (item === 'CONFIRMED') {
        return 'Confirmed';
      } else if (item === 'PROCESSING') {
        return 'Processing';
      } else if (item === 'READY_FOR_COLLECTION') {
        return 'Ready for Collection';
      } else if (item === 'READY_FOR_DELIVERY') {
        return 'Ready for Delivery';
      } else if (item === 'ON_THE_WAY') {
        return 'On The Way';
      } else {
        return item;
      }
    } catch (e) {}
  };

  formatCurrency = value => {
    try {
      return this.format(CurrencyFormatter(value).match(/[a-z]+|[^a-z]+/gi)[1]);
    } catch (e) {
      return value;
    }
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

  pad = item => {
    let time = item.toString();
    if (time.length == 1) return `0${item}`;
    else return item;
  };

  getPrice = item => {
    try {
      if (
        item.confirmationInfo != undefined &&
        item.confirmationInfo.afterPrice != undefined
      ) {
        return this.formatCurrency(item.confirmationInfo.afterPrice);
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  };

  getItemLength = item => {
    try {
      let qty = 0;
      item.map(data => {
        if (data.quantity != undefined) {
          qty += data.quantity;
        }
      });
      return qty;
    } catch (e) {
      return '';
    }
  };

  renderFooter = () => {
    const {pendingCartLength, pendingCart} = this.props;
    let trxLength = pendingCart.length;

    if (!this.state.refreshing && trxLength < pendingCartLength) {
      return <ActivityIndicator style={{color: '#000'}} />;
    } else {
      return null;
    }
  };

  handleLoadMore = () => {
    try {
      const {pendingCartLength, pendingCart} = this.props;
      let trxLength = pendingCart.length;

      if (!this.state.refreshing && trxLength < pendingCartLength) {
        this.loadMoreHistory();
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {intlData, pendingCart} = this.props;
    return (
      <>
        {pendingCart == undefined || isEmptyArray(pendingCart) ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            <Text style={styles.empty}>There is no pending orders.</Text>
          </ScrollView>
        ) : (
          // <View style={styles.component}>
          <FlatList
            data={pendingCart}
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
                onPress={() => this.gotToBasket(item)}>
                <View style={styles.sejajarSpace}>
                  <View style={styles.detail}>
                    <View style={styles.sejajarSpace}>
                      <Text style={styles.storeName}>
                        {item.outlet.name.substr(0, 15)}
                        {item.outlet !== undefined &&
                          item.outlet.name.length >
                            item.outlet.name.substr(0, 15).length &&
                          '...'}
                      </Text>
                      <Text style={styles.itemType}>
                        <Text style={{color: colorConfig.store.title}}>
                          {item.queueNo != undefined ? item.queueNo : null}
                          {item.tableNo != undefined && item.tableNo != '-'
                            ? item.tableNo
                            : null}
                          {' - '}
                          {this.getItemLength(item.details)} Items
                          {' -'}
                          {this.format(CurrencyFormatter(item.totalNettAmount))}
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.sejajarSpace}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon
                          size={16}
                          name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'}
                          style={styles.paymentTypeLogo}
                        />
                        <Text style={styles.paymentType}>
                          {this.getStatusText(item.status)}
                        </Text>
                      </View>
                      <Text style={styles.paymentTgl}>
                        {this.getDate(item.createdOn)}
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
          // </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: -3,
    // marginBottom: 10,
    // flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: colorConfig.pageIndex.inactiveTintColor,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
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
    color: colorConfig.store.secondaryColor,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  paymentTgl: {
    color: colorConfig.pageIndex.inactiveTintColor,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },
  paymentTypeLogo: {
    width: 20,
    // height: 15,
    marginTop: 2,
    color: colorConfig.store.defaultColor,
  },
  paymentType: {
    color: colorConfig.store.defaultColor,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  itemType: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    // fontWeight: 'bold',
  },
  itemTypeStamps: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
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
  pendingCart: state.orderReducer.dataCart.cart,
  pendingCartLength: state.orderReducer.dataCart.pendingCartLength,
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
