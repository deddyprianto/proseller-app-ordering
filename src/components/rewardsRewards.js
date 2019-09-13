import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {connect} from "react-redux";
import {compose} from "redux";
import {getCampaign, getVouchers} from "../actions/auth.actions";

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
      refreshing: false,
    };
  }

  componentDidMount = async() =>{
    if (this.state.dataVoucher.length === 0){
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false });
    }
    this.getDataVoucher();
  }

  getDataVoucher = async() =>{
    const campaign =  await this.props.dispatch(getCampaign());
    if(campaign.count > 0){
      var dataVoucher = [];
      for (let i = 0; i < campaign.count; i++) {
        const voucher =  await this.props.dispatch(getVouchers(campaign.data[i].id));
        if(voucher.count > 0){
          for (let j = 0; j < voucher.count; j++) {
            dataVoucher.push(voucher.data[j])
          }
        }
      }
      this.setState({
        dataVoucher: dataVoucher
      })
    }
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
          <TouchableOpacity style={styles.btnBack}
          onPress={this.goBack}>
            <Icon size={28} name={ Platform.OS === 'ios' ? 'arrow-left' : 'md-arrow-round-back' } style={styles.btnBackIcon} />
            <Text style={styles.btnBackText}> Back </Text>
          </TouchableOpacity>
          <View style={styles.line}/>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>
        }>
        {
          (this.state.isLoading === true) ? 
          <View style={styles.loading}> 
            {(this.state.isLoading) && <Loader />}
          </View> :
          (this.state.dataVoucher.length > 0) ? 
          <View>
            <RewardsStamp/>
            <RewardsStampDetail/>
            <RewordsVouchers dataVoucher={this.state.dataVoucher}/>
          </View> : null
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
});

mapStateToProps = (state) => ({
  getVouchers: state.authReducer.getVouchers
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(RewardsRewards);