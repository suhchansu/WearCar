var SAAgent = null;
var SASocket = null;
var CHANNELID = 104;
var ProviderAppName = "GearService";
var StatusDoorOpen_Set_Value = 0;
var StatusTrunkOpen_Set_Value = 0;
var StatusLightOn_Set_Value = 0;

window.onload = function () {
    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
};

function createHTML(log_string)
{
	var log = document.getElementById('resultBoard');
	log.innerHTML = log.innerHTML + "<br> : " + log_string;
}

function onerror(err) {
	console.log("err [" + err.name + "] msg[" + err.message + "]");
}

var agentCallback = {
	onconnect : function(socket) {
		SASocket = socket;
		alert("Connection Success with WearCar on Android");
		createHTML("startConnection");
		SASocket.setSocketStatusListener(function(reason){
			console.log("Service connection lost, Reason : [" + reason + "]");
			disconnect();
		});
		console.log("success on Peer0");
	},
	onerror : onerror
};

var peerAgentFindCallback = {
		//pearAgent : 연결됬을때 나오는 객체
	onpeeragentfound : function(peerAgent) {
		try {
			if (peerAgent.appName == ProviderAppName) {
				console.log("success on Peer1 "+peerAgent.appName+ " "+ ProviderAppName);
				// onconnct, onrequest를 호출하는 메소드
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);
				console.log("success on Peer2 ");
			} else {
				alert("Not expected app!! : " + peerAgent.appName);
			}
		} catch(err) {
			console.log("exception [" + err.name + "] msg[" + err.message + "]");
		}
	},
	onerror : onerror
}

function onsuccess(agents) {
	try {
		if (agents.length > 0) {
			SAAgent = agents[0];
			
			console.log(" " + agents[0]);
			// Accessory Peer Agent가 발견되면 이함수를 사용.
			SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
			SAAgent.findPeerAgents();
		} else {
			alert("Not found SAAgent!!");
		}
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function connect() {
	if (SASocket) {
		alert('Hello~ you can use WearCar Service');
        return false;
    }
	try {
		//연결 요청, callback 메소드 성공: onsuccess 실패 :callback onerror
		webapis.sa.requestSAAgent(onsuccess, onerror);
		
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function disconnect() {
	try {
		if (SASocket != null) {
			SASocket.close();
			SASocket = null;
			createHTML("closeConnection");
		}
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}
function onreceive(channelId, data) {
	//createHTML(data);
	var calvalue = data;
	console.log("onreceive [" + channelId + "] msg[" + calvalue.charCodeAt(0) + "]");
	
	if(calvalue.charCodeAt(0)&0x02) {
		//도어 닫힘
		StatusDoorOpen_Off();
	}else{
		//도어 열림
		StatusDoorOpen_On();
		console.log("DoorOpen [" + StatusDoorOpen_Set_Value + "] msg[" + calvalue.charCodeAt(0) + "]");
		if(StatusDoorOpen_Set_Value==1){
			navigator.vibrate(1000);
			WarningDoorOpen_Set_Enable();
			return;
		}
	}

	if(calvalue.charCodeAt(0)&0x40) {
		//미등 켜짐
		StatusLightOn_On();
		console.log("LightOn [" + StatusLightOn_Set_Value + "] msg[" + calvalue.charCodeAt(0) + "]");
		if(StatusLightOn_Set_Value==1){
			navigator.vibrate(1000);
			WarningTrunkOpen_Set_Enable();
			return;
		}
	}else{
		//미등 꺼짐
		StatusLightOn_Off();
	}
	
	if(calvalue.charCodeAt(0)&0x80) {
		//트렁크 닫힘
		StatusTrunkOpen_Off();
	}else{
		//트렁크 열림
		StatusTrunkOpen_On();
		console.log("TrunkOpen [" + StatusTrunkOpen_Set_Value + "] msg[" + calvalue.charCodeAt(0) + "]");
		if(StatusTrunkOpen_Set_Value==1){
			navigator.vibrate(1000);
			WarningLightOn_Set_Enable();
			return;
		}
	}
	
}

function SapEngineStop() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "0");
		console.log("SapEngineStop");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapEngineStart() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "1");
		console.log("SapEngineStart");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapWarmingUp_Off() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "2");
		console.log("SapWarmingUp_Off");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapWarmingUp_On() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "3");
		console.log("SapWarmingUp_On");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapCarLight_Off() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "4");
		console.log("SapCarLight_Off");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapCarLight_On() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "5");
		console.log("SapCarLight_On");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapDoorLockOn() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "7");
		console.log("SapDoorLockOn");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapDoorLockOff() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "6");
		console.log("SapDoorLockOff");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapCarSpeaker_Off() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "8");
		console.log("SapCarSpeaker_Off");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapCarSpeaker_On() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "9");
		console.log("SapCarSpeaker_On");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapTrunkOpen_On() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "-");
		console.log("SapTrunkOpen_On");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function SapBtReset() {
	try {
		//pear Agent로 부터 수신된 데이터가 호출될때
		SASocket.setDataReceiveListener(onreceive);		
		SASocket.sendData(CHANNELID, "+");
		console.log("SapBtReset");
	} catch(err) {
		console.log("exception [" + err.name + "] msg[" + err.message + "]");
	}
}

