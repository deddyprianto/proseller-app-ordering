---
to: android/app/build.gradle
force: true
---

apply plugin: "com.android.application"

import com.android.build.OutputFile

/**
 * The react.gradle file registers a task for each build variant (e.g. bundleDebugJsAndAssets
 * and bundleReleaseJsAndAssets).
 * These basically call `react-native bundle` with the correct arguments during the Android build
 * cycle. By default, bundleDebugJsAndAssets is skipped, as in debug/dev mode we prefer to load the
 * bundle directly from the development server. Below you can see all the possible configurations
 * and their defaults. If you decide to add a configuration block, make sure to add it before the
 * `apply from: "../../node_modules/react-native/react.gradle"` line.
 *
 * project.ext.react = [
 *   // the name of the generated asset file containing your JS bundle
 *   bundleAssetName: "index.android.bundle",
 *
 *   // the entry file for bundle generation
 *   entryFile: "index.android.js",
 *
 *   // https://facebook.github.io/react-native/docs/performance#enable-the-ram-format
 *   bundleCommand: "ram-bundle",
 *
 *   // whether to bundle JS and assets in debug mode
 *   bundleInDebug: false,
 *
 *   // whether to bundle JS and assets in release mode
 *   bundleInRelease: true,
 *
 *   // whether to bundle JS and assets in another build variant (if configured).
 *   // See http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Build-Variants
 *   // The configuration property can be in the following formats
 *   //         'bundleIn${productFlavor}${buildType}'
 *   //         'bundleIn${buildType}'
 *   // bundleInFreeDebug: true,
 *   // bundleInPaidRelease: true,
 *   // bundleInBeta: true,
 *
 *   // whether to disable dev mode in custom build variants (by default only disabled in release)
 *   // for example: to disable dev mode in the staging build type (if configured)
 *   devDisabledInStaging: true,
 *   // The configuration property can be in the following formats
 *   //         'devDisabledIn${productFlavor}${buildType}'
 *   //         'devDisabledIn${buildType}'
 *
 *   // the root of your project, i.e. where "package.json" lives
 *   root: "../../",
 *
 *   // where to put the JS bundle asset in debug mode
 *   jsBundleDirDebug: "$buildDir/intermediates/assets/debug",
 *
 *   // where to put the JS bundle asset in release mode
 *   jsBundleDirRelease: "$buildDir/intermediates/assets/release",
 *
 *   // where to put drawable resources / React Native assets, e.g. the ones you use via
 *   // require('./image.png')), in debug mode
 *   resourcesDirDebug: "$buildDir/intermediates/res/merged/debug",
 *
 *   // where to put drawable resources / React Native assets, e.g. the ones you use via
 *   // require('./image.png')), in release mode
 *   resourcesDirRelease: "$buildDir/intermediates/res/merged/release",
 *
 *   // by default the gradle tasks are skipped if none of the JS files or assets change; this means
 *   // that we don't look at files in android/ or ios/ to determine whether the tasks are up to
 *   // date; if you have any other folders that you want to ignore for performance reasons (gradle
 *   // indexes the entire tree), add them here. Alternatively, if you have JS files in android/
 *   // for example, you might want to remove it from here.
 *   inputExcludes: ["android/**", "ios/**"],
 *
 *   // override which node gets called and with what additional arguments
 *   nodeExecutableAndArgs: ["node"],
 *
 *   // supply additional arguments to the packager
 *   extraPackagerArgs: []
 * ]
 */

project.ext.react = [
    entryFile: "index.js",
    enableHermes: false,  // clean and rebuild if changing
    // enableHermes: true,  // clean and rebuild if changing
]

// addUnimodulesDependencies()

apply from: "../../node_modules/react-native/react.gradle"
apply from: "../../node_modules/@sentry/react-native/sentry.gradle"

// apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"

/**
 * Set this to true to create two separate APKs instead of one:
 *   - An APK that only works on ARM devices
 *   - An APK that only works on x86 devices
 * The advantage is the size of the APK is reduced by about 4MB.
 * Upload all the APKs to the Play Store and people will download
 * the correct one based on the CPU architecture of their device.
 */
def enableSeparateBuildPerCPUArchitecture = false

/**
 * Run Proguard to shrink the Java bytecode in release builds.
 */
def enableProguardInReleaseBuilds = false

/**
 * The preferred build flavor of JavaScriptCore.
 *
 * For example, to use the international variant, you can use:
 * `def jscFlavor = 'org.webkit:android-jsc-intl:+'`
 *
 * The international variant includes ICU i18n library and necessary data
 * allowing to use e.g. `Date.toLocaleString` and `String.localeCompare` that
 * give correct results when using with locales other than en-US.  Note that
 * this variant is about 6MiB larger per architecture than default.
 */
def jscFlavor = 'org.webkit:android-jsc-intl:+'

/**
 * Whether to enable the Hermes VM.
 *
 * This should be set on project.ext.react and mirrored here.  If it is not set
 * on project.ext.react, JavaScript will not be compiled to Hermes Bytecode
 * and the benefits of using Hermes will therefore be sharply reduced.
 */
def enableHermes = project.ext.react.get("enableHermes", false);

