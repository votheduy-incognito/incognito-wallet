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

    public static void setPrivateField(Class clazz, Object inst, String field, Object value) throws Exception {
        java.lang.reflect.Field f = clazz.getDeclaredField(field);
        f.setAccessible(true);
        f.set(inst, value);
        f.setAccessible(false);
    }

    @ReactMethod
    public void deriveSerialNumber(String data, Callback successCallback) {
        try {
            Log.d(TAG, "deriveSerialNumber: begin");
            successCallback.invoke(null, Gomobile.deriveSerialNumber(data));
        } catch (Exception e) {
            Log.d(TAG, "deriveSerialNumber: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void randomScalars(String data, Callback successCallback) {
        try {
            Log.d(TAG, "randomScalars: begin");
            successCallback.invoke(null, Gomobile.randomScalars(data));
        } catch (Exception e) {
            Log.d(TAG, "randomScalars: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initPrivacyTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "initPrivacyTx: begin");
            successCallback.invoke(null, Gomobile.initPrivacyTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "initPrivacyTx: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initPrivacyTokenTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "initPrivacyTokenTx: begin");
            successCallback.invoke(null, Gomobile.initPrivacyTokenTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "initPrivacyTokenTx: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initBurningRequestTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "initBurningRequestTx: begin");
            successCallback.invoke(null, Gomobile.initBurningRequestTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "initBurningRequestTx: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initWithdrawRewardTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "initWithdrawRewardTx: begin");
            successCallback.invoke(null, Gomobile.initWithdrawRewardTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "initWithdrawRewardTx: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void staking(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.staking(data, time));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initPRVContributionTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.initPRVContributionTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initPTokenContributionTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.initPTokenContributionTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initPRVTradeTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.initPRVTradeTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void initPTokenTradeTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.initPTokenTradeTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void withdrawDexTx(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.withdrawDexTx(data, time));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void hybridDecryptionASM(String data, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.hybridDecryptionASM(data));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void hybridEncryptionASM(String data, Callback successCallback) {
        try {
            Log.d(TAG, "staking: begin");
            successCallback.invoke(null, Gomobile.hybridEncryptionASM(data));
        } catch (Exception e) {
            Log.d(TAG, "staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void stopAutoStaking(String data, Integer time, Callback successCallback) {
        try {
            Log.d(TAG, "stop staking: begin");
            successCallback.invoke(null, Gomobile.stopAutoStaking(data, time));
        } catch (Exception e) {
            Log.d(TAG, "stop staking: error");
            successCallback.invoke(e.getMessage(), null);
        }
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
            successCallback.invoke(e.getMessage(), null);
            Log.d(TAG, "generateBLSKeyPairFromSeed: begin02 error");
        }
    }

    @ReactMethod
    public void scalarMultBase(String data, Callback successCallback) {
        try {
            Log.d(TAG, "Sign 0x: begin");
            successCallback.invoke(null, Gomobile.scalarMultBase(data));
        } catch (Exception e) {
            Log.d(TAG, "Sign 0x: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void generateKeyFromSeed(String data, Callback successCallback) {
        try {
            Log.d(TAG, "Sign 0x: begin");
            successCallback.invoke(null, Gomobile.generateKeyFromSeed(data));
        } catch (Exception e) {
            Log.d(TAG, "Sign 0x: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void signPoolWithdraw(String data, Callback successCallback) {
        try {
            Log.d(TAG, "Sign 0x: begin");
            successCallback.invoke(null, Gomobile.signPoolWithdraw(data));
        } catch (Exception e) {
            Log.d(TAG, "Sign 0x: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void getSignPublicKey(String data, Callback successCallback) {
        try {
            Log.d(TAG, "Sign 0x: begin");
            successCallback.invoke(null, Gomobile.getSignPublicKey(data));
        } catch (Exception e) {
            Log.d(TAG, "Sign 0x: error");
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void parseNativeRawTx(String data, Callback successCallback) {
        try {
            successCallback.invoke(null, Gomobile.parseNativeRawTx(data));
        } catch (Exception e) {
            successCallback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void parsePrivacyTokenRawTx(String data, Callback successCallback) {
        try {
            successCallback.invoke(null, Gomobile.parsePrivacyTokenRawTx(data));
        } catch (Exception e) {
            successCallback.invoke(e.getMessage(), null);
        }
    }
}