function DoorOpen() {
	document.all.mDoorOpen_Disable.style.display = "none";
	document.all.mDoorOpen_Enable.style.display = "";
	document.all.mDoorLock_Disable.style.display = "";
	document.all.mDoorLock_Enable.style.display = "none";
	SapDoorLockOff();
}

function DoorLock() {
	document.all.mDoorOpen_Disable.style.display = "";
	document.all.mDoorOpen_Enable.style.display = "none";
	document.all.mDoorLock_Disable.style.display = "none";
	document.all.mDoorLock_Enable.style.display = "";
	SapDoorLockOn();
}

function EngineStart() {
	document.all.mEngineStart_Disable.style.display = "none";
	document.all.mEngineStart_Enable.style.display = "";
	document.all.mEngineStop_Disable.style.display = "";
	document.all.mEngineStop_Enable.style.display = "none";
	SapEngineStart();
}

function EngineStop() {
	document.all.mEngineStart_Disable.style.display = "";
	document.all.mEngineStart_Enable.style.display = "none";
	document.all.mEngineStop_Disable.style.display = "none";
	document.all.mEngineStop_Enable.style.display = "";
	SapEngineStop();
}


function WarmingUp_On() {
	document.all.mWarmingUp_On.style.display = "none";
	document.all.mWarmingUp_Off.style.display = "";
	SapWarmingUp_On();
}

function WarmingUp_Off() {
	document.all.mWarmingUp_On.style.display = "";
	document.all.mWarmingUp_Off.style.display = "none";
	SapWarmingUp_Off();
}

function CarLight_On() {
	document.all.mCarLight_On.style.display = "none";
	document.all.mCarLight_Off.style.display = "";
	SapCarLight_On();
}

function CarLight_Off() {
	document.all.mCarLight_On.style.display = "";
	document.all.mCarLight_Off.style.display = "none";
	SapCarLight_Off();
}

function CarSpeaker_On() {
	document.all.mCarSpeaker_On.style.display = "none";
	document.all.mCarSpeaker_Off.style.display = "";
	SapCarSpeaker_On();
}

function CarSpeaker_Off() {
	document.all.mCarSpeaker_On.style.display = "";
	document.all.mCarSpeaker_Off.style.display = "none";
	SapCarSpeaker_Off();
}

function TrunkOpen_On() {
	document.all.mTrunkOpen_On.style.display = "none";
	document.all.mTrunkOpen_Off.style.display = "";
	SapTrunkOpen_On();
}

function TrunkOpen_Off() {
	document.all.mTrunkOpen_On.style.display = "";
	document.all.mTrunkOpen_Off.style.display = "none";
}


function StatusDoorOpen_On() {
	document.all.mStatusDoorOpen_On.style.display = "none";
	document.all.mStatusDoorOpen_Off.style.display = "";
}

