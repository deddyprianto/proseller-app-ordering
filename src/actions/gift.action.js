import {fetchApi} from '../service/api';

export const getGiftCardCategories = () => {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        '/giftCardCategory/load',
        'GET',
        null,
        200,
        token,
      );

      if (response.success) {
        dispatch({
          type: 'DATA_GIFT_CARD_CATEGORIES',
          data: response.responseBody.data,
        });

        return response.responseBody.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const getGiftCardByCategory = ({categoryId}) => {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const response = await fetchApi(
        `/giftCard/category/${categoryId}`,
        'GET',
        null,
        200,
        token,
      );

      if (response.success) {
        dispatch({
          type: 'DATA_GIFT_CARD_BY_CATEGORY',
          data: response.responseBody.data,
        });

        return response.responseBody.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const sendGift = ({
  image,
  value,
  recipientName,
  recipientEmail,
  giftCardCategoryId,
  payments,
}) => {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      const payload = {
        image,
        value,
        recipientName,
        recipientEmail,
        giftCardCategoryId,
        payments,
      };

      const response = await fetchApi(
        '/giftCard/send',
        'POST',
        payload,
        200,
        token,
      );

      if (response.success) {
        dispatch({
          type: 'DATA_GIFT_CARD_BY_CATEGORY',
          data: response.responseBody.data,
        });

        return response.responseBody.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};
