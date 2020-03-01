// EEG data variables
const { Wifi } = require('openbci-observable');
const { voltsToMicrovolts, bufferFFT, powerByBand, sliceFFT, epoch, fft } = require('@neurosity/pipes');
const data1 = {"psd":[[27.197596442311976,23.479118879048993,19.781206817947567,15.643339824322986,12.638206260596553,11.081112933731703,8.730078767878478,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
[53.29126980547793,51.578601544362776,43.10380950455574,33.91020488217584,89.68125343001996,69.41522429915457,69.83147361181165],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0],
[0,0,0,0,0,0,0]
],
"freqs":[7,7.25,7.5,7.75,8,8.25,8.5,8.75,9,9.25,9.5,9.75,10,10.25,10.5,10.75,11,11.25,11.5,11.75,12,12.25,12.5,12.75,13,13.25,13.5,13.75],"info":{"startTime":1582042659234,"samplingRate":256}};
dd
// variables for local server
const express = require('express');
const app = express();
const socket = require('socket.io');
const PORT = 3000;
var server = app.listen(PORT, () => {
    console.log('server is running on port', server.address().port);
});
const io = socket(server);

app.use(express.static('./music'));
app.use(express.static(__dirname));
sendMockData();

// server functions
async function initExpress() {
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();
    console.log("streaming preparing..");

    // Bins = FFT Size / 2
    // Frequency Resolution = Sampling Rate / FFT Size
    // In this case, FFT Size = 1024, Sampling Rate = 256
    // FR = 0.25
    
    wifi.stream.pipe(
        voltsToMicrovolts(),
        epoch({ duration: 256, interval: 100, samplingRate: 256 }),
        fft({ bins: 1024 }),
        sliceFFT([7, 13.75])
    ).subscribe(data => 
        {
            console.log("streaming starts..")
            io.emit("data", data);
        }
    );
}

async function sendMockData() {
    console.log("sending mock data..");
    setInterval(() => io.emit('fft_data', data1), 100);
}

async function init () {
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();
    console.log("streaming starts");

    // Bins = FFT Size / 2
    // Frequency Resolution = Sampling Rate / FFT Size
    // In this case, FFT Size = 1024, Sampling Rate = 256
    // FR = 0.25
    
    wifi.stream.pipe(
        voltsToMicrovolts(),
        epoch({ duration: 256, interval: 100, samplingRate: 256 }),
        fft({ bins: 1024 }),
        sliceFFT([7, 13.75])
    ).subscribe(data => 
        {
            io2.emit("data", data);
        }
    );
}

async function start() {
    //init();
 
    server2.listen(3000);
    setInterval(() => io2.emit('fft_data', data1), 100);
}