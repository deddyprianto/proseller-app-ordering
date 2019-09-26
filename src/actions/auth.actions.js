/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import awsConfig from '../config/awsConfig';

var poolData = {
  UserPoolId: awsConfig.awsUserPoolId,
  ClientId: awsConfig.awsClientId,
};

import {fetchApi} from '../service/api';

// export const createNewUser = (payload) => {
//   return async (dispatch) => {
//     try {
//       dispatch({
//         type: "CREATE_USER_LOADING"
//       });
//       var status = true;

//       var userPool = new CognitoUserPool(poolData);
//       var attributeList = [];
//       var attributeName = new CognitoUserAttribute({Name: 'name', Value: payload.name});
//       var attributeEmail = new CognitoUserAttribute({Name: 'email', Value: payload.email});

//       attributeList.push(attributeName);
//       attributeList.push(attributeEmail);

//       userPool.signUp(payload.email, payload.password, attributeList, null, function(err, result){
//         if (err) {
//           dispatch({
//             type: "CREAT_USER_FAIL"
//           });
//           if(status){
//             notifikasi('Register', err.message)
//             status = false
//           }
//           throw err;
//         } else {
//           dispatch({
//             type: "CREAT_USER_SUCCESS"
//           });
//           dispatch({
//             type: "WAITING_USER_CODE"
//           });
//           Actions.auth()
//         }
//         var cognitoUser = result.user;
//         console.log('User register as: ' + cognitoUser.getUsername());
//       });

//     } catch (error) {
//       dispatch({
//           type: "CREAT_USER_FAIL",
//           payload: error.responseBody
//       });
//       return error;
//     }
//   }
// }

// export const loginUser = (payload) => {
//   return async (dispatch) => {
//     try {
//       dispatch({
//         type: "LOGIN_USER_LOADING"
//       });
//       var status = true;

//       var userPool = new CognitoUserPool(poolData);
//       var cognitoUser = new CognitoUser({Username: payload.email, Pool: userPool});
//       var authenticationDetails = new AuthenticationDetails({Username: payload.email, Password: payload.password});
//       cognitoUser.authenticateUser(authenticationDetails, {
//         onSuccess: function (result) {
//           var accessToken = result.getAccessToken().getJwtToken();
//           dispatch({
//             type: "LOGIN_USER_SUCCESS",
//             payload: payload
//           });
//           dispatch({
//             type: "AUTH_USER_SUCCESS",
//             token: accessToken,
//             payload: payload
//           });
//           dispatch({
//             type: "GET_USER_SUCCESS",
//             payload: payload
//           });
//         },
//         onFailure: function(err) {
//           dispatch({
//             type: "LOGIN_USER_FAIL"
//           });
//           if(status){
//             notifikasi('Login', err.message)
//             status = false
//           }
//           throw err;
//         },
//       });
//       return false;
//     } catch (error) {
//       dispatch({
//         type: "LOGIN_USER_FAIL",
//         payload: error.responseBody
//       });
//       return false;
//     }
//   }
// }

// export const confirmUser = (payload) => {
//   return async (dispatch) => {
//     try {
//       dispatch({
//         type: "CONFIRM_USER_LOADING"
//       });
//       var status = true;

//       var userPool = new CognitoUserPool(poolData);
//       var cognitoUser = new CognitoUser({Username: payload.email, Pool: userPool});
//       cognitoUser.confirmRegistration(payload.code_auth, true, function(err, result) {
//         console.log('call result: ' + result);
//         if (err) {
//           dispatch({
//             type: "CONFIRM_USER_FAIL",
//             errors: err.message
//           });
//           if(status){
//             notifikasi('Confirm', err.message)
//             status = false
//           }
//           throw err;
//         } else {
//           dispatch({
//             type: "CONFIRM_USER_SUCCESS",
//           });
//           Actions.signin()
//         }
//       });
//     } catch (err) {
//       dispatch({
//         type: "CONFIRM_USER_FAIL",
//         errors: err.message
//       });
//       if(status){
//         notifikasi('Confirm', err.message)
//         status = false
//       }
//     }
//   }
// }

// export const logoutUser = () => {
//   return async (dispatch, getState) => {
//     const state = getState();
//     try {
//       const {authReducer: {authData: {payload}}} = state;
//       var userPool = new CognitoUserPool(poolData);
//       var cognitoUser = new CognitoUser({Username: payload.email, Pool: userPool});
//       cognitoUser.signOut();
//       dispatch({
//           type: "USER_LOGGED_OUT_SUCCESS"
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

export const notifikasi = (type, status, action) => {
  Alert.alert(type, status, [
    {
      text: 'Ok',
      onPress: () => action,
      style: 'ok',
    },
  ]);
};

export const createNewUser = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });

      // var dataRegister =
      // {
      //   "email": payload.email,
      //   "username": payload.username,
      //   "password": payload.password,
      //   "name": payload.name,
      //   "phoneNumber": "+6281998948575",
      //   "nickname": "Test",
      //   "address": "Test",
      //   "birthdate": "25/11/1996",
      //   "gender": "male"
      // };
      // console.log(dataRegister)

      const response = await fetchApi(
        '/customer/register',
        'POST',
        payload,
        200,
      );
      console.log(response);
      if (response.success) {
        dispatch({
          type: 'CREAT_USER_SUCCESS',
          dataRegister: payload,
        });

        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'CREAT_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const confirmUser = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CONFIRM_USER_LOADING',
      });
      const response = await fetchApi(
        '/customer/confirm',
        'POST',
        payload,
        200,
      );

      console.log(response);

      if (response.success) {
        dispatch({
          type: 'CONFIRM_USER_SUCCESS',
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginUser = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });
      const response = await fetchApi('/customer/login', 'POST', payload, 200);

      console.log(response);

      if (response.success) {
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.idToken.jwtToken,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      // console.log(token);
      // const response = await fetchApi("/user/logout", "DELETE", null, 200, token);
      // console.log(response);
      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const getToken = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;
      return token;
    } catch (e) {
      console.log(e);
    }
  };
};
