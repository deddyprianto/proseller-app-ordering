import React from 'react';
import {useDispatch} from 'react-redux';
import {checkPromo} from '../../actions/rewards.action';
import {showSnackbar} from '../../actions/setting.action';

const useVouchers = () => {
  const dispatch = useDispatch();
  const checkVoucher = async (voucherCode, showErrorSnackbar) => {
    const checkPromoResponse = await dispatch(checkPromo(voucherCode));
    if (!checkPromoResponse.status) {
      let errorMessage = 'Invalid promo code.';
      if (showErrorSnackbar) {
        dispatch(
          showSnackbar({
            message: checkPromoResponse?.message || errorMessage,
          }),
        );
      }
      return checkPromoResponse;
    }
    dispatch(
      showSnackbar({
        message:
          'Your voucher has been redeemed and can be found in the voucher section below.',
        type: 'success',
      }),
    );
    return checkPromoResponse;
  };

  return {
    checkVoucher,
  };
};

export default useVouchers;
