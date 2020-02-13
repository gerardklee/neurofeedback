function init() {
    const Wifi = require('@openbci/wifi');
    const OpenBCIConsts = require("openbci-utilities").Constants;
    let wifi = new Wifi({
        debug: false,
        verbose: true,
        latency: 5
    });

    wifi.on('sample',(sample) => {
        try {
          console.log("raw data: ", sample.channelData);
        } catch (err) {
          console.log(err);
        }
    })

    wifi.searchToStream({
        sampleRate: 1000, // Custom sample rate
        shieldName: 'OpenBCI-9630', // Enter the unique name for your wifi shield
        streamStart: true // Call to start streaming in this function
      }).catch(console.log);
   
}
init();