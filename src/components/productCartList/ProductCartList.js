/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {useSelector} from 'react-redux';

import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import ProductCartItem from './components/ProductCartItem';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import moment from 'moment';
import additionalSetting from '../../config/additionalSettings';
import ProductCartItemAdvance from './components/ProductCartItemAdvance';
import {Actions} from 'react-native-router-flux';
import ProductCartItemCart2 from './components/ProductCartItemCart2';
import ArrowUpSvg from '../../assets/svg/ArrowUpSvg';
import ArrowBottomSvg from '../../assets/svg/ArrowBottomSvg';
import useOrder from '../../hooks/order/useOrder';

const useStyles = () => {
  const theme = Theme();
  const styles = StyleSheet.create({
    root: {
      marginVertical: 8,
      marginHorizontal: 16,
    },
    dividerTitle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    divider: {
      height: 1,
      backgroundColor: 'black',
      width: '100%',
      position: 'absolute',
      top: '50%',
    },
    titleText: {
      backgroundColor: 'white',
      paddingHorizontal: 16,
      fontFamily: theme.fontFamily.poppinsBold,
      fontSize: 16,
    },
    preOrderTitle: {
      marginTop: 16,
    },
    readyTitle: {
      marginTop: 16,
    },
    availableTextDate: {
      marginTop: 8,
      fontSize: 12,
      fontFamily: theme.fontFamily.poppinsMedium,
      color: theme.colors.textBrand,
    },
    centerComponent: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    mt24: {
      marginTop: 24,
    },
    itemContainer: {
      paddingHorizontal: 16,
      flexDirection: 'row',
    },
    itemText: {
      fontSize: 16,
      fontFamily: theme.fontFamily.poppinsMedium,
    },
    itemTextAmount: {
      color: theme.colors.greyScale5,
    },
    productCartItem2Container: {
      marginVertical: 8,
    },
    mlAuto: {
      marginLeft: 'auto',
    },
    primaryColor: {
      color: theme.colors.primary,
    },
    row: {
      flexDirection: 'row',
    },
  });
  return styles;
};

const ProductCartList = ({
  orderDetail,
  disabled,
  setAvailablePreorderDate,
  setAvailaleForSelection,
  step,
}) => {
  const styles = useStyles();
  const currentBasket = useSelector(
    state => state.orderReducer?.dataBasket?.product,
  );
  const items = disabled ? orderDetail?.details : currentBasket?.details;
  const cartVersion = additionalSetting().cartVersion;
  const ready_items = 'Ready Items';
  const preorder_items = 'Preorder Items';
  const [showAllOrder, setShowAllOrder] = React.useState(false);
  const [showAllPreorder, setShowAllPreOrder] = React.useState(false);
  const {
    groupingeOrder,
    listPreorder,
    defaultOrder,
    availDate,
    listSelfSelection,
  } = useOrder();
  React.useEffect(() => {
    if (items && Array.isArray(items)) {
      groupingeOrder(items);
    }
    if (!items) {
      Actions.pop();
    }
  }, [items]);

  React.useEffect(() => {
    if (typeof setAvailablePreorderDate === 'function') {
      setAvailablePreorderDate(availDate);
    }
  }, [availDate]);

  React.useEffect(() => {
    if (
      setAvailaleForSelection &&
      typeof setAvailaleForSelection === 'function'
    ) {
      setAvailaleForSelection(listSelfSelection);
    }
  }, [listSelfSelection]);

  const renderProductCartItem = (item, index, showOrder) => {
    if (cartVersion === 'advance') {
      if (step === 1) {
        return (
          <View style={styles.root}>
            <ProductCartItemAdvance
              step={step}
              item={item}
              disabled={disabled}
            />
          </View>
        );
      }
      if (index > 0 && !showOrder) {
        return null;
      }
      return (
        <View style={styles.productCartItem2Container}>
          <ProductCartItemCart2 item={item} />
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <ProductCartItem item={item} disabled={disabled} />
      </View>
    );
  };

  const handleAmountItems = title => {
    if (title === ready_items) {
      return (
        defaultOrder.length + ` ${defaultOrder.length > 1 ? 'Items' : 'Item'}`
      );
    }
    return (
      listPreorder.length + ` ${listPreorder.length > 1 ? 'Items' : 'Item'}`
    );
  };

  const toggleItemPreorder = () => setShowAllPreOrder(prevState => !prevState);

  const toggleItemOrder = () => setShowAllOrder(prevState => !prevState);

  const renderMoreItemText = (isPreOrder, showOrder) => {
    if (!isPreOrder && defaultOrder.length > 1) {
      return (
        <TouchableOpacity
          onPress={toggleItemOrder}
          style={[styles.mlAuto, styles.row]}>
          <GlobalText style={[styles.itemText, styles.primaryColor]}>
            {showOrder ? (
              'Hide All Item'
            ) : (
              <>{defaultOrder.length - 1} More Items </>
            )}
          </GlobalText>
          {showOrder ? <ArrowUpSvg /> : <ArrowBottomSvg />}
        </TouchableOpacity>
      );
    }
    if (isPreOrder && listPreorder.length > 1) {
      return (
        <TouchableOpacity
          onPress={toggleItemPreorder}
          style={[styles.mlAuto, styles.row]}>
          <GlobalText style={[styles.itemText, styles.primaryColor]}>
            {showOrder ? (
              'Hide All Item'
            ) : (
              <> {listPreorder.length - 1} More Items </>
            )}
          </GlobalText>
          {showOrder ? <ArrowUpSvg /> : <ArrowBottomSvg />}
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderHeader = (title, containerStyle, isPreOrder, showOrder) => (
    <>
      <View style={styles.centerComponent}>
        <View style={[styles.dividerTitle, containerStyle]}>
          <View style={styles.divider} />
          <GlobalText style={styles.titleText}>{title}</GlobalText>
        </View>
        {isPreOrder && availDate ? (
          <GlobalText style={styles.availableTextDate}>
            Available on {moment(availDate).format('DD MMM YYYY')}
          </GlobalText>
        ) : null}
      </View>
      {step && step > 1 ? (
        <View style={styles.itemContainer}>
          <View>
            <GlobalText style={styles.itemText}>
              Items{' '}
              <GlobalText style={styles.itemTextAmount}>
                {`(${handleAmountItems(title)})`}{' '}
              </GlobalText>{' '}
            </GlobalText>
          </View>
          {renderMoreItemText(isPreOrder, showOrder)}
        </View>
      ) : null}
    </>
  );

  const renderReadyItemHeader = () => {
    if (listPreorder.length > 0) {
      return (
        <>{renderHeader(ready_items, styles.readyTitle, false, showAllOrder)}</>
      );
    }
    return null;
  };

  return (
    <View>
      {defaultOrder.length > 0 ? (
        <FlatList
          data={defaultOrder}
          keyExtractor={item => item.productID}
          renderItem={({item, index}) =>
            renderProductCartItem(item, index, showAllOrder)
          }
          ListHeaderComponent={renderReadyItemHeader()}
        />
      ) : null}
      {listPreorder.length > 0 ? (
        <>
          {defaultOrder.length > 0 ? <View style={styles.mt24} /> : null}
          <FlatList
            data={listPreorder}
            keyExtractor={item => item.productID}
            renderItem={({item, index}) =>
              renderProductCartItem(item, index, showAllPreorder)
            }
            ListHeaderComponent={renderHeader(
              preorder_items,
              styles.preOrderTitle,
              true,
              showAllPreorder,
            )}
          />
        </>
      ) : null}
    </View>
  );
};

export default ProductCartList;
