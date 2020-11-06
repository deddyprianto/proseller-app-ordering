/**
 * This exposes the native ToastExample module as a JS module. This has a
 * function 'show' which takes the following parameters:
 *
 * 1. String message: A string with the text to toast
 * 2. int duration: The duration of the toast. May be ToastExample.SHORT or
 *    ToastExample.LONG
 */
import {NativeModules} from 'react-native';

const {NetsClickReact} = NativeModules;

const NetsClick = {
  Register: async ({userId}) => {
    return NetsClickReact.Registration(userId);
  },
  Debit: async ({amount}) => {
    return NetsClickReact.Debit(amount.toString());
  },
  DebitWithPIN: async ({amount, responseCode, txnCryptogram}) => {
    return NetsClickReact.Debit(amount, responseCode, txnCryptogram);
  },
  Deregister: async () => {
    return NetsClickReact.Deregistration();
  },
};

export default NetsClick;
