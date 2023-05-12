---
to: android/app/src/main/AndroidManifest.xml
force: true
---

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:tools="http://schemas.android.com/tools"
  package="com.<%= name %>">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE"/>

    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <uses-permission android:name="com.sec.android.provider.badge.permission.READ" tools:node="remove" />
    <uses-permission android:name="com.sec.android.provider.badge.permission.WRITE" tools:node="remove" />
    <uses-permission android:name="com.htc.launcher.permission.READ_SETTINGS" tools:node="remove" />
    <uses-permission android:name="com.htc.launcher.permission.UPDATE_SHORTCUT" tools:node="remove" />
    <uses-permission android:name="com.sonyericsson.home.permission.BROADCAST_BADGE" tools:node="remove" />
    <uses-permission android:name="com.sonymobile.home.permission.PROVIDER_INSERT_BADGE" tools:node="remove" />
    <uses-permission android:name="com.anddoes.launcher.permission.UPDATE_COUNT" tools:node="remove" />
    <uses-permission android:name="com.majeur.launcher.permission.UPDATE_BADGE" tools:node="remove" />
    <uses-permission android:name="com.huawei.android.launcher.permission.CHANGE_BADGE" tools:node="remove"/>
    <uses-permission android:name="com.huawei.android.launcher.permission.READ_SETTINGS" tools:node="remove" />
    <uses-permission android:name="com.huawei.android.launcher.permission.WRITE_SETTINGS" tools:node="remove" />
    <uses-permission android:name="android.permission.READ_APP_BADGE" tools:node="remove" />
    <uses-permission android:name="com.oppo.launcher.permission.READ_SETTINGS" tools:node="remove" />
    <uses-permission android:name="com.oppo.launcher.permission.WRITE_SETTINGS" tools:node="remove" />

    <uses-permission android:name="com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE" tools:node="remove" />
    <uses-permission android:name="me.everything.badger.permission.BADGE_COUNT_WRITE" tools:node="remove" />
    <uses-permission android:name="me.everything.badger.permission.BADGE_COUNT_READ" tools:node="remove" />
<!--    <uses-permission tools:node="remove" android:name="android.permission.WRITE_SETTINGS" />-->
    <uses-permission tools:node="remove" android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission tools:node="remove" android:name="com.<%= name %>.app.permission.C2D_MESSAGE" />
    <uses-permission tools:node="remove" android:name="com.google.android.c2dm.permission.RECEIVE" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:largeHeap="true"
      android:theme="@style/AppTheme">
        <uses-library android:name="org.apache.http.legacy" android:required="false"/>
        <meta-data
                android:name="com.google.android.geo.API_KEY"
                android:value="AIzaSyC-7gQIJQ4IFVaz9uhBvfaXcGf45qg4U0Y"/>
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:screenOrientation="portrait"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
          <intent-filter android:label="filter_react_native">
              <action android:name="android.intent.action.VIEW"/>
              <category android:name="android.intent.category.DEFAULT"/>
              <category android:name="android.intent.category.BROWSABLE"/>
              <data android:scheme="edgeworks-demo-crm"/>
              <data android:host="app"/>
          </intent-filter>
      </activity>
      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    </application>

</manifest>
