#import "Gomobile.h"
#import <UIKit/UIKit.h>

@implementation Gomobile

RCT_EXPORT_MODULE(PrivacyGo);

//exports a method deriveSerialNumber to javascript
RCT_EXPORT_METHOD(deriveSerialNumber:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileDeriveSerialNumber(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method randomScalars to javascript
RCT_EXPORT_METHOD(randomScalars:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileRandomScalars(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method initPrivacyTx to javascript
RCT_EXPORT_METHOD(initPrivacyTx:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileInitPrivacyTx(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}


//exports a method initPrivacyTokenTx to javascript
RCT_EXPORT_METHOD(initPrivacyTokenTx:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileInitPrivacyTokenTx(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method initBurningRequestTx to javascript
RCT_EXPORT_METHOD(initBurningRequestTx:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileInitBurningRequestTx(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method initBurningRequestTx to javascript
RCT_EXPORT_METHOD(initWithdrawRewardTx:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileInitWithdrawRewardTx(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method staking to javascript
RCT_EXPORT_METHOD(staking:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileStaking(data,nil);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method generateBLSKeyPairFromSeed to javascript
RCT_EXPORT_METHOD(generateBLSKeyPairFromSeed:(NSString *)data callback:(RCTResponseSenderBlock)callback){
  @try{
    NSString *rs = GomobileGenerateBLSKeyPairFromSeed(data);
    callback(@[[NSNull null], rs]);
  }
  @catch(NSException *exception){
    callback(@[exception.reason, [NSNull null]]);
  }
}

//exports a method scalarMultBase to javascript
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(
  scalarMultBase:(NSString *)data
) {
  NSString *rs = GomobileScalarMultBase(data,nil);
  return rs;
}

//exports a method scalarMultBase to javascript
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(
  generateKeyFromSeed:(NSString *)data
) {
  NSString *rs = GomobileGenerateKeyFromSeed(data,nil);
  return rs;
}

@end
