package com.ustar;

public class AppConfig {

    private String  APP_TTTLE;
    private String  APP_TYPE;   // RH | DP
    private String  ENV_TYPE;   // SIT | UAT | PROD
    private String  APP_ID;
    private String  APP_SECRET;
    private String  MAP_PUB_KEY_ID;
    private String  MAP_PUB_KEY_EXP;
    private String  MAP_PUB_KEY_MODULUS;
    private String  MAP_SERVER_CERT;
    private String  MID;
    private String  TID;
    private String  MAP_URL;
    private String  PNBLOCK_URL;
    private String  MHOST_TYPE;
    private String  MHOST_URL;

    public String getAPP_TTTLE() {
        return APP_TTTLE;
    }

    public void setAPP_TTTLE(String APP_TTTLE) {
        this.APP_TTTLE = APP_TTTLE;
    }

    public String getAPP_TYPE() {
        return APP_TYPE;
    }

    public void setAPP_TYPE(String APP_TYPE) {
        this.APP_TYPE = APP_TYPE;
    }

    public String getENV_TYPE() {
        return ENV_TYPE;
    }

    public void setENV_TYPE(String ENV_TYPE) {
        this.ENV_TYPE = ENV_TYPE;
    }

    public String getMID() {
        return MID;
    }

    public void setMID(String MID) {
        this.MID = MID;
    }

    public String getTID() {
        return TID;
    }

    public void setTID(String TID) {
        this.TID = TID;
    }

    public String getMAP_URL() {
        return MAP_URL;
    }

    public void setMAP_URL(String MAP_URL) {
        this.MAP_URL = MAP_URL;
    }

    public String getPNBLOCK_URL() {
        return PNBLOCK_URL;
    }

    public void setPNBLOCK_URL(String PNBLOCK_URL) {
        this.PNBLOCK_URL = PNBLOCK_URL;
    }

    public String getMHOST_TYPE() {
        return MHOST_TYPE;
    }

    public void setMHOST_TYPE(String MHOST_TYPE) {
        this.MHOST_TYPE = MHOST_TYPE;
    }

    public String getMHOST_URL() {
        return MHOST_URL;
    }

    public void setMHOST_URL(String MHOST_URL) {
        this.MHOST_URL = MHOST_URL;
    }

    public String getAPP_ID() {
        return APP_ID;
    }

    public void setAPP_ID(String APP_ID) {
        this.APP_ID = APP_ID;
    }

    public String getAPP_SECRET() {
        return APP_SECRET;
    }

    public void setAPP_SECRET(String APP_SECRET) {
        this.APP_SECRET = APP_SECRET;
    }

    public String getMAP_PUB_KEY_ID() {
        return MAP_PUB_KEY_ID;
    }

    public void setMAP_PUB_KEY_ID(String MAP_PUB_KEY_ID) {
        this.MAP_PUB_KEY_ID = MAP_PUB_KEY_ID;
    }

    public String getMAP_PUB_KEY_EXP() {
        return MAP_PUB_KEY_EXP;
    }

    public void setMAP_PUB_KEY_EXP(String MAP_PUB_KEY_EXP) {
        this.MAP_PUB_KEY_EXP = MAP_PUB_KEY_EXP;
    }

    public String getMAP_PUB_KEY_MODULUS() {
        return MAP_PUB_KEY_MODULUS;
    }

    public void setMAP_PUB_KEY_MODULUS(String MAP_PUB_KEY_MODULUS) {
        this.MAP_PUB_KEY_MODULUS = MAP_PUB_KEY_MODULUS;
    }

    public String getMAP_SERVER_CERT() {
        return MAP_SERVER_CERT;
    }

    public void setMAP_SERVER_CERT(String MAP_SERVER_CERT) {
        this.MAP_SERVER_CERT = MAP_SERVER_CERT;
    }
}
