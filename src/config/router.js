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
import SignInPhoneNumberWithPassword from '../pages/SignInPhoneNumberWithPassword';
import SignInEmail from '../pages/SignInEmail';
import SignInEmailWithPassword from '../pages/SignInEmailWithPassword';
import MobileRegister from '../pages/MobileRegister';
import MobileRegisterWithPassword from '../pages/MobileRegisterWithPassword';
import EmailRegister from '../pages/EmailRegister';
import EmailRegisterWithPassword from '../pages/EmailRegisterWithPassword';
import PageIndex from '../pages/pageIndex';
import VerifyOtpAfterRegister from '../pages/VerifyOtpAfterRegister';
import VerifyOtpAfterRegisterEmail from '../pages/VerifyOtpAfterRegisterEmail';
import VerifyRegister from '../pages/VerifyRegister';
import Store from '../pages/store';
import ScanBarcode from '../pages/ScanBarcode';

import Pay from '../components/rewardsPay';
import Rewards from '../components/rewardsRewards';
import RewardsQRmenu from '../components/rewardsQRmenu';
import RewardsQRscan from '../components/rewardsQRscan';
// import VoucherDetail from '../components/voucherDetail';
import DetailPoint from '../components/DetailPoint';
import HistoryDetailPayment from '../components/history/historyDetailPayment';
import StoreDetailStores from '../components/storeDetailStores';
import StoreSeeMorePromotion from '../components/storeSeeMorePromotion';
import StoreDetailPromotion from '../components/storeDetailPromotion';
import StoresMap from '../components/storesMap';
import MyVouchers from '../components/vouchers/MyVouchers';
import RedeemVoucher from '../components/vouchers/RedeemVouchers';
import AllVouchers from '../components/vouchers/AllVouchers';
import AccountEditProfil from '../components/accountEditProfil';
import EditProfile from '../components/editProfile';
import PaymentDetail from '../components/paymentDetail';
import PaymentSuccess from '../components/paymentSuccess';
import PaymentAddVoucers from '../components/paymentAddVoucers';
import PaymentDetailItem from '../components/paymentDetailItem';
import InboxDetail from '../components/inboxDetail';
import Inbox from '../pages/inbox';
import PaymentAddPoint from '../components/paymentAddPoint';
import RewardsStamps from '../components/rewardsStamps';
import Notifications from '../components/notifications/Notifications';

// order
import Order from '../pages/order';
import CategoryProducts from '../components/order/CategoryProducts';
import Products2 from '../components/order/Products2';
import Products from '../components/order/Products';
import Basket from '../components/order/Basket';
// import Cart from '../components/order/Cart';
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

// address
import ListAddress from '../components/address/ListAddress';
import AddAddress from '../components/address/AddAddress';
import SelectAddress from '../components/address/SelectAddress';
import EditAddress from '../components/address/EditAddress';
import ListLanguages from '../components/language/ListLanguages';

// referral
import ListReferral from '../components/referral/ListReferral';
import AddReferral from '../components/referral/AddReferral';
import Contacts from '../components/referral/Contacts';

import HostedTransaction from '../components/card/HostedTransaction';
import ChangeCredentials from '../pages/ChangeCredentials';
import ChangeCredentialsOTP from '../pages/ChangeCredentialsOTP';
import PickUpTime from '../components/order/PickUpTime';
import ProductsRetail from '../components/order/ProductsRetail';
import MenuCategory from '../components/order/MenuCategory';
import awsConfig from './awsConfig';
import ProductsSpecific from '../components/order/ProductsSpecific';
import TermsCondition from '../pages/TermCondition';
import Stores from '../pages/store';
import ListMembership from '../components/membership/ListMembership';
import DetailMembership from '../components/membership/DetailMembership';
import Summary from '../components/SVC/Summary';
import BuySVC from '../components/SVC/BuySVC';
import SVCDetail from '../components/SVC/SVCDetail';
import TransferSVC from '../components/SVC/TransferSVC';
import VirtualKeyboardCom from '../components/SVC/VirtualKeyboard';
import ApplyPromoCode from '../pages/ApplyPromoCode';
import PickCoordinate from '../pages/PickCoordinate';
import EGift from '../pages/EGift';
import SendEGift from '../pages/SendEGift';

// created by martin
import EStore from '../pages/EStore';
import ECard from '../pages/ECard';
import OnBoarding from '../pages/OnBoarding';
import Register from '../pages/Register';
import RegisterForm from '../pages/RegisterForm';
import Login from '../pages/Login';
import OTP from '../pages/OTP';
import Redeem from '../pages/Redeem';
import MyFavoriteOutlets from '../pages/MyFavoriteOutlets';
import FavoriteOutlets from '../pages/FavoriteOutlets';
import FavoriteOutletDetail from '../pages/FavoriteOutletDetail';
import OrderHere from '../pages/orderHere';
import Cart from '../pages/cart';
import VoucherDetail from '../pages/VoucherDetail';
import PointDetailAndHistory from '../pages/PointDetailAndHistory';
import MyDeliveryAddress from '../pages/MyDeliveryAddress';
import AddNewAddress from '../pages/AddNewAddress';
import HomeRetail from '../pages/HomeRetail';
import NewPageIndex from '../pages/NewPageIndex';
import ScannerBarcode from '../pages/ScannerBarcode';
import SearchProduct from '../pages/SearchProduct';
import FAQ from '../pages/FAQ';
import Referral from '../pages/Referral';
import WebviewPage from '../pages/WebviewPage';

