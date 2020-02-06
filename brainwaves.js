const { Wifi } = require('openbci-observable');
const { voltsToMicrovolts, bufferFFT, powerByBand } = require('eeg-pipes');

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
            console.log(bandPowers["alpha"]);
            // get average of all the channels
            var alpha = bandPowers["alpha"];
            totalChannel = 8;
            average = 0;
            total = 0;
            for (var i = 0; i < alpha.length; i++) {
                total += alpha[i];
            }
            average = total / totalChannel;     
            console.log("average: " + average);      
        }
    );
}

init();