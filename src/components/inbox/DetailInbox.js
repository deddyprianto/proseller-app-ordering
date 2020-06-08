/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import appConfig from '../../config/appConfig';
import colorConfig from '../../config/colorConfig';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';

const HEIGHT = Dimensions.get('window').height;

export default class DetailInbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inbox: {},
    };
  }

  openDetail = inbox => {
    this.setState({inbox});
    this.RBSheet.open();
  };

  closeDetail = () => {
    this.RBSheet.close();
  };

  render(color = colorConfig.store.title) {
    const {inbox} = this.state;
    return (
      <SafeAreaView>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          animationType={'slide'}
          height={HEIGHT}
          duration={5}
          closeOnDragDown={true}
          closeOnPressMask={true}
          closeOnPressBack={true}
          customStyles={{
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                marginTop: 10,
                fontSize: 22,
                fontFamily: 'Lato-Bold',
                color: colorConfig.store.defaultColor,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}>
              {inbox.title}
            </Text>
            <Text
              style={{
                padding: 15,
                fontSize: 17,
                marginTop: 25,
                fontFamily: 'Lato-Medium',
                color: colorConfig.store.title,
              }}>
              {inbox.message}
            </Text>

            <TouchableOpacity
              onPress={this.closeDetail}
              style={{
                position: 'absolute',
                bottom: 10,
                width: '100%',
                backgroundColor: colorConfig.store.secondaryColor,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  paddingVertical: 13,
                  fontFamily: 'Lato-Bold',
                  fontSize: 19,
                  textAlign: 'center',
                  color: 'white',
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </SafeAreaView>
    );
  }
}
