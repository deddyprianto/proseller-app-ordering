/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import React, {Component} from 'react';
import {Router, Scene, Actions} from 'react-native-router-flux';

import InputPhoneNumber from '../pages/InputPhoneNumber';
import InputEmail from '../pages/InputEmail';
import SignInPhoneNumber from '../pages/SignInPhoneNumber';
import SignInEmail from '../pages/SignInEmail';
import MobileRegister from '../pages/MobileRegister';
import EmailRegister from '../pages/EmailRegister';
import PageIndex from '../pages/pageIndex';
import VerifyOtpAfterRegister from '../pages/VerifyOtpAfterRegister';
import VerifyOtpAfterRegisterEmail from '../pages/VerifyOtpAfterRegisterEmail';
import VerifyRegister from '../pages/VerifyRegister';
import Store from '../pages/store';

import Pay from '../components/rewardsPay';
import Rewards from '../components/rewardsRewards';
import RewardsQRmenu from '../components/rewardsQRmenu';
import RewardsQRscan from '../components/rewardsQRscan';
import VoucherDetail from '../components/voucherDetail';
import HistoryDetailPayment from '../components/history/historyDetailPayment';
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
import PaymentAddPoint from '../components/paymentAddPoint';
import RewardsStamps from '../components/rewardsStamps';

// order
import Order from '../pages/order';
import CategoryProducts from '../components/order/CategoryProducts';
import Products from '../components/order/Products';
import Products2 from '../components/order/Products2';
import Basket from '../components/order/Basket';
import ScanQRTable from '../components/order/ScanQRTable';
import ConfirmTable from '../components/order/ConfirmTable';
import SettleOrder from '../components/order/SettleOrder';
import WaitingFood from '../components/order/WaitingFood';
import {BackHandler, ToastAndroid} from 'react-native';

// card
import ListCard from '../components/card/ListCard';
import HostedPayment from '../components/card/HostedPayment';
import DetailCard from '../components/card/DetailCard';
import PaymentMethods from '../components/card/PaymentMethods';
import PaymentAddCard from '../components/card/PaymentAddCard';
import QRCodeCart from '../components/order/QRCodeCart';

let backPressed = 0;

export default class Routes extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  constructor() {
    super();
    this.state = {
      backPressed: 1,
    };
  }

  handleBackButton = () => {
    if (
      Actions.currentScene === 'inputPhoneNumber' ||
      Actions.currentScene === 'pageIndex'
    ) {
      if (backPressed > 0) {
        BackHandler.exitApp();
        backPressed = 0;
      } else {
        backPressed++;
        ToastAndroid.show('Press Again To Exit', ToastAndroid.SHORT);
        setTimeout(() => {
          backPressed = 0;
        }, 2000);
        return true;
      }
    }
  };

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
            <Scene
              key="verifyOtpAfterRegister"
              component={VerifyOtpAfterRegister}
            />
            <Scene
              key="verifyOtpAfterRegisterEmail"
              component={VerifyOtpAfterRegisterEmail}
            />
            <Scene key="mobileRegister" component={MobileRegister} />
            <Scene key="verifyRegister" component={VerifyRegister} />
            <Scene key="emailRegister" component={EmailRegister} />
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
            <Scene key="store" component={Store} />
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
            <Scene
              key="paymentSuccess"
              component={PaymentSuccess}
              drawerLockMode="locked-closed"
              gesturesEnabled={false}
            />
            <Scene key="paymentAddVoucers" component={PaymentAddVoucers} />
            <Scene key="paymentDetailItem" component={PaymentDetailItem} />
            <Scene key="inboxDetail" component={InboxDetail} />
            <Scene key="paymentAddPoint" component={PaymentAddPoint} />
            <Scene key="detailStamps" component={RewardsStamps} />
            <Scene key="order" component={Order} />
            <Scene key="categoryProducts" component={CategoryProducts} />
            <Scene key="products" component={Products} />
            <Scene key="productsMode2" component={Products2} />
            <Scene key="basket" component={Basket} />
            <Scene key="scanQRTable" component={ScanQRTable} />
            <Scene key="confirmTable" component={ConfirmTable} />
            <Scene key="settleOrder" component={SettleOrder} />
            <Scene key="waitingFood" component={WaitingFood} />
            <Scene key="QRCodeCart" component={QRCodeCart} />

            <Scene key="listCard" component={ListCard} />
            <Scene key="hostedPayment" component={HostedPayment} />
            <Scene key="detailCard" component={DetailCard} />
            <Scene key="paymentMethods" component={PaymentMethods} />
            <Scene key="paymentAddCard" component={PaymentAddCard} />
          </Scene>
        </Scene>
      </Router>
    );
  }
}
