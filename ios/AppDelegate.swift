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

    let HOST_URL = "https://netspay.nets.com.sg"
    let API_GW_URL = "https://api.nets.com.sg"

    let APPLICATION_ID = "00014000105"
    let APP_SECRET = "1F39AC85059866981FE16D45E0A3627CD133DAD77B4FB8887C649C1A54F6C738"

    let HPP_ISSUER_ID = "0001"
    let HPP_ISSUER_ID_UOB = "0002"
    let HPP_ISSUER_ID_OCBC = "0004"
    let HPP_ISSUER_ID_SIM = "9999"
    
    let MAP_PUBLIC_KEY_ID = "2"
    let MAP_PUBLIC_KEY_EXPONENT = "03"
    let MAP_PUBLIC_KEY_MODULUS = "a8d687ac064ee2ce75a51a6351e1b4906366173bd53bba3dea9b8ee9cb57d8028b496cc860e3205f983afdac338b1f4a76a89ba4e832811cb6b8a581b961af256ba53f64cac3153a78922d5142667d5ca31766deb965f2f178e3e5622377d9fa24602e3e3d50bd82c40a9491065260c0f7bcef8a24425ae07acbde658caecb5d56ed2cd67f07bece6bdcefa733b8ab815c4c0d249f9d0784cd2a2a839ba650ae5359bc83b9c38539681603833ef05eeb6ca9b138b9abf3da592f443e6d90467d4a261864cc5de87d54cafcb4ed227e9c649674dd7bbdfd96c7ea25210216f0e7b484b00d39e019a62c8552b2f7b48f1b41be91e5f9262d6c4f75db39f5ea3f73"

    let HPP_PUBLIC_KEY_ID = "4"
    let HPP_PUBLIC_KEY_EXPONENT = "03"

    let HPP_PUBLIC_KEY_MODULUS = "CA83F1C917C072B70757A6D88ED94C8E94AF7F142A2F8A52AC491243BF33F30C3FF18FEBED5D49AB5315057EBA3D3045D1B297F6893F2596CC08E6C5664F324993D553E690C48C9E7342673B3D94F167396E969017B0C80C980C3E8F8F32F28240ADBAA5AD4CA3619110575164738F50504C0CDA43A08B15F7D47A99F91DE2AE6773296C4794B56A989A1BF646FA5F2B3F03FAF20035CD0B0BF701FE977297B946100952BD07D7E73B6AC26B3964CB65831893690C8002B8568FAE0AEDF4DED213FEBCA081F4AEF5BE57B45C1C7EC98CF84D0F1CBCCEF707FDE8CC29821637F6E37653EC989D96AC18253DDC2FB2987616151EE6084653CAB85417A37E06FE1B"


    let mapPubKey = PublicKeyComponent(MAP_PUBLIC_KEY_ID, withKeyModulus: MAP_PUBLIC_KEY_MODULUS, withKeyExponent: MAP_PUBLIC_KEY_EXPONENT)

    let hppPubKey = PublicKeyComponent(HPP_PUBLIC_KEY_ID, withKeyModulus: HPP_PUBLIC_KEY_MODULUS, withKeyExponent: HPP_PUBLIC_KEY_EXPONENT)

    let dic: NSMutableDictionary = [HPP_ISSUER_ID: hppPubKey, HPP_ISSUER_ID_SIM: hppPubKey, HPP_ISSUER_ID_UOB: hppPubKey, HPP_ISSUER_ID_OCBC: hppPubKey]

    let pks = PublicKeySet(mapPubKey, withHppPublicComponents: dic)
    let serverName = "netspay_nets_com_sg"

    DispatchQueue.global().async() {
        do {
            try ExceptionCatcher.catchException {
                NofService.main().setSdkDebuggable(true)
                NofService.main().initialize(withServerBaseUrl: HOST_URL, withApiGwBaseUrl: API_GW_URL, withAppId: APPLICATION_ID, withAppSecret: APP_SECRET, with: pks, withServerCertName: serverName, success: { (result) in
                    DispatchQueue.main.async() {
                      print("result success initialize SDK = \(result)")
                    }
                }, failure: { (errorCode) in
                    DispatchQueue.main.async() {
                        print("failed \(errorCode)")
                        self.showAlert(message: "Initialization failed : \(errorCode)")
                    }
                })
            }
        } catch {
            let err: NSError = error as NSError
            if error.localizedDescription == ServiceError.serviceNotInitializedException().name.rawValue {
                print("Netsclick error " + error.localizedDescription)
            }
            if error.localizedDescription == ServiceError.missingServerCertException().name.rawValue {
                print(error.localizedDescription)
                DispatchQueue.main.async() {
                    self.showAlert(message: "Service Initialized Error : Missing Cert")
                }
            }
            if error.localizedDescription == ServiceError.missingDataException("").name.rawValue {
                print(error.localizedDescription)
                if let missingFields: String = err.userInfo["NSLocalizedDescriptionKey"] as? String {
                    DispatchQueue.main.async() {
                        self.showAlert(message: "Missing Data : \(missingFields)")
                    }
                }
            }
            if error.localizedDescription == ServiceError.serviceNotInitializedException("").name.rawValue {
                print(error.localizedDescription)
                if let missingFields: String = err.userInfo["NSLocalizedDescriptionKey"] as? String {
                    DispatchQueue.main.async() {
                        self.showAlert(message: "Service Initialized Error : \(missingFields)")
                    }
                }
            }
        }
    }
    
    
    jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
      let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "acemart", initialProperties: nil, launchOptions: launchOptions)
    
      AppDelegate.rootViewController.view = rootView
      self.window = UIWindow(frame: UIScreen.main.bounds)
      self.window?.rootViewController = AppDelegate.rootViewController
      self.window?.makeKeyAndVisible()
    
      return true
  }
  
  func showAlert(message: String) {
      let alert = UIAlertController(title: "Error", message:message, preferredStyle: .alert)
      
      alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      
      self.window?.rootViewController?.present(alert, animated: true, completion: nil)
  }
  
}
