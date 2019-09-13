/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import PropTypes from "prop-types";
import React, {Component} from "react";
import {
  TextInput, 
  View, 
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const propTypes = {
  mapElement: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  label: PropTypes.string
};

const defaultProps = {
  mapElement: (n) => {},
  onSubmitEditing: () => {},
  onChangeText: () => {},
  value: "",
  placeholder: "",
  maxLength: 200,
  keyboardType: "default",
  secureTextEntry: false,
  label: ""
};

const styles = StyleSheet.create({
  inputBox: {
    width:300,
    backgroundColor:'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    color:'#ffffff',
    marginVertical: 10,
    paddingLeft: 42
  }
});

class InputText extends Component {

  constructor(){
    super()
    this.state = {
      value: "",
      showPass: true,
      press: false
    }
  }

  componentDidMount() {
    this.setState({
      value: this.props.value
    });
  }

  onChangeText = (value) => {
    this.setState({
      value
    }, () => {
      this.props.onChangeText(value);
    })
  }

  showPass = () =>{
    if(this.state.press == false){
      this.setState({ showPass: false, press: true })
    } else {
      this.setState({ showPass: true, press: false })
    }
  }

  render() {
    const {placeholder, keyboardType, maxLength, onSubmitEditing, icon} = this.props;
    return (
      <View>
        <Icon 
          style={{position: 'absolute', top: 18, left: 15}} 
          name={icon} 
          size={25} 
          color={'rgba(255,255,255, 0.7)'}/>
        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.8)"
          selectionColor="#999999"
          secureTextEntry={(placeholder != 'Password' && placeholder != 'Code Authentification') ? null : this.state.showPass}
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType="next"
          value={this.state.value}
          onSubmitEditing={onSubmitEditing}
          onChangeText={this.onChangeText} />
          {
            (placeholder != 'Password' && placeholder != 'Code Authentification') ? null :
            <TouchableOpacity
              style={{position: 'absolute', top: 18, right: 15}} 
              onPress={this.showPass}>
              <Icon 
                name={this.state.press == false ? 'md-eye': 'md-eye-off'} 
                size={25} 
                color={'rgba(255,255,255, 0.7)'}/>
            </TouchableOpacity>
          }
      </View>
    );
  }
}

InputText.defaultProps = defaultProps;

InputText.propTypes = propTypes;

export default InputText;
