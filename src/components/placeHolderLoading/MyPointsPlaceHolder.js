import React, {Component} from 'react';
import {View} from 'react-native';
import colorConfig from '../../config/colorConfig';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export default class MyPointsPlaceHolder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ShimmerPlaceHolder
          autoRun={true}
          duration={500}
          height={60}
          width={100}
          colorShimmer={[
            colorConfig.store.defaultColor,
            'white',
            colorConfig.store.defaultColor,
          ]}
        />
      </View>
    );
  }
}
