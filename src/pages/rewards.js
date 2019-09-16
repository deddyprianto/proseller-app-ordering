import React, { Component } from 'react';
import { 
  View, 
  Text,
  Dimensions,
  ScrollView,
  RefreshControl,
  AsyncStorage
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import * as _ from 'lodash';
import {connect} from "react-redux";
import {compose} from "redux";
import {
  getCampaign, 
  getDataPointByCampaignID, 
  notifikasi
} from "../actions/auth.actions";

import RewardsPoint from '../components/rewardsPoint';
import RewardsStamp from '../components/rewardsStamp';
import RewardsMenu from '../components/rewardsMenu';
import RewardsTransaction from '../components/rewardsTransaction';
import colorConfig from "../config/colorConfig";
import awsConfig from "../config/awsConfig";

const AppNavigationContainer = createAppContainer(
	createMaterialTopTabNavigator({
		Stamp: {
			screen: RewardsStamp
		},
		// Loyalty: {
    //   screen: Stamp
		// },
		Point: {
      screen: RewardsPoint,
		}
	},{
    initialRouteName: 'Stamp',
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
      },
      tabStyle: {
        height: 40,
      },
      style: {
        backgroundColor: colorConfig.pageIndex.backgroundColor,
      },
      activeTintColor: colorConfig.pageIndex.activeTintColor,
      inactiveTintColor: colorConfig.pageIndex.inactiveTintColor,
      upperCaseLabel: false,
    }
  })
);

class Rewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRewards: [],
      dataPoint: [],
      dataStamp: [],
      dataRecent: [],
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      refreshing: false,
    };
  }

  componentWillMount(){
    this.getDataRewards();
  }

  getDataRewards = async() => {
    try {
      const campaign =  await this.props.dispatch(getCampaign());
      
      if(campaign.count > 0){
        var dataResponse = [];
        let totalPoint = 0;
        for (let i = 0; i < campaign.count; i++) {
          const response =  await this.props.dispatch(getDataPointByCampaignID(campaign.data[i].id));
          if(response.count > 0){
            for (let j = 0; j < response.count; j++) {
              dataResponse.push(response.data[j])
              totalPoint = totalPoint + parseInt(response.data[j].payment)
            }
          }
        }
        var recentTampung = [];
        if(_.orderBy(dataResponse, ['created'], ['desc']).length > 0){
          for (let i = 0; i < 3; i++) {
            recentTampung.push(_.orderBy(dataResponse, ['created'], ['desc'])[i])
          }
        }
        
        this.setState({
          dataRecent: recentTampung
        });

        await AsyncStorage.setItem("@point",  JSON.stringify(totalPoint));
      }      
    } catch (error) {
      await this.props.dispatch(notifikasi('Get Data Rewards Error!', error.responseBody.message, console.log('Cancel Pressed')));
    }
  }

  _setPoint = (data) => {
    this.setState({
      dataRewards: [{'point': 2.429}]
    });
  }

  _setStamp = (data) => {
    
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getDataRewards();
    this.setState({refreshing: false});
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        {/* <AppNavigationContainer/> */}
        <RewardsStamp/>
        <RewardsPoint/>
        <RewardsMenu/>
        <RewardsTransaction dataRecent={this.state.dataRecent}/>
      </ScrollView>
    );
  }
}

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(null, mapDispatchToProps),
)(Rewards);
