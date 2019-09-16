import React, { Component } from 'react';
import { 
  View, 
  Text,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import * as _ from 'lodash';
import {connect} from "react-redux";
import {compose} from "redux";
import {getCampaign, getDataRewards, notifikasi} from "../actions/auth.actions";

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
          const response =  await this.props.dispatch(getDataRewards(campaign.data[i].id));
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
          dataPoint: totalPoint,
          dataRecent: recentTampung
        });
      }      
    } catch (error) {
      await this.props.dispatch(notifikasi('Get Data Rewards Error!', error.responseBody.message, console.log('Cancel Pressed')));
    }

    fetch(awsConfig.getRewords)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.count > 0){
        var pointTampung = [];
        var stampTampung = [];
        for (let i = 0; i < responseJson.count; i++) {
          if(responseJson.data[i].campaignType == 'point'){
            responseJson.data[i].detailPoint = [
              {'storeName' : 'Bugis Village', 'paymentType': 'cash', 'point': 2 },
              {'storeName' : 'Suntec', 'paymentType': 'cash', 'point': 3 },
            ]
            responseJson.data[i].totalPoint = _.sumBy( responseJson.data[i].detailPoint, 'point');
            pointTampung.push(responseJson.data[i]);
          } else {
            stampTampung.push(responseJson.data[i])
          }
        }
        this.setState({
          dataStamp: stampTampung
        });
        
      } else {
        console.log('Data Rewords kosong')
      }
    })
    .catch((error) =>{
      console.error(error);
    });
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
        <RewardsPoint rewardPoint={this.state.dataPoint}/>
        <RewardsMenu/>
        <RewardsTransaction/>
      </ScrollView>
    );
  }
}

mapStateToProps = (state) => ({
  getDataRewards: state.authReducer.getDataRewards
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Rewards);
