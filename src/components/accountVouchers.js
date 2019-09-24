/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import colorConfig from "../config/colorConfig";
import appConfig from '../config/appConfig';

export default class AccountVouchers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
    };
  }

  goBack(){
    Actions.pop()
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
    return mount[value];
  }

  pageDetailVoucher = (item) => {
    console.log(item)
    // Actions.voucher({dataVoucher: item})
  }

	render() {
    const myVoucers = this.props.data;
		return(
			<View style={styles.container}>
        <View style={{backgroundColor: colorConfig.pageIndex.backgroundColor}}>
          <TouchableOpacity style={styles.btnBack}
          onPress={this.goBack}>
            <Icon size={28} name={ Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back' } style={styles.btnBackIcon} />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line}/>
        </View>
        <ScrollView>
          {
            (myVoucers == undefined) ? null : 
            myVoucers.map((item, keys)=>
              <View key={keys}>
              {
                <View style={styles.voucherItem}
                onPress={() => this.pageDetailVoucher(item)}>
                  <View style={{alignItems: 'center'}}>
                    <Image style={(item['image'] != '' && item['image'] != undefined) ? styles.voucherImage1 : styles.voucherImage2} 
                      source={
                        (item['image'] != '' && item['image'] != undefined) ? {uri:item['image']} : appConfig.appImageNull
                      }/>
                      <View style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        backgroundColor: 'rgba(128,128,128, 0.8)',
                        height: 40,
                        width: 40,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{
                          color: colorConfig.pageIndex.backgroundColor,
                          fontSize: 18,
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}>{item['totalRedeem']}</Text>
                      </View>
                  </View>
                  <View style={styles.voucherDetail}>
                    <View style={styles.status}> 
                      <Text style={styles.statusTitle}>Awarded</Text> 
                    </View>
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
                    <View style={{flexDirection:'row', alignItems: 'center'}}>
                      <Image style={{height: 10, width: 15, marginRight: 2}} 
                        source={require('../assets/img/ticket.png')}/>
                      <Text style={styles.pointVoucher}>{item['redeemValue']+' point'}</Text>
                    </View>
                  </View>
                </View>
              }
              </View>
            )
          }
        </ScrollView>
      </View>
    )
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBackIcon: {
    color: colorConfig.pageIndex.activeTintColor, 
    margin:10
  },
  btnBack: {
    flexDirection:'row', 
    alignItems:'center'
  },
  btnBackText: {
    color: colorConfig.pageIndex.activeTintColor, 
    fontWeight: 'bold'
  },
  line: {
    borderBottomColor: colorConfig.store.defaultColor, 
    borderBottomWidth:2
  },
  card: {
    margin:10,
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colorConfig.pageIndex.backgroundColor
  },
  voucherItem: {
    borderColor: colorConfig.store.defaultColor, 
    borderWidth:1, 
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage1: {
    height: (Dimensions.get('window').width/4), 
    width: (Dimensions.get('window').width-22), 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherImage2: {
    height: (Dimensions.get('window').width/4), 
    width: (Dimensions.get('window').width/4), 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10, 
    paddingTop: 5, 
    paddingRight: 5, 
    borderTopColor: colorConfig.store.defaultColor, 
    borderTopWidth: 1,
    paddingBottom: 10
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

