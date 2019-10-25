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
import {Auth, Cache} from 'aws-amplify';
import {LoginManager, LoginButton, AccessToken} from 'react-native-fbsdk';
import AWS from 'aws-sdk';

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
      payload.type = 'userPool';
      payload.email = payload.username;
      payload.tenantId = awsConfig.tenantId;
      console.log(payload, 'payload login');
      const response = await fetchApi('/customer/login', 'POST', payload, 200);

      console.log(response);

      if (response.success) {
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken.jwtToken,
          exp: response.responseBody.accessToken.payload.exp * 1000,
          refreshToken: response.responseBody.refreshToken.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
        console.log(response, 'response login user pool');
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
      LoginManager.logOut();
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

export const refreshToken = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      var payload = {
        refreshToken: state.authReducer.authData.refreshToken,
      };
      // console.log(state.authReducer.authData.tokenExp);
      // console.log(state.authReducer.authData.token);
      // console.log(payload);
      const response = await fetchApi('/auth/refresh', 'POST', payload, 200);

      // console.log(response.responseBody);

      var date = new Date();
      console.log(date);

      var dateaa = new Date(date.getTime() + 3600000);
      console.log(dateaa);

      dispatch({
        type: 'AUTH_USER_SUCCESS',
        token: state.authReducer.authData.token,
        exp: date.getTime() + 3600000,
        refreshToken: state.authReducer.authData.refreshToken,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const createNewUserOther = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });

      console.log(payload, 'createNewUserOther payload');
      const response = await fetchApi(
        '/customer/register',
        'POST',
        payload,
        200,
      );
      console.log(response, 'createNewUserOther');
      return true;
    } catch (error) {
      console.log(error);
      dispatch({
        type: 'CREAT_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginOther = payload => {
  return async dispatch => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });

      var response;

      // const {accessToken, email, expires_at, model, idFB} = payload;
      // const response = await Auth.federatedSignIn(
      //   model,
      //   {accessToken, expires_at},
      //   email,
      // );

      payload.type = 'identityPool';
      payload.username = payload.email;
      payload.tenantId = awsConfig.tenantId;
      response = await fetchApi('/customer/login', 'POST', payload, 200);
      console.log(response, 'loginOther');
      dispatch({
        type: 'LOGIN_USER_SUCCESS',
      });

      if (response.responseBody.statusCustomer) {
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken.jwtToken,
          exp: response.responseBody.idToken.payload.exp * 1000,
          refreshToken: response.responseBody.refreshToken.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
        console.log('selesai');
      }

      if (response.responseBody.message == 'Internal server error') {
        response = await fetchApi('/customer/login', 'POST', payload, 200);
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken.jwtToken,
          exp: response.responseBody.idToken.payload.exp * 1000,
          refreshToken: response.responseBody.refreshToken.token,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody.idToken.payload,
        });
        console.log('selesai');
      }
      payload.statusCustomer = response.responseBody.statusCustomer;
      return payload;
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};
