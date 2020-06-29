import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

const DEFAULT_SIZE_MULTIPLIER = 1.1;
const DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER = 0.08;

export default class RadioButton extends Component {
  static propTypes = {
    size: PropTypes.number,
    innerColor: PropTypes.string,
    outerColor: PropTypes.string,
    isSelected: PropTypes.bool,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    size: 10,
    innerColor: 'dodgerblue',
    outerColor: 'dodgerblue',
    isSelected: false,
    onPress: () => null,
  };

  render() {
    const {size, innerColor, outerColor, isSelected, onPress} = this.props;
    const outerStyle = {
      borderColor: outerColor,
      width: size + size * DEFAULT_SIZE_MULTIPLIER,
      height: size + size * DEFAULT_SIZE_MULTIPLIER,
      borderRadius: 3,
      borderWidth: size * DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER,
    };

    const innerStyle = {
      width: size + size * DEFAULT_SIZE_MULTIPLIER,
      height: size + size * DEFAULT_SIZE_MULTIPLIER,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3,
      backgroundColor: innerColor,
    };

    return (
      <TouchableOpacity style={[styles.radio, outerStyle]} onPress={onPress}>
        {isSelected ? (
          <View style={innerStyle}>
            <Icon
              size={17}
              name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
              style={{
                color: 'white',
                margin: 0,
                padding: 0,
              }}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 5,
  },
});
