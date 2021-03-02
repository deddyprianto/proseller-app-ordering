/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import colorConfig from '../../config/colorConfig';
import RBSheet from 'react-native-raw-bottom-sheet';
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
              selectable={true}
              style={{
                marginTop: 10,
                fontSize: 22,
                fontFamily: 'Poppins-Medium',
                color: colorConfig.store.title,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}>
              {inbox.title}
            </Text>
            <Text
              selectable={true}
              style={{
                padding: 15,
                fontSize: 17,
                marginTop: 25,
                fontFamily: 'Poppins-Regular',
                color: colorConfig.store.titleSelected,
              }}>
              {inbox.message}
            </Text>

            <TouchableOpacity
              onPress={this.closeDetail}
              style={{
                position: 'absolute',
                bottom: 25,
                width: '100%',
                backgroundColor: colorConfig.store.secondaryColor,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  paddingVertical: 13,
                  fontFamily: 'Poppins-Medium',
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
