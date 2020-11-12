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
            width: 190,
            height: 190,
          }}
          source={appConfig.productPlaceholder}
        />
        <Text
          style={{
            // marginTop: 10,
            fontFamily: 'Lato-Medium',
            fontSize: 23,
            color: colorConfig.pageIndex.grayColor,
          }}>
          Let's find your specific item.
        </Text>
      </View>
    );
  }
}
