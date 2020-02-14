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
import CategoryProducts from '../components/order/CategoryProducts';
import Products from '../components/order/Products';
import Basket from '../components/order/Basket';

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
            <Scene
              key="verifyOtpAfterRegister"
              component={VerifyOtpAfterRegister}
            />
            <Scene
              key="verifyOtpAfterRegisterEmail"
              component={VerifyOtpAfterRegisterEmail}
            />
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
            <Scene key="myVouchers" component={MyVouchers} />
            <Scene key="accountEditProfil" component={AccountEditProfil} />
            <Scene key="editProfile" component={EditProfile} />
            <Scene key="paymentDetail" component={PaymentDetail} />
            <Scene key="paymentSuccess" component={PaymentSuccess} />
            <Scene key="paymentAddVoucers" component={PaymentAddVoucers} />
            <Scene key="paymentDetailItem" component={PaymentDetailItem} />
            <Scene key="inboxDetail" component={InboxDetail} />
            <Scene key="paymentAddPoint" component={PaymentAddPoint} />
            <Scene key="detailStamps" component={RewardsStamps} />
            <Scene key="changeCredentials" component={ChangeCredentials} />
            <Scene key="order" component={Order} />
            <Scene key="categoryProducts" component={CategoryProducts} />
            <Scene key="products" component={Products} />
            <Scene key="basket" component={Basket} />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
