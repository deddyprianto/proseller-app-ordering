import {useSelector} from 'react-redux';
import React from 'react';

const useScanGo = () => {
  const [showAlert, setShowAlert] = React.useState(false);
  const cartItem = useSelector(state => state.orderReducer.dataBasket?.product);
  const closeAlert = () => setShowAlert(false);

  const checkProductScanGo = isFromScanPage => {
    return new Promise(resolve => {
      const isScanGoProduct = cartItem?.isStoreCheckoutCart;
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

  return {
    checkProductScanGo,
    showAlert,
    closeAlert,
    setShowAlert,
  };
};

export default useScanGo;
