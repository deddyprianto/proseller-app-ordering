//
//  Netsclick.swift
//  Ustars
//
//  Created by Iqbal DP on 10/03/21.
//  Copyright © 2021 Edgeworks. All rights reserved.
//

import Foundation

@available(iOS 10.0, *)
@objc(NetsClickReact)
class NetsClickReact: NSObject {
  
  var amount = "000000000100"
  
  @objc
  func doDebit(
    _ amt : NSString,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
    
    let amountString: String = amt as String
    let c = (Double(amountString)! * 100.0)
    let d = Int(c)
    let b = String(format: "%012d", d)
    print("B = \(b)")
    amount = b
    print("amount in cent \(amount)")
    let debit = Debit(amount: amount)
    DispatchQueue.global().async() {
       do {
         try ExceptionCatcher.catchException {
             debit.invoke({ (result) in
                 print("result success table 02 and 05= \(result)")
                    // do Debit to merchant host here
                  resolve(result)
                 }, failure: { (error) in
                    reject("DEBIT_FAILED", error, nil)
                   print("failed responseCode = " + error)
                 })
             }
         } catch {
             let err: NSError = error as NSError
             if error.localizedDescription == ServiceError.serviceNotInitializedException().name.rawValue {
                print(error.localizedDescription)
             }
             if error.localizedDescription == ServiceError.missingServerCertException().name.rawValue {
                print(error.localizedDescription)
             }
             if error.localizedDescription == ServiceError.missingDataException("").name.rawValue {
                 print(error.localizedDescription)
                 if let missingFields: String = err.userInfo["NSLocalizedDescriptionKey"] as? String {
                    DispatchQueue.main.async() {
                    // show error missing fields
                  }
                }
            }
        }
    }
  }
  
  @objc
  func DebitWithPIN(
    _ amt : NSString,
    withResp resp: NSString,
    withT53 t53code: NSString,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
    ) {

    let amountString: String = amt as String
    let c = (Double(amountString)! * 100.0)
    let d = Int(c)
    let b = String(format: "%012d", d)
    print("B = \(b)")
    amount = b
    print("amount in cent \(amount)")
    
    let respCode: String = resp as String
    let t53: String = t53code as String
    
    print("resp code = \(respCode)")
    print("t53 code = \(t53)")
    
    let debit = Debit(amount: b, withResponseCode: respCode, withTransactionCryptogram: t53, with: AppDelegate.rootViewController)
    DispatchQueue.global().async() {
        do {
            try ExceptionCatcher.catchException {
                //                            self.showLoading()
                debit.invoke({ (result) in
                    print("result success = \(result)")
                    resolve(result)
                }, failure: { (error) in
                    print("failed responseCode = " + error)
                    reject("DEBIT_FAILED", error, nil)
                })
            }
        } catch {
            if error.localizedDescription == ServiceError.serviceNotInitializedException().name.rawValue {
                print(error.localizedDescription)
            }
            DispatchQueue.main.async() {
//                self.dismiss(animated: true, completion: {
//                    self.showErrorMessage(responderCode: "", errorCode: "", errorMessage: error.localizedDescription)
//                })
            }
        }
    }
  }
  
  @objc(doDeregister:rejecter:)
  func doDeregister(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    let dereg = Deregistration()
    do {
        try ExceptionCatcher.catchException {
            dereg.invoke({ (result) in
                print("result success = \(result)")
                resolve(result)
            }, failure: { (error) in
                print("failed responseCode = " + error)
                reject("DEREGISTRATION_FAILED", error, nil)
            })
        }
    } catch {
        if error.localizedDescription == ServiceError.serviceNotInitializedException().name.rawValue {
            print(error.localizedDescription)
            reject("DEREGISTRATION_FAILED", error.localizedDescription, nil)
        }
        DispatchQueue.main.async() {
          
        }
    }
  }
  
  @available(iOS 10.0, *)
  @objc
  func doRegister(_ muidStr: String,
  resolver resolve: @escaping RCTPromiseResolveBlock,
  rejecter reject: @escaping RCTPromiseRejectBlock) {
    
      let midStr = "11170235100"
    
      print("Begin Register Card")
    
    let reg = Registration(viewController: AppDelegate.rootViewController, withMuid: muidStr, andWithMid: midStr, withNavigationBarColor: UIColor(displayP3Red: 1.0, green: 0.0, blue: 0.0, alpha: 1.0), withTitleBarColor: UIColor.white)
    
    DispatchQueue.global().async() {
       do {
          try ExceptionCatcher.catchException {
             reg.invoke({ (result) in
             DispatchQueue.main.async() {
                 // do UI implementation here
                // send get merchant token to host here
              resolve(result)
              print("successfully register card")
              }}, failure: { (error) in
                   DispatchQueue.main.async() {
                     // show ui error message here
                      reject("REGISTER_FAILED", error, nil)
                      print("failed responseCode = " + error)
                   }
               })
           }
       } catch {
           let err: NSError = error as NSError
           if error.localizedDescription == ServiceError.serviceNotInitializedException().name.rawValue {
              print(error.localizedDescription)
           }
           if error.localizedDescription == ServiceError.missingServerCertException().name.rawValue {
              print(error.localizedDescription)
           }
           if error.localizedDescription == ServiceError.missingDataException("").name.rawValue {
               print(error.localizedDescription)
               if let missingFields: String = err.userInfo["NSLocalizedDescriptionKey"] as? String {
                  DispatchQueue.main.async() {
                      //self.showAlert(message: "Missing Data : \(missingFields)")
                  }
                }
            }
       }
    }
  }

}
