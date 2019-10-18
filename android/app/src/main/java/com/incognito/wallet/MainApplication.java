package com.incognito.wallet;

import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.RNZmqServicePackage;
import com.peel.react.rnos.RNOSModule;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnative.ssh.RNSSHPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.sensors.RNSensorsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactlibrary.RNZmqServicePackage;
import com.tadasr.IOTWifi.IOTWifiPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
          new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
              return BuildConfig.DEBUG;
            }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new RNZmqServicePackage(),
            new RNOSModule(),
            new RNPermissionsPackage(),
            new RNCameraPackage(),
            new RandomBytesPackage(),
            new ReanimatedPackage(),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
            new RNSSHPackage(),
            new RNNetworkInfoPackage(),
            new NetInfoPackage(),
            new RNSensorsPackage(),
            new RNSoundPackage(),
            new RNZmqServicePackage(),
            new RNDeviceInfo(),
            new IOTWifiPackage(),
            new RNFirebasePackage(),
            new RNCameraPackage(),
            new RandomBytesPackage(),
            new ReanimatedPackage(),
            new SvgPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new GomobilePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseDatabasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseCrashlyticsPackage()
      );
    }

            @Override
            protected String getJSMainModuleName() {
              return "index";
            }
          };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
