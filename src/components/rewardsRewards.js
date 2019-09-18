import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from "react-redux";
import {compose} from "redux";
import {dataPoint, vouchers} from "../actions/rewards.action";

import colorConfig from "../config/colorConfig";
import RewardsStamp from '../components/rewardsStamp';
import RewardsStampDetail from '../components/rewardsStampDetail';
import RewordsVouchers from '../components/rewordsVouchers';
import Loader from "../components/loader";

class RewardsRewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataVoucher: [],
      isLoading: true,
      rewardPoint: 0,
      refreshing: false,
    };
  }

  componentDidMount = async() =>{
    
    // if (this.props.vouchers.length === 0){
    //   this.setState({ isLoading: true });
    // } else {
      this.setState({ isLoading: false });
    // }
    // this.getDataVoucher();
  }

  getDataVoucher = async() =>{
    await this.props.dispatch(vouchers());
    await this.props.dispatch(dataPoint());
    this.setState({ isLoading: false });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataVoucher();
    this.setState({refreshing: false});
  }

  goBack(){
    Actions.pop()
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
              <Text style={{color: colorConfig.pageIndex.activeTintColor, fontWeight: 'bold'}}>{this.props.totalPoint+' Point'}</Text>
            </View>
          </View>
          <View style={styles.line}/>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
        }>
        {
          (this.state.isLoading === true) ? 
          <View style={styles.loading}> 
            {(this.state.isLoading) && <Loader />}
          </View> :
          <View>
            <RewardsStamp/>
            <RewardsStampDetail/>
            {
              (this.props.vouchers.length > 0) ? 
              <RewordsVouchers/> : null
            }
          </View> 
        }
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
    borderBottomColor: colorConfig.store.defaultColor, 
    borderBottomWidth:2
  },
  loading: {
    height: Dimensions.get('window').height-50
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
  }
});

mapStateToProps = (state) => ({
  vouchers: state.rewardsReducer.vouchers.dataVoucher,
  totalPoint : state.rewardsReducer.dataPoint.totalPoint
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(RewardsRewards);