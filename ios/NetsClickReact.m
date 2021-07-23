//
//  Netsclick.m
//  Ustars
//
//  Created by Iqbal DP on 13/03/21.
//  Copyright © 2021 Edgeworks. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UIKit/UIKit.h"

#import <React/RCTBridgeModule.h>


@interface RCT_EXTERN_MODULE(NetsClickReact, NSObject)

RCT_EXTERN_METHOD(
  doRegister: (NSString)muidStr
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
  doDebit: (NSString)amt
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
  DebitWithPIN: (NSString)amt withResp: (NSString)resp withT53: (NSString)t53code
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
  doDeregister:
  (RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)
@end
