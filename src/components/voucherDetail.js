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
          {
            console.log(this.props.dataVoucher)
          }
          <View style={styles.voucherItem}>
            <View>
              <Image style={styles.voucherImage} 
                source={
                  (this.props.dataVoucher['image'] != '') ? {uri:this.props.dataVoucher['image']} : appConfig.appImageNull
                }/>
            </View>
            <View style={styles.voucherDetail}>
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
              <View style={{flexDirection:'row', alignItems: 'center'}}>
                <Image style={{height: 10, width: 15, marginRight: 2}} 
                  source={require('../assets/img/ticket.png')}/>
                <Text style={styles.pointVoucher}>{this.props.dataVoucher['redeemValue']+' point'}</Text>
              </View>
            </View>
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
    borderColor: colorConfig.store.defaultColor, 
    borderWidth:2, 
    margin: 10,
    borderRadius: 10,
    backgroundColor: colorConfig.store.storesItem,
  },
  voucherImage: {
    height: (Dimensions.get('window').width/4), 
    width: (Dimensions.get('window').width-24), 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  voucherDetail: {
    paddingLeft: 10, 
    paddingTop: 5, 
    paddingRight: 5, 
    borderTopColor: colorConfig.store.defaultColor, 
    borderTopWidth: 2,
    paddingBottom: 10
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
