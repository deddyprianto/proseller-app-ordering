import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import {connect} from "react-redux";
import {compose} from "redux";
import Icon from 'react-native-vector-icons/Ionicons';
import * as _ from 'lodash';

import logoCash from '../assets/img/cash.png';
import logoVisa from '../assets/img/visa.png';
import colorConfig from "../config/colorConfig";
import { Actions } from 'react-native-router-flux';

class HistoryPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getDate(date){
    var tanggal = new Date(date*1000);
    return tanggal.getDate()+' '+this.getMonth(tanggal.getMonth())+' '+tanggal.getFullYear()+' • '+tanggal.getHours()+':'+tanggal.getMinutes();
  }

  getMonth(value){
    var mount = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return mount[value-1];
  }

  historyDetailPayment = (item) => {
    Actions.historyDetailPayment({item});
  }

  render() {
    return (
      <View>
      {
        (this.props.pointTransaction == undefined) ? null :
        (this.props.pointTransaction.length == 0) ?
        <View style={styles.component}>
          <Text style={styles.empty}>Empty</Text>
        </View> :
        <View style={styles.component}>
        {
          _.orderBy(this.props.pointTransaction, ['created'], ['desc']).map((item, key) =>
          <View key={key}>{
            <TouchableOpacity style={styles.item} onPress={() => this.historyDetailPayment(item)}>
              <View style={styles.sejajarSpace}>
                <View style={styles.detail}>
                  <View style={styles.sejajarSpace}>
                    <Text style={styles.storeName}>{item.storeName}</Text>
                    <Text style={styles.itemType}>{item.pointDebit+' point'}</Text>
                  </View>
                  <View style={styles.sejajarSpace}>
                    <View style={{flexDirection: 'row'}}>
                      <Image resizeMode='stretch' style={styles.paymentTypeLogo} source={
                      (item.paymentType == 'Cash')? logoCash : logoVisa}/>
                      <Text style={styles.paymentType}>{item.paymentType}</Text>
                    </View>
                    <Text style={styles.paymentTgl}>{this.getDate(item.created)}</Text>
                  </View>
                </View>
                <View style={styles.btnDetail}>
                  <Icon size={20} 
                  name={ Platform.OS === 'ios' ? 'ios-arrow-dropright-circle' : 'md-arrow-dropright-circle' } 
                  style={{ color: colorConfig.pageIndex.activeTintColor }} />
                </View>
              </View>
            </TouchableOpacity>
          }</View>)
        }
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  component: {
    marginTop: 10,
    alignItems: 'center'
  },
  empty: {
    color: colorConfig.pageIndex.inactiveTintColor,
    textAlign: 'center'
  },
  item: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 2,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor
  },
  sejajarSpace: {
    flexDirection:'row', 
    justifyContent: 'space-between'
  },
  detail: {
    paddingLeft:10,
    paddingTop:5,
    paddingRight: 5,
    paddingBottom:5,
    width: Dimensions.get('window').width-60
  },
  storeName: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 16,
    fontWeight: 'bold'
  },
  paymentTgl: {
    color: colorConfig.pageIndex.inactiveTintColor,
  },
  paymentTypeLogo: {
    width: 20,
    height: 15,
    marginTop: 2,
  },
  paymentType: {
    paddingLeft: 8,
    color: colorConfig.pageIndex.activeTintColor,
  },
  itemType: {
    color: colorConfig.pageIndex.activeTintColor,
    fontSize: 12,
  },
  btnDetail: {
    alignItems: 'center',
    borderLeftColor: colorConfig.pageIndex.activeTintColor,
    borderLeftWidth: 1,
    width: 40,
    paddingTop: 15
  }
});

mapStateToProps = (state) => ({
  pointTransaction : state.rewardsReducer.dataPoint.pointTransaction
});

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(HistoryPayment);