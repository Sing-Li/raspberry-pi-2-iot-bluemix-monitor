var mqtt    = require('mqtt');
var montask = require('./monitortask.js');
var moment = require('moment');
var client  = mqtt.connect('tls://adv.messaging.internetofthings.ibmcloud.com:8883', {clientId:'d:adv:rasp2monitor:euro001',username:'use-token-auth', password:'l_?QguG03n0'});
 
var delayinms = 60000; // every minute
var suspend = false;

client.on('connect', function () {
  client.subscribe('iot-2/cmd/+/fmt/+');
});
 
client.on('message', function (topic, message) {
      var msg = JSON.parse(message);
    	if (msg.ops) {
          if (msg.ops === 'suspend') {
          	suspend = true;
          } else {
          	suspend = false;
          }
    	}
      console.log('got command: ' + message.toString());
});

var doTask = function() {
  var t = Date.now();
  if (!suspend)  {
    // first call is a minute after start
    montask.start(
    	function(err, result, expected) {

    	  var monval = {};
        if(err) {
          // simple handling of error - extend as required         
    		  monval.d = { accesstime: 0,  status: "down"};
    		  monval.ts = moment().toISOString();
 
          console.log('ERROR!!');
          console.error(err);
        }
        else {
          console.log('got result ' + result);
          console.log('got expect ' + expected);
 
    		  var elapsedTime = Date.now() - t;
    		  monval.d = { accesstime: elapsedTime,  status: 
              ((result === expected)? "ok": "error") };
        }
       	monval.ts = moment().toISOString();

        var payload = JSON.stringify(monval);
    	  console.log(payload);

        client.publish('iot-2/evt/itemsvc/fmt/json' , 
          	payload);
          	  
    	}

    );
  }
  setTimeout(doTask, delayinms);
}


setTimeout(doTask, delayinms );

