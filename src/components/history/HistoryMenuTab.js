import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import colorConfig from '../../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';
import HistoryPayment from './historyPayment';
import HistoryPendingOrders from './HistoryPendingOrders';
import {isEmptyArray} from '../../helper/CheckEmpty';

class HistoryMenuTab extends Component {
  constructor(props) {
    super(props);

    const {dataBasket} = this.props;

    this.state = {
      toggleAll: isEmptyArray(dataBasket) ? true : false,
      togglePending: !isEmptyArray(dataBasket) ? true : false,
      isLoading: false,
    };
  }

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
                    fontFamily: 'Lato-Medium',
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
                    fontFamily: 'Lato-Medium',
                  }}>
                  Pending Orders{' '}
                  {!isEmptyArray(dataBasket) ? `( ${dataBasket.length} )` : null}
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

mapStateToProps = state => ({
  dataBasket: state.orderReducer.dataCart.cart,
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
)(HistoryMenuTab);
