/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colorConfig from '../config/colorConfig';

const propTypes = {
  mapElement: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  label: PropTypes.string,
};

const defaultProps = {
  mapElement: n => {},
  onSubmitEditing: () => {},
  onChangeText: () => {},
  value: '',
  placeholder: '',
  maxLength: 200,
  keyboardType: 'default',
  secureTextEntry: false,
  label: '',
};

const styles = StyleSheet.create({
  inputBox: {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: colorConfig.pageIndex.activeTintColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'rgba(2, 168, 80, 0.7)',
    marginVertical: 10,
    paddingLeft: 42,
  },
});

class InputText extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      showPass: true,
      press: false,
    };
  }

  componentDidMount() {
    this.setState({
      value: this.props.value.replace(/\s/g, ''),
    });
  }

  onChangeText = value => {
    this.setState(
      {
        value: value.replace(/\s/g, ''),
      },
      () => {
        this.props.onChangeText(value.replace(/\s/g, ''));
      },
    );
  };

  showPass = () => {
    if (this.state.press == false) {
      this.setState({showPass: false, press: true});
    } else {
      this.setState({showPass: true, press: false});
    }
  };

  render() {
    const {
      placeholder,
      keyboardType,
      maxLength,
      onSubmitEditing,
      icon,
      onPress,
    } = this.props;
    return (
      <View>
        <TextInput
          onPress={onPress}
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={placeholder}
          placeholderTextColor="rgba(2, 168, 80, 0.7)"
          selectionColor="#999999"
          secureTextEntry={
            placeholder != 'Password' &&
            placeholder != 'Confirm Password' &&
            placeholder != 'Code Authentification'
              ? null
              : this.state.showPass
          }
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType="next"
          value={this.state.value}
          onSubmitEditing={onSubmitEditing}
          onChangeText={this.onChangeText}
        />
        <Icon
          style={{position: 'absolute', top: 16, left: 15}}
          name={icon}
          size={25}
          color="rgba(2, 168, 80, 0.7)"
        />
        {placeholder != 'Password' &&
        placeholder != 'Confirm Password' &&
        placeholder != 'Code Authentification' ? null : (
          <TouchableOpacity
            style={{position: 'absolute', top: 16, right: 15}}
            onPress={this.showPass}>
            <Icon
              name={this.state.press == true ? 'md-eye' : 'md-eye-off'}
              size={25}
              color={'rgba(2, 168, 80, 0.7)'}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

InputText.defaultProps = defaultProps;

InputText.propTypes = propTypes;

export default InputText;
