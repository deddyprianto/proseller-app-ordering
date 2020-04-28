package com.qiji;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;

import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.horcrux.svg.SvgPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

// Facebook login
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;


// Multidex
import androidx.multidex.MultiDexApplication;

import com.microsoft.codepush.react.CodePush;


public class MainApplication extends MultiDexApplication implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         * We use reflection here to pick up the class that initializes Flipper, since
         * Flipper library is not available in release mode
         */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
