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

export default class EmptySearch extends Component {
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
          source={appConfig.emptyBox}
        />
        <Text
          style={{
            marginTop: 20,
            fontFamily: 'Poppins-Medium',
            fontSize: 20,
            color: colorConfig.pageIndex.grayColor,
          }}>
          Oppss, we can't find the item :(
        </Text>
      </View>
    );
  }
}
