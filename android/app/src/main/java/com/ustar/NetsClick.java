package com.ustar;

import android.content.Context;
import android.content.res.Resources;
import android.util.Log;

// NetsClick
import com.nets.nofsdk.request.NofService;
import com.nets.nofsdk.request.StatusCallback;
import com.nets.nofsdk.model.PublicKeyComponent;
import com.nets.nofsdk.model.PublicKeySet;
import com.nets.nofsdk.exception.ServiceAlreadyInitializedException;

public class NetsClick {
    private static NetsClick singleton = null;
    private AppConfig appConfig;
    private Context appContext;

    static {
        singleton = new NetsClick();
    }

    private NetsClick() {

    }

    public static NetsClick getInstance() {
        return singleton;
    }

    public void init(Context context) {
        if (!NofService.isMainProcess(context))
            return;
        appContext = context;
        appConfig = new AppConfig();

        Resources res = context.getResources();
        appConfig.setAPP_TTTLE( res.getString(R.string.app_name));
        appConfig.setAPP_TYPE( res.getString(R.string.appType));
        appConfig.setENV_TYPE( res.getString(R.string.envType));
        appConfig.setAPP_ID( res.getString(R.string.appId));
        appConfig.setAPP_SECRET( res.getString(R.string.appSecret));
        appConfig.setMAP_PUB_KEY_ID( res.getString(R.string.mapPubKeyId));
        appConfig.setMAP_PUB_KEY_EXP( res.getString(R.string.mapPubKeyExp));
        appConfig.setMAP_PUB_KEY_MODULUS( res.getString(R.string.mapPubKeyModulus));
        appConfig.setMAP_SERVER_CERT( res.getString(R.string.mapServerCert));
        appConfig.setMID( res.getString(R.string.mid));
        appConfig.setTID( res.getString(R.string.tid));
        appConfig.setMAP_URL( res.getString(R.string.urlMap));
        appConfig.setPNBLOCK_URL( res.getString(R.string.urlApiGw));
        appConfig.setMHOST_TYPE( res.getString(R.string.mhostType));
        appConfig.setMHOST_URL( res.getString(R.string.mhostUrl));

        Environment environment = Environment.getInstance();
        environment.doInit(appConfig);

        try {
            //ENABLE NOF SDK DEBUG LOG
            NofService.setSdkDebuggable(true);
            NofService.initialize(
                appContext,
                environment.getBASE_MAP_URL(),
                environment.getBASE_API_URL(),
                environment.getAPP_ID(),
                environment.getAPP_SECRET(),
                getAppPublicKeySet(),
                getCaResource(),
                new StatusCallback<String, String>() {
                    @Override public void success(String result) {
                      Log.i("netsclick", result);
                    }
                    @Override public void failure(String result) {
                      Log.e("netsclick", result);
                    }
                });
          } catch (ServiceAlreadyInitializedException e) {
            Log.e("netsclick", e.getMessage());
          }
    }

    private int getCaResource() {
        Environment environment = Environment.getInstance();
        return appContext.getResources().getIdentifier(environment.getMAP_SERVER_CERT(),
                "raw",
                appContext.getPackageName());
    }

    public PublicKeySet getAppPublicKeySet() {
        Environment environment = Environment.getInstance();

        PublicKeyComponent mapPubKey = new PublicKeyComponent(environment.getMAP_PUBLIC_KEY_ID(),
                environment.getMAP_PUBLIC_KEY_EXPONENT(),
                environment.getMAP_PUBLIC_KEY_MODULUS());

        PublicKeySet pks = new PublicKeySet(mapPubKey);
        // MAP Public Key
        // ID : 2
        // MODULUS: cfbb65135256d4e525fc6aada10ff7a78e0f239d6f4ac7ed0ef2b883e1b4cba8ec1c49208142952cdc530380024d6ca7bae28f7d82a36e8b95baad64df079b368d17dce484e00e88ba008e41576da8e9aaa102d4287f07f0edd89a76df8eeb02e08498c01b6a9fd5014e3b73fd49b0c76ba32180894fe1da728c858bad96db9191e7c8244bf0649f09577ebe4bd1d0a1640dc2b8ad6f64b2a2f8715777b669703f3fcb8023dbe024fcb21ca0697044400dcdc288b335ccb254e8d98bb93eb4c71b84141467e35cb284d13c62099ba90367d490581dabdf33744898a54a81bf05451288ec4c1065df003efa51aab502acadba022ee6d48b91901140e00d5eb20b
        // EXPONENT: 03
        /**
         * HPP Public Key
         * ID : 2 – For all (DBS, UOB, OCBC, and NETS Simulator)
         */
        // ALL HPP Public Key are the same for DBS, UOB, OCBC
        // MODULUS: D031A01F005662CCE917C57C8FCC18BB934026DC0D02A0E865896077BBCB2760B05AB979A9253523B11573196465973566760B4F7AE0552349F826AB62A2D2E10B783A99D6668A643090E259ACB30BCD9B9C5A2BFED83A8011DFD79CE0C285E09CF183E31662908B1F5AA8043562DB4056B35876712787B373AED178F55EE860B252CEBD29721B97B84B17429EBE2EB6889F8487FD98EB5DA5477971AF85791B18C8F73CAF1706CC41C22F45F855FE197FCEE10ADB441DD84E92D61C51F23DBEDEFBF153ADA2BFD675FB5BF4ABC6B9E70DED677C8C9A85E189D73B3A287CE4B6B1310B284527A742BE39B47F7FC56022E0419B81113FF739324FCC348AECCED7
        // EXPONENT: 03
        PublicKeyComponent hppPubKeyDBS = new PublicKeyComponent(environment.getHPP_PUBLIC_KEY_ID(0),
                environment.getHPP_PUBLIC_KEY_EXPONENT(0),
                environment.getHPP_PUBLIC_KEY_MODULUS(0));

        PublicKeyComponent hppPubKeyUOB = new PublicKeyComponent(environment.getHPP_PUBLIC_KEY_ID(1),
                environment.getHPP_PUBLIC_KEY_EXPONENT(1),
                environment.getHPP_PUBLIC_KEY_MODULUS(1));

        PublicKeyComponent hppPubKeyNOFOCBC = new PublicKeyComponent(environment.getHPP_PUBLIC_KEY_ID(2),
                environment.getHPP_PUBLIC_KEY_EXPONENT(2),
                environment.getHPP_PUBLIC_KEY_MODULUS(2));

        PublicKeyComponent hppPubKeySIM = new PublicKeyComponent(environment.getHPP_PUBLIC_KEY_ID(4),
                environment.getHPP_PUBLIC_KEY_EXPONENT(4),
                environment.getHPP_PUBLIC_KEY_MODULUS(4));

        pks.addHppPublicKey("0001", hppPubKeyDBS);
        pks.addHppPublicKey("0002", hppPubKeyUOB);
        pks.addHppPublicKey("0004", hppPubKeyNOFOCBC);
        pks.addHppPublicKey("9999", hppPubKeySIM);
        return pks;
    }
}