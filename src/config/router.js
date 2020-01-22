/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {Router, Scene} from 'react-native-router-flux';

import Signin from '../pages/signin';
import Signup from '../pages/signup';
import Aunt from '../pages/aunt';
import ForgotPassword from '../pages/forgotPassword';
import PageIndex from '../pages/pageIndex';

import Pay from '../components/rewardsPay';
import Rewards from '../components/rewardsRewards';
import RewardsQRmenu from '../components/rewardsQRmenu';
import RewardsQRscan from '../components/rewardsQRscan';
import VoucherDetail from '../components/voucherDetail';
import HistoryDetailPayment from '../components/historyDetailPayment';
import StoreDetailStores from '../components/storeDetailStores';
import StoreSeeMorePromotion from '../components/storeSeeMorePromotion';
import StoreDetailPromotion from '../components/storeDetailPromotion';
import StoresMap from '../components/storesMap';
import AccountVouchers from '../components/accountVouchers';
import AccountEditProfil from '../components/accountEditProfil';
import EditProfile from '../components/editProfile';
import PaymentDetail from '../components/paymentDetail';
import PaymentSuccess from '../components/paymentSuccess';
import PaymentAddVoucers from '../components/paymentAddVoucers';
import PaymentDetailItem from '../components/paymentDetailItem';
import InboxDetail from '../components/inboxDetail';
import SigninWaitPassword from '../components/signinWaitPassword';
import PaymentAddPoint from '../components/paymentAddPoint';
import RewardsStamps from '../components/rewardsStamps';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Scene>
          <Scene key="root" hideNavBar={true} initial={!this.props.isLoggedIn}>
            <Scene key="signin" component={Signin} initial={true} />
            <Scene key="signup" component={Signup} title="Register" />
            <Scene key="auth" component={Aunt} title="Auntetikasi" />
            <Scene key="signinWaitPassword" component={SigninWaitPassword} />
            <Scene
              key="forgotPassword"
              component={ForgotPassword}
              title="Forgot Password"
            />
          </Scene>
          <Scene key="app" hideNavBar={true} initial={this.props.isLoggedIn}>
            <Scene key="pageIndex" component={PageIndex} initial={true} />
            <Scene key="pay" component={Pay} />
            <Scene key="rewards" component={Rewards} />
            <Scene key="qrcode" component={RewardsQRmenu} />
            <Scene key="scan" component={RewardsQRscan} />
            <Scene key="voucher" component={VoucherDetail} />
            <Scene
              key="historyDetailPayment"
              component={HistoryDetailPayment}
            />
            <Scene key="storeDetailStores" component={StoreDetailStores} />
            <Scene key="seeMorePromotion" component={StoreSeeMorePromotion} />
            <Scene
              key="storeDetailPromotion"
              component={StoreDetailPromotion}
            />
            <Scene key="storeSeeMap" component={StoresMap} />
            <Scene key="accountVouchers" component={AccountVouchers} />
            <Scene key="accountEditProfil" component={AccountEditProfil} />
            <Scene key="editProfile" component={EditProfile} />
            <Scene key="paymentDetail" component={PaymentDetail} />
            <Scene key="paymentSuccess" component={PaymentSuccess} />
            <Scene key="paymentAddVoucers" component={PaymentAddVoucers} />
            <Scene key="paymentDetailItem" component={PaymentDetailItem} />
            <Scene key="inboxDetail" component={InboxDetail} />
            <Scene key="paymentAddPoint" component={PaymentAddPoint} />
            <Scene key="detailStamps" component={RewardsStamps} />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
