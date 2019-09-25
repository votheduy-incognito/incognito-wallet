package com.incognito.wallet;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import gomobile.Gomobile;

/**
 * Created by hatajoe on 2018/02/15.
 */

public class GomobileModule extends ReactContextBaseJavaModule {
    private static final String TAG = "GomobileModule";

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
            Log.d(TAG, "aggregatedRangeProve: begin");
            successCallback.invoke(null, Gomobile.aggregatedRangeProve(data));
        } catch (Exception e) {
            successCallback.invoke(e, null);
        }
    }

    public static void setPrivateField(Class clazz, Object inst, String field, Object value) throws Exception {
        java.lang.reflect.Field f = clazz.getDeclaredField(field);
        f.setAccessible(true);
        f.set(inst, value);
        f.setAccessible(false);
    }

    @ReactMethod
    public void generateBLSKeyPairFromSeed(String data, Callback successCallback) {
        try {
            Log.d(TAG, "generateBLSKeyPairFromSeed: begin");
            ExecutorService executorService = Executors.newFixedThreadPool(10);

            executorService.execute(new Runnable() {
                public void run() {
//                    successCallback.invoke(null,Gomobile.sayHello("sssss"));
                    Log.d(TAG, "generateBLSKeyPairFromSeed: begin run " + Thread.currentThread().getName());
                    String response = Gomobile.generateBLSKeyPairFromSeed(data);
                    Log.d(TAG, "generateBLSKeyPairFromSeed: begin run data --- " + response);
                    successCallback.invoke(null, response);
                    executorService.shutdown();
                }
            });


            Log.d(TAG, "generateBLSKeyPairFromSeed: begin01");
        } catch (Exception e) {
            successCallback.invoke(e, null);
            Log.d(TAG, "generateBLSKeyPairFromSeed: begin02 error");
        }
    }
}