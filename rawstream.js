const Wifi = require('@openbci/wifi');
const OpenBCIConsts = require("openbci-utilities").Constants;
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
  path: '/Users/gerardlee/Desktop/raw.csv',
  header: ['FIRST CHANNEL']
});

function init() {
    let wifi = new Wifi({
        debug: false,
        verbose: true,
        latency: 5
    });

    wifi.on('sample',(sample) => {
        try {
          const firstChannel = [[-sample.channelData[0]]];
          console.log("raw data: "); 
          console.log(firstChannel);
          csvWriter.writeRecords(firstChannel)
            .then(() => {
              console.log('recorded');
            });
        } catch (err) {
          console.log(err);
        }
    })

    wifi.searchToStream({
        sampleRate: 250, // Custom sample rate
        shieldName: 'OpenBCI-9630', // Enter the unique name for your wifi shield
        streamStart: true // Call to start streaming in this function
      }).catch(console.log);
   
}
init();