function StatusDoorOpen_Off() {
	document.all.mStatusDoorOpen_On.style.display = "";
	document.all.mStatusDoorOpen_Off.style.display = "none";
}


function StatusTrunkOpen_On() {
	document.all.mStatusTrunkOpen_On.style.display = "none";
	document.all.mStatusTrunkOpen_Off.style.display = "";
}

function StatusTrunkOpen_Off() {
	document.all.mStatusTrunkOpen_On.style.display = "";
	document.all.mStatusTrunkOpen_Off.style.display = "none";
}

function StatusLightOn_On() {
	document.all.mStatusLightOn_On.style.display = "none";
	document.all.mStatusLightOn_Off.style.display = "";
}

function StatusLightOn_Off() {
	document.all.mStatusLightOn_On.style.display = "";
	document.all.mStatusLightOn_Off.style.display = "none";
}


function StatusDoorOpen_Set_On() {
	document.all.mStatusDoorOpen_Set_On.style.display = "none";
	document.all.mStatusDoorOpen_Set_Off.style.display = "";
	StatusDoorOpen_Set_Value = 1;
}

function StatusDoorOpen_Set_Off() {
	document.all.mStatusDoorOpen_Set_On.style.display = "";
	document.all.mStatusDoorOpen_Set_Off.style.display = "none";
	StatusDoorOpen_Set_Value = 0;
}

function StatusTrunkOpen_Set_On() {
	document.all.mStatusTrunkOpen_Set_On.style.display = "none";
	document.all.mStatusTrunkOpen_Set_Off.style.display = "";
	StatusTrunkOpen_Set_Value = 1;
}

function StatusTrunkOpen_Set_Off() {
	document.all.mStatusTrunkOpen_Set_On.style.display = "";
	document.all.mStatusTrunkOpen_Set_Off.style.display = "none";
	StatusTrunkOpen_Set_Value = 0;
}

function StatusLightOn_Set_On() {
	document.all.mStatusLightOn_Set_On.style.display = "none";
	document.all.mStatusLightOn_Set_Off.style.display = "";
	StatusLightOn_Set_Value = 1;
}

function StatusLightOn_Set_Off() {
	document.all.mStatusLightOn_Set_On.style.display = "";
	document.all.mStatusLightOn_Set_Off.style.display = "none";
	StatusLightOn_Set_Value = 0;
}



function WarningDoorOpen_Set_Enable() {
	document.all.mMain_display.style.display = "none";
	document.all.mWarningDoor_display.style.display = "";
}
function WarningDoorOpen_Set_Disable() {
	document.all.mMain_display.style.display = "";
	document.all.mWarningDoor_display.style.display = "none";
	document.all.mWarningTrunk_display.style.display = "none";
	document.all.mWarningLight_display.style.display = "none";
	StatusDoorOpen_Set_Value = 0;
}

function WarningTrunkOpen_Set_Enable() {
	document.all.mMain_display.style.display = "none";
	document.all.mWarningTrunk_display.style.display = "";
}
function WarningTrunkOpen_Set_Disable() {
	document.all.mMain_display.style.display = "";
	document.all.mWarningDoor_display.style.display = "none";
	document.all.mWarningTrunk_display.style.display = "none";
	document.all.mWarningLight_display.style.display = "none";
	StatusTrunkOpen_Set_Value = 0;
}

function WarningLightOn_Set_Enable() {
	document.all.mMain_display.style.display = "none";
	document.all.mWarningLight_display.style.display = "";
}
function WarningLightOn_Set_Disable() {
	document.all.mMain_display.style.display = "";
	document.all.mWarningDoor_display.style.display = "none";
	document.all.mWarningTrunk_display.style.display = "none";
	document.all.mWarningLight_display.style.display = "none";
	StatusLightOn_Set_Value = 0;
}


function BtReset() {
	document.all.mStatusLightOn_On.style.display = "";
	document.all.mStatusLightOn_Off.style.display = "none";
	SapBtReset();
}