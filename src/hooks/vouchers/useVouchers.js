import React from 'react';
import {useDispatch} from 'react-redux';
import {checkPromo} from '../../actions/rewards.action';
import {showSnackbar} from '../../actions/setting.action';

const useVouchers = () => {
  const dispatch = useDispatch();
  const checkVoucher = async voucherCode => {
    const checkPromoResponse = await dispatch(checkPromo(voucherCode));

    if (!checkPromoResponse.status) {
      let errorMessage = 'Invalid promo code.';
      dispatch(
        showSnackbar({
          message: checkPromoResponse?.message || errorMessage,
        }),
      );
      return undefined;
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
