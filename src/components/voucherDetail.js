import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import colorConfig from "../config/colorConfig";
import appConfig from "../config/appConfig";

export default class VoucherDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      rewardPoint: 0,
    };
  }

  componentWillMount = async() => {
    this.setState({rewardPoint: await AsyncStorage.getItem("@point")});
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
    return mount[value-1];
  }

  btnRedeem = (dataVoucher) => {
    console.log(dataVoucher)
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View>
          <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.btnBack}
            onPress={this.goBack}>
              <Icon size={28} name={ Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back' } style={styles.btnBackIcon} />
              <Text style={styles.btnBackText}> Back </Text>
            </TouchableOpacity>
            <View style={styles.point}>
              <Image style={{height: 18, width: 25, marginRight: 5}} 
                source={require('../assets/img/ticket.png')}/>
              <Text style={{color: colorConfig.pageIndex.activeTintColor, fontWeight: 'bold'}}>{this.state.rewardPoint+' Point'}</Text>
            </View>
          </View>
          <View style={styles.line}/>
        </View>
        <ScrollView>
          <View style={styles.voucherItem}>
            <View>
              <Image style={styles.voucherImage} 
                source={
                  (this.props.dataVoucher['image'] != '') ? {uri:this.props.dataVoucher['image']} : appConfig.appImageNull
                }/>
            </View>
            <View style={styles.voucherDetail}>
              <View style={{
                paddingLeft: 10, 
                paddingTop: 5, 
                paddingRight: 5, 
                paddingBottom: 10,
              }}>
                <Text style={styles.nameVoucher}>{this.props.dataVoucher['voucherName']}</Text>
                <View style={{flexDirection:'row'}}>
                  <Icon size={15} name={ Platform.OS === 'ios' ? 'ios-arrow-dropright' : 'md-arrow-dropright-circle' } 
                    style={{ color: colorConfig.pageIndex.inactiveTintColor, marginRight:3 }} />
                  <Text style={styles.descVoucher}>{this.props.dataVoucher['voucherDesc']}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Icon size={15} name={ Platform.OS === 'ios' ? 'ios-time' : 'md-time' } 
                    style={{ color: colorConfig.pageIndex.inactiveTintColor, marginRight:3 }} />
                  <Text style={styles.descVoucher}>{
                    this.getDate(this.props.dataVoucher['validity']['validDate']['startDate'])+' - '+
                    this.getDate(this.props.dataVoucher['validity']['validDate']['endDate'])
                  }</Text>
                </View>
              </View>
              <View style={{
                alignItems: 'center',
                width: this.state.screenWidth/5,
                borderLeftColor: colorConfig.pageIndex.activeTintColor,
                borderLeftWidth: 1,
                padding: 10,
              }}>
                <Text style={styles.pointVoucher}>{this.props.dataVoucher['redeemValue']}</Text>
                <Text style={styles.pointVoucherText}>point</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => this.btnRedeem(this.props.dataVoucher)}
            style={{
              height: 40,
              backgroundColor: colorConfig.pageIndex.activeTintColor,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              alignItems: 'center'
            }}>
              <Text style={{
                color: colorConfig.pageIndex.backgroundColor,
                fontWeight: 'bold',
                paddingTop:10,
                fontSize: 16
              }}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorConfig.pageIndex.backgroundColor
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
    borderBottomColor: colorConfig.pageIndex.activeTintColor, 
    borderBottomWidth:2
  },
  point: {
    margin: 10, 
    alignItems: 'center', 
    flexDirection:'row', 
    alignItems: 'center',
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5
  },
  voucherItem: {
    borderColor: colorConfig.pageIndex.activeTintColor, 
    borderWidth:1, 
    margin: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage: {
    height: (Dimensions.get('window').width/4), 
    width: (Dimensions.get('window').width-22), 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    borderTopColor: colorConfig.pageIndex.activeTintColor, 
    borderTopWidth: 1,
    flexDirection:'row', 
    justifyContent: 'space-between'
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
    fontSize:20, 
    fontWeight: 'bold',
    textAlign: 'center',
    color: colorConfig.pageIndex.activeTintColor,
    paddingBottom: 0
  },
  pointVoucherText: {
    fontSize:20, 
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 0,
    color: colorConfig.pageIndex.activeTintColor,
  },
});
