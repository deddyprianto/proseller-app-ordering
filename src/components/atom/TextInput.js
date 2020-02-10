import React, {Component} from 'react';
import {TextInput} from 'react-native';
import colorConfig from '../../config/colorConfig';

export default class CustomTextInput extends Component {
  render() {
    return (
      <TextInput
        keyboardType={this.props.keyboardType}
        value={this.props.value}
        style={{
          fontSize: 20,
          fontFamily: 'Lato-Medium',
          padding: 15,
          color: colorConfig.pageIndex.grayColor,
          borderColor: colorConfig.pageIndex.inactiveTintColor,
          borderWidth: 2,
          borderRadius: 13,
        }}
      />
    );
  }
}
