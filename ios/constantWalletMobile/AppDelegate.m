/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Firebase.h>
#import "RNFirebaseNotifications.h"
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <CodePush/CodePush.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[AppsFlyerTracker sharedTracker] trackAppLaunch];
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"constantWalletMobile"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  /** APPSFLYER INIT **/
  [AppsFlyerTracker sharedTracker].appsFlyerDevKey = @"b3jPTau376R98i6xKeFShJ";
  [AppsFlyerTracker sharedTracker].appleAppID = @"1475631606";
  [AppsFlyerTracker sharedTracker].delegate = self;
  /* Set isDebug to true to see AppsFlyer debug logs */
  [AppsFlyerTracker sharedTracker].isDebug = true;
    
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

// Deep linking

// Open Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id> * _Nullable))restorationHandler {
    [[AppsFlyerTracker sharedTracker] continueUserActivity:userActivity restorationHandler:restorationHandler];
    return YES;
}

// Report Push Notification attribution data for re-engagements
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    [[AppsFlyerTracker sharedTracker] handlePushNotification:userInfo];
}


// AppsFlyerTracker implementation

//Handle Conversion Data (Deferred Deep Link)
-(void)onConversionDataSuccess:(NSDictionary*) installData {
    id status = [installData objectForKey:@"af_status"];
    if([status isEqualToString:@"Non-organic"]) {
        id sourceID = [installData objectForKey:@"media_source"];
        id campaign = [installData objectForKey:@"campaign"];
        NSLog(@"This is a none organic install. Media source: %@  Campaign: %@",sourceID,campaign);
    } else if([status isEqualToString:@"Organic"]) {
        NSLog(@"This is an organic install.");
    }
}
-(void)onConversionDataFail:(NSError *) error {
  NSLog(@"%@",error);
}

//Handle Direct Deep Link
- (void) onAppOpenAttribution:(NSDictionary*) attributionData {
  NSLog(@"%@",attributionData);
}
- (void) onAppOpenAttributionFailure:(NSError *)error {
  NSLog(@"%@",error);
}

@end
