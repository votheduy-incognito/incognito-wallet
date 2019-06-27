package com.constantwalletmobile;

import gomobile.Gomobile;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

/**
 * Created by hatajoe on 2018/02/15.
 */

public class GomobileModule extends ReactContextBaseJavaModule {
    public GomobileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "PrivacyGo";
    }

    @ReactMethod
    public void aggregatedRangeProve(String data, Callback successCallback) {
        try {
            successCallback.invoke(null, Gomobile.aggregatedRangeProve(data));
        } catch(Exception e) {
            successCallback.invoke(e, null);
        }
    }
}