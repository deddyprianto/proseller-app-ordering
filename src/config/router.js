/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, { Component } from 'react';
import {Router, Scene} from 'react-native-router-flux';

import Signin from '../pages/signin';
import Signup from '../pages/signup';
import Aunt from '../pages/aunt';
import PageIndex from "../pages/pageIndex";

export default class Routes extends Component {
	render() {
		return(
			<Router>
        <Scene>
          <Scene key="root" hideNavBar={true} initial={this.props.isLoggedIn}>
            <Scene key="signin" component={Signin} initial={true} />
            <Scene key="signup" component={Signup} title="Register" />
            <Scene key="auth" component={Aunt} title="Auntetikasi" />
          </Scene>
          <Scene key="app" hideNavBar={true} initial={!this.props.isLoggedIn}>
            <Scene key="pageIndex" component={PageIndex} initial={true} />
          </Scene>
        </Scene>
      </Router>
		)
	}
}
