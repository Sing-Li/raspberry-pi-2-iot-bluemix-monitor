var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtts://adv.messaging.internetofthings.ibmcloud.com', {clientId:'a:adv:adminapp',username:'a-adv-rcwb9', password:'0dUJblg@C'});
 
client.on('connect', function () {
  var payload = {};
  payload.ops = process.argv[3];
  client.publish('iot-2/type/rasp2monitor/id/' + process.argv[2] +  '/cmd/operation/fmt/json', JSON.stringify(payload), function() {
   client.end();
});
  
});
 
client.on('message', function (topic, message) {
  console.log('got command: ' + message.toString());
});
