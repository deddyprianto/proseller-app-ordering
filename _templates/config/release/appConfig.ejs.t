---
to: src/config/appConfig.js
force: true
---
//Search "ICON" for icons
//Search "IMAGE" for images

const appConfig = {
  // info company
  appName: '<%= name.toLowerCase() %>',
  appMataUang: 'SGD',
  appVersion: 'Version 1.1',

  // image company
  appImageNull: require('../assets/img/logo.png'),
  userQRCode: require('../../assets/img/qrcode.jpg'),
  foodPlaceholder: require('../../assets/img/food-placeholder.jpg'),
  welcomeLogo: require('../../assets/img/welcome-logo.png'),
  dbsLogo: require('../../assets/img/dbs.png'),
  // button
  appButtonSignin: require('../../assets/img/button_sigin.png'),
  appButtonFB: require('../../assets/img/button_fb.png'),
  arrowRight: require('../../assets/img/arrow-right.png'),
  appLogoFB: require('../../assets/img/logo_fb.png'),
  appFormSignin: require('../../assets/img/form_signin.png'),
  // other setting
  appStatusLoginOther: true,
  appStatusBackgroundScreen: true,

  //  image template
  emptyBox: require('../../assets/component/empty-box.png'),
  newSearch: require('../../assets/component/find-food.png'),
  productPlaceholder: require('../../assets/component/product-placeholder.png'),

  notes: require('../assets/img/notes.png'),

  test: require('../assets/img/test.png'),
  termsAndConditions: require('../assets/img/termsAndConditions.png'),
  logout: require('../assets/img/logout.png'),
  notifications: require('../assets/img/notifications.png'),
  editProfile: require('../assets/img/editProfile.png'),
  star: require('../assets/img/star.png'),
  warning: require('../assets/img/warning.png'),
  location: require('../assets/img/icon-location.png'),

  //should be dynamic
  logoMerchant: require('../../native/<%= name.toLowerCase() %>/assets/img/logo.png'),
  logoMerchantWithBackground: require('../../native/<%= name.toLowerCase() %>/assets/img/logo-merchant-with-background.png'),
  imageOnBoarding1: require('../../native/<%= name.toLowerCase() %>/assets/img/image-on-boarding-1.png'),
  imageOnBoarding2: require('../../native/<%= name.toLowerCase() %>/assets/img/image-on-boarding-2.png'),
  imageOnBoarding3: require('../../native/<%= name.toLowerCase() %>/assets/img/image-on-boarding-3.png'),
  <% if (name.toLowerCase() === "fareastflora") { %>
  imageOnBoarding4: require('../../native/<%= name.toLowerCase() %>/assets/img/image-on-boarding-4.png'),
  <% } %>
  imagePointSmallBackground: require('../../native/<%= name.toLowerCase() %>/assets/img/image-point-small-background.png'),
  imagePointLargeBackground: require('../../native/<%= name.toLowerCase() %>/assets/img/image-point-large-background.png'),
  //LOGO MARTIN
  // logoMerchant: require('../assets/img/logo.png'),
  // logoMerchantWithBackground: require('../assets/img/logo-merchant-with-background.png'),

  //IMAGE
  imageAdditionalBanner: require('../assets/img/image-additional-banner.jpg'),

  imageBackground: require('../assets/img/image-background.png'),

  imageEmptyDeliveryAddress: require('../assets/img/image-empty-address.png'),

  imageFavoriteOutlet: require('../assets/img/image-favorite-outlet.png'),

  imageEmptyProduct: require('../assets/img/image-empty-product.png'),

  // imageOnBoarding1: require('../assets/img/image-on-boarding-1.png'),
  // imageOnBoarding2: require('../assets/img/image-on-boarding-2.png'),
  // imageOnBoarding3: require('../assets/img/image-on-boarding-3.png'),

  imageOrderNotAvailable: require('../assets/img/image-order-not-available.png'),

  imagePromotionBackground: require('../assets/img/image-promotion-background.png'),
  // imagePointSmallBackground: require('../assets/img/image-point-small-background.png'),
  // imagePointLargeBackground: require('../assets/img/image-point-large-background.png'),

  imageRedeemed: require('../assets/img/image-redeemed.png'),

  //ICON
  iconArrowUp: require('../assets/img/icon-arrow-up.png'),
  iconArrowDown: require('../assets/img/icon-arrow-down.png'),
  iconArrowLeft: require('../assets/img/icon-arrow-left.png'),
  iconArrowRight: require('../assets/img/icon-arrow-right.png'),

  iconCart: require('../assets/img/icon-cart.png'),
  iconCheck: require('../assets/img/icon-check.png'),
  iconClose: require('../assets/img/icon-close.png'),
  iconCopy: require('../assets/img/icon-copy.png'),

  iconDelete: require('../assets/img/icon-delete.png'),
  iconDeliveryProvider: require('../assets/img/icon-delivery-provider.png'),

  iconEdit: require('../assets/img/icon-edit.png'),
  iconEditProfile: require('../assets/img/icon-edit-profile.png'),
  iconEmail: require('../assets/img/icon-email.png'),

  iconFAQ: require('../assets/img/icon-faq.png'),

  iconHome: require('../assets/img/icon-home.png'),
  iconHomeEStore: require('../assets/img/icon-home-e-store.png'),
  iconHomeECard: require('../assets/img/icon-home-e-card.png'),
  iconHomeOutlet: require('../assets/img/icon-home-outlet.png'),
  iconHomeSendAGift: require('../assets/img/icon-home-send-a-gift.png'),
  iconHistory: require('../assets/img/icon-history.png'),

  iconInformation: require('../assets/img/icon-information.png'),

  iconKeyboard: require('../assets/img/icon-keyboard.png'),

  iconLogin: require('../assets/img/icon-login.png'),
  iconLogout: require('../assets/img/icon-logout.png'),
  iconLocation: require('../assets/img/icon-location.png'),

  iconMoreMenu: require('../assets/img/icon-more-menu.png'),
  iconMinus: require('../assets/img/icon-minus.png'),
  iconMyVoucher: require('../assets/img/icon-my-voucher.png'),

  iconNotification: require('../assets/img/icon-notification.png'),
  iconNotes: require('../assets/img/icon-notes.png'),

  iconOrderingModeTakeAway: require('../assets/img/icon-ordering-mode-take-away.png'),
  iconOrderingModeDelivery: require('../assets/img/icon-ordering-mode-delivery.png'),
  iconOrderingModeStorePickUp: require('../assets/img/icon-ordering-mode-store-pick-up.png'),

  iconPoint: require('../assets/img/icon-point.png'),
  iconPointBar: require('../assets/img/icon-point-bar.png'),
  iconPlus: require('../assets/img/icon-plus.png'),
  iconPayment: require('../assets/img/icon-payment.png'),
  iconProfile: require('../assets/img/icon-profile.png'),
  iconPromoStar: require('../assets/img/icon-promo-star.png'),

  iconQRCode: require('../assets/img/icon-qr-code.png'),

  iconReward: require('../assets/img/icon-reward.png'),
  iconReferral: require('../assets/img/icon-referral.png'),

  iconSVC: require('../assets/img/icon-svc.png'),
  iconSearch: require('../assets/img/icon-search.png'),
  iconScan: require('../assets/img/icon-scan.png'),
  iconShare: require('../assets/img/icon-share.png'),
  iconStepGift: require('../assets/img/icon-step-gift.png'),
  iconStepLogin: require('../assets/img/icon-step-login.png'),
  iconStepSend: require('../assets/img/icon-step-send.png'),

  iconTermsAndConditions: require('../assets/img/icon-terms-and-conditions.png'),

  iconVoucher: require('../assets/img/icon-voucher.png'),

  iconWarning: require('../assets/img/icon-warning.png'),
};

export default appConfig;
