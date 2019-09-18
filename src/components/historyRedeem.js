import React, { Component } from 'react';
import { View, Text } from 'react-native';

import colorConfig from "../config/colorConfig";

export default class HistoryRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{margin: 10, alignItems: 'center'}}>
        <Text style={{textAlign: 'center', color: colorConfig.pageIndex.inactiveTintColor }}> Empty </Text>
      </View>
    );
  }
}
