import * as React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import PropTypes from 'prop-types';

const ToggleComponent = props => {
  const animatedValue = new Animated.Value(0);

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 18],
  });

  const {
    isOn,
    onColor,
    offColor,
    style,
    onToggle,
    labelStyle,
    label,
    containerStyle,
  } = props;

  const color = isOn ? onColor : offColor;

  animatedValue.setValue(isOn ? 1 : 0);

  const handleToggle = () => {
    if (typeof onToggle === 'function') {
      onToggle();
    }
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <Pressable onPress={handleToggle}>
        <View style={[styles.toggleContainer, style, {backgroundColor: color}]}>
          <Animated.View
            style={[
              styles.toggleWheelStyle,
              {
                marginLeft: moveToggle,
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
};

ToggleComponent.propTypes = {
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  label: PropTypes.string,
  onToggle: PropTypes.func,
  style: PropTypes.object,
  isOn: PropTypes.bool.isRequired,
  labelStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

ToggleComponent.defaultProps = {
  onColor: '#4cd137',
  offColor: '#ecf0f1',
  label: '',
  onToggle: () => {},
  style: {},
  isOn: false,
  labelStyle: {},
  containerStyle: {},
};

export default ToggleComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  toggleContainer: {
    width: 32,
    height: 16,
    marginLeft: 3,
    borderRadius: 15,
    justifyContent: 'center',
  },
  label: {
    marginRight: 2,
  },
  toggleWheelStyle: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
});
