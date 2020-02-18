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

    // Bins = FFT Size / 2
    // Frequency Resolution = Sampling Rate / FFT Size
    // In this case, FFT Size = 256, Sampling Rate = 256
    // FR = 1
    
    wifi.stream.pipe(
        voltsToMicrovolts(),
        bufferFFT({ bins: 128, samplingRate: 256 })
    ).subscribe(bins => 
        {
            console.log(bins[0].length);
            console.log(bins[0][1]);
        }
    );
}

async function start() {
    init();
    server.listen(3000);
}
start();