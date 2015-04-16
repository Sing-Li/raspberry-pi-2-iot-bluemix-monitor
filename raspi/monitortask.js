var MonitoredBluemixURL = 'http://temp.mybluemix.net/';
var itemName = 'monitortestitem';
var itemQuantity = 323;

var expectedmsg = 'Completed. Quantity ' + itemQuantity + ' of ' + itemName + ' added.';

var Spooky = require('spooky');

var createInstance = function(cb) {
    var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start(
            MonitoredBluemixURL);

        // function tuple used to pass variables into casperjs scope
        spooky.then([{itemName: itemName, itemQuantity: itemQuantity}, 
            function () {
                this.fill('form[action="/items/add"]', 
                    { item: itemName, quantity: itemQuantity }, true);

                this.waitForUrl('/items/add', function() {     
                    this.emit('addstatus', this.evaluate(
                        function() { 
                            return  __utils__.findOne('#additemstatus').innerHTML;
                        }
                    ));
                });
        }]);

        spooky.run();
    });

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
   cb(e);
   spooky.destroy();
});

spooky.on('addstatus', function (msg) {
    console.log(msg);
    cb(null, msg, expectedmsg);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});

}   // of createInstance

var MonitorTask = { 
 start : createInstance 
};

module.exports = MonitorTask;
