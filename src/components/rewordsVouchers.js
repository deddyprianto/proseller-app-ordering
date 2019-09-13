import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl
} from 'react-native';
import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";
import Icon from 'react-native-vector-icons/Ionicons';

import {connect} from "react-redux";
import {compose} from "redux";

class RewordsVouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: this.props.dataVoucher
    };
  }

  getDate(date){
    var tanggal = new Date(date*1000);
    return tanggal.getDate()+' '+this.getMonth(tanggal.getMonth())+' '+tanggal.getFullYear();
  }

  getMonth(value){
    var mount = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    return mount[value-1];
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Vouchers</Text>
        <View>
          {
            this.state.dataVoucher.map((item, keys)=>
              <View key={keys}>
              {
                <TouchableOpacity style={styles.voucherItem}>
                  <View>
                    <Image style={styles.voucherImage} 
                      source={
                        (item['image'] != '') ? {uri:item['image']} : appConfig.appImageNull
                      }/>
                  </View>
                  <View style={styles.voucherDetail}>
                    {/* <View style={styles.status}> 
                      <Text style={styles.statusTitle}>Awarded</Text> 
                    </View> */}
                    <Text style={styles.nameVoucher}>{item['voucherName']}</Text>
                    <View style={{flexDirection:'row'}}>
                      <Icon size={15} name={ Platform.OS === 'ios' ? 'ios-arrow-dropright' : 'md-arrow-dropright-circle' } 
                        style={{ color: colorConfig.pageIndex.inactiveTintColor, marginRight:3 }} />
                      <Text style={styles.descVoucher}>{item['voucherDesc']}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Icon size={15} name={ Platform.OS === 'ios' ? 'ios-time' : 'md-time' } 
                        style={{ color: colorConfig.pageIndex.inactiveTintColor, marginRight:3 }} />
                      <Text style={styles.descVoucher}>{
                        this.getDate(item['validity']['validDate']['startDate'])+' - '+
                        this.getDate(item['validity']['validDate']['endDate'])
                      }</Text>
                    </View>
                    <Text style={styles.pointVoucher}>{'Need '+item['redeemValue']+' Point'}</Text>
                  </View>
                </TouchableOpacity>
              }
              </View>
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    margin:10
  },
  title: {
    color: colorConfig.pageIndex.activeTintColor, 
    fontSize: 16,
    marginBottom:5,
    fontWeight: 'bold'
  },
  voucherItem: {
    height: (Dimensions.get('window').width/4)+3, 
    flexDirection:'row', 
    borderColor: colorConfig.store.defaultColor, 
    borderWidth:1, 
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage: {
    height: (Dimensions.get('window').width/4), 
    width: (Dimensions.get('window').width/4), 
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10, 
    paddingTop: 5, 
    paddingRight: 5, 
    borderLeftColor: colorConfig.store.defaultColor, 
    borderLeftWidth: 1
  },
  status: {
    backgroundColor: colorConfig.pageIndex.listBorder,
    height:20,
    paddingLeft:5,
    paddingRight:5,
    borderRadius: 5,
    width: 70
  },
  statusTitle: {
    fontSize:12, 
    color: colorConfig.pageIndex.backgroundColor,
    textAlign: 'center'
  },
  nameVoucher: {
    fontSize:14, 
    color: colorConfig.store.defaultColor,
    fontWeight: 'bold'
  },
  descVoucher: {
    fontSize:12, 
    color: colorConfig.pageIndex.inactiveTintColor
  },
  pointVoucher: {
    fontSize:12, 
    color: colorConfig.pageIndex.activeTintColor,
  },
});

mapStateToProps = (state) => ({
  getVouchers: state.authReducer.getVouchers
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(RewordsVouchers);