android {
    compileSdkVersion rootProject.ext.compileSdkVersion

    // config flavour
    flavorDimensions "default"

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    defaultConfig {
        applicationId "com.<%= name %>"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        compileSdkVersion rootProject.ext.compileSdkVersion
        versionCode <%= androidVersionCode %>
        versionName "<%= androidVersionName %>"
        missingDimensionStrategy 'react-native-camera', 'general'
        resValue "string", "build_config_package", "com.<%= name %>"
        multiDexEnabled true
        // detox
        testBuildType System.getProperty('testBuildType', 'debug')
        testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
    }
    splits {
        abi {
            reset()
            enable enableSeparateBuildPerCPUArchitecture
            universalApk false  // If true, also generate a universal APK
            include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
    }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://facebook.github.io/react-native/docs/signed-apk-android.
            // For App Center Purpose
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            // Detox-specific additions to pro-guard
            proguardFile "${rootProject.projectDir}/../node_modules/detox/android/detox/proguard-rules-app.pro"
        }
    }
    productFlavors {
            dev {
                minSdkVersion rootProject.ext.minSdkVersion
                applicationId 'com.<%= name %>.dev'
                versionName "<%= androidVersionName %>"
                targetSdkVersion rootProject.ext.targetSdkVersion
                resValue "string", "build_config_package", "com.<%= name %>"
            }
            demo {
                minSdkVersion rootProject.ext.minSdkVersion
                applicationId 'com.<%= name %>.demo'
                versionName "<%= androidVersionName %>"
                targetSdkVersion rootProject.ext.targetSdkVersion
                resValue "string", "build_config_package", "com.<%= name %>"
            }
            app {
                minSdkVersion rootProject.ext.minSdkVersion
                applicationId 'com.<%= name %>.app'
                versionName "<%= androidVersionName %>"
                targetSdkVersion rootProject.ext.targetSdkVersion
                resValue "string", "build_config_package", "com.<%= name %>"
            }
        }
    // applicationVariants are e.g. debug, release
    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            // For each separate APK per architecture, set a unique version code as described here:
            // https://developer.android.com/studio/build/configure-apk-splits.html
            def versionCodes = ["armeabi-v7a": 1, "x86": 2, "arm64-v8a": 3, "x86_64": 4]
            def abi = output.getFilter(OutputFile.ABI)
            if (abi != null) {  // null for the universal-debug, universal-release variants
                output.versionCodeOverride =
                        versionCodes.get(abi) * 1048576 + defaultConfig.versionCode
            }

        }
    }
}

dependencies {
    compile project(':@react-native-community_cameraroll')
    implementation project(':react-native-fs')
    implementation project(':react-native-linear-gradient')
    implementation project(':react-native-sms-retriever')
    // implementation project(':react-native-device-brightness')
    implementation project(':react-native-config')
    implementation project(':react-native-permissions')
    implementation project(':react-native-vector-icons')
    // implementation project(':react-native-fbsdk')
    implementation project(':react-native-android-location-enabler')
    implementation project(':react-native-svg')
    implementation project(':react-native-camera')
    implementation fileTree(dir: "libs", include: ["*.jar"])
    // implementation "com.facebook.react:react-native:+"  // From node_modules
    // implementation 'com.facebook.android:facebook-android-sdk:[4,5)'
    // implementation 'com.facebook.android:facebook-login:[5,6)'
    // implementation 'com.facebook.android:facebook-android-sdk:5.15.3'
    
    // def multidex_version = "2.0.1"
    // implementation 'androidx.multidex:multidex:$multidex_version'

    implementation 'com.android.support:multidex:1.0.3'

    // detox
    androidTestImplementation('com.wix:detox:+') { transitive = true }
    androidTestImplementation 'junit:junit:4.12'
    implementation "androidx.annotation:annotation:1.1.0"

    // NetsClick
    implementation 'com.android.support.constraint:constraint-layout:1.1.3'
    implementation 'com.android.support.constraint:constraint-layout:1.1.3'

    implementation "com.google.code.gson:gson:2.8.5"
    implementation 'com.j256.ormlite:ormlite-core:5.0'
    implementation 'com.j256.ormlite:ormlite-android:5.0'
    implementation 'com.squareup.okhttp3:okhttp:3.12.1'
    implementation 'com.jakewharton.retrofit:retrofit1-okhttp3-client:1.0.2'
    implementation 'com.squareup.okhttp3:logging-interceptor:3.12.3'
    implementation 'com.google.guava:guava:27.0.1-android'
    implementation 'com.nimbusds:nimbus-jose-jwt:4.11.2'
    implementation 'com.madgag.spongycastle:core:1.58.0.0'
    implementation 'com.madgag.spongycastle:prov:1.58.0.0'
    implementation 'com.madgag.spongycastle:pkix:1.54.0.0'
    implementation 'org.jetbrains:annotations:16.0.2'

    if (enableHermes) {
        def hermesPath = "../../node_modules/hermes-engine/android/";
        debugImplementation files(hermesPath + "hermes-debug.aar")
        releaseImplementation files(hermesPath + "hermes-release.aar")
    } else {
        implementation jscFlavor
    }
}

// Run this once to be able to run the application with BUCK
// puts all compile dependencies into folder libs for BUCK to use
task copyDownloadableDepsToLibs(type: Copy) {
    from configurations.compile
    into 'libs'
}

apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
apply plugin: 'com.android.application'
apply plugin: 'com.onesignal.androidsdk.onesignal-gradle-plugin'
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

