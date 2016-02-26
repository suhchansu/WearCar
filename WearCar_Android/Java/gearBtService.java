package chansu.GearService;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.util.HashMap;

import javax.security.cert.X509Certificate;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Binder;
import android.os.IBinder;
import android.text.format.Time;
import android.util.Log;
import android.widget.Toast;
import chansu.wearcar.WearCar;

import com.samsung.android.sdk.SsdkUnsupportedException;
import com.samsung.android.sdk.accessory.SA;
import com.samsung.android.sdk.accessory.SAAgent;
import com.samsung.android.sdk.accessory.SAAuthenticationToken;
import com.samsung.android.sdk.accessory.SAPeerAgent;
import com.samsung.android.sdk.accessory.SASocket;

public class gearBtService extends SAAgent {
    
	private static final String TAG = "GearService";

    public Boolean isAuthentication = false;
    public Context mContext = null;
    
	public static final int GEAR_CHANNEL_ID = 104;
	public static final int SERVICE_CONNECTION_RESULT_OK = 0;
	
	HashMap<Integer, wearCarProviderConnection> mConnectionsMap = null;
		
    private final IBinder mBinder = new LocalBinder();
    private static wearCarProviderConnection myConnection = null;
        
    public class LocalBinder extends Binder {
        public gearBtService getService() {
            return gearBtService.this;
        }
    }
    
    public gearBtService() {
        super("FTSampleProviderImpl", wearCarProviderConnection.class);
        Log.i(TAG, "생성자");
    }
    
    public static void writeSap(byte[] buffer) throws IOException {
		//wearCarProviderConnection r;
	
		/*
		byte[] test = new byte[2];
		test[0] = 0x08;
		test[1] = 0;*/
    	
//*		
		//example
		//*
    	buffer[0] |= 0x08;
    	buffer[1] = 0;
    	
		//buffer[0] |= 0x02; //door close
		buffer[0] &= ~0x02; //door open
		buffer[0] |= 0x40; //Light on
		//buffer[0] &= ~0x40; //Light off
		//buffer[0] |= 0x80; //Trunk close
		buffer[0] &= ~0x80; //Trunk open
		
    	myConnection.send(GEAR_CHANNEL_ID, buffer);
    	//r.write(buffer);
	}    
        
    public class wearCarProviderConnection extends SASocket {
        public static final String TAG = "wearCarProviderConnection";
        private int mConnectionId;
        private SASocket mSaSocket;

        public wearCarProviderConnection() {
            super(wearCarProviderConnection.class.getName());
            Log.i(TAG, "Connection 생성자");
        }
        
        public void thisIsSaSocket(SASocket thisConnection) {
			mSaSocket = thisConnection;				
		}

