import {useDispatch, useSelector} from 'react-redux';
import React from 'react';
import {removeBasket} from '../../actions/order.action';

const useScanGo = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const dispatch = useDispatch();
  const cartItem = useSelector(state => state.orderReducer.dataBasket?.product);
  const defaultOutlet = useSelector(
    state => state.storesReducer.defaultOutlet.defaultOutlet,
  );
  const closeAlert = () => setShowAlert(false);

  const checkProductScanGo = isFromScanPage => {
    return new Promise(resolve => {
      console.log({cartItem}, 'sisui');
      const isScanGoProduct = cartItem?.isScannedProduct;
      const isHaveCart = cartItem && Object.keys(cartItem)?.length > 0;
      if (isHaveCart) {
        if (isFromScanPage && !isScanGoProduct) {
          resolve(true);
        }
        if (!isFromScanPage && isScanGoProduct) {
          resolve(true);
        }
        resolve(false);
      }
      resolve(false);
    });
  };

  const checkDuplicateItem = id => {
    console.log({cartItem, id}, 'leleka');
    const isHaveCart = cartItem && Object.keys(cartItem)?.length > 0;
    console.log({isHaveCart, cartItem, id}, 'kala');
    if (isHaveCart) {
      const duplicateProduct = cartItem?.details?.find(data => data?.id === id);
      if (duplicateProduct) {
        return duplicateProduct;
      }
      return null;
    }
    return null;
  };

  const onRemoveBasket = () => {
    dispatch(removeBasket());
  };

  return {
    checkProductScanGo,
    showAlert,
    closeAlert,
    onRemoveBasket,
    setShowAlert,
    checkDuplicateItem,
  };
};

export default useScanGo;
