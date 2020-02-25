import React, {Component} from 'react';
import {View} from 'react-native';
import colorConfig from '../../config/colorConfig';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export default class StampsPlaceHolder extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <ShimmerPlaceHolder
          autoRun={true}
          duration={900}
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            marginHorizontal: 5,
          }}
          colorShimmer={[
            colorConfig.store.defaultColor,
            'white',
            colorConfig.store.defaultColor,
          ]}
        />
        <ShimmerPlaceHolder
          autoRun={true}
          duration={900}
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            marginHorizontal: 5,
          }}
          colorShimmer={[
            colorConfig.store.defaultColor,
            'white',
            colorConfig.store.defaultColor,
          ]}
        />
        <ShimmerPlaceHolder
          autoRun={true}
          duration={900}
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            marginHorizontal: 5,
          }}
          colorShimmer={[
            colorConfig.store.defaultColor,
            'white',
            colorConfig.store.defaultColor,
          ]}
        />
        <ShimmerPlaceHolder
          autoRun={true}
          duration={900}
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            marginHorizontal: 5,
          }}
          colorShimmer={[
            colorConfig.store.defaultColor,
            'white',
            colorConfig.store.defaultColor,
          ]}
        />
        <ShimmerPlaceHolder
          autoRun={true}
          duration={900}
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            marginHorizontal: 5,
          }}
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
