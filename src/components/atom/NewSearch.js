/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {View, Dimensions, Image, Text} from 'react-native';
import appConfig from '../../config/appConfig';
import colorConfig from '../../config/colorConfig';

const imageWidth = Dimensions.get('window').width / 2;

export default class NewSearch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Image
          style={{
            width: 150,
            height: 150,
          }}
          source={appConfig.newSearch}
        />
        <Text
          style={{
            marginTop: 20,
            fontFamily: 'Lato-Bold',
            fontSize: 20,
            color: colorConfig.pageIndex.grayColor,
          }}>
          Let's find your specific item.
        </Text>
      </View>
    );
  }
}
