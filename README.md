# React Native Apps

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
SET ENVFILE=.env.demo && npx react-native run-android --variant=demoDebug --appIdSuffix=dev
```
To run app debug on **production**, run :

```
SET ENVFILE=.env.production && npx react-native run-android --variant=productionDebug --appIdSuffix=dev
```

## Generate Release App.
Go to android directory then,

To build app on **dev** environment, run :

```
SET ENVFILE=.env.dev && gradlew assembleDevRelease 
```
To build app on **demo** environment, run :

```
SET ENVFILE=.env.demo && gradlew assembleDemoRelease 
```
To build app on **production** environment, run :

```
SET ENVFILE=.env.production && gradlew assembleProductionRelease 
```

## Change App Icon
To change the app icon based on their environment, go to **android/app/src** and specify your app icon based on their environment.
