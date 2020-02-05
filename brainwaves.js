const { Wifi } = require('openbci-observable');
const { voltsToMicrovolts, bufferFFT, powerByBand } = require('eeg-pipes');

async function init () {
    const wifi = new Wifi();
    await wifi.connect({ ipAddress: '192.168.4.1' });
    await wifi.start();

    wifi.stream.pipe(
        voltsToMicrovolts(),
        bufferFFT({ bins: 256 }),
        powerByBand()
    ).subscribe(buffer =>
        console.log('bands: ', buffer)
    );
}

init();