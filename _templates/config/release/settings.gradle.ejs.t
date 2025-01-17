---
to: android/settings.gradle
force: true
---

rootProject.name = '<%= name %>'
include ':react-native-linear-gradient'
project(':react-native-linear-gradient').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-linear-gradient/android')
include ':@react-native-firebase_crashlytics'
project(':@react-native-firebase_crashlytics').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-firebase/crashlytics/android')
include ':@react-native-firebase_app'
project(':@react-native-firebase_app').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-firebase/app/android')
include ':react-native-firebase'
project(':react-native-firebase').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-firebase/android')
include ':react-native-config'
project(':react-native-config').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-config/android')
include ':react-native-permissions'
project(':react-native-permissions').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-permissions/android')
include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
include ':react-native-fbsdk'
project(':react-native-fbsdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fbsdk/android')
include ':react-native-fbsdk'
project(':react-native-fbsdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-fbsdk/android')
include ':react-native-android-location-enabler'
project(':react-native-android-location-enabler').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-android-location-enabler/android')
include ':react-native-svg'
project(':react-native-svg').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-svg/android')
include ':react-native-camera'
project(':react-native-camera').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-camera/android')
include ':@react-native-community_cameraroll'
project(':@react-native-community_cameraroll').projectDir = new File(rootProject.projectDir, 	'../node_modules/@react-native-community/cameraroll/android')
include ':react-native-fs'
project(':react-native-fs').projectDir = new File(settingsDir, '../node_modules/react-native-fs/android')
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
