// node version 7.8.0 required
// npm install --save package-name
// tone.js for sound feedback
// charts.js for real time graphing
// killall -9 node // to kill all the node processes
// smoothing: bandpass filtering, threshold

const { Wifi } = require('openbci-observable');
const { voltsToMicrovolts, bufferFFT, powerByBand } = require('eeg-pipes');

const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('event', data => { });
  client.on('disconnect', () => { });
});

async function init () {
    console.log("funtion in");
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();
    console.log("streaming starts");

    wifi.stream.pipe(
        voltsToMicrovolts(),
        bufferFFT({ bins: 256 }),
        powerByBand()
    ).subscribe(bandPowers =>
        {
            // print all the channels
            //io.emit("alpha data", bandPowers["alpha"]);
            // get average of all the channels
            //console.log("subscribe starts")
            var alpha = bandPowers["alpha"];
            var delta = bandPowers["delta"];
            console.log("alpha: ", alpha)
            console.log("delta: ", delta)
            //console.log("band power show");
            totalChannels = 8;
            average = 0;
            total = 0;
            for (var i = 0; i < alpha.length; i++) {
                total += alpha[i];
            }
            //console.log("show average");
            //average = total / totalChannels;     
            //console.log(average);
            //io.emit("average", average); 
            //console.log("average shown");   
        }
    );
}

async function start() {
    init();
    server.listen(3000);
}
start();