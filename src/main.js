/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar ,
} from 'react-native';
import {connect} from "react-redux";

import Routes from './config/router';
import Splash from './pages/splash'
import colorConfig from "./config/colorConfig";

class Main extends Component {
  constructor(props) {
    super(props);
  
    this.state = { isLoading: true }
  }

  async componentDidMount() {
    const data = await this.performTimeConsumingTask();
  
    if (data !== null) {
      this.setState({ isLoading: false });
    }
  }

  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        3000
      )
    );
  }

	render() {
    const {authData:{isLoggedIn}} = this.props;

    if (this.state.isLoading) {
      return <Splash />;
    }

		return(
      <View style={styles.container}>
        <StatusBar
           backgroundColor="#83BC49"
           barStyle="light-content"
         />
        <Routes isLoggedIn={isLoggedIn} />
      </View>
    )
	}
}

const styles = StyleSheet.create({
  container : {
    flex: 1
  }
});

mapStateToProps = state => ({
  authData: state.authReducer.authData
})

export default connect(mapStateToProps, null)(Main)
