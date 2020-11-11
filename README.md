# CRM React Native Apps

## About the app.
This application has several environments that have been installed in the Gradle project, namely the release/debug app for **dev, demo, and production** (live). So, you have to run the app according to the environment you want, for example, dev for development, a demo for the demonstration app and production for a live app.

Settings base URL and configuration in the application are in the .env file. If you want to develop applications in a dev environment, then you must use the .env.dev file, for demos in the .env.demo and for live or production, in the .env.production file.

## Installation

Clone the apps and go to the root folder, then run :

```bash
yarn install
```

## Running Debug Mode
To run app debug on **dev** environment, run :

```
SET ENVFILE=.env.dev && npx react-native run-android --variant=devDebug --appIdSuffix=dev
```
To run app debug on **demo**, run :

```
SET ENVFILE=.env.demo && npx react-native run-android --variant=demoDebug --appIdSuffix=demo
```
To run app debug on **production**, run :

```
SET ENVFILE=.env.production && npx react-native run-android --variant=productionDebug --appIdSuffix=production
```

## Generate Release App (apk)
Go to android directory then,

To build app on **dev** environment, run :

```
SET ENVFILE=.env.dev && gradlew assembleDevRelease 
```
To build app on **demo** environment, run :

```
p
```
To build app on **production** environment, run :

```
SET ENVFILE=.env.production && gradlew assembleProductionRelease 
```
## Generate Release App Bundle (aab)
Go to android directory then,

To build app on **dev** environment, run :

```
SET ENVFILE=.env.dev && gradlew bundleDevRelease
```
To build app on **demo** environment, run :

```
SET ENVFILE=.env.demo && gradlew bundleDemoRelease
```
To build app on **production** environment, run :

```
SET ENVFILE=.env.production && gradlew bundleProductionRelease
```
## Change App Icon
To change the app icon based on their environment, go to **android/app/src** and specify your app icon based on their environment.

## How to Clone Apps.
Every company has different build apps. Therefore, 1 project react native must be cloned for each different company, and every 1 company apps has 3 stages, namely dev, demo and production.

We use package **react-native-rename** to automatically change the package name and Apps ID :
```
npm install react-native-rename -g
```
Before starting to clone apps for a new company, make sure you create a new branch from the stable version. Then execute the following command to change the Apps ID and package name :
```
react-native-rename <newName>
```

After you execute the command, your MainApplication.java and MainActivity.java files will disappear. Therefore you need to create a new file by copying the contents of the previous stable version.

Then, please change the package name and apps manually in the following code:
 
on ``android/app/src/main/java/com/your package name/MainApplication.java``

```java
package com.{new package name};
```
on ``android/app/src/main/java/com/your package name/MainActivity.java``

```java
package com.{new package name};
```
and change the following app name. <b>Make sure the name below is the same as in the app.json file</b>
```java
@Override
protected String getMainComponentName() {
    return "{new package name}";
}
```

## Crashlytic File.
After all processes are complete, you need to update the ``google-services.json`` files according to their respective companies on :
``` android/src/demo/ ```
``` android/src/dev/ ```
``` android/src/production/ ```

And you must create a new project for the company on the website https://sentry.io/ to register a new Crashlytic DSN. Each stage must have a separate DSN project at <b>sentry.io</b>

 After all the processes have been setup, then clean the gradle project on ```/andoid``` directory with the command :
```
gradlew clean
```
