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

import Pay from "../components/rewardsPay";
import Rewards from "../components/rewardsRewards";
import RewardsQRmenu from "../components/rewardsQRmenu";
import RewardsQRscan from "../components/rewardsQRscan";

export default class Routes extends Component {
	render() {
		return(
			<Router>
        <Scene>
          <Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
            <Scene key="signin" component={Signin} initial={true} />
            <Scene key="signup" component={Signup} title="Register" />
            <Scene key="auth" component={Aunt} title="Auntetikasi" />
          </Scene>
          <Scene key="app" hideNavBar={true} initial={this.props.isLoggedIn}>
            <Scene key="pageIndex" component={PageIndex} initial={true} />
            <Scene key="pay" component={Pay} />
            <Scene key="rewards" component={Rewards} />
            <Scene key="qrcode" component={RewardsQRmenu} />
            <Scene key="scan" component={RewardsQRscan} />
          </Scene>
        </Scene>
      </Router>
		)
	}
}
