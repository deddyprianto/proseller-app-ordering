//
//  AppDelegate.swift
//  Ustars
//
//  Created by Iqbal DP on 10/03/21.
//  Copyright © 2021 Edgeworks. All rights reserved.
//
import Firebase

@UIApplicationMain
class AppDelegate: UIViewController, UIApplicationDelegate {
  var window: UIWindow?
  var bridge: RCTBridge!
  
  public static var rootViewController = UIViewController()
  
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    // Firebase
    FirebaseApp.configure()
    
    let jsCodeLocation: URL
    
    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
      let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "Automaxima", initialProperties: nil, launchOptions: launchOptions)
    
      AppDelegate.rootViewController.view = rootView
      self.window = UIWindow(frame: UIScreen.main.bounds)
      self.window?.rootViewController = AppDelegate.rootViewController
      self.window?.makeKeyAndVisible()
    
      return true
  }
  
}
