/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {StyleSheet, View, Text, SafeAreaView} from 'react-native';

import DashedLine from 'react-native-dashed-line';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Theme from '../theme/Theme';
import {productByPromotion} from '../actions/product.action';
import ProductList from '../components/productList/ProductList';
import {Header} from '../components/layout';
import LoadingScreen from '../components/loadingScreen/LoadingScreen';
import ButtonCartFloating from '../components/buttonCartFloating/ButtonCartFloating';
import {isEmptyArray} from '../helper/CheckEmpty';
import moment from 'moment';

const useStyles = () => {
  const theme = Theme();
  const result = StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: '#D6D6D6',
    },
    image: {
      width: '100%',
      maxWidth: '100%',
      height: undefined,
      aspectRatio: 1 / 1,
    },
    textHeader: {
      fontSize: theme.fontSize[16],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textCartButton: {
      fontSize: theme.fontSize[12],
      color: theme.colors.textButtonDisabled,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textPrice: {
      fontSize: theme.fontSize[14],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textName: {
      fontSize: theme.fontSize[14],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    textQty: {
      width: 36,
      textAlign: 'center',
      fontSize: theme.fontSize[12],
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.poppinsBold,
    },
    textSpecialInstruction: {
      fontSize: theme.fontSize[14],
      color: theme.colors.text1,
      fontFamily: theme.fontFamily.poppinsRegular,
    },
    textDescription: {
      marginBottom: 8,
      fontSize: theme.fontSize[16],
      color: theme.colors.textPrimary,
      fontFamily: theme.fontFamily.poppinsSemiBold,
    },
    viewNameAndPrice: {
      width: '70%',
    },
    viewNameQtyPrice: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 16,
      marginTop: 4,
    },
    viewTextAndButtonQty: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewCartButton: {
      padding: 16,
      backgroundColor: 'white',
      borderColor: '#D6D6D6',
      borderTopWidth: 1,
    },

    viewTextSpecialInstruction: {
      backgroundColor: '#F9F9F9',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    viewDescription: {
      padding: 16,
    },
    touchableCartButton: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.primary,
    },

    touchableCartButtonDisabled: {
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: theme.colors.buttonDisabled,
    },
    touchableMinus: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
    touchablePlus: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    textInputSpecialInstruction: {
      // height: 110,
      // textAlignVertical: 'top',
      borderColor: '#D6D6D6',
      padding: 16,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: 'white',
    },
    iconMinus: {
      width: 12,
      height: 12,
      tintColor: theme.colors.primary,
    },
    iconPlus: {
      width: 12,
      height: 12,
      tintColor: theme.colors.background,
    },
    iconClose: {
      fontSize: 24,
      position: 'absolute',
      right: 17,
    },
    padding16: {
      padding: 16,
    },
    marginTopIos: {
      marginTop: 25,
    },
    marginTopAndroid: {
      marginTop: 0,
    },
    marginTopIphone14Pro: {
      marginTop: 35,
    },
    preorderStyle: {
      display: 'flex',
      width: '20%',
    },
    containerPreOrder: {
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
    },
  });
  return result;
};

const PromotionDetail = ({handleClose, promotion}) => {
  const theme = Theme();
  const styles = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [productsRelated, setProductsRelated] = useState([]);

  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );

  const basket = useSelector(state => state.orderReducer?.dataBasket?.product);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      console.log('MARTIN', promotion);
      const promotionId = promotion.sortKey.replace('promotion::', '');
      const response = await dispatch(
        productByPromotion({
          promotionId: promotionId,
          outletId: defaultOutlet.id,
        }),
      );
      setProductsRelated(response);
      setIsLoading(false);
    };
    loadData();
  }, [promotion]);

  const renderDividerDashed = () => {
    return (
      <View style={{margin: 16}}>
        <DashedLine
          dashLength={4}
          dashThickness={0.5}
          dashGap={5}
          dashColor={theme.colors.brandPrimary}
        />
      </View>
    );
  };

  const renderName = () => {
    const promotionName = promotion?.promoDisplayName || promotion?.name;
    return (
      <View
        style={{
          borderRadius: 8,
          margin: 16,
          padding: 16,
          backgroundColor: theme.colors.accent,
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: theme.colors.textQuaternary,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsSemiBold,
          }}>
          {promotionName}
        </Text>
      </View>
    );
  };

  const renderDateValidityListItem = ({day, fromTime, toTime}) => {
    const from = fromTime.replace(':', '.');
    const to = toTime.replace(':', '.');
    return (
      <View
        style={{
          width: 220,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            marginTop: 8,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[16],
            fontFamily: theme.fontFamily.poppinsSemiBold,
          }}>
          {day}
        </Text>
        <Text
          style={{
            marginTop: 8,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[16],
            fontFamily: theme.fontFamily.poppinsSemiBold,
          }}>
          {from} - {to}
        </Text>
      </View>
    );
  };

  const renderDateValidityList = () => {
    const isAllDays = promotion?.validity?.allDays;

    if (isAllDays) {
      return renderDateValidityListItem({
        day: 'Everyday',
        fromTime: '00:00',
        toTime: '23:59',
      });
    } else {
      return promotion?.validity?.activeWeekDays.map(row => {
        return renderDateValidityListItem({
          day: row?.day,
          fromTime: row?.validHour?.from,
          toTime: row?.validHour?.to,
        });
      });
    }
  };

  const renderDateValidity = () => {
    const startDate = moment(promotion?.startDate).format('DD MMM YYYY');
    const endData = moment(promotion?.endDate).format('DD MMM YYYY');
    return (
      <View
        style={{
          marginHorizontal: 16,
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Date & Time Validity
        </Text>
        <Text
          style={{
            marginTop: 8,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[16],
            fontFamily: theme.fontFamily.poppinsSemiBold,
          }}>
          {startDate} - {endData}
        </Text>
        {renderDateValidityList()}
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View
        style={{
          marginHorizontal: 16,
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[14],
            fontFamily: theme.fontFamily.poppinsMedium,
          }}>
          Promotion Descriptions
        </Text>
        <Text
          style={{
            marginTop: 8,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSize[16],
            fontFamily: theme.fontFamily.poppinsSemiBold,
          }}>
          {promotion?.remark} asd
        </Text>
      </View>
    );
  };

  const renderRelatedItems = () => {
    if (!isEmptyArray(productsRelated)) {
      return (
        <View style={{marginBottom: 30}}>
          <Text
            numberOfLines={2}
            style={{
              marginHorizontal: 16,
              color: theme.colors.textPrimary,
              fontSize: theme.fontSize[14],
              fontFamily: theme.fontFamily.poppinsMedium,
            }}>
            Related Items
          </Text>

          <ProductList
            products={productsRelated}
            basket={basket}
            promotionDisabled={true}
          />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <LoadingScreen loading={isLoading} />
      <Header title="Promotion Detail" onBackBtn={handleClose} />
      <KeyboardAwareScrollView style={styles.container}>
        {renderName()}
        {renderDateValidity()}
        {renderDividerDashed()}
        {renderDescription()}
        {renderDividerDashed()}
        {renderRelatedItems()}
      </KeyboardAwareScrollView>
      <ButtonCartFloating />
    </SafeAreaView>
  );
};

export default PromotionDetail;
