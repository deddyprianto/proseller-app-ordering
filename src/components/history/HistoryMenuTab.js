import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import HistoryPayment from './historyPayment';
import HistoryPendingOrders from './HistoryPendingOrders';
import {isEmptyArray} from '../../helper/CheckEmpty';
import {openPopupNotification} from '../../actions/order.action';
import {HistoryNotificationModal} from '../modal';

class HistoryMenuTab extends Component {
  constructor(props) {
    super(props);

    const {afterPayment} = this.props;

    this.state = {
      toggleAll: afterPayment == undefined || !afterPayment ? true : false,
      togglePending: afterPayment && afterPayment != undefined ? true : false,
      isLoading: false,
    };
  }

  closePopup = () => {
    this.props.dispatch(openPopupNotification(false));
  };

  render() {
    const {intlData, dataBasket} = this.props;
    return (
      <>
        {/*Tabs*/}
        <View
          style={{
            marginBottom: 20,
            backgroundColor: colorConfig.store.defaultColor,
            paddingTop: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({toggleAll: true, togglePending: false})
            }
            style={{width: '50%', alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon
                  size={17}
                  name={Platform.OS === 'ios' ? 'ios-grid' : 'md-grid'}
                  style={{
                    color: colorConfig.pageIndex.backgroundColor,
                    marginRight: 7,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Orders
                </Text>
              </View>
              {this.state.toggleAll ? <View style={styles.triangle} /> : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({togglePending: true, toggleAll: false})
            }
            style={{width: '50%', alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon
                  size={17}
                  name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
                  style={{
                    color: colorConfig.pageIndex.backgroundColor,
                    marginRight: 7,
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Pending Orders{' '}
                  {!isEmptyArray(dataBasket)
                    ? `( ${dataBasket.length} )`
                    : null}
                </Text>
              </View>
              {this.state.togglePending ? (
                <View style={styles.triangle} />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        {/*Tabs*/}

        {this.state.toggleAll ? <HistoryPayment /> : null}
        {this.state.togglePending ? (
          <HistoryPendingOrders intlData={intlData} />
        ) : null}
        <HistoryNotificationModal
          value={this.props.dataNotification}
          open={this.props.popupNotification}
          handleClose={this.closePopup}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  triangle: {
    alignItems: 'center',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colorConfig.pageIndex.backgroundColor,
    marginBottom: 0,
  },
});

const mapStateToProps = state => ({
  afterPayment: state.accountsReducer.afterPayment.afterPayment,
  dataBasket: state.orderReducer.dataCart.cart,
  intlData: state.intlData,
  popupNotification: state.orderReducer?.popupNotification?.openPopup,
  dataNotification: state?.orderReducer?.notificationData?.notificationData,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HistoryMenuTab);
