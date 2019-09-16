import React, { Component } from 'react';
import { 
  View, 
  Text,
  Dimensions,
  AsyncStorage
} from 'react-native';
import colorConfig from "../config/colorConfig";

export default class RewardsPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      rewardPoint: 0
    };
  }

  componentDidMount = async() =>{
    this.setState({rewardPoint: await AsyncStorage.getItem("@point")})
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
        }}>{this.state.rewardPoint}</Text>
        <Text style={{
          color: colorConfig.pageIndex.backgroundColor, 
          textAlign: 'center'
        }}>Point ></Text>
      </View>
    );
  }
}