//for temporary
import PendingOrderDetail from '../pages/PendingOrderDetail';
import InboxDetailMessage from '../pages/InboxDetailMessage';
import OrderingMode from '../pages/OrderingMode';
import Payment from '../pages/Payment';
import Membership from '../pages/Membership';
import MembershipAllTier from '../pages/MembershipAllTier';
import VoucherDetailV2 from '../pages/VoucherDetailV2/VoucherDetailV2';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import ContactUsBasic from '../pages/ContactUsBasic';
import ContactUsStarter from '../pages/ContactUsStarter';
import CartStep1 from '../pages/CartStep1';
import PromotionDetail from '../pages/PromotionDetail';
import ProductDetail from '../pages/ProductDetail';

const MyTransitionSpec = {
  duration: 200,
  // easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
  // timing: Animated.timing,
};

const transitionConfig = () => ({
  transitionSpec: MyTransitionSpec,
  // screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid,
  screenInterpolator: sceneProps => {
    const {layout, position, scene} = sceneProps;
    const {index} = scene;
    const width = layout.initWidth;

    ////right to left by replacing bottom scene
    return {
      transform: [
        {
          translateX: position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, -width],
          }),
        },
      ],
    };

    // const inputRange = [index - 1, index, index + 1];
    //
    // const opacity = position.interpolate({
    //   inputRange,
    //   outputRange: [0, 1, 0],
    // });
    //
    // const translateX = position.interpolate({
    //   inputRange,
    //   outputRange: [width, 0, 0],
    // });
    //
    // return {
    //   opacity,
    //   transform: [{translateX}],
    // };

    ////from center to corners
    // const inputRange = [index - 1, index, index + 1];
    // const opacity = position.interpolate({
    //     inputRange,
    //     outputRange: [0.8, 1, 1],
    // });

    // const scaleY = position.interpolate({
    //     inputRange,
    //     outputRange: ([0.8, 1, 1]),
    // });

    // return {
    //     opacity,
    //     transform: [
    //         { scaleY },
    //     ],
    // };
  },
});

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
      Actions.currentScene === 'pageIndex' ||
      Actions.currentScene === 'onBoarding'
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
      <Router uriPrefix={awsConfig.APP_DEEP_LINK}>
        <Scene>
          <Scene
            transitionConfig={transitionConfig}
            key="app"
            hideNavBar={true}>
            <Scene key="inputPhoneNumber" component={InputPhoneNumber} />
            <Scene key="signInPhoneNumber" component={SignInPhoneNumber} />
            <Scene
              key="signInPhoneNumberWithPassword"
              component={SignInPhoneNumberWithPassword}
            />
            <Scene key="signInEmail" component={SignInEmail} />
            <Scene
              key="signInEmailWithPassword"
              component={SignInEmailWithPassword}
            />
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
            <Scene key="inboxDetailMessage" component={InboxDetailMessage} />
            <Scene
              key="mobileRegisterWithPassword"
              component={MobileRegisterWithPassword}
            />
            <Scene key="emailRegister" component={EmailRegister} />
            <Scene
              key="emailRegisterWithPassword"
              component={EmailRegisterWithPassword}
            />
            <Scene key="listLanguages" component={ListLanguages} />
            <Scene key="pay" component={Pay} />
            <Scene key="rewards" component={Rewards} />
            <Scene key="qrcode" component={RewardsQRmenu} />
            <Scene
              key="scan"
              path={'/payment/:paymentRefNo/'}
              component={RewardsQRscan}
            />
            <Scene key="scanBarcode" component={ScanBarcode} />
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
            <Scene key="redeemVoucher" component={RedeemVoucher} />
            <Scene key="accountEditProfil" component={AccountEditProfil} />
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
            <Scene key="inbox" component={Inbox} />
            <Scene key="paymentAddPoint" component={PaymentAddPoint} />
            <Scene key="detailStamps" component={RewardsStamps} />
            <Scene key="detailPoint" component={DetailPoint} />
            <Scene key="order" component={Order} />
            <Scene key="categoryProducts" component={CategoryProducts} />
            <Scene key="productsMode2" component={ProductsRetail} />
            <Scene key="specificCategory" component={ProductsSpecific} />
            <Scene key="basket" component={Basket} />
            {/* <Scene key="cart" component={Cart} /> */}
            <Scene key="scanQRTable" component={ScanQRTable} />
            <Scene key="confirmTable" component={ConfirmTable} />
            <Scene key="settleOrder" component={SettleOrder} />
            <Scene key="waitingFood" component={WaitingFood} />
            <Scene key="QRCodeCart" component={QRCodeCart} />
            <Scene key="listCard" component={ListCard} />
            <Scene key="hostedPayment" component={HostedPayment} />
            <Scene key="hostedTrx" component={HostedTransaction} />
            <Scene key="detailCard" component={DetailCard} />
            <Scene key="paymentMethods" component={PaymentMethods} />
            <Scene key="paymentAddCard" component={PaymentAddCard} />
            <Scene key="listMembership" component={ListMembership} />
            <Scene key="detailMembership" component={DetailMembership} />
            <Scene key="listAddress" component={ListAddress} />
            <Scene key="addAddress" component={AddAddress} />
            <Scene key="pickCoordinate" component={PickCoordinate} />
            <Scene key="editAddress" component={EditAddress} />
            <Scene key="selectAddress" component={SelectAddress} />
            <Scene key="listLanguages" component={ListLanguages} />
            <Scene key="listReferral" component={ListReferral} />
            <Scene key="addReferral" component={AddReferral} />
            <Scene key="contacts" component={Contacts} />
            <Scene key="pickUpTime" component={PickUpTime} />
            <Scene key="changeCredentials" component={ChangeCredentials} />
            <Scene key="menuCategory" component={MenuCategory} />
            <Scene key="termsCondition" component={TermsCondition} />
            <Scene key="stores" component={Stores} />
            <Scene
              key="changeCredentialsOTP"
              component={ChangeCredentialsOTP}
            />
            <Scene key="summary" component={Summary} />
            <Scene key="buySVC" component={BuySVC} />
            <Scene key="SVCDetail" component={SVCDetail} />
            <Scene key="virtualKeyboard" component={VirtualKeyboardCom} />
            <Scene key="transferSVC" component={TransferSVC} />
            <Scene key="applyPromoCode" component={ApplyPromoCode} />
            <Scene key="editProfile" component={EditProfile} />
            <Scene key="verifyRegister" component={VerifyRegister} />
            <Scene key="notifications" component={Notifications} />
            {/* //martin */}
            {/* <Scene key="pageIndex" component={PageIndex} initial={true} /> */}
            <Scene key="pageIndex" component={NewPageIndex} initial={true} />
            <Scene key="eStore" component={EStore} />
            <Scene key="eCard" component={ECard} />
            <Scene key="onBoarding" component={OnBoarding} />
            <Scene key="register" component={Register} />
            <Scene key="registerForm" component={RegisterForm} />
            <Scene key="otp" component={OTP} />
            <Scene key="login" component={Login} />
            <Scene key="eGift" component={EGift} />
            <Scene key="sendEGift" component={SendEGift} />
            <Scene key="orderHere" component={OrderHere} />
            <Scene key="cart" component={Cart} />
            <Scene key="redeem" component={Redeem} />
            <Scene key="myFavoriteOutlets" component={MyFavoriteOutlets} />
            <Scene key="favoriteOutlets" component={FavoriteOutlets} />
            <Scene
              key="favoriteOutletDetail"
              component={FavoriteOutletDetail}
            />
            <Scene key="voucherDetail" component={VoucherDetail} />
            <Scene
              key="pointDetailAndHistory"
              component={PointDetailAndHistory}
            />
            <Scene key="myDeliveryAddress" component={MyDeliveryAddress} />
            <Scene key="addNewAddress" component={AddNewAddress} />
            <Scene key="pendingOrderDetail" component={PendingOrderDetail} />
            <Scene key="homeRetail" component={HomeRetail} />
            <Scene key="scannerBarcode" component={ScannerBarcode} />
            <Scene key="searchProduct" component={SearchProduct} />
            <Scene key="faq" component={FAQ} />
            <Scene key="referral" component={Referral} />
            <Scene key="policy" component={WebviewPage} />

            <Scene key="orderingMode" component={OrderingMode} />
            <Scene key="payment" component={Payment} />
            <Scene key="contactUs" component={ContactUsBasic} />
            <Scene key="voucherV2" component={VoucherDetailV2} />
            <Scene key="contactUsBasic" component={ContactUsBasic} />
            <Scene key="contactUsStarter" component={ContactUsStarter} />

            <Scene key="membership" component={Membership} />
            <Scene key="membershipAllTier" component={MembershipAllTier} />
            <Scene key="privacyPolicy" component={PrivacyPolicy} />
            <Scene key="cartStep1" component={CartStep1} />
            <Scene key="promotionDetail" component={PromotionDetail} />
            <Scene key="productDetail" component={ProductDetail} />

            {/* //martin */}
          </Scene>
        </Scene>
      </Router>
    );
  }
}
