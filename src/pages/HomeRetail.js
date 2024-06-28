/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';

import Banner from '../components/banner';
import Header from '../components/layout/header';
import ProductCategoryList from '../components/productCategoryList';
import ProductSubCategoryList from '../components/productSubCategoryList';
import ProductList from '../components/productList';
import ButtonCartFloating from '../components/buttonCartFloating';

import {isEmptyArray, isEmptyObject} from '../helper/CheckEmpty';

import appConfig from '../config/appConfig';

import {getProductByOutlet} from '../actions/product.action';
import {getSVCBalance} from '../actions/SVC.action';
import {dataPointHistory} from '../actions/rewards.action';
import {dataTransaction} from '../actions/sales.action';

import Theme from '../theme';
import {myVouchers} from '../actions/account.action';
import {getUserProfile} from '../actions/user.action';
import {dataPromotion} from '../actions/promotion.action';
import {Body} from '../components/layout';
import {getTermsConditions, getBasket} from '../actions/order.action';
import {
  normalizeLayoutSizeHeight,
  normalizeLayoutSizeWidth,
} from '../helper/Layout';
import {dataStores} from '../actions/stores.action';
import BannerFnB from '../components/bannerFnB';
import additionalSetting from '../config/additionalSettings';
import PointSvg from '../assets/svg/PointSvg';
import VoucherSvg from '../assets/svg/VoucherSvg';
import SvcSvg from '../assets/svg/SvcSvg';
import {navigate} from '../utils/navigation.utils';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      maxWidth: '100%',
    },
    body: {
      flex: 1,
      marginTop: 10,
      width: '100%',
      paddingHorizontal: 16,
    },
    dividerVertical: {
      height: '100%',
      width: 1,
      backgroundColor: theme.colors.brandSecondary,
    },
    dividerHorizontal: {
      flex: 1,
      height: 1,
      maxHeight: 1,
      marginTop: 16,
      marginHorizontal: 16,
      backgroundColor: theme.colors.brandPrimary,
    },
    textProductCategories: {
      margin: 16,
      color: theme.colors.textPrimary,
      fontSize: theme.fontSize[16],
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textMenuBarChildTitle: {
      fontSize: theme.fontSize[14],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textMenuBarChildValue: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    textHeaderTitle: {
      paddingTop: 2,
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewHeaderTitle: {
      flex: 1,
      minHeight: 36,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.accent,
    },
    viewMenuBar: {
      elevation: 2,
      marginTop: normalizeLayoutSizeHeight(32),
      paddingVertical: 16,
      borderRadius: 8,
      marginHorizontal: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.brandPrimary,
    },
    viewMenuBarChild: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewMenuBarChildImage: {
      padding: 5,
      borderRadius: 50,
      backgroundColor: theme.colors.buttonStandBy,
    },
    viewFloatingButton: {
      elevation: 5,
      position: 'absolute',
      bottom: 100,
      right: 18,
      width: 70,
      height: 70,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
    },
    viewFloatingButtonWithoutCartNotify: {
      elevation: 5,
      position: 'absolute',
      bottom: 32,
      right: 18,
      width: 70,
      height: 70,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
    },
    iconMenuBarChild: {
      height: 24,
      width: 24,
    },
    iconArrowUp: {
      width: 26,
      height: 16,
      tintColor: theme.colors.brandPrimary,
    },
    iconArrowDown: {
      marginLeft: 4,
      width: 16,
      height: 12,
      tintColor: theme.colors.textQuaternary,
    },
    marginBottom30: {
      marginBottom: 30,
    },
    scrollContainer: {
      paddingBottom: 80,
    },
    viewInfoBar: {
      elevation: 2,
      marginTop: normalizeLayoutSizeHeight(32),
      padding: 16,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.errorColor,
    },
    txtSeeAll: {
      color: theme.colors.primary,
      fontSize: theme.fontSize[14],
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    btnSeeAll: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    txtInfoTransaction: {
      fontSize: theme.fontSize[14],
      color: theme.colors.background,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewInfoBarContainer: {
      marginHorizontal: 16,
    },
  });
  return styles;
};

const HomeRetail = props => {
  const ref = useRef();
  const styles = useStyles();
  const dispatch = useDispatch();
  const {navigation} = props;
  const [productsLimitLength, setProductsLimitLength] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});
  const [isShowFloatingButton, setIsShowFloatingButton] = useState(false);
  const [productListPosition, setProductListPosition] = useState(0);
  const theme = Theme();
  const bannerSize = useSelector(
    state => state.settingReducer?.bannerSizeSettings?.bannerSize,
  );
  const orderingSetting = useSelector(
    state => state.orderReducer.orderingSetting?.orderingSetting?.settings,
  );
  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  const productOutletTitle = useSelector(
    state => state.productReducer.productsOutlet.name,
  );
  const productOutletCategories = useSelector(
    state => state.productReducer.productsOutlet.data,
  );

  const subCategories = useSelector(
    state => state.productReducer.productSubCategories,
  );

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  const orderHistory = useSelector(
    state => state.rewardsReducer?.dataPoint?.pointTransaction,
  );

  const vouchers = useSelector(
    state => state.accountsReducer?.myVouchers?.vouchers,
  );

  const products = useSelector(
    state => state.productReducer.productsBySubCategory,
  );

  const svcBalance = useSelector(state => state.SVCReducer.balance.balance);
  const stores = useSelector(state => state.storesReducer?.dataStores?.stores);

  const intlData = useSelector(state => state.intlData);

  useEffect(() => {
    const loadData = async () => {
      const result = productOutletCategories?.find(
        category => category?.id === selectedCategory?.id,
      )?.items;

      if (!isEmptyObject(result)) {
        const filterTypeProduct = result?.filter(
          value => value.itemType === 'PRODUCT',
        );

        const filterTypeGroup = result?.filter(
          value => value.itemType === 'GROUP',
        );

        const isTypeProductPriority =
          filterTypeProduct?.length > filterTypeGroup?.length;

        if (isTypeProductPriority) {
          await dispatch({
            type: 'DATA_PRODUCT_SUB_CATEGORIES',
            subCategories: [],
          });
          await dispatch({
            type: 'DATA_PRODUCTS_BY_SUB_CATEGORY',
            products: filterTypeProduct,
          });
        } else {
          await dispatch({
            type: 'DATA_PRODUCT_SUB_CATEGORIES',
            subCategories: filterTypeGroup,
          });
          setSelectedSubCategory(filterTypeGroup[0]);
        }
      } else {
        await dispatch({
          type: 'DATA_PRODUCT_SUB_CATEGORIES',
          subCategories: [],
        });
        await dispatch({
          type: 'DATA_PRODUCTS_BY_SUB_CATEGORY',
          products: [],
        });
      }
    };

    loadData();
  }, [selectedCategory, productOutletCategories, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      const result = subCategories?.find(
        subCategory => subCategory?.id === selectedSubCategory?.id,
      )?.items;

      await dispatch({
        type: 'DATA_PRODUCTS_BY_SUB_CATEGORY',
        products: result,
      });
    };

    if (!isEmptyObject(selectedSubCategory) && !isEmptyObject(subCategories)) {
      loadData();
    }
  }, [selectedSubCategory, subCategories, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    const response = await dispatch(getProductByOutlet(defaultOutlet.id));
    await dispatch(dataStores());
    await dispatch(getTermsConditions());
    await dispatch(getBasket());
    await dispatch(getSVCBalance());
    await dispatch(dataPointHistory());
    await dispatch(myVouchers());
    await dispatch(getUserProfile());
    await dispatch(dataPromotion());
    await dispatch(dataTransaction());
    response?.data && setSelectedCategory(response.data[0]);
    setRefresh(false);
  }, [dispatch, defaultOutlet]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 50;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleShowFloatingButton = value => {
    if (value > productListPosition) {
      setIsShowFloatingButton(true);
    } else {
      setIsShowFloatingButton(false);
    }
  };

  const onStorePress = () => {
    if (stores?.length > 1) {
      return navigate('store');
    }
    return null;
  };

  const renderHeaderTitle = () => {
    if (refresh) {
      return null;
    }
    if (stores?.length <= 1 && !additionalSetting().hideLabelForSingleOutlet) {
      return null;
    }
    return (
      <Pressable style={styles.viewHeaderTitle} onPress={onStorePress}>
        <Text numberOfLines={1} style={styles.textHeaderTitle}>
          {defaultOutlet?.name}
        </Text>
        {stores?.length > 1 ? (
          <Image
            style={styles.iconArrowDown}
            source={appConfig.iconArrowDown}
          />
        ) : null}
      </Pressable>
    );
  };

  const renderVerticalDivider = () => {
    return <View style={styles.dividerVertical} />;
  };

  const renderMenuBarPoint = () => {
    const point = totalPoint || '0';
    return (
      <TouchableOpacity
        style={styles.viewMenuBarChild}
        onPress={() => {
          navigate('detailPoint', {intlData});
        }}>
        <View style={styles.viewMenuBarChildImage}>
          <PointSvg height={24} color={theme.colors.brandTertiary} />
        </View>
        <Text style={styles.textMenuBarChildTitle}>My Points</Text>
        <Text style={styles.textMenuBarChildValue}>{point} PTS</Text>
      </TouchableOpacity>
    );
  };

  const renderMenuBarVoucher = () => {
    const vouchersLength = vouchers?.length || '0';
    return (
      <TouchableOpacity
        style={styles.viewMenuBarChild}
        onPress={() => {
          navigate('voucherV2');
        }}>
        <View style={styles.viewMenuBarChildImage}>
          <VoucherSvg height={24} color={theme.colors.brandTertiary} />
        </View>
        <Text style={styles.textMenuBarChildTitle}>My Vouchers</Text>
        <Text style={styles.textMenuBarChildValue}>{vouchersLength}</Text>
      </TouchableOpacity>
    );
  };

  const renderMenuBarSVC = () => {
    const balance = svcBalance || 0;
    const svcValue = orderingSetting?.find(
      setting => setting.settingKey === 'ShowSvcOnProfileSubMenu',
    );
    if (svcValue?.settingValue === false) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.viewMenuBarChild}
        onPress={() => {
          navigate('summary');
        }}>
        <View style={styles.viewMenuBarChildImage}>
          <SvcSvg color={theme.colors.brandTertiary} height={24} />
        </View>
        <Text style={styles.textMenuBarChildTitle}>SVC Balance</Text>
        <Text style={styles.textMenuBarChildValue}>{balance}</Text>
      </TouchableOpacity>
    );
  };

  const renderMenuBar = () => {
    return (
      <View style={styles.viewMenuBar}>
        {renderMenuBarPoint()}
        {renderVerticalDivider()}
        {renderMenuBarVoucher()}
        {renderVerticalDivider()}
        {renderMenuBarSVC()}
      </View>
    );
  };

  const isUnverifiedOrder = arr => {
    return arr?.some(
      obj =>
        obj.hasOwnProperty('isVerified') &&
        obj.isVerified === false &&
        obj.orderingMode === 'STORECHECKOUT',
    );
  };

  const renderTransactionInfoBar = () => {
    if (isUnverifiedOrder(orderHistory)) {
      return (
        <View style={styles.viewInfoBarContainer}>
          <View style={styles.viewInfoBar}>
            <Text style={styles.txtInfoTransaction}>
              You have unverified transaction(s)
            </Text>
            <TouchableOpacity
              style={styles.btnSeeAll}
              onPress={() => {
                navigation.navigate('Orders');
              }}>
              <Text style={styles.txtSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const renderFloatingButtonToTop = () => {
    if (isShowFloatingButton) {
      const styleView = !isEmptyArray(basket?.details)
        ? styles.viewFloatingButton
        : styles.viewFloatingButtonWithoutCartNotify;

      return (
        <TouchableOpacity
          style={styleView}
          onPress={() => {
            ref.current.scrollTo(0);
          }}>
          <Image source={appConfig.iconArrowUp} style={styles.iconArrowUp} />
        </TouchableOpacity>
      );
    }
  };

  const renderBanner = () => {
    return (
      <>
        {bannerSize ? (
          <BannerFnB bottom={normalizeLayoutSizeWidth(-26)} placement={'top'} />
        ) : (
          <Banner bottom={normalizeLayoutSizeWidth(-26)} />
        )}
      </>
    );
  };

  const renderProductCategoryList = () => {
    const enableMoreCategories = orderingSetting?.find(
      setting => setting.settingKey === 'ShowAllCategory',
    );
    const isEnableMoreCategories = enableMoreCategories?.settingValue;
    return (
      <View>
        <Text style={styles.textProductCategories}>{productOutletTitle}</Text>
        <ProductCategoryList
          categories={productOutletCategories}
          selectedCategory={selectedCategory}
          onClick={item => {
            setSelectedCategory(item);
            setProductsLimitLength(10);
          }}
          isIndicator
          isScroll
          horizontal
          isMoreCategoryButton={isEnableMoreCategories}
        />
      </View>
    );
  };

  const renderProductSubCategoryList = () => {
    return (
      <View>
        <Text style={styles.textProductCategories}>
          {selectedCategory?.name}
        </Text>
        <ProductSubCategoryList
          subCategories={subCategories}
          selectedSubCategory={selectedSubCategory}
          onChange={item => {
            setSelectedSubCategory(item);
          }}
        />
      </View>
    );
  };

  const renderProductList = () => {
    const productsLimit = !isEmptyArray(products)
      ? products?.slice(0, productsLimitLength)
      : [];
    return (
      <View
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          setProductListPosition(layout.y);
        }}>
        <ProductList products={productsLimit} basket={basket} />
        <View style={styles.marginBottom30} />
      </View>
    );
  };

  const renderDivider = () => {
    return <View style={styles.dividerHorizontal} />;
  };

  const renderHeader = () => {
    return <Header customTitle={renderHeaderTitle()} search={!additionalSetting().disableSearchFunction} isLogo />;
  };

  const renderBody = () => {
    return (
      <Body>
        <ScrollView
          ref={ref}
          onScroll={e => {
            handleShowFloatingButton(e.nativeEvent.contentOffset.y);
            if (isCloseToBottom(e.nativeEvent)) {
              setProductsLimitLength(productsLimitLength + 10);
            }
          }}
          contentContainerStyle={styles.scrollContainer}
          scrollEventThrottle={0}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
          {renderBanner()}
          {renderTransactionInfoBar()}
          {renderMenuBar()}
          {renderProductCategoryList()}
          {renderDivider()}
          {renderProductSubCategoryList()}
          {renderProductList()}
        </ScrollView>
      </Body>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      {renderHeader()}
      {renderBody()}
      {renderFloatingButtonToTop()}
      <ButtonCartFloating />
    </SafeAreaView>
  );
};

export default HomeRetail;
