// EEG data variables
const { Wifi } = require('openbci-observable');
const { voltsToMicrovolts, bufferFFT, powerByBand, sliceFFT, epoch, fft, bandpassFilter, notchFilter } = require('@neurosity/pipes');

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

// SENDING THE DATA
sendEEGData();
//sendAlphaWave();
//sendRawData();
//sendMockData();

// server functions
async function sendEEGData() {
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();
    console.log("streaming preparing..");

    // Bins = FFT Size / 2
    // Frequency Resolution = Sampling Rate / FFT Size
    // In this case, FFT Size = 1024, Sampling Rate = 256
    // FR = 0.25
    // duration must be equal to number of bins
    // 1024 for 0.25 frequency resolution
    // 1280 for 0.2 frequency resolution
    // 2 - 7 for eye blinks
    // 7.5 - 12.5 for alpha
    // 256 to make the amplitude go down fast
    // 25 is the optimal interval

    wifi.stream.pipe(
        voltsToMicrovolts(),
        epoch({ duration: 1024, interval: 25, samplingRate: 256 }),
        bandpassFilter({ cutoffFrequencies: [7.25, 12.5], nbChannels: 8 }),
        notchFilter({ cutoffFrequency: 60, nbChannels: 8, samplingRate: 256 }),
        fft({ bins: 1024 }),
        sliceFFT([7.5, 12.5])
    ).subscribe(data => 
        {
            io.emit("fftData", data);
        }
    );
}

async function sendRawData() {
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();
    console.log("streaming starts");
    
    wifi.stream.pipe(
        voltsToMicrovolts()
    ).subscribe(data => 
        {
            console.log(data);
            io.emit("rawData", data);
        }
    );
}

async function sendAlphaWave() {
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();
    console.log("streaming starts");

    wifi.stream.pipe(
        voltsToMicrovolts(),
        epoch({ duration: 256, interval: 100, samplingRate: 256 }),
        fft({ bins: 256 }),
        powerByBand()
    ).subscribe(data => 
        {
            console.log(data["alpha"]);
        }
    );
}

async function sendMockData() {
    console.log("sending mock data..");
    setInterval(() => io.emit('fftData', data1), 100);
}

async function start() {
    //init();
 
    server2.listen(3000);
    setInterval(() => io2.emit('fft_data', data1), 100);
}
