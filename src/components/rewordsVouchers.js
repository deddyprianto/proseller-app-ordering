import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
import {compose} from 'redux';
import AllVouchers from './vouchers/AllVouchers';
import MyVouchers from './vouchers/MyVouchers';
import * as _ from 'lodash';
import colorConfig from '../config/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';

class RewordsVouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleAllVoucher: true,
      toggleMyVoucher: false,
      isLoading: false,
    };
  }

  render() {
    try {
      var myVoucers = [];
      if (this.props.myVoucers != undefined) {
        _.forEach(
          _.groupBy(
            this.props.myVoucers.filter(voucher => voucher.deleted == false),
            'id',
          ),
          function(value, key) {
            value[0].totalRedeem = value.length;
            myVoucers.push(value[0]);
          },
        );
      }
    } catch (e) {
      var myVoucers = [];
    }
    return (
      <View>
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
              this.setState({toggleAllVoucher: true, toggleMyVoucher: false})
            }
            style={{width: '50%', alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon
                  size={17}
                  name={Platform.OS === 'ios' ? 'ios-apps' : 'md-apps'}
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
                  Redeem Voucher
                </Text>
              </View>
              {this.state.toggleAllVoucher ? (
                <View style={styles.triangle} />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({toggleMyVoucher: true, toggleAllVoucher: false})
            }
            style={{width: '50%', alignItems: 'center'}}>
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon
                  size={17}
                  name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
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
                  My Voucher
                </Text>
              </View>
              {this.state.toggleMyVoucher ? (
                <View style={styles.triangle} />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        {/*Tabs*/}

        {this.state.toggleAllVoucher ? <AllVouchers /> : null}
        {this.state.toggleMyVoucher ? <MyVouchers data={myVoucers} /> : null}
      </View>
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
  vouchers: state.rewardsReducer.vouchers.dataVoucher,
  myVoucers: state.accountsReducer.myVoucers.myVoucers,
});

mapDispatchToProps = dispatch => ({
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RewordsVouchers);
