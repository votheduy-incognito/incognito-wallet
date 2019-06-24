package com.constantwalletmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.wifi.p2p.WiFiP2PManagerPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import org.reactnative.camera.RNCameraPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new WiFiP2PManagerPackage(),
            new RCTBluetoothSerialPackage(),
            new RNCameraPackage(),
            new RandomBytesPackage(),
            new ReanimatedPackage(),
            new SvgPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
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
