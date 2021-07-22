package com.acemart;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.nets.nofsdk.request.StatusCallback;
import com.nets.nofsdk.request.Registration;
import com.nets.nofsdk.request.Deregistration;
import com.nets.nofsdk.request.CheckFundAvailability;
import com.nets.nofsdk.request.Debit;
import com.nets.nofsdk.exception.ServiceNotInitializedException;
//import com.nets.nofsdk.exception.CardAlreadyRegisteredException;
import com.nets.nofsdk.exception.CardNotRegisteredException;

import java.text.DecimalFormat;
import java.util.Map;
import java.util.HashMap;

public class NetsClickReact extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String ERR_REG_FAILED = "ERR_REG_FAILED";
  private static final String ERR_NOT_INIT = "ERR_NOT_INIT";
  private static final String ERR_DEREG_FAILED = "ERR_REG_FAILED";
  private static final String ERR_CARD_NOT_REG = "ERR_CARD_NOT_REG";
  private static final String ERR_CFA_FAILED = "ERR_CFA_FAILED";
  private static final String ERR_DEBIT_FAILED = "ERR_DEBIT_FAILED";

  NetsClickReact(ReactApplicationContext context) {
    super(context);
    reactContext = context;
//    NetsClick.getInstance().init(reactContext);
  }

  @Override
  public String getName() {
    return "NetsClickReact";
  }

 // Constants that we want to expose to Javascript
  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    // constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    // constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }


  private String formatAmountInCents(String amountStr){
    String amtInCents = "";
    DecimalFormat df2 = new DecimalFormat("0.00");
    amountStr = df2.format(Double.valueOf(amountStr));
    Log.d("netsclick","Format>>" + amountStr);
    amountStr = amountStr.replaceAll("\\.","");
    amtInCents = "000000000000".substring(0,12-amountStr.length()) + amountStr;
    //amtInCents = amountStr.replaceAll("\\.","");

    return amtInCents;
  }

  @ReactMethod
  public void doRegister(String muid, Promise promise) {
    Environment environment = Environment.getInstance();
    String mid = environment.getMID();
    Registration reg = new Registration(mid, muid);
    try {
        reg.invoke(new StatusCallback<String, String>() {
            @Override
            public void success(String result) {
                // ui handles successful registration. Use string result as part of request to merchant host
                promise.resolve(result);
            }
            @Override
            public void failure(String result) {
                // ui handles registration error
                promise.reject(ERR_REG_FAILED, result);
            }
        });
    } catch (ServiceNotInitializedException e) {
        promise.reject(ERR_NOT_INIT, e.getMessage());
    }
  }

  @ReactMethod
  public void doDeregister(Promise promise) {
    Deregistration dereg = new Deregistration();
    try {
        dereg.invoke(new StatusCallback<String, String>() {
            @Override
            public void success(String result) {
                // ui handles successful deregistration
                promise.resolve(result);
            }
            @Override
            public void failure(String result) {
                // ui handle deregistration failure
                promise.reject(ERR_DEREG_FAILED, result);
            }
        });
    } catch (ServiceNotInitializedException e) {
        promise.reject(ERR_NOT_INIT, e.getMessage());
    } catch (CardNotRegisteredException e) {
        promise.reject(ERR_CARD_NOT_REG, e.getMessage());
    }
  }

  @ReactMethod
  public void doDebit(String amount, Promise promise) {
    String amountInCents = amount;
    amountInCents = formatAmountInCents(amountInCents);
    Log.d("netsclick", "Debit amountInCents: " + amountInCents);

    Debit debit = new Debit (amountInCents);
    try {
        debit.invoke(new StatusCallback<String, String>() {
            @Override
            public void success(String result) {
                // ui handles nof debit success.Use string result as part of request to merchant host
                Log.i("netsclick success", result);
                promise.resolve(result);
            }
            @Override
            public void failure(String result) {
                // ui handles check fund availability failure
                Log.i("netsclick failed", result);
                promise.reject(ERR_DEBIT_FAILED, result);
            }
        });
    } catch (ServiceNotInitializedException e) {
        Log.i("netslick ", "err");
        promise.reject(ERR_NOT_INIT, e.getMessage());
    }
  }

  @ReactMethod
  public void DebitWithPIN(String amount, String responseCode, String txnCryptogram, Promise promise) {
    String amountInCents = amount;
    amountInCents = formatAmountInCents(amountInCents);
    Log.d("netsclick", "Debit amountInCents: " + amountInCents);

    Debit debit = new Debit (amountInCents, responseCode, txnCryptogram);
    try {
        debit.invoke(new StatusCallback<String, String>() {
            @Override
            public void success(String result) {
                // ui handles nof debit success.Use string result as part of request to merchant host
                promise.resolve(result);
            }
            @Override
            public void failure(String result) {
                // ui handles check fund availability failure
                promise.reject(ERR_DEBIT_FAILED, result);
            }
        });
    } catch (ServiceNotInitializedException e) {
        promise.reject(ERR_NOT_INIT, e.getMessage());
    }
  }
}
