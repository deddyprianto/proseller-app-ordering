/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {connect} from "react-redux";

import {logoutUser} from "../actions/auth.actions";
import colorConfig from "../config/colorConfig";

const styles = StyleSheet.create({
  container : {
    backgroundColor:colorConfig.home.container,
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  textStyle: {
      color: colorConfig.home.textStyle,
      fontSize: 18,
      textAlign: 'center'
  },
  button: {
    width:300,
    backgroundColor: colorConfig.home.button,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color: colorConfig.home.buttonText,
    textAlign:'center'
  },
});

class Home extends Component {

  logoutUser = () => {
    this.props.dispatch(logoutUser());
  }

	render() {
    const {getUser: {userDetails}} = this.props;
    console.log(userDetails)

		return(
			<View style={styles.container}>
          <Text style={styles.textStyle}>This is a profile page for {userDetails ? userDetails.email : ""}</Text>
          <TouchableOpacity style={styles.button} onPress={this.logoutUser}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
			</View>
    )
	}
}

mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser
});

mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
