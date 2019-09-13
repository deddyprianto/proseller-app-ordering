import React, { Component } from 'react';
import { 
  View, 
  Text,
  Dimensions 
} from 'react-native';
import colorConfig from "../config/colorConfig";

export default class RewardsPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
    };
  }

  render() {
    return (
      <View style={{backgroundColor: colorConfig.pageIndex.activeTintColor, height: (this.state.screenHeight/3)-30}}>
        <Text style={{
          color: colorConfig.pageIndex.backgroundColor, 
          textAlign: 'center', 
          paddingTop: 20, 
          fontSize: 30,
          fontWeight:'bold',
        }}>{this.props.rewardPoint}</Text>
        <Text style={{
          color: colorConfig.pageIndex.backgroundColor, 
          textAlign: 'center'
        }}>Point ></Text>
      </View>
    );
  }
}
