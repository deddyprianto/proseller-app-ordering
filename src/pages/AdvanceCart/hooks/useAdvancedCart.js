import {useSelector} from 'react-redux';
import React from 'react';
const useAdvancedCart = () => {
  const currentBasket =
    useSelector(state => state.orderReducer?.dataBasket?.product?.details) ||
    [];
  console.log({currentBasket}, 'lepo');
  const calculateAmount = () => {
    // const mapping = currentBasket.map((basket) => )
  };
  return {
    calculateAmount,
  };
};

export default useAdvancedCart;
