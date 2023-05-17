import React from 'react';
import {Animated, Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    position: 'absolute',
    bottom: -30,
    width: Dimensions.get('window').width * 0.9,
    left: 16,
    right: 16,
    padding: 10,
    borderRadius: 8,
  },
});

const AnimationMessage = ({show, setShow, children, containerStyle}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (show) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            if (setShow && typeof setShow === 'function') {
              setShow(false);
            }
          });
        }, 3000);
      });
    }
  }, [fadeAnim, setShow, show]);

  return (
    <Animated.View
      style={[styles.container, {opacity: fadeAnim}, containerStyle]}>
      {children}
    </Animated.View>
  );
};

export default AnimationMessage;
