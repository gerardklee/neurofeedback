const { Wifi } = require('openbci-observable');
const { voltsToMicrovolts, bufferFFT, powerByBand, sliceFFT, epoch, fft } = require('@neurosity/pipes');

const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('event', data => { });
  client.on('disconnect', () => { });
});

const data1 = {"psd":[[27.197596442311976,23.479118879048993,19.781206817947567,15.643339824322986,12.638206260596553,11.081112933731703,8.730078767878478],[53.29126980547793,51.578601544362776,43.10380950455574,33.91020488217584,89.68125343001996,69.41522429915457,69.83147361181165],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],"freqs":[7,8,9,10,11,12,13],"info":{"startTime":1582042659234,"samplingRate":256}};

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
        epoch({ duration: 256, interval: 100, samplingRate: 256 }),
        fft({ bins: 256}),
        sliceFFT([7, 13])
    ).subscribe(data => 
        {
            io.emit("data", data);
        }
    );
}

async function start() {
    //init();
    server.listen(3000);
    setInterval(() => io.emit("data", data1), 1000);
}
start();