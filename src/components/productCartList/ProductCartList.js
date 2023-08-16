/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Martin
 * martin@edgeworks.co.id
 * PT Edgeworks
 */

import React from 'react';
import {useSelector} from 'react-redux';

import {View, FlatList, StyleSheet} from 'react-native';

import ProductCartItem from './components/ProductCartItem';
import GlobalText from '../globalText';
import Theme from '../../theme/Theme';
import moment from 'moment';
import additionalSetting from '../../config/additionalSettings';
import ProductCartItemAdvance from './components/ProductCartItemAdvance';
import {Actions} from 'react-native-router-flux';

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
  const [listPreorder, setListPreorder] = React.useState([]);
  const [defaultOrder, setDefaultOrder] = React.useState([]);
  const [availDate, setAvailDate] = React.useState(null);
  const [listSelfSelection, setListSelfSlection] = React.useState([]);
  const cartVersion = additionalSetting().cartVersion;

  const groupingeOrder = () => {
    const isNotPreorder = items.filter(item => !item.isPreOrderItem);
    const isPreOrder = items.filter(item => item.isPreOrderItem);
    const isSelfSelection = items.filter(
      item => item.product.allowSelfSelection,
    );
    const sortPreOrder = isPreOrder.sort(
      (a, b) =>
        new Date(b?.product?.productAvailableDate).getTime() -
        new Date(a?.product?.productAvailableDate).getTime(),
    );
    setAvailDate(sortPreOrder[0]?.product?.productAvailableDate);
    setListPreorder(isPreOrder);
    setDefaultOrder(isNotPreorder);
    setListSelfSlection(isSelfSelection);
  };
  React.useEffect(() => {
    if (items && Array.isArray(items)) {
      groupingeOrder();
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

  const renderProductCartItem = item => {
    if (cartVersion === 'advance') {
      return (
        <View style={styles.root}>
          <ProductCartItemAdvance step={step} item={item} disabled={disabled} />
        </View>
      );
    }
    return (
      <View style={styles.root}>
        <ProductCartItem item={item} disabled={disabled} />
      </View>
    );
  };

  const renderHeader = (title, containerStyle, isPreOrder) => (
    <View style={styles.centerComponent}>
      <View style={[styles.dividerTitle, containerStyle]}>
        <View style={styles.divider} />
        <GlobalText style={styles.titleText}>{title} </GlobalText>
      </View>
      {isPreOrder && availDate ? (
        <GlobalText style={styles.availableTextDate}>
          Available on {moment(availDate).format('DD MMM YYYY')}
        </GlobalText>
      ) : null}
    </View>
  );
  return (
    <View>
      {defaultOrder.length > 0 ? (
        <FlatList
          data={defaultOrder}
          keyExtractor={item => item.productID}
          renderItem={({item}) => renderProductCartItem(item)}
          ListHeaderComponent={renderHeader('Ready Items', styles.readyTitle)}
        />
      ) : null}
      {listPreorder.length > 0 ? (
        <>
          {defaultOrder.length > 0 ? <View style={styles.mt24} /> : null}
          <FlatList
            data={listPreorder}
            keyExtractor={item => item.productID}
            renderItem={({item}) => renderProductCartItem(item)}
            ListHeaderComponent={renderHeader(
              'Preorder Items',
              styles.preOrderTitle,
              true,
            )}
          />
        </>
      ) : null}
    </View>
  );
};

export default ProductCartList;
