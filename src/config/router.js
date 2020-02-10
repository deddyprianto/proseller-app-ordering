/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {
  Router,
  Scene,
  CardStackStyleInterpolator,
} from 'react-native-router-flux';

import InputPhoneNumber from '../pages/InputPhoneNumber';
import InputEmail from '../pages/InputEmail';
import Signup from '../pages/signup';
import SignInPhoneNumber from '../pages/SignInPhoneNumber';
import SignInEmail from '../pages/SignInEmail';
import MobileRegister from '../pages/MobileRegister';
import EmailRegister from '../pages/EmailRegister';
import VerifyRegister from '../pages/VerifyRegister';
import Aunt from '../pages/aunt';
import VerifyCode from '../pages/verifyCode';
import ForgotPassword from '../pages/forgotPassword';
import PageIndex from '../pages/pageIndex';
import VerifyOtpAfterRegister from '../pages/VerifyOtpAfterRegister';
import VerifyOtpAfterRegisterEmail from '../pages/VerifyOtpAfterRegisterEmail';
import ChangeCredentials from '../pages/changeCredentials';

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
import MyVouchers from '../components/vouchers/MyVouchers';
import AllVouchers from '../components/vouchers/AllVouchers';
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

// order
import Order from '../pages/order';

export default class Routes extends Component {
  render() {
    return (
      <Router>
        <Scene>
          <Scene
            key="root"
            hideNavBar={true}
            swipeEnabled={false}
            animationEnabled={false}
            panHandlers={null}
            initial={!this.props.isLoggedIn}>
            <Scene
              key="inputPhoneNumber"
              component={InputPhoneNumber}
              initial={true}
            />
            <Scene key="signInPhoneNumber" component={SignInPhoneNumber} />
            <Scene key="signInEmail" component={SignInEmail} />
            <Scene key="inputEmail" component={InputEmail} />
            <Scene key="verifyRegister" component={VerifyRegister} />
            <Scene key="verifyOtpAfterRegister" component={VerifyOtpAfterRegister} />
            <Scene key="verifyOtpAfterRegisterEmail" component={VerifyOtpAfterRegisterEmail} />
            <Scene key="mobileRegister" component={MobileRegister} />
            <Scene key="emailRegister" component={EmailRegister} />
            <Scene key="signup" component={Signup} title="Register" />
            <Scene key="auth" component={Aunt} title="Auntetikasi" />
            <Scene key="verifyCode" component={VerifyCode} title="verifyCode" />
            <Scene key="signinWaitPassword" component={SigninWaitPassword} />
            <Scene
              key="forgotPassword"
              component={ForgotPassword}
              title="Forgot Password"
            />
          </Scene>
          <Scene
            duration={0}
            key="app"
            hideNavBar={true}
            initial={this.props.isLoggedIn}>
            <Scene
              duration={0}
              key="pageIndex"
              component={PageIndex}
              initial={true}
            />
            <Scene duration={0} key="pay" component={Pay} />
            <Scene duration={0} key="rewards" component={Rewards} />
            <Scene key="qrcode" component={RewardsQRmenu} />
            <Scene duration={0} key="scan" component={RewardsQRscan} />
            <Scene duration={0} key="voucher" component={VoucherDetail} />
            <Scene
              duration={0}
              key="historyDetailPayment"
              component={HistoryDetailPayment}
            />
            <Scene
              duration={0}
              key="storeDetailStores"
              component={StoreDetailStores}
            />
            <Scene
              duration={0}
              key="seeMorePromotion"
              component={StoreSeeMorePromotion}
            />
            <Scene
              duration={0}
              key="storeDetailPromotion"
              component={StoreDetailPromotion}
            />
            <Scene duration={0} key="storeSeeMap" component={StoresMap} />
            <Scene
              duration={0}
              key="myVouchers"
              component={MyVouchers}
            />
            <Scene
              duration={0}
              key="accountEditProfil"
              component={AccountEditProfil}
            />
            <Scene duration={0} key="editProfile" component={EditProfile} />
            <Scene duration={0} key="paymentDetail" component={PaymentDetail} />
            <Scene key="paymentSuccess" component={PaymentSuccess} />
            <Scene key="paymentAddVoucers" component={PaymentAddVoucers} />
            <Scene
              duration={0}
              key="paymentDetailItem"
              component={PaymentDetailItem}
            />
            <Scene key="inboxDetail" component={InboxDetail} />
            <Scene key="paymentAddPoint" component={PaymentAddPoint} />
            <Scene duration={0} key="detailStamps" component={RewardsStamps} />
            <Scene
              duration={0}
              key="changeCredentials"
              component={ChangeCredentials}
            />
            <Scene key="order" component={Order} />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
