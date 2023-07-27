import {fetchApi} from '../service/api';

export const getPaidMembership = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApi(
        '/customergroup/paidmemberships',
        'GET',
        null,
        200,
        token,
      );
      console.log('response get paid membership', response);

      if (response.success == true) {
        dispatch({
          type: 'DATA_MEMBERSHIP',
          memberships: response.responseBody,
        });
      } else {
        dispatch({
          type: 'DATA_MEMBERSHIP',
          memberships: {},
        });
      }
      return response.responseBody;
    } catch (error) {
      return error;
    }
  };
};

export const submitMembership = payload => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;
      const response = await fetchApi(
        '/sales/customer/submit',
        'POST',
        payload,
        200,
        token,
      );
      console.log('response get paid membership', response);
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const redeemMembership = (membership, selectedPlan, userDetail) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let pointPurchase = selectedPlan.point;
      if (selectedPlan.newPoint !== undefined) {
        pointPurchase = selectedPlan.newPoint;
      }

      let payload = {
        membership: {
          period: selectedPlan.period,
          periodUnit: selectedPlan.periodUnit,
          point: selectedPlan.point,
          id: membership.id,
        },
        customerId: `customer::${userDetail.id}`,
        redeemValue: pointPurchase,
      };

      console.log(payload, 'payload membership redeeem');
      const response = await fetchApi(
        '/accummulation/point/redeem/membership',
        'POST',
        payload,
        200,
        token,
      );
      console.log('response get paid membership', response);
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const getAllMembershipTier = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        '/customer/membership-tier',
        'GET',
        null,
        200,
        token,
      );

      if (response.success) {
        await dispatch({
          type: 'DATA_ALL_MEMBERSHIP',
          data: response.responseBody.data,
        });
      } else {
        dispatch({
          type: 'DATA_ALL_MEMBERSHIP',
          memberships: [],
        });
      }
      return response.responseBody.data;
    } catch (error) {
      return error;
    }
  };
};
