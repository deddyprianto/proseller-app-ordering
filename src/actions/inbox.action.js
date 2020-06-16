import {fetchApi} from '../service/api';

export const dataInbox = (skip, take) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let {
        inboxReducer: {
          dataInbox: {broadcast},
        },
      } = state;

      const payload = {
        skip,
        take,
      };

      const response = await fetchApi(
        '/broadcast/customer',
        'POST',
        payload,
        200,
        token,
      );
      console.log(response, 'response inbox');

      let data = [];

      if (response.success) {
        try {
          if (broadcast == undefined || skip == 0) {
            data = response.responseBody;
            data.skip = skip + take;
            data.take = take;
          } else {
            data = JSON.stringify(broadcast);
            data = JSON.parse(data);
            data.dataLength = response.responseBody.dataLength;
            data.Data = [...data.Data, ...response.responseBody.Data];
            data.skip = skip + take;
            data.take = take;
          }
        } catch (e) {
          data = {};
          data.Data = [];
        }
        await dispatch({
          type: 'DATA_ALL_BROADCAST',
          data: data,
        });
      }
      return response;
    } catch (error) {
      return error;
    }
  };
};

export const readMessage = (item, index) => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          tokenUser: {token},
        },
      } = state;

      let {
        inboxReducer: {
          dataInbox: {broadcast},
        },
      } = state;

      try {
        let inbox = JSON.stringify(broadcast);
        inbox = JSON.parse(inbox);
        for (let i = 0; i < inbox.Data.length; i++) {
          if (inbox.Data[i].id == item.id) {
            inbox.Data[i].isRead = true;
          }
        }
        await dispatch({
          type: 'DATA_ALL_BROADCAST',
          data: inbox,
        });
      } catch (e) {}

      await fetchApi(
        `/broadcast/customer/get/${item.id}`,
        'GET',
        null,
        200,
        token,
      );
    } catch (error) {
      return error;
    }
  };
};
