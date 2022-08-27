/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import Banner from '../components/banner';
import Header from '../components/layout/header';
import ProductCategoryList from '../components/productCategoryList';
import ProductSubCategoryList from '../components/productSubCategoryList';
import ProductList from '../components/productList';

import {isEmptyArray} from '../helper/CheckEmpty';
import CurrencyFormatter from '../helper/CurrencyFormatter';

import appConfig from '../config/appConfig';

import {getBasket, getProductByOutlet} from '../actions/product.action';
import {getSVCBalance} from '../actions/SVC.action';
import {dataPointHistory} from '../actions/rewards.action';

import Theme from '../theme';
import {myVouchers} from '../actions/account.action';

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
    footer: {
      position: 'absolute',
      bottom: 10,
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
    textButtonCart: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPriceButtonCart: {
      fontSize: theme.fontSize[16],
      color: theme.colors.textSecondary,
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
      fontSize: theme.fontSize[14],
      color: theme.colors.textQuaternary,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    viewHeaderTitle: {
      flex: 1,
      marginBottom: -4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 16,
      borderRadius: 50,
      backgroundColor: theme.colors.accent,
    },
    viewButtonCart: {
      elevation: 2,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      padding: 14,
      justifyContent: 'space-between',
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.buttonActive,
    },
    viewIconAndTextCart: {
      display: 'flex',
      flexDirection: 'row',
    },
    viewMenuBar: {
      elevation: 2,
      marginTop: -25,
      padding: 16,
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
    },
    viewMenuBarChildImage: {
      padding: 5,
      borderRadius: 50,
      backgroundColor: theme.colors.buttonStandBy,
    },
    viewFloatingButton: {
      elevation: 5,
      position: 'absolute',
      bottom: 80,
      right: 18,
      width: 70,
      height: 70,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.accent,
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 7,
      color: theme.colors.textSecondary,
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
  });
  return styles;
};

const Home = () => {
  const ref = useRef();
  const styles = useStyles();
  const dispatch = useDispatch();
  const [productsLimitLength, setProductsLimitLength] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});
  const [isShowFloatingButton, setIsShowFloatingButton] = useState(false);
  const [productListPosition, setProductListPosition] = useState(0);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  const productOutletCategories = useSelector(
    state => state.productReducer.productsOutlet,
  );

  const subCategories = useSelector(
    state => state.productReducer.productSubCategories,
  );

  const totalPoint = useSelector(
    state => state.rewardsReducer?.dataPoint?.totalPoint,
  );

  const vouchers = useSelector(
    state => state.accountsReducer?.myVouchers?.vouchers,
  );

  const products = useSelector(
    state => state.productReducer.productsBySubCategory,
  );

  const svcBalance = useSelector(state => state.SVCReducer.balance.balance);

  const intlData = useSelector(state => state.intlData);

  useEffect(() => {
    const loadData = async () => {
      const result = productOutletCategories?.find(
        category => category?.id === selectedCategory?.id,
      )?.items;

      await dispatch({
        type: 'DATA_PRODUCT_SUB_CATEGORIES',
        subCategories: result,
      });

      setSelectedSubCategory(result[0]);
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

    loadData();
  }, [selectedSubCategory, subCategories, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    const response = await dispatch(getProductByOutlet(defaultOutlet.id));
    await dispatch(getBasket());
    await dispatch(getSVCBalance());
    await dispatch(dataPointHistory());
    await dispatch(myVouchers());

    setSelectedCategory(response[0]);
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

  const renderButtonCart = () => {
    if (!isEmptyArray(basket?.details)) {
      return (
        <TouchableOpacity
          style={styles.viewButtonCart}
          onPress={() => {
            Actions.cart();
          }}>
          <View style={styles.viewIconAndTextCart}>
            <Image source={appConfig.iconCart} style={styles.icon} />
            <Text style={styles.textButtonCart}>
              {basket?.details?.length} Items in Cart
            </Text>
          </View>
          <Text style={styles.textPriceButtonCart}>
            {CurrencyFormatter(basket?.totalNettAmount)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const renderHeaderTitle = () => {
    return (
      <TouchableOpacity
        style={styles.viewHeaderTitle}
        onPress={() => {
          Actions.store();
        }}>
        <Text numberOfLines={1} style={styles.textHeaderTitle}>
          {defaultOutlet?.name}
        </Text>
        <Image style={styles.iconArrowDown} source={appConfig.iconArrowDown} />
      </TouchableOpacity>
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
          Actions.detailPoint({intlData});
        }}>
        <View style={styles.viewMenuBarChildImage}>
          <Image source={appConfig.iconPoint} style={styles.iconMenuBarChild} />
        </View>
        <Text style={styles.textMenuBarChildTitle}>Your Point</Text>
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
          Actions.rewards();
        }}>
        <View style={styles.viewMenuBarChildImage}>
          <Image
            source={appConfig.iconVoucher}
            style={styles.iconMenuBarChild}
          />
        </View>
        <Text style={styles.textMenuBarChildTitle}>Your Voucher</Text>
        <Text style={styles.textMenuBarChildValue}>{vouchersLength}</Text>
      </TouchableOpacity>
    );
  };

  const renderMenuBarSVC = () => {
    const balance = svcBalance || 0;
    return (
      <TouchableOpacity
        style={styles.viewMenuBarChild}
        onPress={() => {
          Actions.summary();
        }}>
        <View style={styles.viewMenuBarChildImage}>
          <Image source={appConfig.iconSVC} style={styles.iconMenuBarChild} />
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

  const renderFloatingButtonToTop = () => {
    if (isShowFloatingButton) {
      return (
        <TouchableOpacity
          style={styles.viewFloatingButton}
          onPress={() => {
            ref.current.scrollTo(0);
          }}>
          <Image source={appConfig.iconArrowUp} style={styles.iconArrowUp} />
        </TouchableOpacity>
      );
    }
  };

  const renderBanner = () => {
    return <Banner />;
  };

  const renderProductCategoryList = () => {
    return (
      <View>
        <Text style={styles.textProductCategories}>Product Categories</Text>
        <ProductCategoryList
          categories={productOutletCategories}
          selectedCategory={selectedCategory}
          onClick={item => {
            setSelectedCategory(item);
            setProductsLimitLength(0);
          }}
          isIndicator
          isScroll
          isMoreCategoryButton
          horizontal
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
    if (!isEmptyArray(products)) {
      const productsLimit = products?.slice(0, productsLimitLength);
      return (
        <View
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            setProductListPosition(layout.y);
          }}>
          <ProductList products={productsLimit} basket={basket} />
        </View>
      );
    }
  };

  const renderDivider = () => {
    return <View style={styles.dividerHorizontal} />;
  };

  const renderHeader = () => {
    return <Header customTitle={renderHeaderTitle()} search isLogo />;
  };

  return (
    <SafeAreaView style={styles.root}>
      {renderHeader()}
      <ScrollView
        ref={ref}
        onScroll={e => {
          handleShowFloatingButton(e.nativeEvent.contentOffset.y);
          if (isCloseToBottom(e.nativeEvent)) {
            setProductsLimitLength(productsLimitLength + 10);
          }
        }}
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
        {renderMenuBar()}
        {renderProductCategoryList()}
        {renderDivider()}
        {renderProductSubCategoryList()}
        {renderProductList()}
      </ScrollView>
      <View style={styles.footer}>{renderButtonCart()}</View>
      {renderFloatingButtonToTop()}
    </SafeAreaView>
  );
};

export default Home;