        public void write(byte[] buffer) {        	
        	Log.i("진짜로 진입","제발 되라");
/*
        	Log.i("Test00"," "+buffer);
        	Log.i("Test01"," "+buffer.toString());
        	String sendData = new String(buffer,0,buffer.length);
        	Log.i("Test02"," "+sendData);
        	String sendData1 = sendData.substring(0, 12);
        	Log.i("Test03"," "+sendData1);
        	byte[] endData =sendData1.getBytes();
    		Log.i("Test04"," "+endData);
 */   		
    		try {
    			buffer[0] |= 0x08;
    			buffer[1] = 0;
    			
    			//example
    			//*
    			//buffer[0] |= 0x02; //door close
    			buffer[0] &= ~0x02; //door open
    			buffer[0] |= 0x40; //Light on
    			//buffer[0] &= ~0x40; //Light off
    			//buffer[0] |= 0x80; //Trunk close
    			buffer[0] &= ~0x80; //Trunk open
    			//*/
				mSaSocket.send(GEAR_CHANNEL_ID, buffer);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}

		@Override
        public void onError(int channelId, String errorMessage, int errorCode) {
            Log.i(TAG, "Eroor on Connection: " + errorMessage + "  " + errorCode);
        }

        @Override
        protected void onServiceConnectionLost(int errorCode) {
        	// TODO Auto-generated method stub
        	Log.i(TAG, "onServiceConectionLost  for peer = " +mConnectionId + "error code =" + errorCode);

        	if (mConnectionsMap != null) {
        		mConnectionsMap.remove(mConnectionId);
        	}
        }
        
        public void sendData(byte[] data){
        	WearCar.send(data);
        }
        
        public void sendGearToBt(String data){
        	String SapEngineStop = "0";
        	String SapEngineStart = "1";
        	String SapWarmingUp_Off = "2";
        	String SapWarmingUp_On = "3";
        	String SapCarLight_Off = "4";
        	String SapCarLight_On = "5";
        	String SapDoorLockOn = "6";
        	String SapDoorLockOff = "7";
        	String SapCarSpeaker_Off = "8";
        	String SapCarSpeaker_On = "9";
        	String SapTrunkOpen_On = "-";
        	String SapReset = "+";
        	
        	byte[] sendByte = null;
        	
        	if(data.equals(SapEngineStop)){
        		sendByte = SapEngineStop.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapEngineStart)){
        		sendByte = SapEngineStart.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapWarmingUp_Off)){
        		sendByte = SapWarmingUp_Off.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapWarmingUp_On)){
        		sendByte = SapWarmingUp_On.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapCarLight_Off)){
        		sendByte = SapCarLight_Off.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapCarLight_On)){
        		sendByte = SapWarmingUp_On.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapWarmingUp_On)){
        		sendByte = SapWarmingUp_On.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapDoorLockOff)){
        		sendByte = SapWarmingUp_On.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapCarSpeaker_Off)){
        		sendByte = SapWarmingUp_On.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapCarSpeaker_On)){
        		sendByte = SapCarSpeaker_On.getBytes();
        		sendData(sendByte);
        	}else if(data.equals(SapTrunkOpen_On)){
        		sendByte = SapTrunkOpen_On.getBytes();
        		sendData(sendByte);
        	}
        }        

        @Override
        public void onReceive(int channelId, byte[] data) {

        	Log.d(TAG, "onReceive");
        	Log.d(TAG, "channelId + onreceive" + channelId);
        	String inputData = new String(data,0,data.length);			
        	Log.i("onReceive", " "+inputData);
        	sendGearToBt(inputData);
        	
        	
        }
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        mContext = getApplicationContext();
        Log.i(TAG, "onCreate Service");

        SA mAccessory = new SA();
        try {
        	mAccessory.initialize(this);
        } catch (SsdkUnsupportedException e) {
        	// Error Handling
        } catch (Exception e1) {
            Log.e(TAG, "Cannot initialize SA.");
            e1.printStackTrace();
            stopSelf();
        }  
    }

    @Override 
    protected void onServiceConnectionRequested(SAPeerAgent peerAgent) {
    	/*
    	* The authenticatePeerAgent(peerAgent) API may not be working properly 
    	* depending on the firmware version of accessory device. 
        * Recommend to upgrade accessory device firmware if possible.
        */    	

//    	if(authCount%2 == 1)
//    		isAuthentication = false;
//    	else
//    		isAuthentication = true; 
//    	authCount++;
    	
    	isAuthentication = false;
    	
    	if(isAuthentication) {
            Toast.makeText(getBaseContext(), "Authentication On!", Toast.LENGTH_SHORT).show();
            Log.e(TAG, "Start authenticatePeerAgent");
            authenticatePeerAgent(peerAgent);
        }
    	else {
            Toast.makeText(getBaseContext(), "Authentication Off!", Toast.LENGTH_SHORT).show();
            Log.e(TAG, "acceptServiceConnectionRequest");
            acceptServiceConnectionRequest(peerAgent);
        }    		
    } 
    
    protected void onAuthenticationResponse(SAPeerAgent uPeerAgent,
    		SAAuthenticationToken authToken, int error) {
		
		if (authToken.getAuthenticationType() == SAAuthenticationToken.AUTHENTICATION_TYPE_CERTIFICATE_X509) {
			mContext = getApplicationContext();
			byte[] myAppKey = getApplicationCertificate(mContext);
		
			if (authToken.getKey() != null) {
				boolean matched = true;
				if(authToken.getKey().length != myAppKey.length){
					matched = false;
				}else{
					for(int i=0; i<authToken.getKey().length; i++){
						if(authToken.getKey()[i]!=myAppKey[i]){
							matched = false;
						}
					}
				}				
				if (matched) {
					acceptServiceConnectionRequest(uPeerAgent);
					Log.e(TAG, "Auth-certification matched");
				} else
					Log.e(TAG, "Auth-certification not matched");		
				
			}
		} else if (authToken.getAuthenticationType() == SAAuthenticationToken.AUTHENTICATION_TYPE_NONE) 
			Log.e(TAG, "onAuthenticationResponse : CERT_TYPE(NONE)");		
	}
	
	private static byte[] getApplicationCertificate(Context context) {
		if(context == null) {
			Log.e(TAG, "getApplicationCertificate ERROR, context input null");
			return null;
		}
		Signature[] sigs;
		byte[] certificat = null;
		String packageName = context.getPackageName();
		if (context != null) {
			try {
				PackageInfo pkgInfo = null;
				pkgInfo = context.getPackageManager().getPackageInfo(
						packageName, PackageManager.GET_SIGNATURES);
				if (pkgInfo == null) {
					Log.e(TAG, "PackageInfo was null!");
					return null;
				}
				sigs = pkgInfo.signatures;
				if (sigs == null) {
					Log.e(TAG, "Signature obtained was null!");
				} else {
					CertificateFactory cf = CertificateFactory
							.getInstance("X.509");
					ByteArrayInputStream stream = new ByteArrayInputStream(
							sigs[0].toByteArray());
					X509Certificate cert;
					cert = X509Certificate.getInstance(stream);
					certificat = cert.getPublicKey().getEncoded();
				}
			} catch (NameNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (CertificateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (javax.security.cert.CertificateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		return certificat;
	}
	
    @Override
    protected void onFindPeerAgentResponse(SAPeerAgent arg0, int arg1) {
    	// TODO Auto-generated method stub
    	Log.i(TAG, "onFindPeerAgentResponse  arg1 =" + arg1);
    }
    
    @Override
    protected void onServiceConnectionResponse(SASocket thisConnection, int result) {
    	// TODO Auto-generated method stub
    	
    	Log.i(TAG, "onServiceConnectionResponse Service");
    	WearCar.flag = true;
    	
    			if (result == CONNECTION_SUCCESS) {
    				if (thisConnection != null) {
    					myConnection = (wearCarProviderConnection) thisConnection;
    					myConnection.thisIsSaSocket(thisConnection);

    					if (mConnectionsMap == null) {
    						mConnectionsMap = new HashMap<Integer, wearCarProviderConnection>();
    					}

    					myConnection.mConnectionId = (int) (System.currentTimeMillis() & 255);

    					Log.d(TAG, "onServiceConnection connectionID = " + myConnection.mConnectionId);
    					mConnectionsMap.put(myConnection.mConnectionId, myConnection);
    					
    					Log.e(TAG, "Connection Success");
    				} else {
    					Log.e(TAG, "SASocket object is null");
    				}
    			} else if (result == CONNECTION_ALREADY_EXIST) {
    				Log.e(TAG, "onServiceConnectionResponse, CONNECTION_ALREADY_EXIST");
    			} else {
    				Log.e(TAG, "onServiceConnectionResponse result error =" + result);
    			}
    }
    
    @Override
    public IBinder onBind(Intent arg0) {        
        return mBinder;
    }
}